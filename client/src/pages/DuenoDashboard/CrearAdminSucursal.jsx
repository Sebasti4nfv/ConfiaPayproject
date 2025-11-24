import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CrearAdminSucursal() {
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
      // Endpoint FUTURO: /api/sucursales/:id/crear-admin
      await axiosClient.post(`/api/sucursales/${id}/crear-admin`, {
        ...form,
        tienda: user.tienda,   // dueño → tienda
        sucursal: id,          // sucursal → donde se asignará el admin
      });

      toast.success("Administrador creado correctamente");
      navigate(`/dashboard/sucursales/${id}/admins`);
    } catch (error) {
      console.error("Error al crear admin:", error.response?.data || error);
      toast.error("No se pudo crear el administrador");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crear Administrador de Sucursal</h2>

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
          placeholder="Correo"
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
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded col-span-2"
        >
          Registrar Administrador
        </button>
      </form>
    </div>
  );
}
