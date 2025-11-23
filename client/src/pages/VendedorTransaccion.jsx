import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function VendedorTransaccion() {
  const { user } = useAuth();
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("ingreso");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await axiosClient.post("/api/transactions", {
        monto,
        descripcion,
        tipo,
        comprobante: "voucher_demo.png",
        tienda: user.tienda,
        sucursal: user.sucursal,   // ← AGREGAR ESTO
      });

      toast.success("Transacción registrada correctamente");
      setMonto("");
      setDescripcion("");
      setTipo("ingreso");
    } catch (error) {
      console.error("❌ Error al registrar:", error.response?.data || error);
      toast.error("Error al registrar la transacción");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Registrar Transacción 💼
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold text-gray-700">
            Monto (S/.)
          </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-blue-500"
            required
          />

          <label className="block mb-2 font-semibold text-gray-700">
            Descripción
          </label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-blue-500"
            placeholder="Ej: Venta de producto X"
            required
          />

          <label className="block mb-2 font-semibold text-gray-700">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-blue-500"
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Guardar Transacción
          </button>
        </form>

        {mensaje && (
          <p className="text-center mt-4 font-semibold text-gray-700">
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
