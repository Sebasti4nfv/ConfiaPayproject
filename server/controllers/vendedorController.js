
import Validacion from "../models/Validacion.js";
import Transaccion from "../models/Transaccion.js";

export const validarVoucher = async (req, res) => {
  try {
    const { vendedorId, tiendaId, monto, metodoPago } = req.body;
    const archivoUrl = req.file.filename;

    // SIMULACIÓN TEMPORAL
    const fake = Math.random() < 0.2;
    const resultado = fake ? "falso" : "valido";

    const nuevaValidacion = await Validacion.create({
      vendedorId,
      tiendaId,
      monto,
      metodoPago,
      archivoUrl,
      resultado,
      detalles: fake
        ? "Simulación: comprobante sospechoso"
        : "Validación aceptada",
    });

    res.json(nuevaValidacion);
  } catch (error) {
    res.status(500).json({ msg: "Error en validar voucher", error });
  }
};

export const registrarVenta = async (req, res) => {
  try {
    const { vendedorId, tiendaId, monto, metodoPago, observacion } = req.body;

    const venta = await Transaccion.create({
      vendedorId,
      tiendaId,
      monto,
      metodoPago,
      observacion,
      type: "venta",
      fecha: new Date(),
    });

    res.json(venta);
  } catch (error) {
    res.status(500).json({ msg: "Error registrando venta", error });
  }
};
