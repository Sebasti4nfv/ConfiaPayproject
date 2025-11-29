// server/controllers/validacionController.js
import Validacion from "../models/Validacion.js";

export const subirComprobante = async (req, res) => {
  try {
    const { monto, metodoPago } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ success: false, message: "No se subió ningún archivo." });
    }
    if (!monto || !metodoPago) {
      return res.status(400).json({ success: false, message: "Faltan campos (monto / metodoPago)." });
    }

    // ✅ tomamos del token
    const vendedorId = req.user?.id;
    const tienda = req.user?.tienda || null;

    // Simulación del análisis OCR (temporal)
    const r = Math.random();
    const { resultado, detalles } =
      r < 0.7 ? { resultado: "valido", detalles: "Comprobante verificado correctamente." } :
      r < 0.9 ? { resultado: "sospechoso", detalles: "Monto o datos inconsistentes con el comprobante." } :
                { resultado: "invalido", detalles: "Archivo alterado o ilegible." };

    const validacion = await Validacion.create({
      vendedorId,
      tienda,
      sucursal: req.user.sucursal || null,
      monto: Number(monto),
      metodoPago,
      archivoUrl: archivo.path,
      resultado,
      detalles,
    });

    res.json({ success: true, validacion });
  } catch (error) {
    console.error("Error al subir comprobante:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const obtenerValidaciones = async (req, res) => {
  try {
    const validaciones = await Validacion.find()
      .populate("vendedorId", "name email tienda role") // 👈 agrega esta línea
      .sort({ creadoEn: -1 });

    res.json(validaciones);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const obtenerValidacionesPorTienda = async (req, res) => {
  try {
    const { tiendaId } = req.params;

    const datos = await Validacion.find({ tienda: tiendaId })
      .populate("vendedorId", "name email role")
      .sort({ creadoEn: -1 });

    res.json(datos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const obtenerValidacionesPorSucursal = async (req, res) => {
  try {
    const { sucursalId } = req.params;

    const datos = await Validacion.find({ sucursal: sucursalId })
      .populate("vendedorId", "name email role")
      .sort({ creadoEn: -1 });

    res.json(datos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const obtenerMisValidaciones = async (req, res) => {
  try {
    const vendedorId = req.user.id;

    const datos = await Validacion.find({ vendedorId })
      .sort({ creadoEn: -1 });

    res.json(datos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
