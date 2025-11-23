// server/models/Tienda.js
import mongoose from "mongoose";

const tiendaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    rubro: { type: String, required: true },
    direccion: { type: String, required: true },
    descripcion: { type: String },

    ruc: { type: String },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Datos bancarios
    banco: { type: String, required: true },
    tipoCuenta: {
      type: String,
      enum: ["ahorros", "corriente"],
      required: true,
    },
    numeroCuenta: { type: String, required: true },
    cci: { type: String, required: true },
    titularCuenta: { type: String, required: true },
    documentoTitular: { type: String, required: true },

    // Plan de cobro
    plan: {
      type: String,
      enum: ["mensual", "porcentaje", "mixto"],
      default: "mensual",
    },

    vendedores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    administradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Tienda = mongoose.model("Tienda", tiendaSchema);
export default Tienda;
