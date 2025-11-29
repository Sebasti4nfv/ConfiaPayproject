import mongoose from "mongoose";

const transaccionSchema = new mongoose.Schema({
  vendedorId: String,
  tiendaId: String,
  monto: Number,
  metodoPago: String,
  observacion: String,
  type: String,
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Transaccion", transaccionSchema);

