import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["cliente", "vendedor", "dueño", "admin"],
      default: "cliente",
    },
    dni: { type: String },
    telefono: { type: String },
    tienda: { type: mongoose.Schema.Types.ObjectId, ref: "Tienda", default: null}, // relacion local
    sucursal: { type: mongoose.Schema.Types.ObjectId, ref: "Sucursal", default: null,}, // relacion local
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;