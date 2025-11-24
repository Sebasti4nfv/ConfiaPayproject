import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos de transacciones solo para dueños
        if (user.role === "dueño") {
          const res = await axiosClient.get("/api/transactions");
          setTransactions(res.data);
        }

        // Sucursales del dueño (misma lógica que ya usabas)
        const resSuc = await axiosClient.get(
          `/api/sucursales/tienda/${user.tienda}`
        );
        setSucursales(resSuc.data || []);
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        Bienvenido, {user.name} 👋
      </h1>

      <p className="mb-6 text-gray-600">
        Rol: <span className="font-semibold">{user.role}</span>
      </p>

      {/* ---- Vista por rol ---- */}
      {user.role === "cliente" && <ClienteView />}
      {user.role === "vendedor" && <VendedorView />}
      {user.role === "dueño" && (
        <DuenioView
          transactions={transactions}
          sucursales={sucursales}
        />
      )}
    </div>
  );
}

/* --------------------------
      VISTA CLIENTE
---------------------------*/
function ClienteView() {
  return <p>Valida tus comprobantes y pagos aquí 💳</p>;
}

/* --------------------------
      VISTA VENDEDOR
---------------------------*/
function VendedorView() {
  return (
    <div className="mt-6 text-center">
      <p>Registra tus ventas y pagos 💼</p>

      <Link
        to="/vendedor"
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
      >
        Registrar nueva transacción
      </Link>

      <Link
        to="/validate"
        className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Validar comprobante
      </Link>
    </div>
  );
}

/* --------------------------
      VISTA DUEÑO MEJORADA
---------------------------*/
function DuenioView({ transactions, sucursales }) {
  const sucursalesCount = sucursales.length;

  // Resumen global
  const ingresos = transactions
    .filter((t) => t.tipo === "ingreso")
    .reduce((acc, t) => acc + t.monto, 0);

  const egresos = transactions
    .filter((t) => t.tipo === "egreso")
    .reduce((acc, t) => acc + t.monto, 0);

  const balance = ingresos - egresos;

  // Resumen por sucursal
  const resumenPorSucursal = sucursales.map((suc) => {
    const transSucursal = transactions.filter((t) => {
      // Ajusta estos campos según tu modelo de transacción
      return (
        t.sucursal === suc._id ||
        t.sucursalId === suc._id ||
        t.sucursal?._id === suc._id
      );
    });

    const ing = transSucursal
      .filter((t) => t.tipo === "ingreso")
      .reduce((acc, t) => acc + t.monto, 0);

    const egr = transSucursal
      .filter((t) => t.tipo === "egreso")
      .reduce((acc, t) => acc + t.monto, 0);

    return {
      id: suc._id,
      nombre: suc.nombre,
      ingresos: ing,
      egresos: egr,
      balance: ing - egr,
      totalTransacciones: transSucursal.length,
    };
  });
  const dataGraficoSucursales = resumenPorSucursal.map((s) => ({
    nombre: s.nombre,
    ingresos: s.ingresos,
    egresos: s.egresos,
    balance: s.balance,
  }));
  // Últimas transacciones (máx 8)
  const ultimasTransacciones = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.fecha || b.createdAt) - new Date(a.fecha || a.createdAt)
    )
    .slice(0, 8);  

  return (
    <div className="space-y-6">
      {/* --- Tarjetas Resumen Global --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-green-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Ingresos totales</p>
          <p className="text-2xl font-bold text-green-700">S/ {ingresos}</p>
        </div>

        <div className="bg-red-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Egresos totales</p>
          <p className="text-2xl font-bold text-red-700">S/ {egresos}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Balance</p>
          <p className="text-2xl font-bold text-blue-700">S/ {balance}</p>
        </div>

        <div className="bg-indigo-100 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Sucursales activas</p>
          <p className="text-2xl font-bold text-indigo-700">
            {sucursalesCount}
          </p>
        </div>
      </div>

      {/* --- Resumen por sucursal --- */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800">
            Resumen financiero por sucursal
          </h2>
          <Link
            to="/dashboard/sucursales"
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Gestionar sucursales
          </Link>
        </div>

        {resumenPorSucursal.length === 0 ? (
          <p className="text-gray-500">
            Aún no tienes sucursales registradas o no hay transacciones.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left">Sucursal</th>
                  <th className="px-4 py-2 text-right">Ingresos</th>
                  <th className="px-4 py-2 text-right">Egresos</th>
                  <th className="px-4 py-2 text-right">Balance</th>
                  <th className="px-4 py-2 text-right">Transacciones</th>
                </tr>
              </thead>
              <tbody>
                {resumenPorSucursal.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="px-4 py-2">{s.nombre}</td>
                    <td className="px-4 py-2 text-right">
                      S/ {s.ingresos.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      S/ {s.egresos.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-semibold ${
                        s.balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      S/ {s.balance.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {s.totalTransacciones}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* --- Gráfico por sucursal --- */}
      {dataGraficoSucursales.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Comparativo de ingresos y egresos por sucursal
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGraficoSucursales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ingresos" name="Ingresos" fill="#16a34a" />
                <Bar dataKey="egresos" name="Egresos" fill="#dc2626" />
                <Bar dataKey="balance" name="Balance" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {/* --- Últimas transacciones --- */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800">
            Últimas transacciones
          </h2>
          <span className="text-xs text-gray-500">
            Muestra las últimas operaciones registradas
          </span>
        </div>

        {ultimasTransacciones.length === 0 ? (
          <p className="text-gray-500">Todavía no hay transacciones.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-right">Monto</th>
                  <th className="px-4 py-2 text-left">Sucursal</th>
                  <th className="px-4 py-2 text-left">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {ultimasTransacciones.map((t) => (
                  <tr key={t._id} className="border-b last:border-0">
                    <td className="px-4 py-2">
                      {new Date(t.fecha || t.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 capitalize">
                      {t.tipo || "—"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      S/ {t.monto?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {/* Ajusta según tu modelo de sucursal en transacción */}
                      {t.sucursalNombre ||
                        t.sucursal?.nombre ||
                        "Sin sucursal"}
                    </td>
                    <td className="px-4 py-2">
                      {t.descripcion || t.metodoPago || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Accesos rápidos --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/validaciones"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg text-center font-semibold"
        >
          Módulo de validación de comprobantes
        </Link>

        <Link
          to="/dashboard/trustscore"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-center font-semibold"
        >
          Análisis financiero / Trust Score
        </Link>

        <Link
          to="/reportes"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold block text-center"
        >
          📊 Reportes financieros
        </Link>

      </div>
    </div>
  );
}
