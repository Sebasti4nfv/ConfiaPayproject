import express from "express";
import { verificarToken, isOwner, isOwnerOrAdmin } from "../middleware/authMiddleware.js";
import {
  crearSucursal,
  obtenerSucursalesPorTienda,
  crearAdminSucursal,
  listarAdminsSucursal,
  crearVendedorSucursal,
  listarVendedoresSucursal
} from "../controllers/sucursalController.js";

const router = express.Router();

// Crear sucursal (solo dueño)
router.post("/", verificarToken, isOwner, crearSucursal);

// Listar sucursales por tienda
router.get("/tienda/:tiendaId", verificarToken, obtenerSucursalesPorTienda);

// Crear admin por sucursal
router.post("/:id/crear-admin", verificarToken, isOwner, crearAdminSucursal);

// Listar admins por sucursal
router.get("/:id/admins", verificarToken, listarAdminsSucursal);

// Crear vendedor por sucursal
router.post("/:id/crear-vendedor", verificarToken, isOwnerOrAdmin, crearVendedorSucursal);

// Listar vendedores por sucursal
router.get("/:id/vendedores", verificarToken, listarVendedoresSucursal);

export default router;
