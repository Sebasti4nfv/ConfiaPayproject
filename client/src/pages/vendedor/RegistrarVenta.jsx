import { useState } from "react";
import axios from "axios";

export default function RegistrarVenta() {
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [obs, setObs] = useState("");
  const [mensaje, setMensaje] = useState("");

  const registrar = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:5000/api/vendedor/registrar", {
      vendedorId: localStorage.getItem("userId"),
      tiendaId: localStorage.getItem("tiendaId"),
      monto,
      metodoPago,
      observacion: obs,
    });

    setMensaje("Venta registrada correctamente");
    setMonto("");
    setObs("");
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
        ></textarea>

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
    </div>
  );
}
