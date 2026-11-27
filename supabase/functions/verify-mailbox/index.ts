import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const FROM_ADDRESS = "AIinRT2027 <abstracts@aiinrt.org>";
const SITE = "https://aiinrt.org";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const sha256 = async (s: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))))
    .map((b) => b.toString(16).padStart(2, "0")).join("");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Not signed in" }, 401);
    const caller = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: u, error } = await caller.auth.getUser();
    if (error || !u.user?.email) return json({ error: "Not signed in" }, 401);
    const user = u.user;
    const body = await req.json().catch(() => ({}));

    if (body.action === "send") {
      const token = crypto.randomUUID() + crypto.randomUUID();
      const { data: ok, error: e1 } = await admin.rpc("mailbox_store_token", { _user_id: user.id, _email: user.email, _token_hash: await sha256(token) });
      if (e1) throw e1;
      if (!ok) return json({ error: "A link was sent a few minutes ago. Please check your inbox." }, 429);
      const link = `${SITE}/my-abstracts?verify=${token}`;
      const r = await fetch(`${GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
          "X-Connection-Api-Key": Deno.env.get("RESEND_API_KEY")!,
        },
        body: JSON.stringify({
          from: FROM_ADDRESS, to: [user.email], subject: "AIinRT2027 – confirm your email to see co-authored abstracts",
          html: `<p>Click the link below (valid 24 hours) to confirm this email address and see the abstracts where you are listed as co-author.</p><p><a href="${link}">Confirm my email</a></p><p>If you did not request this, ignore this email.</p>`,
        }),
      });
      if (!r.ok) return json({ error: "Could not send the email. Please try again later." }, 502);
      return json({ sent: true });
    }

    if (body.action === "confirm" && typeof body.token === "string" && body.token.length <= 100) {
      const { data: ok, error: e2 } = await admin.rpc("mailbox_confirm", { _user_id: user.id, _email: user.email, _token_hash: await sha256(body.token) });
      if (e2) throw e2;
      if (!ok) return json({ error: "This link is invalid or expired. Request a new one." }, 400);
      return json({ verified: true });
    }
    return json({ error: "Invalid request" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: "Something went wrong" }, 500);
  }
});
