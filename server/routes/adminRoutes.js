import express from "express";
import { 
  getSucursalesAdmin,
  getVendedoresSucursal,
  getVentasVendedor
} from "../controllers/adminController.js";

const router = express.Router();

// sucursales donde trabaja el admin
router.get("/sucursales/:adminId", getSucursalesAdmin);

// vendedores de una sucursal
router.get("/vendedores/:sucursalId", getVendedoresSucursal);

// ventas de un vendedor
router.get("/ventas/:vendedorId", getVentasVendedor);

export default router;
