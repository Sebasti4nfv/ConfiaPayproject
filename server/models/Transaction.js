import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    tienda: { type: mongoose.Schema.Types.ObjectId, ref: "Tienda", required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    monto: { type: Number, required: true },
    descripcion: { type: String },
    tipo: { type: String, enum: ["ingreso", "egreso"], default: "ingreso" },
    comprobante: { type: String }, // puede ser URL o texto
    fecha: { type: Date, default: Date.now },
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: "Sucursal", default: null,}, // relacion local
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
