import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { PlusCircle, Users, Store, Activity, Building } from "lucide-react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
console.log("CARGANDO ESTE ARCHIVO DE SUCURSALES");

export default function SucursalesDashboard() {
  const { user } = useAuth();
  const [sucursales, setSucursales] = useState([]);

  // Genera stats y sparkline "bonitos" para demo
  const generarStatsSucursal = () => {
    const ingresosDia = Math.floor(Math.random() * 800) + 200; // 200–1000
    const egresosDia = Math.floor(ingresosDia * (0.2 + Math.random() * 0.4)); // 20–60% de ingresos
    const balanceDia = ingresosDia - egresosDia;
    const validaciones = Math.floor(Math.random() * 20) + 5; // 5–25
    const actividad = Math.min(100, Math.max(20, Math.floor((validaciones / 25) * 100)));

    const sparkData = Array.from({ length: 7 }).map((_, i) => ({
      dia: `D${i + 1}`,
      valor:
        Math.floor(ingresosDia * 0.4) +
        Math.floor(Math.random() * ingresosDia * 0.6),
    }));

    return {
      ingresosDia,
      egresosDia,
      balanceDia,
      validaciones,
      actividad,
      sparkData,
    };
  };

  const cargarSucursales = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axiosClient.get(
        `/api/sucursales/tienda/${user.tienda}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data || [];

      // Enriquecemos con stats locales para el dashboard
      const enriquecidas = data.map((s) => ({
        ...s,
        _stats: generarStatsSucursal(),
      }));

      setSucursales(enriquecidas);
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar las sucursales");
    }
  };

  useEffect(() => {
    if (user?.tienda) {
      cargarSucursales();
    }
  }, [user]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
            <Building size={30} /> Sucursales
          </h1>
          <p className="text-gray-600 mt-1">
            Visualiza el rendimiento de cada punto de venta y gestiona su equipo.
          </p>
        </div>

        <Link
          to="/dashboard/sucursales/crear"
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow"
        >
          <PlusCircle size={20} /> Nueva Sucursal
        </Link>
      </div>

      {/* GRID DE SUCURSALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sucursales.map((s) => (
          <div
            key={s._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition border border-gray-200 flex flex-col"
          >
            {/* ENCABEZADO */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Store className="text-blue-600" size={26} />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {s.nombre}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {s.direccion || "Dirección no registrada"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-500">Estado</span>
                <p className="text-sm font-semibold text-green-600">
                  🟢 Activa
                </p>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center shadow-sm">
                <p className="text-[11px] text-gray-600 mb-1">Ingresos hoy</p>
                <p className="font-bold text-blue-800 text-lg">
                  S/ {s._stats.ingresosDia}
                </p>
              </div>

              <div className="bg-red-50 p-3 rounded-lg text-center shadow-sm">
                <p className="text-[11px] text-gray-600 mb-1">Egresos hoy</p>
                <p className="font-bold text-red-700 text-lg">
                  S/ {s._stats.egresosDia}
                </p>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg text-center shadow-sm">
                <p className="text-[11px] text-gray-600 mb-1">Balance</p>
                <p
                  className={`font-bold text-lg ${
                    s._stats.balanceDia >= 0
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  S/ {s._stats.balanceDia}
                </p>
              </div>
            </div>

            {/* ACTIVIDAD Y VALIDACIONES */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="text-green-600" size={18} />
                <p className="text-sm text-gray-700">
                  Actividad:{" "}
                  <span className="font-semibold">
                    {s._stats.actividad}%
                  </span>
                </p>
              </div>

              <p className="text-sm text-gray-700">
                Validaciones:{" "}
                <span className="font-semibold">
                  {s._stats.validaciones}
                </span>
              </p>
            </div>

            {/* SPARKLINE */}
            <div className="h-20 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={s._stats.sparkData}>
                  <Tooltip
                    formatter={(value) => [`S/ ${value}`, "Monto"]}
                    labelFormatter={(label) => `Día ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* BOTONES */}
            <div className="mt-auto flex flex-col gap-2">
              <Link
                to={`/dashboard/sucursales/${s._id}`}
                className="w-full text-center bg-gray-900 hover:bg-black text-white px-3 py-2 rounded-lg font-semibold"
              >
                Ver detalle
              </Link>

              <div className="flex gap-2">
                <Link
                  to={`/dashboard/sucursales/${s._id}/admins`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Users size={18} /> Admins
                </Link>

                <Link
                  to={`/dashboard/sucursales/${s._id}/vendedores`}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Users size={18} /> Vendedores
                </Link>
              </div>
            </div>
          </div>
        ))}

        {sucursales.length === 0 && (
          <p className="text-gray-500">
            Aún no tienes sucursales registradas. Crea la primera para empezar a
            monitorear tu negocio.
          </p>
        )}
      </div>
    </div>
  );
}
