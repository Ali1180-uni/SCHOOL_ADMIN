import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#0B1120] text-slate-300">Loading...</div>;
  }

  if (!user || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
