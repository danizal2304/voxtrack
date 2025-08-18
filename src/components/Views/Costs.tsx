import React, { useState } from 'react';
import { Filter, Download, Calendar, DollarSign } from 'lucide-react';

const Costs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('client');
  const [showFilters, setShowFilters] = useState(false);

  const costData = [
    {
      id: 1,
      date: '2025-01-15',
      client: 'TechCorp',
      agent: 'Sales Assistant',
      provider: 'Vapi',
      metric: 'Minutos',
      quantity: 45,
      cost: '$23.50',
      status: 'ok'
    },
    {
      id: 2,
      date: '2025-01-15',
      client: 'Real Estate Pro',
      agent: 'Lead Qualifier',
      provider: 'Retell',
      metric: 'Minutos',
      quantity: 67,
      cost: '$41.20',
      status: 'warning'
    },
    {
      id: 3,
      date: '2025-01-14',
      client: 'MedClinic',
      agent: 'Appointment Setter',
      provider: 'ElevenLabs',
      metric: 'Characters',
      quantity: 12500,
      cost: '$8.75',
      status: 'ok'
    },
    {
      id: 4,
      date: '2025-01-14',
      client: 'RetailPlus',
      agent: 'Support Bot',
      provider: 'Synthflow',
      metric: 'Llamadas',
      quantity: 23,
      cost: '$34.50',
      status: 'alert'
    }
  ];

  const tabs = [
    { key: 'client', label: 'Por Cliente' },
    { key: 'agent', label: 'Por Agente' },
    { key: 'provider', label: 'Por Proveedor' }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      ok: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      alert: 'bg-red-100 text-red-700'
    };
    const labels = {
      ok: 'OK',
      warning: 'Alerta',
      alert: 'Excedido'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Mes</p>
              <p className="text-xl font-semibold text-gray-900">$2,847</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Últimos 7 días</p>
              <p className="text-xl font-semibold text-gray-900">$487</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div>
            <p className="text-sm text-gray-600">Promedio diario</p>
            <p className="text-xl font-semibold text-gray-900">$94.90</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div>
            <p className="text-sm text-gray-600">Proyección mes</p>
            <p className="text-xl font-semibold text-gray-900">$3,420</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.key
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos</option>
                  <option value="vapi">Vapi</option>
                  <option value="retell">Retell</option>
                  <option value="elevenlabs">ElevenLabs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos</option>
                  <option value="techcorp">TechCorp</option>
                  <option value="realestate">Real Estate Pro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos</option>
                  <option value="ok">OK</option>
                  <option value="warning">Alerta</option>
                  <option value="alert">Excedido</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agente
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Métrica
                </th>
                <th className="sticky top-0 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="sticky top-0 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="sticky top-0 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.agent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.provider}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.metric}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{row.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">{row.cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(row.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando 1-4 de 247 registros
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Anterior
            </button>
            <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</span>
            <span className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer">2</span>
            <span className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer">3</span>
            <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Costs;