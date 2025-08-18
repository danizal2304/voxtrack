import React from 'react';
import { DollarSign, Phone, Star, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import KPICard from '../Dashboard/KPICard';

const Overview: React.FC = () => {
  const kpis = [
    {
      title: 'Gasto del Mes',
      value: '$2,847',
      change: '+12%',
      changeType: 'negative' as const,
      icon: DollarSign,
      description: 'vs. mes anterior'
    },
    {
      title: 'Llamadas Totales',
      value: '1,245',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Phone,
      description: 'últimos 7 días'
    },
    {
      title: 'QA Score Promedio',
      value: '87/100',
      change: '+3pts',
      changeType: 'positive' as const,
      icon: Star,
      description: 'calidad general'
    },
    {
      title: 'Leads Generados',
      value: '324',
      change: '+15%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'conversiones exitosas'
    }
  ];

  const alerts = [
    { type: 'warning', message: 'Cliente "Real Estate Pro" superó el 80% del presupuesto mensual', time: '2 min' },
    { type: 'error', message: 'Agente "Support Bot" tiene QA score bajo (65/100)', time: '15 min' },
    { type: 'info', message: 'Nueva integración con Retell disponible', time: '1h' }
  ];

  const topAgents = [
    { name: 'Sales Assistant', client: 'TechCorp', cost: '$420', calls: 89 },
    { name: 'Support Bot', client: 'RetailPlus', cost: '$380', calls: 156 },
    { name: 'Lead Qualifier', client: 'Real Estate Pro', cost: '$340', calls: 78 },
    { name: 'Appointment Setter', client: 'MedClinic', cost: '$290', calls: 112 },
    { name: 'Order Assistant', client: 'FoodDelivery', cost: '$275', calls: 203 }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendencia de Gastos</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg">7D</button>
              <button className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 rounded-lg">30D</button>
              <button className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-50 rounded-lg">90D</button>
            </div>
          </div>
          
          {/* Simplified chart placeholder */}
          <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-center relative overflow-hidden">
            <div className="flex items-end space-x-2 h-full w-full px-4 pb-4">
              {[45, 52, 38, 61, 42, 70, 55, 48, 65, 72, 58, 69, 75, 63].map((height, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alertas Activas</h3>
            <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">3</span>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  alert.type === 'error' ? 'text-red-500' : 
                  alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">hace {alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas las alertas
          </button>
        </div>
      </div>

      {/* Top Agents Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top 5 Agentes por Costo</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todos</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Agente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Cliente</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Llamadas</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm">Costo</th>
              </tr>
            </thead>
            <tbody>
              {topAgents.map((agent, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{agent.name}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{agent.client}</td>
                  <td className="py-4 px-4 text-right text-gray-600">{agent.calls}</td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">{agent.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;