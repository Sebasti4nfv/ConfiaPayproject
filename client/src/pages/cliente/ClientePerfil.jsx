import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, User, Lock } from "lucide-react";

export default function ClientePerfil() {
  const { user } = useAuth();

  // Datos simulados iniciales desde AuthContext
  const [form, setForm] = useState({
    name: user?.name || "Cliente Demo",
    email: user?.email || "cliente@demo.com",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Simulación: los datos del perfil se actualizaron correctamente.");
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg border">

      {/* Título */}
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Mi Perfil
      </h1>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <img
          src="https://i.pravatar.cc/150?img=32"
          alt="avatar"
          className="w-28 h-28 rounded-full shadow-lg ring-4 ring-blue-200"
        />
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* NOMBRE */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Nombre Completo
          </label>
          <div className="flex items-center border rounded-lg pl-3 bg-gray-50">
            <User size={20} className="text-gray-500" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 focus:outline-none text-gray-800"
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Correo Electrónico
          </label>
          <div className="flex items-center border rounded-lg pl-3 bg-gray-50">
            <Mail size={20} className="text-gray-500" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 focus:outline-none text-gray-800"
              required
            />
          </div>
        </div>

        {/* CONTRASEÑA */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Nueva Contraseña (opcional)
          </label>
          <div className="flex items-center border rounded-lg pl-3 bg-gray-50">
            <Lock size={20} className="text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Ingresa una nueva contraseña"
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 focus:outline-none text-gray-800"
            />
          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Guardar cambios
        </button>
      </form>

      {/* VOLVER */}
      <div className="text-center mt-6">
        <a
          href="/cliente/dashboard"
          className="text-blue-600 font-semibold hover:underline"
        >
          Volver al Dashboard
        </a>
      </div>
    </div>
  );
}

