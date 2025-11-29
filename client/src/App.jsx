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

// 🟩 Cliente
import ClienteHome from "./pages/cliente/ClienteHome";
import ClienteTienda from "./pages/cliente/ClienteTienda";
import ClienteVerificar from "./pages/cliente/ClienteVerificar";
import ClienteConstancia from "./pages/cliente/ClienteConstancia";
import ClienteDashboard from "./pages/cliente/ClienteDashboard";
import ClientePerfil from "./pages/cliente/ClientePerfil";

// 🟦 Vendedor
import VendedorDashboard from "./pages/vendedor/VendedorDashboard";
import ValidarVoucher from "./pages/vendedor/ValidarVoucher";
import RegistrarVenta from "./pages/vendedor/RegistrarVenta";

// 🟧 Admin (NUEVO)
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVendedores from "./pages/admin/AdminVendedores";
import AdminVentasVendedor from "./pages/admin/AdminVentasVendedor";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow bg-gray-50">
          <Routes>

            {/* =======================
                PÚBLICO
               ======================= */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-owner" element={<OwnerRegister />} />

            {/* =======================
                DASHBOARD DUEÑO (principal)
               ======================= */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["dueño"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* =======================
                TRUSTSCORE / VALIDACIÓN
               ======================= */}
            <Route
              path="/validate"
              element={
                <ProtectedRoute>
                  <ValidatePayment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/trustscore"
              element={
                <ProtectedRoute roles={["dueño"]}>
                  <TrustScoreDashboard />
                </ProtectedRoute>
              }
            />

            {/* =======================
                MÓDULO DEL VENDEDOR
               ======================= */}
            <Route
              path="/vendedor"
              element={
                <ProtectedRoute roles={["vendedor"]}>
                  <VendedorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendedor/validar"
              element={
                <ProtectedRoute roles={["vendedor"]}>
                  <ValidarVoucher />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendedor/registrar"
              element={
                <ProtectedRoute roles={["vendedor"]}>
                  <RegistrarVenta />
                </ProtectedRoute>
              }
            />

            {/* =======================
                VALIDACIONES (dueño y admin)
               ======================= */}
            <Route
              path="/validaciones"
              element={
                <ProtectedRoute roles={["dueño", "admin"]}>
                  <ValidacionesList />
                </ProtectedRoute>
              }
            />

            {/* =======================
                SUCURSALES DEL DUEÑO
               ======================= */}
            <Route
              path="/dashboard/sucursales"
              element={
                <ProtectedRoute roles={["dueño"]}>
                  <SucursalesDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/sucursales/crear"
              element={
                <ProtectedRoute roles={["dueño"]}>
                  <CrearSucursal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/sucursales/:id/admins"
              element={
                <ProtectedRoute roles={["dueño"]}>
                  <AdminsPorSucursal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/sucursales/:id/crear-admin"
              element={
                <ProtectedRoute roles={["dueño"]}>
                  <CrearAdminSucursal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/sucursales/:id/vendedores"
              element={
                <ProtectedRoute roles={["dueño", "admin"]}>
                  <VendedoresPorSucursal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/sucursales/:id/crear-vendedor"
              element={
                <ProtectedRoute roles={["dueño", "admin"]}>
                  <CrearVendedorSucursal />
                </ProtectedRoute>
              }
            />

            {/* =======================
                CLIENTES
               ======================= */}
            <Route path="/cliente" element={<ClienteHome />} />
            <Route path="/cliente/tienda/:id" element={<ClienteTienda />} />
            <Route path="/cliente/verificar/:id" element={<ClienteVerificar />} />
            <Route path="/cliente/constancia/:id" element={<ClienteConstancia />} />

            <Route
              path="/cliente/dashboard"
              element={
                <ProtectedRoute roles={["cliente"]}>
                  <ClienteDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/cliente/perfil" element={<ClientePerfil />} />

            {/* =======================
                ADMINISTRADOR DE SUCURSALES
               ======================= */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/sucursal/:id/vendedores"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminVendedores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/vendedor/:id/ventas"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminVentasVendedor />
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
