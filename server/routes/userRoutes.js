// server/routes/userRoutes.js
import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import {
  crearVendedor,
  obtenerVendedoresPorTienda,
  obtenerUsuarios,
  eliminarUsuario,
  crearAdmin,
} from "../controllers/userController.js";

const router = express.Router();

// 🔹 Obtener vendedores por tienda (solo dueño)
router.get("/vendedores/:tienda", verificarToken, obtenerVendedoresPorTienda);

// 🔹 (opcional) Obtener todos los usuarios - uso administrativo
router.get("/todos", verificarToken, obtenerUsuarios);

// 🔹 Eliminar usuario (solo dueño/admin)
router.delete("/:userId", verificarToken, eliminarUsuario);

//
router.post("/crear-vendedor", verificarToken, crearVendedor);
router.post("/crear-admin", verificarToken, crearAdmin);

router.get("/", verificarToken, obtenerUsuarios);

export default router;
