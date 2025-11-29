import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient.js";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [sucursales, setSucursales] = useState([]);
  const adminId = localStorage.getItem("userId");

  console.log("🟦 AdminDashboard cargado");
  console.log("🟩 adminId:", adminId);

  useEffect(() => {
    axiosClient
      .get(`/api/admin/sucursales/${adminId}`)
      .then((res) => {
        console.log("🟩 respuesta sucursales:", res.data);
        setSucursales(res.data);
      })
      .catch((err) => {
        console.error("❌ error axios:", err);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard del Administrador</h1>

      <pre className="bg-gray-100 p-2 text-sm">
        {JSON.stringify(sucursales, null, 2)}
      </pre>
    </div>
  );
}

