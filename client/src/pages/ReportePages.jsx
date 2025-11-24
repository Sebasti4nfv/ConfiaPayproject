import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import axiosClient from "../api/axiosClient"; // ajusta ruta si es necesario
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de gráficos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportesPage = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ totalIngresos: 0, totalEgresos: 0, balance: 0 });
  const [filtros, setFiltros] = useState({ fechaInicio: '', fechaFin: '', sucursal: '' });
  const [loading, setLoading] = useState(false);

  // URL del Backend (Ajusta si tu puerto es diferente)
 

  // Función para obtener datos
  const obtenerDatos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Asumo que guardas el token así
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Query string para filtros
      const params = new URLSearchParams();

        if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
        if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);
        if (filtros.sucursal) params.append("sucursal", filtros.sucursal);

        const query = params.toString() ? `?${params.toString()}` : "";

      // 1. Obtener Lista
      const resLista = await axiosClient.get(`/api/transactions${query}`);
      setTransacciones(resLista.data);

      // 2. Obtener Estadísticas
      const resStats = await axiosClient.get(`/api/transactions/reporte/stats${query}`);
      setEstadisticas(resStats.data);

    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error al cargar los reportes. Verifica que el servidor esté activo.");
    }
    setLoading(false);
  };

  // Cargar datos al inicio y cuando cambien los filtros
  useEffect(() => {
    obtenerDatos();
  }, [filtros]);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // --- EXPORTAR A EXCEL ---
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(transacciones.map(t => ({
      Fecha: format(new Date(t.createdAt), 'dd/MM/yyyy HH:mm'),
      Tipo: t.tipo,
      Monto: t.monto,
      Descripcion: t.descripcion,
      Usuario: t.user?.name || 'N/A',
      Sucursal: t.sucursal?.nombre || 'General'
    })));
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reporte");
    XLSX.writeFile(libro, "Reporte_Transacciones.xlsx");
  };

  // --- EXPORTAR A PDF ---
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Transacciones - ConfiaPay", 14, 20);
    
    const tablaColumnas = ["Fecha", "Tipo", "Monto", "Usuario", "Descripción"];
    const tablaFilas = transacciones.map(t => [
      format(new Date(t.createdAt), 'dd/MM/yyyy'),
      t.tipo.toUpperCase(),
      `S/. ${t.monto}`,
      t.user?.name || 'N/A',
      t.descripcion
    ]);

    autoTable(doc, {
    head: [tablaColumnas],
    body: tablaFilas,
    startY: 30,
    });

    doc.save("Reporte_Transacciones.pdf");
  };

  // Datos para el Gráfico
  const dataGrafico = {
    labels: ['Ingresos', 'Egresos'],
    datasets: [
      {
        label: 'Monto (S/.)',
        data: [estadisticas.totalIngresos, estadisticas.totalEgresos],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)'],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reportes y Transacciones</h1>

      {/* --- SECCIÓN DE FILTROS --- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
          <input type="date" name="fechaInicio" onChange={handleChange} className="border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
          <input type="date" name="fechaFin" onChange={handleChange} className="border p-2 rounded" />
        </div>
        
        {/* Botones de Exportación */}
        <div className="ml-auto flex gap-2">
          <button onClick={exportarExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            📊 Excel
          </button>
          <button onClick={exportarPDF} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            📄 PDF
          </button>
        </div>
      </div>

      {/* --- ESTADÍSTICAS Y GRÁFICO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjetas de Resumen */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500">Total Ingresos</h3>
          <p className="text-2xl font-bold text-green-600">S/. {estadisticas.totalIngresos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-gray-500">Total Egresos</h3>
          <p className="text-2xl font-bold text-red-600">S/. {estadisticas.totalEgresos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500">Balance Neto</h3>
          <p className="text-2xl font-bold text-blue-600">S/. {estadisticas.balance}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8 w-full md:w-1/2 mx-auto">
         <h3 className="text-lg font-bold mb-4 text-center">Resumen Visual</h3>
         <Bar data={dataGrafico} />
      </div>

      {/* --- TABLA DE TRANSACCIONES --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4">Cargando...</td></tr>
            ) : transacciones.map((t) => (
              <tr key={t._id}>
                <td className="px-6 py-4 whitespace-nowrap">{format(new Date(t.fecha), 'dd/MM/yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{t.user?.name || 'Usuario'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    t.tipo === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {t.tipo}
                  </span>
                </td>
                <td className="px-6 py-4">{t.descripcion}</td>
                <td className="px-6 py-4 font-bold">S/. {t.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportesPage;