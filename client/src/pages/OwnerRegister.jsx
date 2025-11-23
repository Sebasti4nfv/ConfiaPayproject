import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function OwnerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    password: "",

    nombreTienda: "",
    rubro: "",
    direccion: "",
    descripcion: "",
    ruc: "",

    banco: "",
    tipoCuenta: "",
    numeroCuenta: "",
    cci: "",
    titularCuenta: "",
    documentoTitular: "",

    plan: "mensual",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.post("/api/auth/register-owner", form);
      toast.success("Cuenta de dueño creada correctamente 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error al registrar dueño");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-100 to-blue-200">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleRegister}
        className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[450px]"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Registro de Dueño
        </h2>

        {/* DATOS PERSONALES */}
        <h3 className="font-bold text-lg mb-2 text-gray-700">Datos personales</h3>
        <input name="dni" placeholder="DNI" className="input" onChange={handleChange} required />
        <input name="nombres" placeholder="Nombres" className="input" onChange={handleChange} required />
        <input name="apellidos" placeholder="Apellidos" className="input" onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" className="input" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Correo electrónico" className="input" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" className="input" onChange={handleChange} required />

        {/* DATOS DE LA TIENDA */}
        <h3 className="font-bold text-lg mt-6 mb-2 text-gray-700">Datos del negocio</h3>
        <input name="nombreTienda" placeholder="Nombre de la tienda" className="input" onChange={handleChange} required />
        <input name="rubro" placeholder="Rubro del negocio (minimarket, ropa, etc.)" className="input" onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" className="input" onChange={handleChange} required />
        <input name="ruc" placeholder="RUC (si aplica)" className="input" onChange={handleChange} />
        <textarea
          name="descripcion"
          placeholder="Descripción (opcional)"
          className="input"
          onChange={handleChange}
        ></textarea>


        {/* DATOS BANCARIOS */}
        <h3 className="font-bold text-lg mt-6 mb-2 text-gray-700">Datos bancarios</h3>
        <input name="banco" placeholder="Banco" className="input" onChange={handleChange} required />
        <select name="tipoCuenta" className="input" onChange={handleChange} required>
          <option value="">Tipo de cuenta</option>
          <option value="ahorros">Ahorros</option>
          <option value="corriente">Corriente</option>
        </select>
        <input name="numeroCuenta" placeholder="Número de cuenta" className="input" onChange={handleChange} required />
        <input name="cci" placeholder="CCI" className="input" onChange={handleChange} required />
        <input name="titularCuenta" placeholder="Titular de la cuenta" className="input" onChange={handleChange} required />
        <input name="documentoTitular" placeholder="Documento del titular" className="input" onChange={handleChange} required />

        {/* PLAN DEL NEGOCIO */}
        <h3 className="font-bold text-lg mt-6 mb-2 text-gray-700">Plan de cobro</h3>
        <select name="plan" className="input" onChange={handleChange}>
          <option value="mensual">Plan mensual económico</option>
          <option value="porcentaje">Porcentaje por transacción</option>
          <option value="mixto">Mixto (mensual + %)</option>
        </select>

        {/* BOTÓN */}
        <button className="w-full bg-green-600 text-white py-3 mt-6 rounded-xl font-semibold hover:bg-green-700 transition">
          Registrar dueño
        </button>
      </motion.form>
    </div>
  );
}
