import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const FROM_ADDRESS = "AIinRT2027 <abstracts@aiinrt.org>";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const html = (body: string) => `<!doctype html>
<html><body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="border-bottom:3px solid #005EB8;padding-bottom:12px;">
      <span style="font-size:20px;font-weight:bold;color:#005EB8;">AIinRT2027</span>
    </div>
    <div style="font-size:14px;color:#374151;line-height:1.6;margin-top:24px;white-space:pre-wrap;">${esc(body)}</div>
    <p style="font-size:12px;color:#6b7280;line-height:1.6;margin-top:24px;">
      This message was sent by the AIinRT2027 organizers. Questions? Reply to m.maspero@umcutrecht.nl.<br/>
      You received this email because you are listed as an author of an abstract submitted to the AIinRT2027 workshop.
    </p>
  </div>
</body></html>`;

const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) throw new Error("Email service is not configured.");

    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) return json({ error: "Unauthorized." }, 401);
    const url = Deno.env.get("SUPABASE_URL")!;
    const caller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: claims, error: cErr } = await caller.auth.getClaims(auth.replace("Bearer ", ""));
    if (cErr || !claims?.claims) return json({ error: "Unauthorized." }, 401);
    const uid = claims.claims.sub as string;

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin");
    if (!roles?.length) return json({ error: "Forbidden." }, 403);

    let b: any;
    try { b = await req.json(); } catch { return json({ error: "Invalid JSON body." }, 400); }
    if (b?.mode === "decision") return await sendDecisions(admin, uid, b, LOVABLE_API_KEY, RESEND_API_KEY);
    const subject = typeof b.subject === "string" ? b.subject.replace(/[\r\n]+/g, " ").trim() : "";
    const body = typeof b.body === "string" ? b.body.trim() : "";
    const abstractId = b.abstractId ?? null;
    const includeWithdrawn = b.includeWithdrawn === true;
    const dryRun = b.dryRun === true;
    if (!dryRun && (!subject || subject.length > 200)) return json({ error: "Subject is required (max 200 characters)." }, 400);
    if (!dryRun && (!body || body.length > 5000)) return json({ error: "Message is required (max 5,000 characters)." }, 400);
    if (abstractId !== null && (typeof abstractId !== "string" || !/^[0-9a-f-]{36}$/i.test(abstractId)))
      return json({ error: "abstractId must be a UUID." }, 400);

    let q = admin.from("abstracts").select("id, title, status, submitted_by, authors:abstract_authors(email)");
    if (abstractId) q = q.eq("id", abstractId);
    else if (!includeWithdrawn) q = q.neq("status", "withdrawn");
    const { data: abstracts, error: aErr } = await q;
    if (aErr) throw aErr;

    // Build recipient list: one entry per (abstract, email).
    const jobs: { abstractId: string; title: string; email: string }[] = [];
    for (const a of (abstracts ?? []) as any[]) {
      const set = new Set<string>();
      const { data: sub } = await admin.auth.admin.getUserById(a.submitted_by);
      if (sub?.user?.email) set.add(sub.user.email.toLowerCase());
      for (const au of a.authors ?? []) {
        const e = (au?.email ?? "").trim().toLowerCase();
        if (e && isEmail(e)) set.add(e);
      }
      for (const email of set) jobs.push({ abstractId: a.id, title: a.title, email });
    }
    if (dryRun) return json({ abstracts: abstracts?.length ?? 0, recipients: jobs.length });

    let sent = 0;
    for (const j of jobs) {
      const safeTitle = String(j.title).replace(/[\r\n]+/g, " ").slice(0, 300);
      const subj = subject.replaceAll("{title}", safeTitle).slice(0, 300);
      const r = await fetch(`${GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": RESEND_API_KEY,
        },
        body: JSON.stringify({ from: FROM_ADDRESS, to: [j.email], subject: subj, html: html(body.replaceAll("{title}", safeTitle)) }),
      });
      let error: string | null = null;
      if (r.ok) sent++;
      else { error = `[${r.status}] ${(await r.text()).slice(0, 300)}`; console.error("Resend failed for a recipient", r.status); }
      await admin.from("email_log").insert({
        sent_by: uid, abstract_id: j.abstractId, recipient_email: j.email, subject: subj,
        kind: "manual", status: r.ok ? "sent" : "failed", error,
      });
      await new Promise((res) => setTimeout(res, 600));
    }
    return json({ sent, total: jobs.length });
  } catch (err) {
    console.error("send-author-email failed:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
