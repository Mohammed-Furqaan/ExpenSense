import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { state } = useAuth();
  return state.token ? <Outlet /> : <Navigate to="/login" replace />;
}
