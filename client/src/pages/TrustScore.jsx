import React from "react";
export default function TrustScore() {
  const { user } = useAuth();
  const score = Math.floor(Math.random() * 40) + 60; // ejemplo aleatorio

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 to-yellow-200">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">
        Trust Score de {user.name || "Usuario"}
      </h1>
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <p className="text-6xl font-bold text-yellow-600">{score}%</p>
        <p className="mt-4 text-gray-700">Nivel de confianza actual en tus transacciones</p>
      </div>
    </div>
  );
}
