import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const getViewTitle = (view: string) => {
    const titles: { [key: string]: string } = {
      overview: 'Dashboard Overview',
      costs: 'Gestión de Costos',
      qa: 'Quality Assurance',
      integrations: 'Integraciones',
      budgets: 'Presupuestos & Alertas',
      analytics: 'Analytics',
      clients: 'Gestión de Clientes',
      whitelabel: 'Configuración White-label',
      billing: 'Billing & Planes',
      settings: 'Configuración',
    };
    return titles[view] || 'Dashboard';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{getViewTitle(currentView)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitorea la calidad y costos de tus agentes de IA
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Workspace selector */}
          <div className="flex items-center space-x-2">
            <select className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Mi Agencia</option>
              <option>Workspace 2</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;