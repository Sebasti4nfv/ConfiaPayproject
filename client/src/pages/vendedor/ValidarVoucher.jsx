// src/pages/vendedor/ValidarVoucher.jsx
import { useState } from "react";
import axiosClient from "../../api/axiosClient.js";

export default function ValidarVoucher() {
  const [file, setFile] = useState(null);
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("Yape");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    if (!file || !monto) {
      setError("Completa todos los campos.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      setError("Sesión expirada. Vuelve a iniciar sesión.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("archivo", file);
      formData.append("monto", monto);
      formData.append("metodoPago", metodoPago);
      formData.append("vendedorId", user.id);
      formData.append("tiendaId", user.tienda);

      const res = await axiosClient.post(
        "/api/vendedor/validar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResultado(res.data);
    } catch (err) {
      console.error("Error validando voucher:", err);
      setError("No se pudo validar el comprobante.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Validar Comprobante</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2 rounded"
        />

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
          <option value="Yape">Yape</option>
          <option value="Plin">Plin</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded w-full font-semibold"
        >
          Validar
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {resultado && (
        <div className="mt-6 p-4 rounded shadow-md bg-white border">
          {resultado.resultado === "valido" ? (
            <p className="text-green-600 font-bold">✔ Comprobante válido</p>
          ) : (
            <p className="text-red-600 font-bold">✘ Comprobante falso</p>
          )}

          <p className="mt-2 text-sm">Detalles: {resultado.detalles}</p>
        </div>
      )}
    </div>
  );
}
