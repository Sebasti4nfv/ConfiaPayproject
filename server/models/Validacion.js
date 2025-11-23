// server/models/Validacion.js
import mongoose from "mongoose";

const validacionSchema = new mongoose.Schema({
  vendedorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tienda: { type: mongoose.Schema.Types.ObjectId, ref: "Tienda", required: false },
  monto: { type: Number, required: true },
  metodoPago: { type: String, enum: ["Yape", "Plin", "Transferencia"], required: true },
  archivoUrl: { type: String, required: true },
  resultado: { type: String, enum: ["valido", "sospechoso", "invalido"], required: true },
  detalles: { type: String },
  creadoEn: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Validacion", validacionSchema);
