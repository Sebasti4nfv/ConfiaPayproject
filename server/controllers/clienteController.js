import Tienda from "../models/Tienda.js";
import Validacion from "../models/Validacion.js";

/* ----------------------------------------------
   BUSCAR TIENDAS POR NOMBRE
------------------------------------------------*/
export const buscarTiendas = async (req, res) => {
  try {
    const { nombre } = req.query;

    if (!nombre || nombre.trim() === "") {
      return res.json([]);
    }

    const tiendas = await Tienda.find({
      nombre: { $regex: nombre, $options: "i" }
    }).select("nombre trustScore reseñas");

    res.json(tiendas);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar tiendas" });
  }
};

/* ----------------------------------------------
   OBTENER PERFIL DE TIENDA
------------------------------------------------*/
export const obtenerTienda = async (req, res) => {
  try {
    const tienda = await Tienda.findById(req.params.id)
      .select("nombre trustScore reseñas descripcion ubicacion fechaRegistro");

    if (!tienda) {
      return res.status(404).json({ msg: "Tienda no encontrada" });
    }

    res.json(tienda);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tienda" });
  }
};

/* ----------------------------------------------
   VALIDAR COMPROBANTE (CLIENTE)
------------------------------------------------*/
export const validarCliente = async (req, res) => {
  try {
    const tiendaId = req.params.tiendaId;

    if (!req.file) {
      return res.status(400).json({ msg: "Debes subir una imagen" });
    }

    const archivoUrl = req.file.path;

    // --- Simulación de OCR ----
    const montoDetectado = 100;

    const nuevaValidacion = await Validacion.create({
      tienda: tiendaId,
      archivoUrl,
      monto: montoDetectado,
      metodoPago: "Yape",
      resultado: "valido",
      creadoEn: new Date(),
    });

    res.json({
      id: nuevaValidacion._id,
      monto: montoDetectado,
      archivoUrl
    });

  } catch (error) {
    res.status(500).json({ msg: "Error al validar comprobante" });
  }
};

/* ----------------------------------------------
   OBTENER CONSTANCIA DIGITAL
------------------------------------------------*/
export const obtenerConstancia = async (req, res) => {
  try {
    const data = await Validacion.findById(req.params.id)
      .populate("tienda", "nombre trustScore");

    if (!data) {
      return res.status(404).json({ msg: "Constancia no encontrada" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener constancia" });
  }
};
