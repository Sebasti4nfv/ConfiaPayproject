// server/controllers/userController.js
import User from "../models/User.js";
import Tienda from "../models/Tienda.js";
import bcrypt from "bcryptjs";

// ======================================================
// CREAR VENDEDOR (dueño o admin)
// ======================================================
export const crearVendedor = async (req, res) => {
  try {
    const { nombres, apellidos, dni, telefono, email, password, tienda } = req.body;

    const tiendaDB = await Tienda.findById(tienda);
    if (!tiendaDB) return res.status(404).json({ message: "Tienda no encontrada" });

    if (!["dueño", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const existente = await User.findOne({ email });
    if (existente) return res.status(400).json({ message: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const vendedor = await User.create({
      name: `${nombres} ${apellidos}`,
      email,
      password: hashedPassword,
      role: "vendedor",
      dni,
      telefono,
      tienda,
    });

    tiendaDB.vendedores.push(vendedor._id);
    await tiendaDB.save();

    res.status(201).json({ message: "Vendedor creado", vendedor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear vendedor" });
  }
};

// ======================================================
// CREAR ADMIN (solo dueño)
// ======================================================
export const crearAdmin = async (req, res) => {
  try {
    const { nombres, apellidos, dni, telefono, email, password, tienda } = req.body;

    const tiendaDB = await Tienda.findById(tienda);
    if (!tiendaDB) return res.status(404).json({ message: "Tienda no encontrada" });

    if (req.user.role !== "dueño") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const existente = await User.findOne({ email });
    if (existente) return res.status(400).json({ message: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: `${nombres} ${apellidos}`,
      email,
      password: hashedPassword,
      role: "admin",
      dni,
      telefono,
      tienda,
    });

    tiendaDB.administradores.push(admin._id);
    await tiendaDB.save();

    res.status(201).json({ message: "Administrador creado", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear administrador" });
  }
};

// ======================================================
// LISTAR VENDEDORES POR TIENDA
// ======================================================
export const obtenerVendedoresPorTienda = async (req, res) => {
  try {
    const { tienda } = req.params;

    const tiendaDB = await Tienda.findById(tienda);
    if (!tiendaDB) return res.status(404).json({ message: "Tienda no encontrada" });

    const vendedores = await User.find({
      tienda,
      role: "vendedor",
    }).select("-password");

    res.json(vendedores);
  } catch (error) {
    console.error("Error al obtener vendedores:", error);
    res.status(500).json({ message: error.message });
  }
};
// ✅ Obtener todos los usuarios (uso administrativo)
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};