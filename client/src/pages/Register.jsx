import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/api/auth/register", {
        ...form,
        role: "cliente",        // 🔥 SIEMPRE cliente
        tienda: null,           // 🔥 No pertenece a tienda
      });

      toast.success("Cuenta creada correctamente 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrarse");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        onSubmit={handleRegister}
        className="bg-white p-10 rounded-2xl shadow-xl w-[400px]"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Registro de Cliente
        </h2>

        <input
          name="name"
          placeholder="Nombre completo"
          className="input w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="input w-full mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="input w-full mb-3"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Crear cuenta
        </button>

        <p className="mt-4 text-center text-gray-600">
          ¿Eres dueño?{" "}
          <Link
            to="/register-owner"
            className="text-blue-700 font-semibold hover:underline"
          >
            Registra tu tienda aquí
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
