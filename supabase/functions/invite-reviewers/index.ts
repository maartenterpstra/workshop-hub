import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const FROM_ADDRESS = "AIinRT2027 <abstracts@aiinrt.org>";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SUBJECT = "AIinRT2027: set up your reviewer account (reviews 1–15 December)";
const html = (name: string, link: string) => `<!doctype html><html><body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
  <div style="border-bottom:3px solid #005EB8;padding-bottom:12px;"><span style="font-size:20px;font-weight:bold;color:#005EB8;">AIinRT2027</span></div>
  <div style="font-size:14px;color:#374151;line-height:1.6;margin-top:24px;">
    <p>Dear ${esc(name || "reviewer")},</p>
    <p>Thank you for reviewing for AIinRT2027. Abstract submission closes on <strong>1 December 2026, 12:00</strong> (Amsterdam time). Your assigned abstracts will appear on the website shortly after, and reviews can be submitted and updated until <strong>15 December 2026, 12:00</strong>.</p>
    <p><strong>Set your password now</strong> with your personal link:</p>
    <p style="margin:20px 0;"><a href="${esc(link)}" style="background:#005EB8;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Set your password</a></p>
    <p style="font-size:12px;color:#6b7280;">The link works once. If it has expired, use "Forgot your password?" at <a href="https://aiinrt.org/login">aiinrt.org/login</a> with this email address.</p>
    <p><strong>Short guide</strong></p>
    <ul>
      <li>Score each abstract (1–5) on technical rigor, relevance, novelty, reproducibility and session fit.</li>
      <li>Answer three short questions for the authors (1–3 sentences each): <em>Where is the value?</em>, <em>What could be done better to increase the impact?</em> and <em>Any tips?</em></li>
      <li>Be constructive and respectful. Review is double-blind: don't try to identify authors and don't reveal yourself.</li>
    </ul>
    <p>Reviews are done at <a href="https://aiinrt.org/review">aiinrt.org/review</a>.</p>
    <p>Kind regards,<br/>The AIinRT2027 Scientific Organizing Committee</p>
  </div>
  <p style="font-size:12px;color:#6b7280;margin-top:24px;">Questions? Reply to m.maspero@umcutrecht.nl.</p>
</div></body></html>`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) throw new Error("Email service is not configured.");
    const auth = req.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) return json({ error: "Unauthorized." }, 401);
    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const caller = createClient(url, anonKey, { global: { headers: { Authorization: auth } } });
    const { data: claims, error: cErr } = await caller.auth.getClaims(auth.replace("Bearer ", ""));
    if (cErr || !claims?.claims) return json({ error: "Unauthorized." }, 401);
    const uid = claims.claims.sub as string;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin");
    if (!roles?.length) return json({ error: "Forbidden." }, 403);

    let b: any = {};
    try { b = await req.json(); } catch { /* empty body ok */ }
    const dryRun = b?.dryRun === true;
    const mode: "all" | "failed" | "single" = ["failed", "single"].includes(b?.mode) ? b.mode : "all";
    const single = typeof b?.email === "string" ? b.email.trim().toLowerCase().slice(0, 254) : "";
    if (mode === "single" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(single)) return json({ error: "Enter a valid email." }, 400);

    const { data: rr } = await admin.from("user_roles").select("user_id").eq("role", "reviewer");
    const ids = new Set((rr ?? []).map((r: any) => r.user_id));
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const { data: profiles } = await admin.from("profiles").select("id, full_name");
    const names = new Map((profiles ?? []).map((p: any) => [p.id, p.full_name ?? ""]));
    const { data: logs } = await admin.from("email_log").select("recipient_email, status, sent_at").eq("subject", SUBJECT).order("sent_at", { ascending: true });
    const last = new Map<string, { status: string; sent_at: string }>();
    for (const l of logs ?? []) last.set(String(l.recipient_email).toLowerCase(), l as any);
    const dayAgo = Date.now() - 24 * 3600 * 1000;
    const reviewers = (list?.users ?? []).filter((u) => ids.has(u.id) && u.email);
    let targets = reviewers.filter((u) => !u.last_sign_in_at);
    if (mode === "single") targets = reviewers.filter((u) => u.email!.toLowerCase() === single);
    else if (mode === "failed") targets = targets.filter((u) => last.get(u.email!.toLowerCase())?.status === "failed");
    else targets = targets.filter((u) => { const l = last.get(u.email!.toLowerCase()); return !(l?.status === "sent" && Date.parse(l.sent_at) > dayAgo); });
    if (mode === "single" && !targets.length) return json({ error: "No reviewer account with that email." }, 404);
    const failedCount = reviewers.filter((u) => !u.last_sign_in_at && last.get(u.email!.toLowerCase())?.status === "failed").length;

    if (dryRun) return json({ count: targets.length, failedCount, subject: SUBJECT });

    let sent = 0, failed = 0;
    for (const u of targets) {
      const email = u.email!.toLowerCase();
      let error: string | null = null;
      const { data: link, error: lErr } = await admin.auth.admin.generateLink({ type: "recovery", email, options: { redirectTo: "https://aiinrt.org/set-password" } });
      const actionLink = link?.properties?.action_link;
      if (lErr || !actionLink) error = `Password link could not be created: ${lErr?.message ?? "no link returned"}`.slice(0, 300);
      else {
        const r = await fetch(`${GATEWAY_URL}/emails`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": RESEND_API_KEY },
          body: JSON.stringify({ from: FROM_ADDRESS, to: [email], subject: SUBJECT, html: html(names.get(u.id) ?? "", actionLink) }),
        });
        if (!r.ok) { error = `[${r.status}] ${(await r.text()).slice(0, 300)}`; console.error("Resend failed for a reviewer", r.status); }
      }
      if (error) failed++; else sent++;
      await admin.from("email_log").insert({ sent_by: uid, abstract_id: null, recipient_email: email, subject: SUBJECT, kind: "manual", status: error ? "failed" : "sent", error });
      await new Promise((res) => setTimeout(res, 600));
    }
    return json({ sent, failed });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
