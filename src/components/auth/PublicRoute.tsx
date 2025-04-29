
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-gentle text-xl font-medium">Carregando...</div>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
