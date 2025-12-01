import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Store, LogOut, User, CreditCard } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md border-b">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <span
          onClick={() => {
            if (!user) return navigate("/");

            switch (user.role) {
              case "cliente":
                navigate("/cliente/dashboard");
                break;
              case "vendedor":
                navigate("/vendedor/dashboard");
                break;
              case "admin":
                navigate("/admin/dashboard");
                break;
              case "dueño":
                navigate("/dashboard"); // Dashboard del dueño
                break;
              default:
                navigate("/");
            }
          }}
          className="text-2xl font-bold text-blue-700 cursor-pointer"
        >
          ConfiaPay
        </span>

        {/* BOTONES */}
        <div className="flex items-center gap-6">

          {/* --- NO LOGUEADO --- */}
          {!user && (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600">
                Registrarse
              </Link>
            </>
          )}

          {/* --- CLIENTE --- */}
          {user?.role === "cliente" && (
            <>
              <Link
                to="/cliente/dashboard"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                <Home size={18} /> Inicio
              </Link>

              <Link
                to="/cliente"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                <Store size={18} /> Buscar Tienda
              </Link>

              <Link
                to="/cliente/perfil"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                <User size={18} /> Perfil
              </Link>
            </>
          )}

          {/* --- VENDEDOR Y DUEÑO: Validar Comprobante --- */}
          {(user?.role === "vendedor" || user?.role === "dueño") && (
            <Link
              to="/vendedor/validar"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <CreditCard size={18} /> Validar Comprobante
            </Link>
          )}

          {/* --- SOLO DUEÑO: Sucursales --- */}
          {user?.role === "dueño" && (
            <Link
              to="/dashboard/sucursales"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <Store size={18} /> Sucursales
            </Link>
          )}

          {/* --- LOGOUT (TODOS) --- */}
          {user && (
            <button
              onClick={handleLogout}
              className="text-red-600 font-semibold hover:text-red-700 flex items-center gap-1"
            >
              <LogOut size={18} />
              Salir
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
