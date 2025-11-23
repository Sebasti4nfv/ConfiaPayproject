import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ⬅️ NUEVO: obtenemos login() del AuthContext
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosClient.post("/api/auth/login", {
        email,
        password,
      });

      // ⬅️ NUEVO: Guardamos token + user de forma PRO
      login(res.data);

      toast.success(`Bienvenido a ConfiaPay 💳`);

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error login:", error.response?.data || error);
      toast.error("Credenciales incorrectas ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-200 via-blue-100 to-blue-300 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[380px] text-center"
      >
        <h1 className="text-3xl font-bold mb-6 text-green-700 tracking-wide">
          🔒 ConfiaPay
        </h1>
        <p className="text-gray-600 mb-8">
          Inicia sesión en tu cuenta para continuar
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-5 relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-green-500"
              required
            />
          </div>

          <div className="mb-6 relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            Regístrate
          </Link>
        </p>
        <p>
          ¿Eres dueño?  
          <Link to="/register-owner">Registra tu tienda aquí</Link>
        </p>

      </motion.div>
    </div>
  );
}
