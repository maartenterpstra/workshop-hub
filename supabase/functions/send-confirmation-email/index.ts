import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Sender address on the verified aiinrt.org Resend domain.
const FROM_ADDRESS = "AIinRT2027 <abstracts@aiinrt.org>";
const MY_ABSTRACTS_URL = "https://workshop-spark-25.lovable.app/my-abstracts";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

interface Body {
  abstractId?: string;
  event?: "submitted" | "updated";
  mode?: "single" | "all";
}

interface BulkResult {
  sent: number;
  failed: { abstractId: string; email: string | null; error: string }[];
  total: number;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const buildHtml = (title: string, event: "submitted" | "updated") => {
  const action = event === "submitted" ? "submitted" : "updated";
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="border-bottom:3px solid #005EB8;padding-bottom:12px;">
      <span style="font-size:20px;font-weight:bold;color:#005EB8;">AIinRT2027</span>
    </div>
    <h1 style="font-size:18px;color:#111827;margin:24px 0 8px;">Abstract ${action}</h1>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Your abstract <strong>&ldquo;${escapeHtml(title)}&rdquo;</strong> has been
      successfully ${action} for AIinRT2027 (Utrecht, 1&ndash;2 April 2027).
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      You can review or revise it until the submission deadline
      (1 December 2026, 12:00 Europe/Amsterdam) from your author area.
    </p>
    <p style="margin:24px 0;">
      <a href="${MY_ABSTRACTS_URL}" style="background:#FF8C00;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:bold;">View my abstracts</a>
    </p>
    <p style="font-size:12px;color:#6b7280;line-height:1.6;">
      You received this email because you ${action} an abstract on the AIinRT2027 submission platform.
    </p>
  </div>
</body></html>`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      throw new Error("Email service is not configured.");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: Body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { abstractId, event, mode = "single" } = body;
    if (mode !== "single" && mode !== "all") {
      return new Response(JSON.stringify({ error: "mode must be 'single' or 'all'." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (mode === "single") {
      if (typeof abstractId !== "string" || !/^[0-9a-f-]{36}$/i.test(abstractId)) {
        return new Response(JSON.stringify({ error: "abstractId must be a UUID." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (event !== "submitted" && event !== "updated") {
        return new Response(JSON.stringify({ error: "event must be 'submitted' or 'updated'." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the caller's session.
    const caller = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await caller.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    if (mode === "all") {
      const { data: adminRole } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin");
      if (!adminRole?.length) {
        return new Response(JSON.stringify({ error: "Forbidden." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: all, error: allErr } = await admin
        .from("abstracts")
        .select("id, title, submitted_by")
        .order("submitted_at", { ascending: true });
      if (allErr) throw allErr;
      const out: BulkResult = { sent: 0, failed: [], total: all?.length ?? 0 };
      for (const a of all ?? []) {
        const { data: u } = await admin.auth.admin.getUserById(a.submitted_by);
        const email = u?.user?.email ?? null;
        if (!email) {
          out.failed.push({ abstractId: a.id, email, error: "No email on account" });
          continue;
        }
        const r = await fetch(`${GATEWAY_URL}/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
          },
          body: JSON.stringify({
            from: FROM_ADDRESS,
            to: [email],
            subject: `AIinRT2027: abstract received — ${a.title}`,
            html: buildHtml(a.title, "submitted"),
          }),
        });
        if (r.ok) out.sent++;
        else {
          const t = await r.text();
          console.error(`Bulk send failed [${r.status}] for ${a.id}: ${t}`);
          out.failed.push({ abstractId: a.id, email, error: `[${r.status}] ${t.slice(0, 200)}` });
        }
        // Stay under Resend's default rate limit (~2 req/s).
        await new Promise((res) => setTimeout(res, 600));
      }
      return new Response(JSON.stringify(out), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: abstract, error: abstractError } = await admin
      .from("abstracts")
      .select("id, title, submitted_by")
      .eq("id", abstractId)
      .maybeSingle();
    if (abstractError || !abstract) {
      return new Response(JSON.stringify({ error: "Abstract not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only the submitting author (or an admin/SOC) may trigger the email.
    const isOwner = abstract.submitted_by === userData.user.id;
    if (!isOwner) {
      const { data: roles } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .in("role", ["admin", "soc"]);
      if (!roles?.length) {
        return new Response(JSON.stringify({ error: "Forbidden." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { data: recipient, error: recipientError } = await admin.auth.admin.getUserById(
      abstract.submitted_by,
    );
    if (recipientError || !recipient.user?.email) {
      return new Response(JSON.stringify({ error: "Recipient not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [recipient.user.email],
        subject:
          event === "submitted"
            ? `AIinRT2027: abstract received — ${abstract.title}`
            : `AIinRT2027: abstract updated — ${abstract.title}`,
        html: buildHtml(abstract.title, event),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Resend request failed [${response.status}]: ${errorBody}`);
      return new Response(
        JSON.stringify({ error: "Email provider request failed", status: response.status, details: errorBody }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const result = await response.json();
    return new Response(JSON.stringify({ sent: true, id: result?.id ?? null }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-confirmation-email failed:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
