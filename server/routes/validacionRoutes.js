// server/routes/validacionRoutes.js
import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { verificarToken } from "../middleware/authMiddleware.js"; // si ya usas JWT
import {
  subirComprobante,
  obtenerValidaciones,
  obtenerValidacionesPorTienda,
  obtenerValidacionesPorSucursal,
  obtenerMisValidaciones
} from "../controllers/validacionController.js";

const router = express.Router();

// Puedes protegerlo con JWT si lo deseas
router.post("/subir",verificarToken, upload.single("archivo"), subirComprobante);
router.get("/todas", verificarToken, obtenerValidaciones);
router.get("/tienda/:tiendaId", verificarToken, obtenerValidacionesPorTienda);
router.get("/sucursal/:sucursalId", verificarToken, obtenerValidacionesPorSucursal);
router.get("/mias", verificarToken, obtenerMisValidaciones);
export default router;
