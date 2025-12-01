import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";

// 🔹 Simulación de validación
const validarComprobanteSimulado = () => {
  const montosPermitidos = [20, 50, 80, 100, 150];
  const monto = montosPermitidos[Math.floor(Math.random() * montosPermitidos.length)];

  return {
    id: "constancia_" + Date.now(),
    monto,
    resultado: "valido",
  };
};

export default function ClienteVerificar() {
  const { id } = useParams(); // id de la tienda
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleArchivo = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setArchivo(file);
    setPreview(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const enviar = (e) => {
    e.preventDefault();

    if (!archivo) {
      setErrorMsg("Debes seleccionar una imagen del comprobante.");
      return;
    }

    // Simulación del proceso
    setLoading(true);
    setErrorMsg("");
    setResultado(null);

    setTimeout(() => {
      const simulated = validarComprobanteSimulado();
      setResultado(simulated);
      setLoading(false);
    }, 2000); // simula proceso de análisis
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-12 bg-white rounded-xl shadow-lg border border-gray-200">

      <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
        Validar comprobante
      </h1>
      <p className="text-gray-700 text-center mb-6">
        Sube una imagen de tu voucher para verificarlo automáticamente.
      </p>

      {/* FORMULARIO */}
      <form onSubmit={enviar} className="space-y-4">

        <label className="block">
          <span className="text-gray-700 font-semibold">Selecciona una imagen</span>

          <div className="mt-2 border p-4 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition text-center">
            <Upload size={32} className="mx-auto text-blue-600" />
            <p className="text-gray-600 mt-2">Haz clic para seleccionar archivo</p>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleArchivo}
            />
          </div>
        </label>

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full rounded-xl shadow-md mt-3"
          />
        )}

        {/* ERROR */}
        {errorMsg && (
          <p className="text-red-600 text-center font-semibold mt-2">
            {errorMsg}
          </p>
        )}

        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Validando…
            </>
          ) : (
            "Validar comprobante"
          )}
        </button>
      </form>

      {/* LOADER */}
      {loading && (
        <div className="flex justify-center mt-6">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* RESULTADO */}
      {resultado && (
        <div className="mt-10 p-6 border rounded-xl bg-gray-50 shadow-sm text-center">
          <CheckCircle size={40} className="text-green-600 mx-auto mb-3" />

          <h2 className="text-xl font-bold text-green-700">¡Validación exitosa!</h2>

          <p className="text-gray-700 mt-2">
            Monto detectado:
            <br />
            <span className="text-2xl font-bold text-blue-700">S/ {resultado.monto}</span>
          </p>

          <Link
            to={`/cliente/constancia/${resultado.id}`}
            className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Ver constancia digital
          </Link>
        </div>
      )}

    </div>
  );
}
