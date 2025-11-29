import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Store } from "lucide-react";

// 🔹 Datos SIMULADOS de tiendas
const tiendasSimuladas = [
  {
    _id: "t1",
    nombre: "DMujeres Cosmética",
    trustScore: 4.8,
    descripcion: "Productos de belleza premium y cuidado personal.",
    direccion: "Av. Primavera 234, Lima",
    rubro: "Cosméticos",
    reseñas: 12,
  },
  {
    _id: "t2",
    nombre: "TechZone Perú",
    trustScore: 4.5,
    descripcion: "Venta de laptops, accesorios y gadgets.",
    direccion: "Calle Los Olivos 456, Lima",
    rubro: "Tecnología",
    reseñas: 8,
  },
  {
    _id: "t3",
    nombre: "MiniMarket Don Pepe",
    trustScore: 4.2,
    descripcion: "Tu bodega de confianza del barrio.",
    direccion: "Jr. Puno 500, Trujillo",
    rubro: "Abarrotes",
    reseñas: 5,
  },
  {
    _id: "t4",
    nombre: "ConfiaPay Store Demo",
    trustScore: 4.9,
    descripcion: "Tienda demostrativa oficial para la presentación.",
    direccion: "Av. Demo 123, Lima",
    rubro: "Demo",
    reseñas: 20,
  },
];

export default function ClienteHome() {
  const [search, setSearch] = useState("");
  const [tiendasFiltradas, setTiendasFiltradas] = useState(tiendasSimuladas);
  const [buscado, setBuscado] = useState(false);

  const buscarTiendas = () => {
    const termino = search.trim().toLowerCase();

    if (!termino) {
      setTiendasFiltradas(tiendasSimuladas);
      setBuscado(true);
      return;
    }

    const filtradas = tiendasSimuladas.filter((t) =>
      t.nombre.toLowerCase().includes(termino)
    );

    setTiendasFiltradas(filtradas);
    setBuscado(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-12">

      {/* TÍTULO */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700">Buscar Tienda 🛍️</h1>
        <p className="text-gray-600 mt-2">
          Explora tiendas registradas en ConfiaPay.
        </p>
      </div>

      {/* BUSCADOR */}
      <div className="flex gap-3 mb-8 justify-center">
        <input
          type="text"
          placeholder="Escribe el nombre de la tienda..."
          className="border p-3 rounded-xl shadow-md w-full md:w-2/3 focus:ring-2 focus:ring-blue-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscarTiendas()}
        />

        <button
          onClick={buscarTiendas}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow"
        >
          <Search size={20} />
          Buscar
        </button>
      </div>

      {/* LISTA DE TIENDAS */}
      <div className="space-y-5">
        {tiendasFiltradas.map((t) => (
          <div
            key={t._id}
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-200"
          >
            {/* Encabezado */}
            <div className="flex items-center gap-4 mb-3">
              <Store size={36} className="text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">{t.nombre}</h2>
                <p className="text-gray-600">{t.descripcion}</p>
              </div>
            </div>

            {/* Info básica */}
            <p className="text-gray-600 mt-1">
              <span className="font-semibold">Rubro:</span> {t.rubro}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Dirección:</span> {t.direccion}
            </p>

            {/* Trust Score / reseñas */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <Star size={22} className="text-yellow-400" />
                <span className="font-semibold text-lg">
                  Trust Score: {t.trustScore} ⭐
                </span>
              </div>
              <p className="text-gray-600">
                Reseñas: <strong>{t.reseñas}</strong>
              </p>
            </div>

            {/* BOTÓN ÚNICO */}
            <div className="mt-5">
              <Link
                to={`/cliente/tienda/${t._id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                Ver perfil de tienda
              </Link>
            </div>
          </div>
        ))}

        {/* Sin resultados */}
        {buscado && tiendasFiltradas.length === 0 && (
          <p className="text-center text-gray-500 mt-6">
            No se encontraron tiendas con ese nombre.
          </p>
        )}
      </div>
    </div>
  );
}
