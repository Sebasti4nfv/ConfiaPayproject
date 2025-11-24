import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TrustScoreDashboard() {
  const { user } = useAuth();
  const [vendedores, setVendedores] = useState([]);
  const [globalScore, setGlobalScore] = useState(0);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  // Genera datos simulados de TrustScore por vendedor
  const enrichWithTrustData = (lista) => {
    const enriched = lista.map((v) => {
      const base = 55 + Math.random() * 40; // 55–95
      const score = Math.round(base);

      const riesgos = {
        ventas_rapidas: Math.floor(Math.random() * 4),
        monto_inusual: Math.floor(Math.random() * 5),
        validaciones_fallidas: Math.floor(Math.random() * 3),
        actividad_nocturna: Math.floor(Math.random() * 4),
      };

      const historialScore = Array.from({ length: 7 }).map((_, i) =>
        Math.max(
          40,
          Math.min(100, Math.round(score + (Math.random() * 10 - 5)))
        )
      );

      return {
        id: v._id || v.id || String(Math.random()),
        nombre: v.name || v.nombre || "Vendedor",
        score,
        riesgos,
        historialScore,
      };
    });

    if (enriched.length === 0) {
      // fallback si no hay vendedores todavía
      return [
        {
          id: "fake1",
          nombre: "Vendedor demo 1",
          score: 92,
          riesgos: {
            ventas_rapidas: 0,
            monto_inusual: 1,
            validaciones_fallidas: 0,
            actividad_nocturna: 1,
          },
          historialScore: [95, 93, 92, 91, 92, 94, 92],
        },
        {
          id: "fake2",
          nombre: "Vendedor demo 2",
          score: 68,
          riesgos: {
            ventas_rapidas: 2,
            monto_inusual: 3,
            validaciones_fallidas: 1,
            actividad_nocturna: 2,
          },
          historialScore: [75, 73, 70, 65, 60, 62, 68],
        },
        {
          id: "fake3",
          nombre: "Vendedor demo 3",
          score: 54,
          riesgos: {
            ventas_rapidas: 3,
            monto_inusual: 4,
            validaciones_fallidas: 2,
            actividad_nocturna: 3,
          },
          historialScore: [60, 58, 55, 52, 50, 53, 54],
        },
      ];
    }

    return enriched;
  };

  // Carga lista real de vendedores de la tienda y les agrega TrustScore simulado
  const cargarVendedores = async () => {
    try {
      const token = localStorage.getItem("token");

      let lista = [];
      if (user?.tienda) {
        // ajusta la ruta si tu backend usa otro prefijo
        const res = await axiosClient.get(
          `/api/usuarios/vendedores/${user.tienda}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        lista = res.data || [];
      }

      const enriched = enrichWithTrustData(lista);
      setVendedores(enriched);

      // promedio como TrustScore global
      const avg =
        enriched.reduce((acc, v) => acc + v.score, 0) / enriched.length;
      const global = Math.round(avg || 80);
      setGlobalScore(global);

      // tendencia alrededor del global
      const trendData = Array.from({ length: 7 }).map((_, i) => ({
        dia: `D${i + 1}`,
        score: Math.max(
          40,
          Math.min(100, Math.round(global + (Math.random() * 10 - 5)))
        ),
      }));
      setTrend(trendData);
    } catch (err) {
      console.error("Error cargando vendedores para TrustScore:", err);
      // fallback completo si algo falla
      const enriched = enrichWithTrustData([]);
      setVendedores(enriched);
      setGlobalScore(80);
      const trendData = Array.from({ length: 7 }).map((_, i) => ({
        dia: `D${i + 1}`,
        score: 75 + (i % 3) * 3,
      }));
      setTrend(trendData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) cargarVendedores();
  }, [user]);

  const getScoreLabel = (score) => {
    if (score >= 80) return "Confiable";
    if (score >= 60) return "Moderado";
    return "Riesgo alto";
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const barData = vendedores.map((v) => ({
    nombre: v.nombre,
    score: v.score,
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
            <ShieldCheck size={30} /> Análisis financiero / TrustScore
          </h1>
          <p className="text-gray-600 mt-1 max-w-2xl">
            Módulo de análisis de riesgo de vendedores basado en comportamiento
            transaccional simulado. Listo para conectarse en el futuro con
            validaciones reales y modelos de Machine Learning.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="text-sm text-blue-700 hover:underline font-semibold"
        >
          ← Volver al dashboard
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando TrustScore...</p>
      ) : (
        <>
          {/* CARDS PRINCIPALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100">
                <ShieldCheck className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">TrustScore global</p>
                <p className="text-3xl font-bold text-blue-700">
                  {globalScore}/100
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
              <div className="p-3 rounded-full bg-indigo-100">
                <TrendingUp className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vendedores analizados</p>
                <p className="text-3xl font-bold text-indigo-700">
                  {vendedores.length}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
              <div className="p-3 rounded-full bg-yellow-100">
                <AlertTriangle className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Riesgos detectados</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {vendedores.reduce(
                    (acc, v) =>
                      acc +
                      v.riesgos.ventas_rapidas +
                      v.riesgos.monto_inusual +
                      v.riesgos.validaciones_fallidas +
                      v.riesgos.actividad_nocturna,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* GRAFICOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Tendencia global */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp size={18} /> Evolución semanal del TrustScore global
              </h2>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis domain={[40, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score por vendedor */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                TrustScore por vendedor
              </h2>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis domain={[40, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" name="TrustScore" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* TABLA DETALLE */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Detalle de riesgo por vendedor
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 text-left">Vendedor</th>
                    <th className="px-4 py-2 text-center">TrustScore</th>
                    <th className="px-4 py-2 text-center">Estado</th>
                    <th className="px-4 py-2 text-center">Ventas rápidas</th>
                    <th className="px-4 py-2 text-center">Montos inusuales</th>
                    <th className="px-4 py-2 text-center">
                      Validaciones fallidas
                    </th>
                    <th className="px-4 py-2 text-center">
                      Actividad nocturna
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vendedores.map((v) => (
                    <tr key={v.id} className="border-b last:border-0">
                      <td className="px-4 py-2">{v.nombre}</td>
                      <td className="px-4 py-2 text-center font-semibold">
                        {v.score}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreClass(
                            v.score
                          )}`}
                        >
                          {getScoreLabel(v.score)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {v.riesgos.ventas_rapidas}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {v.riesgos.monto_inusual}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {v.riesgos.validaciones_fallidas}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {v.riesgos.actividad_nocturna}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Nota: los valores de riesgo están simulados para este avance, pero
              el módulo está preparado para conectarse con datos reales de
              transacciones y validaciones en futuros sprints.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
