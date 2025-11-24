import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ListaSucursales() {
  const { user } = useAuth();
  const [sucursales, setSucursales] = useState([]);

  const cargar = async () => {
    try {
      const res = await axiosClient.get(`/api/sucursales/tienda/${user.tienda}`);
      setSucursales(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar sucursales");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Sucursales</h2>
        <Link
          to="/dashboard/sucursales/crear"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          ➕ Nueva Sucursal
        </Link>
      </div>

      {sucursales.length === 0 ? (
        <p>No hay sucursales aún.</p>
      ) : (
        <ul className="space-y-4">
          {sucursales.map((s) => (
            <li
              key={s._id}
              className="bg-white shadow p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">{s.nombre}</h3>
                <p className="text-sm text-gray-600">{s.direccion}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/dashboard/sucursales/${s._id}/admins`}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Admins
                </Link>
                <Link
                  to={`/dashboard/sucursales/${s._id}/vendedores`}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  Vendedores
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
