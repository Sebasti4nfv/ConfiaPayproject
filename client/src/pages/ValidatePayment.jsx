import React from "react";
import { useState } from "react";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";
export default function ValidatePayment() {
  const [archivo, setArchivo] = useState(null);
  const [monto, setMonto] = useState("");
  const [resultado, setResultado] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("monto", monto);
    formData.append("metodoPago", "Yape");

    const token = localStorage.getItem("token"); // ✅ obtenemos el token

    try {
      const res = await axiosClient.post("/api/validacion/subir", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`, // ✅ enviamos el token
        },
      });

      setResultado(res.data.validacion);
    } catch (err) {
      console.error("Error al validar comprobante:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error al validar comprobante");

    }
    if (res.data.validacion.resultado === "valido")
  toast.success("✅ Comprobante válido");
else if (res.data.validacion.resultado === "sospechoso")
  toast("⚠️ Comprobante sospechoso, revisa los datos");
else
  toast.error("❌ Comprobante inválido o alterado");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Validar Comprobante</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={(e) => setArchivo(e.target.files[0])} required />
        <input
          type="number"
          className="border w-full p-2 rounded"
          placeholder="Monto"
          onChange={(e) => setMonto(e.target.value)}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
          Validar
        </button>
      </form>

      {resultado && (
        <div className="mt-5 border rounded p-3">
          <p><b>Resultado:</b> {resultado.resultado}</p>
          <p>{resultado.detalles}</p>
        </div>
      )}
    </div>
  );
}
