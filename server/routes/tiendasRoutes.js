// server/routes/tiendaRoutes.js
import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import {
  crearTienda,
  obtenerTiendasDelDueño,
  eliminarTienda,
} from "../controllers/tiendaController.js";

const router = express.Router();

// 🔹 Crear nueva tienda (solo dueño)
router.post("/crear", verificarToken, crearTienda);

// 🔹 Obtener todas las tiendas del dueño logueado
router.get("/mis-tiendas", verificarToken, obtenerTiendasDelDueño);

// 🔹 Eliminar una tienda
router.delete("/:id", verificarToken, eliminarTienda);

export default router;
