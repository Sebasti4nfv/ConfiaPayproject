import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient.js";

import { useParams, Link } from "react-router-dom";

export default function AdminVendedores() {
  const { id } = useParams(); // id de sucursal
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    axiosClient
      .get(`/api/admin/vendedores/${id}`)
      .then((res) => setVendedores(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendedores de esta sucursal</h1>

      <div className="space-y-4">
        {vendedores.map((v) => (
          <div key={v._id} className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">{v.nombre}</h2>
            <p className="text-gray-600">{v.email}</p>

            <Link
              to={`/admin/vendedor/${v._id}/ventas`}
              className="mt-3 inline-block bg-green-600 text-white py-2 px-4 rounded"
            >
              Ver ventas
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
