import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminsPorSucursal() {
  const { id } = useParams(); // id = sucursalId
  const [admins, setAdmins] = useState([]);
  const [sucursal, setSucursal] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarAdmins = async () => {
    try {
      const res = await axiosClient.get(`/api/sucursales/${id}/admins`); 
      setAdmins(res.data.admins);
      setSucursal(res.data.sucursal);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar administradores ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAdmins();
  }, [id]);

  if (loading) return <p>Cargando administradores...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Administradores de la sucursal:{" "}
        <span className="text-blue-700">{sucursal?.nombre}</span>
      </h2>

      <Link
        to={`/dashboard/sucursales/${id}/crear-admin`}
        className="inline-block mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        ➕ Crear administrador
      </Link>

      {admins.length === 0 ? (
        <p>No hay administradores registrados en esta sucursal.</p>
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
            {admins.map((a) => (
              <tr key={a._id} className="border-b">
                <td className="py-2 px-4">{a.name}</td>
                <td className="py-2 px-4">{a.email}</td>
                <td className="py-2 px-4">{a.dni}</td>
                <td className="py-2 px-4">{a.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
