import React from "react";
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 text-center py-4 mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-400">ConfiaPay</span>. 
        Todos los derechos reservados.
      </p>
    </footer>
  );
}
