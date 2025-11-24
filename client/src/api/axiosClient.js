import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

console.log("🔥 API URL cargada:", API_URL);

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ⬅️ Agregar token automáticamente a TODAS las peticiones
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
