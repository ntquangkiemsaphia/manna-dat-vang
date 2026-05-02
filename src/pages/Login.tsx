import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, isAdmin, loading: authLoading, user } = useAuth();

  // Chỉ redirect sau khi auth đã sẵn sàng để tránh nháy qua lại giữa login/admin.
  if (!authLoading && user && isAdmin) {
    return <Navigate to="/quan-tri" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Đăng nhập thành công!");
      navigate("/quan-tri");
    } catch (err: any) {
      toast.error(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-32">
        <div className="container max-w-md">
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Đăng nhập quản trị</h1>
              <p className="text-sm text-muted-foreground mt-2">Đăng nhập để quản lý nội dung website</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@mannadatvang.vn" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0 py-5" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
