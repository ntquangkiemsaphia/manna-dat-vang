import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Action =
  | { action: "list" }
  | { action: "create"; email: string; password: string; role: "admin" | "manager" | "user" }
  | { action: "update_role"; user_id: string; role: "admin" | "manager" | "user" }
  | { action: "update_email"; user_id: string; email: string }
  | { action: "update_password"; user_id: string; password: string }
  | { action: "delete"; user_id: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const caller = userData?.user;
    if (!caller) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Forbidden: admin only" }, 403);

    const body = (await req.json()) as Action;

    if (body.action === "list") {
      const { data: list, error } = await admin.auth.admin.listUsers({ perPage: 200 });
      if (error) throw error;
      const ids = list.users.map((u) => u.id);
      const { data: roles } = await admin.from("user_roles").select("user_id, role").in("user_id", ids);
      const roleMap = new Map<string, string>();
      (roles ?? []).forEach((r: any) => roleMap.set(r.user_id, r.role));
      const users = list.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        role: roleMap.get(u.id) ?? "user",
      }));
      return json({ users });
    }

    if (body.action === "create") {
      const { email, password, role } = body;
      if (!email || !password) return json({ error: "Thiếu email/password" }, 400);
      const { data: created, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) throw error;
      const uid = created.user!.id;
      await admin.from("user_roles").delete().eq("user_id", uid);
      const { error: rErr } = await admin.from("user_roles").insert({ user_id: uid, role });
      if (rErr) throw rErr;
      return json({ ok: true, user_id: uid });
    }

    if (body.action === "update_role") {
      const { user_id, role } = body;
      if (user_id === caller.id && role !== "admin")
        return json({ error: "Không thể tự hạ quyền admin của chính mình" }, 400);
      await admin.from("user_roles").delete().eq("user_id", user_id);
      const { error } = await admin.from("user_roles").insert({ user_id, role });
      if (error) throw error;
      return json({ ok: true });
    }

    if (body.action === "update_email") {
      const { user_id, email } = body;
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Email không hợp lệ" }, 400);
      const { error } = await admin.auth.admin.updateUserById(user_id, { email, email_confirm: true });
      if (error) throw error;
      return json({ ok: true });
    }

    if (body.action === "update_password") {
      const { user_id, password } = body;
      if (!password || password.length < 6) return json({ error: "Mật khẩu tối thiểu 6 ký tự" }, 400);
      const { error } = await admin.auth.admin.updateUserById(user_id, { password });
      if (error) throw error;
      return json({ ok: true });
    }

    if (body.action === "delete") {
      if (body.user_id === caller.id) return json({ error: "Không thể xoá chính bạn" }, 400);
      const { error } = await admin.auth.admin.deleteUser(body.user_id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}