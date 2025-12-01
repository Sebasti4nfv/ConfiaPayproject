import express from "express";
import multer from "multer";
import {
  validarVoucher,
  registrarVenta,
} from "../controllers/vendedorController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Validar voucher
router.post("/validar", upload.single("archivo"), validarVoucher);

// Registrar venta manual
router.post("/registrar", registrarVenta);

export default router;
