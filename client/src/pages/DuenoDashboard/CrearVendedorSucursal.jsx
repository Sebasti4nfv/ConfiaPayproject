import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CrearVendedorSucursal() {
  const { id } = useParams(); // id = sucursalId
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
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
      // FUTURO endpoint backend
      await axiosClient.post(`/api/sucursales/${id}/crear-vendedor`, {
        ...form,
        tienda: user.tienda,
        sucursal: id,
      });

      toast.success("Vendedor creado correctamente");
      navigate(`/dashboard/sucursales/${id}/vendedores`);
    } catch (error) {
      console.error("Error creando vendedor:", error.response?.data || error);
      toast.error("No se pudo registrar el vendedor");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crear Vendedor para Sucursal</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={form.nombres}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={form.apellidos}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="border p-3 rounded col-span-2"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="border p-3 rounded col-span-2"
          required
        />

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded col-span-2"
        >
          Registrar Vendedor
        </button>
      </form>
    </div>
  );
}
