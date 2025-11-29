// server/controllers/tiendaController.js
import Tienda from "../models/Tienda.js";

export const crearTienda = async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    const dueñoId = req.user.id;

    if (req.user.role !== "dueño") {
      return res.status(403).json({ message: "Solo los dueños pueden crear tiendas." });
    }

    const nuevaTienda = await Tienda.create({ nombre, direccion, dueñoId });
    res.status(201).json({ success: true, tienda: nuevaTienda });
  } catch (error) {
    console.error("Error al crear tienda:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerTiendasDelDueño = async (req, res) => {
  try {
    const dueñoId = req.user.id;
    if (req.user.role !== "dueño") {
      return res.status(403).json({ message: "Solo los dueños pueden ver sus tiendas." });
    }

    const tiendas = await Tienda.find({ dueñoId }).sort({ creadaEn: -1 });
    res.json(tiendas);
  } catch (error) {
    console.error("Error al obtener tiendas:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const eliminarTienda = async (req, res) => {
  try {
    const { id } = req.params;
    const dueñoId = req.user.id;

    const tienda = await Tienda.findOne({ _id: id, dueñoId });
    if (!tienda) {
      return res.status(404).json({ message: "Tienda no encontrada o no te pertenece." });
    }

    await Tienda.findByIdAndDelete(id);
    res.json({ success: true, message: "Tienda eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
