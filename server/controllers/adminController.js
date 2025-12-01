import Usuario from "../models/User.js";
import Sucursal from "../models/Sucursal.js";
import Transaction from "../models/Transaction.js";

// A) Sucursales de un admin
export const getSucursalesAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Usuario.findById(adminId);
    if (!admin) return res.status(404).json({ error: "Admin no encontrado" });

    const sucursales = await Sucursal.find({ tienda: admin.tienda });
    res.json(sucursales);

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo sucursales" });
  }
};

// B) Vendedores por sucursal
export const getVendedoresSucursal = async (req, res) => {
  try {
    const { sucursalId } = req.params;

    const sucursal = await Sucursal.findById(sucursalId)
      .populate("vendedores", "-password")
      .lean();

    if (!sucursal) return res.status(404).json({ error: "Sucursal no encontrada" });

    res.json(sucursal.vendedores);

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo vendedores" });
  }
};

// C) Ventas por vendedor
export const getVentasVendedor = async (req, res) => {
  try {
    const { vendedorId } = req.params;

    const ventas = await Transaction.find({ user: vendedorId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(ventas);

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo ventas" });
  }
};
