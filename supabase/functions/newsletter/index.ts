import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const FROM_ADDRESS = "AIinRT2027 <abstracts@aiinrt.org>";
const SITE = "https://aiinrt.org";
const AUDIENCE_NAME = "AIinRT newsletter";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const Body = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("subscribe"),
    email: z.string().trim().toLowerCase().email().max(255),
    name: z.string().trim().max(100).optional().default(""),
    consent: z.literal(true),
    website: z.string().optional().default(""), // honeypot
  }),
  z.object({ action: z.literal("unsubscribe"), token: z.string().uuid() }),
]);

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) throw new Error("Email service is not configured.");
    const resend = (path: string, method = "GET", body?: unknown) =>
      fetch(`${GATEWAY_URL}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": RESEND_API_KEY,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

    const getAudienceId = async () => {
      const r = await resend("/audiences");
      if (!r.ok) throw new Error(`Resend audiences [${r.status}]: ${await r.text()}`);
      const list = (await r.json()).data ?? [];
      const found = list.find((a: any) => a.name === AUDIENCE_NAME);
      if (found) return found.id as string;
      const c = await resend("/audiences", "POST", { name: AUDIENCE_NAME });
      if (!c.ok) throw new Error(`Resend create audience [${c.status}]: ${await c.text()}`);
      return (await c.json()).id as string;
    };

    let raw: unknown;
    try { raw = await req.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
    const parsed = Body.safeParse(raw);
    if (!parsed.success) return json({ error: "Please enter a valid email and accept the consent." }, 400);
    const input = parsed.data;

    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    if (input.action === "unsubscribe") {
      const { data: row } = await db.from("newsletter_subscribers").select("id, email").eq("unsubscribe_token", input.token).maybeSingle();
      if (!row) return json({ error: "Link not valid." }, 404);
      await db.from("newsletter_subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("id", row.id);
      try {
        const aid = await getAudienceId();
        const r = await resend(`/audiences/${aid}/contacts/${encodeURIComponent(row.email)}`, "PATCH", { unsubscribed: true });
        if (!r.ok) console.error("Resend unsubscribe failed", r.status, await r.text());
      } catch (e) { console.error(e); }
      return json({ ok: true });
    }

    if (input.website) return json({ ok: true }); // bot

    const { data: existing } = await db.from("newsletter_subscribers")
      .select("id, unsubscribed_at, unsubscribe_token").eq("email", input.email).maybeSingle();
    if (existing && !existing.unsubscribed_at) return json({ ok: true });

    let row = existing;
    if (existing) {
      await db.from("newsletter_subscribers").update({ unsubscribed_at: null, consent_at: new Date().toISOString(), name: input.name || null }).eq("id", existing.id);
    } else {
      const { data, error } = await db.from("newsletter_subscribers")
        .insert({ email: input.email, name: input.name || null }).select("id, unsubscribed_at, unsubscribe_token").single();
      if (error) throw error;
      row = data;
    }

    const aid = await getAudienceId();
    const [first, ...rest] = (input.name || "").split(" ");
    const cr = await resend(`/audiences/${aid}/contacts`, "POST", {
      email: input.email, first_name: first || undefined, last_name: rest.join(" ") || undefined, unsubscribed: false,
    });
    if (cr.ok) {
      const c = await cr.json();
      if (c?.id) await db.from("newsletter_subscribers").update({ resend_contact_id: c.id }).eq("id", row!.id);
    } else {
      // Contact may already exist (re-subscribe): make sure it's active.
      await resend(`/audiences/${aid}/contacts/${encodeURIComponent(input.email)}`, "PATCH", { unsubscribed: false });
    }

    const unsub = `${SITE}/unsubscribe?token=${row!.unsubscribe_token}`;
    const html = `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
<div style="border-bottom:3px solid #005EB8;padding-bottom:12px;"><span style="font-size:20px;font-weight:bold;color:#005EB8;">AIinRT2027</span></div>
<h1 style="font-size:18px;color:#111827;margin:24px 0 8px;">Thanks for subscribing${input.name ? `, ${esc(first)}` : ""}!</h1>
<p style="font-size:14px;color:#374151;line-height:1.6;">You'll receive occasional news about AIinRT2027 (Utrecht, 1&ndash;2 April 2027): deadlines, programme updates and registration.</p>
<p style="margin:24px 0;"><a href="${SITE}" style="background:#FF8C00;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:bold;">Visit the website</a></p>
<p style="font-size:12px;color:#6b7280;">Don't want these emails? <a href="${unsub}" style="color:#6b7280;">Unsubscribe</a>.</p>
</div></body></html>`;
    const sr = await resend("/emails", "POST", {
      from: FROM_ADDRESS, to: [input.email], subject: "Welcome to the AIinRT newsletter", html,
      headers: { "List-Unsubscribe": `<${unsub}>` },
    });
    if (!sr.ok) console.error("Welcome email failed", sr.status, await sr.text());

    return json({ ok: true });
  } catch (err) {
    console.error("newsletter failed:", err);
    return json({ error: "Something went wrong. Please try again later." }, 500);
  }
});
