import express from "express";
import upload from "../middleware/multer.js";

import {
  buscarTiendas,
  obtenerTienda,
  validarCliente,
  obtenerConstancia
} from "../controllers/clienteController.js";

const router = express.Router();

// Buscar tiendas por nombre
router.get("/tiendas/buscar", buscarTiendas);

// Ver perfil de tienda
router.get("/tiendas/:id", obtenerTienda);

// Validar comprobante (cliente)
router.post("/validar/:tiendaId", upload.single("archivo"), validarCliente);

// Ver constancia digital
router.get("/constancia/:id", obtenerConstancia);

export default router;
