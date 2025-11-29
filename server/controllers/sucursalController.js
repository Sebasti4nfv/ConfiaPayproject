import Sucursal from "../models/Sucursal.js";
import Tienda from "../models/Tienda.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const crearSucursal = async (req, res) => {
  try {
    console.log("🔵 BODY recibido:", req.body);
    console.log("🟣 req.user:", req.user);
    const { nombre, direccion, telefono, tienda } = req.body;

    console.log("🟡 ID de tienda recibido:", tienda);

    // Verificar que la tienda exista
    const tiendaDB = await Tienda.findById(tienda);
    console.log("🟢 tiendaDB:", tiendaDB);
    if (!tiendaDB) return res.status(404).json({ message: "Tienda no encontrada" });

    console.log("🟠 Dueño en tienda:", tiendaDB.owner.toString());
    console.log("🟣 Dueño que envía token:", req.user.id);
    // Validar que el dueño es dueño de esa tienda
    if (tiendaDB.owner.toString() !== req.user.id.toString()) {
      console.log("❌ El dueño no coincide");
      return res.status(403).json({ message: "No autorizado" });
    }
    const nueva = await Sucursal.create({
      nombre,
      direccion,
      telefono,
      tienda,
    });
    console.log("🟩 Sucursal creada:", nueva);

    res.status(201).json({ message: "Sucursal creada", sucursal: nueva });
  } catch (error) {
    console.error("Error crear sucursal:", error);
    res.status(500).json({ message: "Error crear sucursal" });
  }
};
export const obtenerSucursalesPorTienda = async (req, res) => {
  try {
    const { tiendaId } = req.params;

    const lista = await Sucursal.find({ tienda: tiendaId });

    res.json(lista);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener sucursales" });
  }
};
export const crearAdminSucursal = async (req, res) => {
  try {
    const { nombres, apellidos, dni, telefono, email, password } = req.body;
    const { id } = req.params; // id = sucursalId

    const sucursal = await Sucursal.findById(id).populate("tienda");
    if (!sucursal) return res.status(404).json({ message: "Sucursal no encontrada" });

    // El dueño que crea admin DEBE ser dueño de la tienda
    if (sucursal.tienda.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Verificar email repetido
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: `${nombres} ${apellidos}`,
      dni,
      telefono,
      email,
      password: hashed,
      role: "admin",
      tienda: sucursal.tienda._id,
      sucursal: id,
    });

    sucursal.administradores.push(admin._id);
    await sucursal.save();

    res.status(201).json({
      message: "Administrador creado correctamente",
      admin,
    });

  } catch (error) {
    console.error("Error crear admin sucursal:", error);
    res.status(500).json({ message: "Error al crear administrador" });
  }
};
export const listarAdminsSucursal = async (req, res) => {
  try {
    const { id } = req.params;

    const sucursal = await Sucursal.findById(id)
      .populate("administradores", "-password")
      .lean();

    if (!sucursal) return res.status(404).json({ message: "Sucursal no encontrada" });

    res.json({
      sucursal: { nombre: sucursal.nombre, direccion: sucursal.direccion },
      admins: sucursal.administradores,
    });

  } catch (error) {
    console.error("Error listar admins:", error);
    res.status(500).json({ message: "Error al listar admins" });
  }
};
export const crearVendedorSucursal = async (req, res) => {
  try {
    const { nombres, apellidos, dni, telefono, email, password } = req.body;
    const { id } = req.params;

    const sucursal = await Sucursal.findById(id).populate("tienda");
    if (!sucursal) return res.status(404).json({ message: "Sucursal no encontrada" });

    // Dueño o admin pueden crear vendedores
    if (!["dueño", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // Admin NO puede crear vendedores fuera de su sucursal
    if (req.user.role === "admin" && req.user.sucursal.toString() !== id) {
      return res.status(403).json({ message: "No perteneces a esta sucursal" });
    }

    const existente = await User.findOne({ email });
    if (existente) return res.status(400).json({ message: "El correo ya existe" });

    const hashed = await bcrypt.hash(password, 10);

    const vendedor = await User.create({
      name: `${nombres} ${apellidos}`,
      dni,
      telefono,
      email,
      password: hashed,
      role: "vendedor",
      tienda: sucursal.tienda._id,
      sucursal: id,
    });

    sucursal.vendedores.push(vendedor._id);
    await sucursal.save();

    res.status(201).json({ message: "Vendedor creado correctamente", vendedor });

  } catch (error) {
    console.error("Error crear vendedor:", error);
    res.status(500).json({ message: "Error al registrar vendedor" });
  }
};
export const listarVendedoresSucursal = async (req, res) => {
  try {
    const { id } = req.params;

    const sucursal = await Sucursal.findById(id)
      .populate("vendedores", "-password")
      .lean();

    if (!sucursal) return res.status(404).json({ message: "Sucursal no encontrada" });

    res.json({
      sucursal: { nombre: sucursal.nombre },
      vendedores: sucursal.vendedores,
    });

  } catch (error) {
    console.error("Error listar vendedores:", error);
    res.status(500).json({ message: "Error al obtener vendedores" });
  }
};
