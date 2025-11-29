import { Link } from "react-router-dom";

export default function VendedorDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Panel del Vendedor</h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        <Link
          to="/vendedor/validar"
          className="bg-blue-600 text-white py-4 text-center rounded-xl font-semibold hover:bg-blue-700"
        >
          Validar Comprobante
        </Link>

        <Link
          to="/vendedor/registrar"
          className="bg-green-600 text-white py-4 text-center rounded-xl font-semibold hover:bg-green-700"
        >
          Registrar Venta
        </Link>
      </div>
    </div>
  );
}
