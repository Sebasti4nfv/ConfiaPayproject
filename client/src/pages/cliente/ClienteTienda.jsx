import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Store, MapPin, MessageSquare } from "lucide-react";

// 🔹 TIENDAS SIMULADAS (mismas que ClienteHome)
const tiendasSimuladas = [
  {
    _id: "t1",
    nombre: "DMujeres Cosmética",
    trustScore: 4.8,
    descripcion: "Productos de belleza premium y cuidado personal.",
    direccion: "Av. Primavera 234, Lima",
    rubro: "Cosméticos",
    reseñas: [
      { usuario: "Ana R.", comentario: "Excelente calidad y rapidez.", rating: 5 },
      { usuario: "Luis M.", comentario: "Atención muy amable.", rating: 4 },
      { usuario: "Carla P.", comentario: "Todo perfecto.", rating: 5 },
    ],
  },
  {
    _id: "t2",
    nombre: "TechZone Perú",
    trustScore: 4.5,
    descripcion: "Accesorios tecnológicos, audífonos, cargadores y más.",
    direccion: "Calle Los Olivos 456, Lima",
    rubro: "Tecnología",
    reseñas: [
      { usuario: "Carlos", comentario: "Buen servicio, rápido y confiable.", rating: 4 },
    ],
  },
  {
    _id: "t3",
    nombre: "MiniMarket Don Pepe",
    trustScore: 4.2,
    descripcion: "Tu tienda de abarrotes de confianza.",
    direccion: "Jr. Puno 500, Trujillo",
    rubro: "Abarrotes",
    reseñas: [],
  },
  {
    _id: "t4",
    nombre: "ConfiaPay Store Demo",
    trustScore: 4.9,
    descripcion: "Tienda demostrativa oficial para la presentación.",
    direccion: "Av. Demo 123, Lima",
    rubro: "Demo",
    reseñas: [
      { usuario: "Esteban", comentario: "Perfecto para demostración.", rating: 5 },
      { usuario: "Karla", comentario: "Muy bien implementado.", rating: 5 },
    ],
  },
];

export default function ClienteTienda() {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);

  useEffect(() => {
    const found = tiendasSimuladas.find((t) => t._id === id);
    setTienda(found);
  }, [id]);

  if (!tienda)
    return (
      <p className="text-center mt-10 text-gray-600">
        No se encontró la tienda solicitada.
      </p>
    );

  // Si no hay reseñas, mostramos una simulada
  const reseñas = tienda.reseñas?.length
    ? tienda.reseñas
    : [{ usuario: "Usuario Demo", comentario: "Sin reseñas aún.", rating: 4 }];

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200">

      {/* TITLE */}
      <div className="flex items-center gap-4">
        <Store size={48} className="text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-blue-700">{tienda.nombre}</h1>
          <p className="text-gray-600">{tienda.descripcion}</p>
        </div>
      </div>

      {/* INFO GENERAL */}
      <div className="mt-6 space-y-4">
        <p className="flex items-center gap-2 text-gray-700">
          <MapPin size={20} className="text-red-500" />
          <span>{tienda.direccion}</span>
        </p>

        <p className="text-gray-700">
          <strong>Rubro:</strong> {tienda.rubro}
        </p>

        <div className="flex items-center gap-2">
          <Star size={26} className="text-yellow-400" />
          <span className="text-lg font-semibold">
            Trust Score: {tienda.trustScore} ⭐
          </span>
        </div>
      </div>

      {/* RESEÑAS */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <MessageSquare size={26} className="text-blue-600" />
          Reseñas de clientes
        </h2>

        <div className="space-y-4">
          {reseñas.map((r, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between">
                <p className="font-semibold">{r.usuario}</p>
                <p className="text-yellow-500">
                  {Array(r.rating).fill("⭐").join("")}
                </p>
              </div>
              <p className="text-gray-700 mt-1">{r.comentario}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
