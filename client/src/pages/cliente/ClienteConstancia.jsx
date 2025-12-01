import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, FileDown, QrCode } from "lucide-react";

// 🔹 Datos simulados generales de constancia
const generarConstanciaSimulada = (id) => ({
  _id: id,
  tienda: "Tienda Demo ConfiaPay",
  metodoPago: "Yape",
  monto: Math.floor(Math.random() * 150 + 20), // entre 20 y 170
  resultado: "valido",
  fecha: new Date().toLocaleDateString("es-PE"),
  hora: new Date().toLocaleTimeString("es-PE"),
});

export default function ClienteConstancia() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulación de carga
    const fake = generarConstanciaSimulada(id);
    setTimeout(() => setData(fake), 600);
  }, [id]);

  if (!data)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Generando constancia…
      </p>
    );

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200">

      {/* Título */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-700 flex justify-center items-center gap-2">
          <CheckCircle size={36} /> Constancia Digital
        </h1>
        <p className="text-gray-600">
          Comprobante verificado correctamente por ConfiaPay.
        </p>
      </div>

      {/* CUADRO PRINCIPAL */}
      <div className="space-y-3 border-t pt-5 text-gray-700 text-lg">

        <p><strong>ID de validación:</strong><br />
          <span className="text-blue-700 font-semibold">{data._id}</span>
        </p>

        <p><strong>Tienda:</strong><br />{data.tienda}</p>

        <p><strong>Método de pago:</strong><br />{data.metodoPago}</p>

        <p>
          <strong>Monto:</strong><br />
          <span className="text-green-700 font-bold text-2xl">S/ {data.monto}</span>
        </p>

        <p>
          <strong>Resultado:</strong><br />
          <span className="text-green-600 font-semibold uppercase">{data.resultado}</span>
        </p>

        <p><strong>Fecha:</strong><br />{data.fecha}</p>
        <p><strong>Hora:</strong><br />{data.hora}</p>
      </div>

      {/* QR SIMULADO */}
      <div className="mt-8 flex flex-col items-center">
        <QrCode size={85} className="text-gray-700 mb-3" />

        <p className="text-gray-500 text-sm max-w-[260px] text-center">
          Código QR simulado.  
          En la versión oficial permitirá verificar la autenticidad de la constancia.
        </p>
      </div>

      {/* Descargar PDF */}
      <div className="mt-8 text-center">
        <button
          onClick={() => alert("Simulación: PDF descargado")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2 mx-auto transition shadow"
        >
          <FileDown size={20} />
          Descargar PDF
        </button>
      </div>

      {/* Volver */}
      <div className="text-center mt-6">
        <Link
          to="/cliente/dashboard"
          className="text-blue-600 underline font-semibold hover:text-blue-800"
        >
          Volver al dashboard
        </Link>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-xs mt-6 border-t pt-3">
        ConfiaPay © 2025 — Certificación de pago simulada
      </p>
    </div>
  );
}
