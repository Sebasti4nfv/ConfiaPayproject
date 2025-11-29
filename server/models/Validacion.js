import mongoose from "mongoose";

const validacionSchema = new mongoose.Schema({
  vendedorId: String,
  tiendaId: String,
  monto: Number,
  metodoPago: String,
  archivoUrl: String,
  resultado: String,
  detalles: String,
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Validacion", validacionSchema);

