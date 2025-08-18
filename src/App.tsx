import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Overview from './components/Views/Overview';
import Costs from './components/Views/Costs';
import QualityAssurance from './components/Views/QualityAssurance';
import Integrations from './components/Views/Integrations';

function App() {
  const [activeView, setActiveView] = useState('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <Overview />;
      case 'costs':
        return <Costs />;
      case 'qa':
        return <QualityAssurance />;
      case 'integrations':
        return <Integrations />;
      case 'budgets':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Presupuestos & Alertas</h3>
            <p className="text-gray-600">Vista en desarrollo...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">Vista en desarrollo...</p>
          </div>
        );
      case 'clients':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Clientes</h3>
            <p className="text-gray-600">Vista en desarrollo...</p>
          </div>
        );
      case 'whitelabel':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración White-label</h3>
            <p className="text-gray-600">Vista en desarrollo...</p>
          </div>
        );
      case 'billing':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing & Planes</h3>
            <p className="text-gray-600">Vista en desarrollo...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración</h3>
            <p className="text-gray-600">Vista en desarrollo...</p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={activeView} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;