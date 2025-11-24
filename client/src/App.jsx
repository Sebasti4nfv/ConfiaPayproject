import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DuenoDashboard/Dashboard";

import ValidatePayment from "./pages/ValidatePayment";
import TrustScore from "./pages/TrustScore";
import VendedorTransaccion from "./pages/VendedorTransaccion";
import ValidacionesList from "./pages/ValidacionesList";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ListaSucursales from "./pages/DuenoDashboard/ListaSucursales";
import CrearSucursal from "./pages/DuenoDashboard/CrearSucursal";

import AdminsPorSucursal from "./pages/DuenoDashboard/AdminsPorSucursal";
import CrearAdminSucursal from "./pages/DuenoDashboard/CrearAdminSucursal";

import VendedoresPorSucursal from "./pages/DuenoDashboard/VendedoresPorSucursal";
import CrearVendedorSucursal from "./pages/DuenoDashboard/CrearVendedorSucursal";

import SucursalesDashboard from "./pages/DuenoDashboard/SucursalesDashboard";

import OwnerRegister from "./pages/OwnerRegister";
import TrustScoreDashboard from "./pages/DuenoDashboard/TrustScoreDashboard";

import "./styles/global.css";

//comentario
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow bg-gray-50">
          <Routes>

            {/* Público */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-owner" element={<OwnerRegister />} />
            {/* Dashboard general */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />

            {/* Validación de pago / trustscore */}
            <Route
              path="/validate"
              element={<ProtectedRoute><ValidatePayment /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/trustscore"
              element={<ProtectedRoute roles={["dueño"]}><TrustScoreDashboard /></ProtectedRoute>}            />

            {/* Módulo Vendedor */}
            <Route
              path="/vendedor"
              element={<ProtectedRoute roles={["vendedor"]}><VendedorTransaccion /></ProtectedRoute>}
            />

            {/* Validaciones administrativas */}
            <Route
              path="/validaciones"
              element={<ProtectedRoute roles={["dueño", "admin"]}><ValidacionesList /></ProtectedRoute>}
            />

            {/* =======================
                MÓDULO SUCURSALES (solo dueño)
               ======================= */}

            {/* Lista de sucursales */}
            <Route
              path="/dashboard/sucursales"
              element={<ProtectedRoute roles={["dueño"]}><SucursalesDashboard /></ProtectedRoute>}
            />

            {/* Crear sucursal */}
            <Route
              path="/dashboard/sucursales/crear"
              element={<ProtectedRoute roles={["dueño"]}><CrearSucursal /></ProtectedRoute>}
            />

            {/* Admins por sucursal */}
            <Route
              path="/dashboard/sucursales/:id/admins"
              element={<ProtectedRoute roles={["dueño"]}><AdminsPorSucursal /></ProtectedRoute>}
            />

            {/* Crear admin por sucursal */}
            <Route
              path="/dashboard/sucursales/:id/crear-admin"
              element={<ProtectedRoute roles={["dueño"]}><CrearAdminSucursal /></ProtectedRoute>}
            />

            {/* Vendedores por sucursal */}
            <Route
              path="/dashboard/sucursales/:id/vendedores"
              element={<ProtectedRoute roles={["dueño", "admin"]}><VendedoresPorSucursal /></ProtectedRoute>}
            />

            {/* Crear vendedor por sucursal */}
            <Route
              path="/dashboard/sucursales/:id/crear-vendedor"
              element={<ProtectedRoute roles={["dueño", "admin"]}><CrearVendedorSucursal /></ProtectedRoute>}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
