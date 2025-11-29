import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient.js";

import { useParams } from "react-router-dom";

export default function AdminVentasVendedor() {
  const { id } = useParams(); // id del vendedor
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    axiosClient
      .get(`/api/admin/ventas/${id}`)
      .then((res) => setVentas(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ventas del Vendedor</h1>

      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Monto</th>
            <th className="p-2">Método</th>
            <th className="p-2">Resultado</th>
            <th className="p-2">Fecha</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map((v) => (
            <tr key={v._id} className="border-t">
              <td className="p-2">S/ {v.monto}</td>
              <td className="p-2">{v.metodoPago}</td>
              <td className="p-2">{v.resultado || "—"}</td>
              <td className="p-2">{new Date(v.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
