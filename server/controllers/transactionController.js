import Transaction from "../models/Transaction.js";

// Crear transacción
export const crearTransaccion = async (req, res) => {
  try {
    const { monto, descripcion, tipo, comprobante } = req.body;

    const nueva = new Transaction({
      user: req.user.id,
      monto,
      descripcion,
      tipo,
      comprobante,
      tienda: req.user.tienda,
      sucursal: req.user.sucursal || null,
  });

    await nueva.save();
    res.status(201).json({ message: "Transacción registrada exitosamente", transaccion: nueva });
  } catch (error) {
    console.error("❌ Error al crear transacción:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const obtenerTransacciones = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, sucursal } = req.query;
    const filtro = {};

    // Filtrar por tienda (si es dueño)
    if (req.user.role === "dueño") {
      filtro.tienda = req.user.tienda;
    }

    // Filtrar por vendedor (si es vendedor)
    if (req.user.role === "vendedor") {
      filtro.user = req.user.id;
    }

    // Filtrar por sucursal (si viene)
    if (sucursal && sucursal !== "") {
      filtro.sucursal = sucursal;
    }

    // Filtrar por fechas SOLO si ambas vienen
    if (fechaInicio && fechaFin && fechaInicio !== "" && fechaFin !== "") {
      filtro.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }

    const transacciones = await Transaction.find(filtro)
      .populate("user", "name email role")
      .populate("sucursal", "nombre direccion")
      .sort({ createdAt: -1 });

    res.json(transacciones);
  } catch (error) {
    console.error("❌ Error en obtenerTransacciones:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const obtenerEstadisticas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, sucursal } = req.query;
    const match = {};

    // Filtrar por tienda (dueño)
    if (req.user.role === "dueño") {
      // Tu campo tienda ES STRING, no ObjectId
      match.tienda = req.user.tienda;
    }

    // Filtrar por sucursal si viene
    if (sucursal && sucursal !== "") {
      // También es un STRING
      match.sucursal = sucursal;
    }

    // Fechas válidas
    if (fechaInicio && fechaFin && fechaInicio !== "" && fechaFin !== "") {
      match.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }

    const stats = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalIngresos: {
            $sum: {
              $cond: [{ $eq: ["$tipo", "ingreso"] }, "$monto", 0],
            },
          },
          totalEgresos: {
            $sum: {
              $cond: [{ $eq: ["$tipo", "egreso"] }, "$monto", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIngresos: 1,
          totalEgresos: 1,
          balance: { $subtract: ["$totalIngresos", "$totalEgresos"] },
        },
      },
    ]);

    res.json(stats[0] || { totalIngresos: 0, totalEgresos: 0, balance: 0 });

  } catch (error) {
    console.error("❌ Error en obtenerEstadisticas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

