
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const isAdmin = localStorage.getItem("userEmail") === "savesuppo@gmail.com";
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
