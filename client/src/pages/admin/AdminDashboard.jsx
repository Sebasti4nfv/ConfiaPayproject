import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient.js";
import { Link } from "react-router-dom";
import { Store, Users, Eye } from "lucide-react";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const adminId = user?.id;

  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) return;

    axiosClient
      .get(`/api/admin/sucursales/${adminId}`)
      .then((res) => {
        setSucursales(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("❌ Error:", err);
        setLoading(false);
      });
  }, [adminId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando información...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* TITULO */}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Dashboard del Administrador
      </h1>

      {/* LISTA DE SUCURSALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {sucursales.map((s) => (
          <div
            key={s._id}
            className="bg-white border shadow-sm rounded-lg p-5 hover:shadow-md transition"
          >
            {/* HEADER SUCURSAL */}
            <div className="flex items-center gap-3 mb-4">
              <Store size={28} className="text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{s.nombre}</h2>
                <p className="text-sm text-gray-500">{s.direccion}</p>
              </div>
            </div>

            {/* INFORMACIÓN */}
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Teléfono:</span> {s.telefono}
            </p>

            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Vendedores:</span>{" "}
              {s.vendedores.length}
            </p>

            {/* BOTONES */}
            <div className="flex gap-3 mt-3">
              <Link
                to={`/admin/sucursal/${s._id}/vendedores`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <Users size={18} />
                Ver Vendedores
              </Link>

              <Link
                to={`/admin/sucursal/${s._id}/vendedores`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                <Eye size={18} />
                Ver Ventas
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* SI NO HAY SUCURSALES */}
      {sucursales.length === 0 && (
        <div className="mt-10 text-center text-gray-500">
          No tienes sucursales asignadas.
        </div>
      )}
    </div>
  );
}
