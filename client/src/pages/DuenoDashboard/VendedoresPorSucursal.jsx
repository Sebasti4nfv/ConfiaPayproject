import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function VendedoresPorSucursal() {
  const { id } = useParams(); // sucursalId
  const [vendedores, setVendedores] = useState([]);
  const [sucursal, setSucursal] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarVendedores = async () => {
    try {
      const res = await axiosClient.get(`/api/sucursales/${id}/vendedores`);
      setVendedores(res.data.vendedores);
      setSucursal(res.data.sucursal);
    } catch (error) {
      console.error("Error al cargar vendedores:", error);
      toast.error("No se pudieron cargar los vendedores ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVendedores();
  }, [id]);

  if (loading) return <p>Cargando vendedores...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Vendedores de la sucursal:{" "}
        <span className="text-purple-700">{sucursal?.nombre}</span>
      </h2>

      <Link
        to={`/dashboard/sucursales/${id}/crear-vendedor`}
        className="inline-block mb-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
      >
        ➕ Crear vendedor
      </Link>

      {vendedores.length === 0 ? (
        <p>No hay vendedores registrados en esta sucursal.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Correo</th>
              <th className="py-2 px-4 text-left">DNI</th>
              <th className="py-2 px-4 text-left">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((v) => (
              <tr key={v._id} className="border-b">
                <td className="py-2 px-4">{v.name}</td>
                <td className="py-2 px-4">{v.email}</td>
                <td className="py-2 px-4">{v.dni}</td>
                <td className="py-2 px-4">{v.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
