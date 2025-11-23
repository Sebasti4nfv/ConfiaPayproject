import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const salir = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white py-4 px-8 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => navigate("/dashboard")}>
        ConfiaPay
      </h1>

      <ul className="flex gap-6 text-sm items-center">
        <li className="hover:text-blue-200 cursor-pointer">
          <Link to="/dashboard">Dashboard</Link>
        </li>

        {/* ✅ Opción visible solo para vendedores y dueños */}
        {(role === "vendedor" || role === "dueño") && (
          <li className="hover:text-blue-200 cursor-pointer">
            <Link to="/validate">Validar comprobante</Link>
          </li>
        )}

        {/* 🏪 Nueva opción: solo visible para dueños */}
        {role === "dueño" && (
          <li className="hover:text-blue-200 cursor-pointer">
            <Link to="/dashboard/sucursales">Sucursales</Link>
          </li>
        )}

        <li className="hover:text-blue-200 cursor-pointer" onClick={salir}>
          Salir
        </li>
      </ul>
    </nav>
  );
}
