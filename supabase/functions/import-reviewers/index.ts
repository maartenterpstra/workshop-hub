import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const RecordSchema = z.object({
  firstName: z.string().min(1).max(200),
  lastName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  affiliation: z.string().max(1000).optional().default(""),
  topics: z.array(z.string().min(1).max(200)).max(10).default([]),
});

const BodySchema = z.object({
  password: z.string().min(8).max(200),
  reviewers: z.array(RecordSchema).min(1).max(500),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  // --- caller must be an authenticated admin ---
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

  const asCaller = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await asCaller.auth.getUser();
  if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);

  const admin = createClient(url, serviceKey);
  const { data: roleRows } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id);
  if (!(roleRows ?? []).some((r) => r.role === "admin")) {
    return json({ error: "Admin role required" }, 403);
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: parsed.error.flatten().fieldErrors }, 400);
  }
  const { password, reviewers } = parsed.data;

  const { data: topicRows, error: topicErr } = await admin.from("topics").select("id, name");
  if (topicErr) return json({ error: topicErr.message }, 500);
  const topicIdByName = new Map((topicRows ?? []).map((t) => [t.name, t.id as string]));

  let created = 0;
  let updated = 0;
  const errors: string[] = [];
  const unknownTopics = new Set<string>();

  for (const r of reviewers) {
    const email = r.email.toLowerCase().trim();
    const fullName = `${r.firstName} ${r.lastName}`.replace(/\s+/g, " ").trim();

    try {
      let userId: string | null = null;

      const { data: createdUser, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, affiliation: r.affiliation },
      });

      if (createErr) {
        // Already exists -> look the user up instead of creating a duplicate
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const existing = (list?.users ?? []).find(
          (u) => (u.email ?? "").toLowerCase() === email,
        );
        if (!existing) {
          errors.push(`${email}: ${createErr.message}`);
          continue;
        }
        userId = existing.id;
        updated++;
      } else {
        userId = createdUser.user!.id;
        created++;
      }

      const { error: profileErr } = await admin.from("profiles").upsert(
        {
          id: userId,
          email,
          full_name: fullName,
          affiliation: r.affiliation || null,
          must_change_password: true,
        },
        { onConflict: "id" },
      );
      if (profileErr) errors.push(`${email} profile: ${profileErr.message}`);

      await admin
        .from("user_roles")
        .upsert({ user_id: userId, role: "reviewer" }, { onConflict: "user_id,role" });

      // Replace expertise with the current roster selection
      await admin.from("reviewer_expertise").delete().eq("reviewer_id", userId);
      const expertiseRows = r.topics
        .map((name) => {
          const topicId = topicIdByName.get(name);
          if (!topicId) unknownTopics.add(name);
          return topicId ? { reviewer_id: userId!, topic_id: topicId } : null;
        })
        .filter((v): v is { reviewer_id: string; topic_id: string } => v !== null);
      if (expertiseRows.length) {
        const { error: expErr } = await admin.from("reviewer_expertise").insert(expertiseRows);
        if (expErr) errors.push(`${email} expertise: ${expErr.message}`);
      }
    } catch (e) {
      errors.push(`${email}: ${e instanceof Error ? e.message : "unknown error"}`);
    }
  }

  return json({
    created,
    updated,
    total: reviewers.length,
    unknownTopics: [...unknownTopics],
    errors,
  });
});
