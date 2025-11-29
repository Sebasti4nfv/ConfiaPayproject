import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CrearSucursal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = {
        ...form,
        tienda: user.tienda,
    };

      await axiosClient.post("/api/sucursales", body);
      toast.success("Sucursal creada correctamente");
      navigate("/dashboard/sucursales");

    } catch (err) {
      console.error(err);
      toast.error("Error al crear sucursal");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear Sucursal</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="nombre"
          placeholder="Nombre"
          className="border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          name="direccion"
          placeholder="Dirección"
          className="border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          className="border px-3 py-2 rounded"
          onChange={handleChange}
          required
        />

        <button className="bg-green-600 text-white py-2 rounded">
          Crear
        </button>
      </form>
    </div>
  );
}