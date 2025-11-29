import { useState } from "react";
import axios from "axios";

export default function ValidarVoucher() {
  const [file, setFile] = useState(null);
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("Yape");
  const [resultado, setResultado] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !monto) {
      alert("Completa todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("monto", monto);
    formData.append("metodoPago", metodoPago);
    formData.append("vendedorId", localStorage.getItem("userId"));
    formData.append("tiendaId", localStorage.getItem("tiendaId"));

    const res = await axios.post(
      "http://localhost:5000/api/vendedor/validar",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setResultado(res.data);
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

      {/* RESULTADO */}
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
