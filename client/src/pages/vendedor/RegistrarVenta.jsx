// src/pages/vendedor/RegistrarVenta.jsx
import { useState } from "react";
import axiosClient from "../../api/axiosClient.js";

export default function RegistrarVenta() {
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [obs, setObs] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const registrar = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      setError("Sesión expirada. Vuelve a iniciar sesión.");
      return;
    }

    try {
      await axiosClient.post("/api/vendedor/registrar", {
        vendedorId: user.id,       // id del user logueado
        tiendaId: user.tienda,     // tienda asociada al vendedor
        monto,
        metodoPago,
        observacion: obs,
      });

      setMensaje("Venta registrada correctamente");
      setMonto("");
      setObs("");
    } catch (err) {
      console.error("Error registrando venta:", err);
      setError("No se pudo registrar la venta. Revisa los datos o inténtalo de nuevo.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Venta</h1>

      <form onSubmit={registrar} className="space-y-4">
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="block w-full border p-2 rounded"
        />

        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="block w-full border p-2 rounded"
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Yape">Yape</option>
          <option value="Plin">Plin</option>
        </select>

        <textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          placeholder="Observación"
          className="block w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded w-full font-semibold"
        >
          Registrar
        </button>
      </form>

      {mensaje && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
