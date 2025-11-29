import Usuario from "../models/User.js";
import Sucursal from "../models/Sucursal.js";
import Transaccion from "../models/Transaccion.js";

// A) Sucursales que administra
export const getSucursalesAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const sucursales = await Sucursal.find({ adminId });

    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo sucursales" });
  }
};

// B) Vendedores de una sucursal
export const getVendedoresSucursal = async (req, res) => {
  try {
    const { sucursalId } = req.params;

    const vendedores = await Usuario.find({
      sucursalId,
      rol: "vendedor"
    });

    res.json(vendedores);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo vendedores" });
  }
};

// C) Ventas de un vendedor
export const getVentasVendedor = async (req, res) => {
  try {
    const { vendedorId } = req.params;

    const ventas = await Transaccion.find({ vendedorId }).sort({ fecha: -1 });

    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo ventas" });
  }
};
