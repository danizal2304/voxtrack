import React from 'react';
import { DollarSign, Phone, Star, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import KPICard from '../Dashboard/KPICard';
import { useUsageEvents } from '../../hooks/useUsageEvents';
import { useQAScores } from '../../hooks/useQAScores';

const Overview: React.FC = () => {
  const { usageEvents, loading: usageLoading } = useUsageEvents();
  const { conversations, loading: qaLoading } = useQAScores();

  if (usageLoading || qaLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando datos...</div>
      </div>
    );
  }

  // Calculate KPIs from database data
  const totalCost = usageEvents.reduce((sum, event) => sum + event.call_cost, 0);
  const totalCalls = usageEvents.length;
  const avgQAScore = conversations.length > 0 
    ? conversations
        .filter(c => c.qa_score)
        .reduce((sum, c) => sum + (c.qa_score?.overall_score || 0), 0) / 
      conversations.filter(c => c.qa_score).length
    : 0;
  const totalLeads = conversations.filter(c => 
    c.qa_score?.conversation_intent?.toLowerCase().includes('lead') ||
    c.qa_score?.conversation_intent?.toLowerCase().includes('demo') ||
    c.qa_score?.conversation_intent?.toLowerCase().includes('inquiry')
  ).length;

  const kpis = [
    {
      title: 'Gasto del Mes',
      value: `$${totalCost.toFixed(2)}`,
      change: '+12%',
      changeType: 'negative' as const,
      icon: DollarSign,
      description: 'vs. mes anterior'
    },
    {
      title: 'Llamadas Totales',
      value: totalCalls.toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Phone,
      description: 'últimos 7 días'
    },
    {
      title: 'QA Score Promedio',
      value: `${Math.round(avgQAScore)}/100`,
      change: '+3pts',
      changeType: 'positive' as const,
      icon: Star,
      description: 'calidad general'
    },
    {
      title: 'Leads Generados',
      value: totalLeads.toString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'conversiones exitosas'
    }
  ];

  // Generate alerts from database data
  const alerts = [];
  
  // High cost alerts
  const highCostClients = usageEvents
    .reduce((acc, event) => {
      acc[event.client_name] = (acc[event.client_name] || 0) + event.call_cost;
      return acc;
    }, {} as Record<string, number>);
  
  Object.entries(highCostClients).forEach(([client, cost]) => {
    if (cost > 100) {
      alerts.push({
        type: 'warning',
        message: `Cliente "${client}" ha gastado $${cost.toFixed(2)} este mes`,
        time: '2 min'
      });
    }
  });

  // Low QA score alerts
  conversations
    .filter(c => c.qa_score && c.qa_score.overall_score < 70)
    .slice(0, 2)
    .forEach(c => {
      alerts.push({
        type: 'error',
        message: `Agente "${c.agent_id}" tiene QA score bajo (${c.qa_score?.overall_score}/100)`,
        time: '15 min'
      });
    });

  // Calculate top agents from database
  const agentStats = usageEvents.reduce((acc, event) => {
    const key = `${event.agent_id}-${event.client_name}`;
    if (!acc[key]) {
      acc[key] = {
        name: event.agent_id,
        client: event.client_name,
        cost: 0,
        calls: 0
      };
    }
    acc[key].cost += event.call_cost;
    acc[key].calls += 1;
    return acc;
  }, {} as Record<string, { name: string; client: string; cost: number; calls: number }>);

  const topAgents = Object.values(agentStats)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5)
    .map(agent => ({
      ...agent,
      cost: `$${agent.cost.toFixed(2)}`
    }));

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
            {alerts.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No hay alertas activas</p>
              </div>
            )}
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
              {topAgents.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No hay datos de agentes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;