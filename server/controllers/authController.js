import User from "../models/User.js";
import Tienda from "../models/Tienda.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ======================================================
   REGISTRO DE CLIENTE
   ====================================================== */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, tienda } = req.body;

    const userExistente = await User.findOne({ email });
    if (userExistente)
      return res.status(400).json({ message: "El usuario ya existe" });

    const hashed = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      name,
      email,
      password: hashed,
      role: role || "cliente",  // cliente por defecto
      tienda: tienda || null,
      sucursal: null,
    });

    return res
      .status(201)
      .json({ message: "Usuario registrado exitosamente" });

  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

/* ======================================================
   LOGIN GENERAL (DUEÑO / ADMIN / VENDEDOR / CLIENTE)
   ====================================================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // Token con tienda + sucursal
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        tienda: user.tienda || null,
        sucursal: user.sucursal || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Devolver usuario completo
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tienda: user.tienda || null,
        sucursal: user.sucursal || null,
      },
    });

  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

/* ======================================================
   REGISTRO DUEÑO + CREACIÓN DE TIENDA
   ====================================================== */
export const registerOwner = async (req, res) => {
  console.log("🔥 ESTE ES EL AUTHCONTROLLER CORRECTO");

  try {
    console.log("🟦 Datos recibidos en registerOwner:", req.body);
    const {
      dni,
      nombres,
      apellidos,
      telefono,
      email,
      password,

      nombreTienda,
      rubro,
      direccion,
      descripcion,
      ruc,

      banco,
      tipoCuenta,
      numeroCuenta,
      cci,
      titularCuenta,
      documentoTitular,

      plan,
    } = req.body;
    // Validación básica
    if (
      !dni || !nombres || !apellidos || !telefono ||
      !email || !password ||
      !nombreTienda || !rubro || !direccion ||
      !banco || !tipoCuenta || !numeroCuenta || !cci ||
      !titularCuenta || !documentoTitular
    ) {
      return res.status(400).json({
        message: "Faltan datos obligatorios para registrar al dueño",
      });
    }

    // Verificar si correo o DNI ya existen
    
    const existente = await User.findOne({ $or: [{ email }, { dni }] });
    if (existente)
      return res
        .status(400)
        .json({ message: "El correo o DNI ya están registrados" });

    // Contraseña hasheada
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear dueño
    const owner = await User.create({
      name: `${nombres} ${apellidos}`,
      email,
      password: hashedPassword,
      role: "dueño",
      dni,
      telefono,
      tienda: null,      // se llena luego
      sucursal: null,    // un dueño no pertenece a sucursal
    });

    // Crear tienda asociada
    const tienda = await Tienda.create({
      nombre: nombreTienda,
      rubro,
      direccion,
      descripcion,
      ruc,
      owner: owner._id,
      banco,
      tipoCuenta,
      numeroCuenta,
      cci,
      titularCuenta,
      documentoTitular,
      plan: plan || "mensual",
    });

    // Guardar tienda en el dueño
    owner.tienda = tienda._id;
    await owner.save();

    return res.status(201).json({
      message: "Dueño y tienda registrados correctamente",
      ownerId: owner._id,
      tiendaId: tienda._id,
    });

  } catch (error) {
    console.error("❌ Error en registerOwner:", error);
    return res.status(500).json({
      message: "Error al registrar dueño",
      error: error.message,
    });
  }
};
