import { Navigate, Outlet, useLocation } from "react-router-dom";

export const RequireAuth = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const location = useLocation();
  if (!token) return <Navigate to="/auth" state={{ from: location }} replace />;
  return <Outlet />;
};