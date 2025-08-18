import React from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  CheckCircle, 
  Zap, 
  Target, 
  Palette, 
  CreditCard,
  Settings,
  Users,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const navigation = [
    { name: 'Overview', icon: LayoutDashboard, key: 'overview' },
    { name: 'Costos', icon: DollarSign, key: 'costs' },
    { name: 'Quality Assurance', icon: CheckCircle, key: 'qa' },
    { name: 'Integraciones', icon: Zap, key: 'integrations' },
    { name: 'Presupuestos', icon: Target, key: 'budgets' },
    { name: 'Analytics', icon: BarChart3, key: 'analytics' },
    { name: 'Clientes', icon: Users, key: 'clients' },
  ];

  const settings = [
    { name: 'White-label', icon: Palette, key: 'whitelabel' },
    { name: 'Billing', icon: CreditCard, key: 'billing' },
    { name: 'Configuración', icon: Settings, key: 'settings' },
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">VoiceQA</h1>
            <p className="text-xs text-gray-500 font-light">Quality & Cost Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.key;
          
          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-gray-100 px-4 py-4 space-y-1">
        {settings.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.key;
          
          return (
            <button
              key={item.key}
              onClick={() => onViewChange(item.key)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`mr-3 h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {item.name}
            </button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@agency.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;