import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function ValidacionesList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const cargarDatos = async () => {
    try {
      let url = "";

      if (user.role === "dueño") {
        url = `/api/validacion/tienda/${user.tienda}`;
      } else if (user.role === "admin") {
        url = `/api/validacion/sucursal/${user.sucursal}`;
      } else if (user.role === "vendedor") {
        url = `/api/validacion/mias`;
      }

      const res = await axiosClient.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setItems(res.data);
    } catch (e) {
      console.error("Error al cargar validaciones:", e);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Validaciones</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Fecha</th>
            <th className="p-2">Monto</th>
            <th className="p-2">Método</th>
            <th className="p-2">Resultado</th>
            {(user.role === "dueño" || user.role === "admin") && (
              <th className="p-2">Vendedor</th>
            )}
          </tr>
        </thead>

        <tbody>
          {items.map((v) => (
            <tr key={v._id} className="border-t">
              <td className="p-2">
                {new Date(v.creadoEn).toLocaleString()}
              </td>
              <td className="p-2">S/ {v.monto}</td>
              <td className="p-2">{v.metodoPago}</td>
              <td
                className={`p-2 font-semibold ${
                  v.resultado === "valido"
                    ? "text-green-600"
                    : v.resultado === "sospechoso"
                    ? "text-yellow-500"
                    : "text-red-600"
                }`}
              >
                {v.resultado}
              </td>

              {(user.role === "dueño" || user.role === "admin") && (
                <td className="p-2">{v.vendedorId?.name || "—"}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
