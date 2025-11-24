import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth();

  // No autenticado → redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Rol no permitido → redirigir según caso
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}