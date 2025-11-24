import mongoose from "mongoose";

const sucursalSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    telefono: { type: String },

    // Relación con la tienda
    tienda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tienda",
      required: true,
    },

    // Admins asignados
    administradores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Vendedores asignados
    vendedores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Sucursal", sucursalSchema);
