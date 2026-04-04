import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PublicRoute() {
  const { state } = useAuth();
  return state.token ? <Navigate to="/" replace /> : <Outlet />;
}
