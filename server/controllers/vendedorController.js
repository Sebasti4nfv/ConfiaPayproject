
import Validacion from "../models/Validacion.js";
import Transaccion from "../models/Transaction.js";
import Usuario from "../models/User.js";
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

    // Obtener datos reales del vendedor
    const vendedor = await Usuario.findById(vendedorId);

    if (!vendedor) {
      return res.status(404).json({ msg: "Vendedor no encontrado" });
    }

    // Registrar la venta
    const venta = await Transaccion.create({
      user: vendedorId,               // CAMPO CORRECTO DEL MODELO
      tienda: tiendaId,               // CAMPO CORRECTO DEL MODELO
      sucursal: vendedor.sucursal,    // ✔ AHORA SÍ FUNCIONA
      monto,
      descripcion: observacion || "",
      tipo: "ingreso",
      fecha: new Date(),
    });

    res.json({ success: true, venta });

  } catch (error) {
    console.error("Error registrar venta:", error);
    res.status(500).json({ msg: "Error registrando venta", error });
  }
};
