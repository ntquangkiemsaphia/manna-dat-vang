import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Role = "admin" | "manager" | "user";
interface UserRow { id: string; email: string; created_at: string; role: Role }

const callFn = async (body: unknown) => {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) throw new Error(error.message);
  if ((data as any)?.error) throw new Error((data as any).error);
  return data;
};

const UsersAdmin = () => {
  const qc = useQueryClient();
  const { user: me } = useAuth();
  const [open, setOpen] = useState(false);
  const [editEmailUser, setEditEmailUser] = useState<UserRow | null>(null);
  const [editPwdUser, setEditPwdUser] = useState<UserRow | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await callFn({ action: "list" });
      return ((res as any).users ?? []) as UserRow[];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: Role }) =>
      callFn({ action: "update_role", user_id, role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Đã cập nhật quyền"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteUser = useMutation({
    mutationFn: async (user_id: string) => callFn({ action: "delete", user_id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Đã xoá người dùng"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground border-0">
              <Plus className="w-4 h-4 mr-1" /> Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Thêm người dùng mới</DialogTitle></DialogHeader>
            <CreateUserForm onDone={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["admin-users"] }); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left p-3 font-medium">Email</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Ngày tạo</th>
            <th className="text-left p-3 font-medium">Quyền</th>
            <th className="text-right p-3 font-medium">Thao tác</th>
          </tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Đang tải...</td></tr>}
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{u.email}{u.id === me?.id && <span className="ml-2 text-xs text-muted-foreground">(bạn)</span>}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{new Date(u.created_at).toLocaleDateString("vi-VN")}</td>
                <td className="p-3">
                  <Select
                    value={u.role}
                    onValueChange={(v) => updateRole.mutate({ user_id: u.id, role: v as Role })}
                    disabled={u.id === me?.id}
                  >
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm" variant="ghost" title="Đổi email"
                    onClick={() => setEditEmailUser(u)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm" variant="ghost" title="Đổi mật khẩu"
                    onClick={() => setEditPwdUser(u)}
                  >
                    <KeyRound className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm" variant="ghost" className="text-destructive"
                    disabled={u.id === me?.id}
                    onClick={() => { if (confirm(`Xoá user ${u.email}?`)) deleteUser.mutate(u.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && users.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Chưa có người dùng</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editEmailUser} onOpenChange={(o) => !o && setEditEmailUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Đổi email đăng nhập</DialogTitle></DialogHeader>
          {editEmailUser && (
            <EditEmailForm user={editEmailUser} onDone={() => { setEditEmailUser(null); qc.invalidateQueries({ queryKey: ["admin-users"] }); }} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPwdUser} onOpenChange={(o) => !o && setEditPwdUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Đổi mật khẩu</DialogTitle></DialogHeader>
          {editPwdUser && (
            <EditPasswordForm user={editPwdUser} onDone={() => setEditPwdUser(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CreateUserForm = ({ onDone }: { onDone: () => void }) => {
  const [form, setForm] = useState({ email: "", password: "", role: "manager" as Role });
  const m = useMutation({
    mutationFn: async () => callFn({ action: "create", ...form }),
    onSuccess: () => { toast.success("Đã tạo người dùng"); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Email *</label>
        <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Mật khẩu *</label>
        <Input type="text" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Quyền</label>
        <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0" disabled={m.isPending}>
        {m.isPending ? "Đang tạo..." : "Tạo người dùng"}
      </Button>
    </form>
  );
};

const EditEmailForm = ({ user, onDone }: { user: UserRow; onDone: () => void }) => {
  const [email, setEmail] = useState(user.email);
  const m = useMutation({
    mutationFn: async () => callFn({ action: "update_email", user_id: user.id, email }),
    onSuccess: () => { toast.success("Đã đổi email"); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Email mới *</label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0" disabled={m.isPending}>
        {m.isPending ? "Đang lưu..." : "Cập nhật email"}
      </Button>
    </form>
  );
};

const EditPasswordForm = ({ user, onDone }: { user: UserRow; onDone: () => void }) => {
  const [password, setPassword] = useState("");
  const m = useMutation({
    mutationFn: async () => callFn({ action: "update_password", user_id: user.id, password }),
    onSuccess: () => { toast.success("Đã đổi mật khẩu"); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-4">
      <div className="text-sm text-muted-foreground">User: <span className="font-medium text-foreground">{user.email}</span></div>
      <div>
        <label className="text-sm font-medium mb-1 block">Mật khẩu mới * (≥ 6 ký tự)</label>
        <Input type="text" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0" disabled={m.isPending}>
        {m.isPending ? "Đang lưu..." : "Cập nhật mật khẩu"}
      </Button>
    </form>
  );
};

export default UsersAdmin;