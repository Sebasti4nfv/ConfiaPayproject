import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { CheckCircle, XCircle, TrendingUp, CreditCard } from "lucide-react";

// 🎨 Colores para gráficos
const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b"];

// 📌 Datos SIMULADOS
const estadisticasSimuladas = {
  totalValidaciones: 42,
  validacionesExitosas: 35,
  sospechosas: 4,
  rechazadas: 3,
  totalGastado: 1870,
};

const validacionesPorMes = [
  { mes: "Ene", cant: 4 },
  { mes: "Feb", cant: 6 },
  { mes: "Mar", cant: 3 },
  { mes: "Abr", cant: 8 },
  { mes: "May", cant: 5 },
  { mes: "Jun", cant: 7 },
];

const metodosPago = [
  { metodo: "Yape", value: 22 },
  { metodo: "Plin", value: 14 },
  { metodo: "Transferencia", value: 6 },
];

const actividadLinea = [
  { dia: "Lun", val: 2 },
  { dia: "Mar", val: 3 },
  { dia: "Mié", val: 1 },
  { dia: "Jue", val: 4 },
  { dia: "Vie", val: 3 },
  { dia: "Sáb", val: 5 },
  { dia: "Dom", val: 1 },
];

const actividadReciente = [
  { tienda: "DMujeres", monto: 80, fecha: "2025-11-15" },
  { tienda: "TechZone", monto: 100, fecha: "2025-11-14" },
  { tienda: "MiniMarket Don Pepe", monto: 20, fecha: "2025-11-13" },
];

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(estadisticasSimuladas);

  useEffect(() => {
    console.log("ClienteDashboard cargado con datos simulados.");
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">

      {/* ENCABEZADO */}
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        Hola, {user.name} 👋
      </h1>
      <p className="text-gray-600 mb-10">
        Bienvenido a tu panel de control de ConfiaPay.
      </p>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="p-5 bg-blue-600 text-white rounded-xl shadow-md">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Validaciones Totales</h2>
            <CreditCard size={32} />
          </div>
          <p className="mt-4 text-4xl font-bold">{stats.totalValidaciones}</p>
        </div>

        <div className="p-5 bg-green-600 text-white rounded-xl shadow-md">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Exitosas</h2>
            <CheckCircle size={32} />
          </div>
          <p className="mt-4 text-4xl font-bold">{stats.validacionesExitosas}</p>
        </div>

        <div className="p-5 bg-yellow-500 text-white rounded-xl shadow-md">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Sospechosas</h2>
            <TrendingUp size={32} />
          </div>
          <p className="mt-4 text-4xl font-bold">{stats.sospechosas}</p>
        </div>

        <div className="p-5 bg-red-600 text-white rounded-xl shadow-md">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Rechazadas</h2>
            <XCircle size={32} />
          </div>
          <p className="mt-4 text-4xl font-bold">{stats.rechazadas}</p>
        </div>
      </div>

      {/* TOTAL GASTADO */}
      <div className="mt-10 bg-gray-100 p-6 rounded-xl shadow flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-700">Total gastado validado</h2>
          <p className="text-gray-600 mt-1">Monto total detectado en validaciones.</p>
        </div>
        <p className="text-4xl font-bold text-blue-700">S/ {stats.totalGastado}</p>
      </div>

      {/* GRAFICO DE BARRAS */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Validaciones por mes</h2>
        <div className="w-full h-64 bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={validacionesPorMes}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cant" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAFICO DE PIE */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Métodos de pago usados</h2>
        <div className="w-full h-64 bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={metodosPago}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label = {({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {metodosPago.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAFICO DE LINEA */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Actividad semanal</h2>
        <div className="w-full h-64 bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={actividadLinea}>
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-3">
        Actividad reciente
      </h2>

      <div className="space-y-4">
        {actividadReciente.map((item, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg shadow-sm bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{item.tienda}</p>
              <p className="text-gray-600 text-sm">Fecha: {item.fecha}</p>
            </div>
            <p className="text-blue-700 font-bold text-lg">S/ {item.monto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
