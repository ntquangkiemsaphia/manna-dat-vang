import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

const AuthBoundary = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthBoundary;