import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // Không chặn render mặc định để tránh "trang trắng" trong vài giây đầu
  // khi Supabase đang khôi phục session / refresh token thất bại.
  const [loading, setLoading] = useState(false);
  const [roleChecked, setRoleChecked] = useState(true);

  const checkAdmin = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    } finally {
      setRoleChecked(true);
    }
  };

  useEffect(() => {
    let initialized = false;
    let lastCheckedUserId: string | null = null;

    const handleSession = (s: Session | null) => {
      setSession(s);
      setUser(s?.user ?? null);
      const uid = s?.user?.id ?? null;
      if (uid && uid !== lastCheckedUserId) {
        lastCheckedUserId = uid;
        setRoleChecked(false);
        // defer to tránh deadlock với onAuthStateChange
        setTimeout(() => checkAdmin(uid), 0);
      } else if (!uid) {
        lastCheckedUserId = null;
        setIsAdmin(false);
        setRoleChecked(true);
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Bỏ qua INITIAL_SESSION nếu getSession() đã chạy trước
        if (!initialized && _event === "INITIAL_SESSION") return;
        handleSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      initialized = true;
      handleSession(session);
    }).catch(() => {
      initialized = true;
      setLoading(false);
      setRoleChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setRoleChecked(true);
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading: loading || (!!user && !roleChecked), signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
