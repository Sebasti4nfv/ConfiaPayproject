import express from "express";
import { crearTransaccion, obtenerTransacciones,obtenerEstadisticas } from "../controllers/transactionController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/reporte/stats", verificarToken, obtenerEstadisticas);
// Registrar una nueva transacción
router.post("/", verificarToken, crearTransaccion);

// Obtener todas las transacciones del usuario autenticado
router.get("/", verificarToken, obtenerTransacciones);

export default router; 
