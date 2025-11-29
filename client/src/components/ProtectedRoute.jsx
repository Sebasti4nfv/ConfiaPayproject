import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth();

  // No autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si user aún no carga
  if (!user) {
    console.log("⏳ Esperando user...");
    return null;
  }

  // Validación de roles
  if (roles && !roles.includes(user.role)) {
    console.log("⛔ Acceso denegado. Rol actual:", user.role);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
