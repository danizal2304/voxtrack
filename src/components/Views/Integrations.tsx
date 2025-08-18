import React, { useState } from 'react';
import { Zap, CheckCircle, AlertCircle, Settings, Plus, ExternalLink } from 'lucide-react';

const Integrations: React.FC = () => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const providers = [
    {
      id: 'vapi',
      name: 'Vapi',
      description: 'Voice AI infrastructure platform',
      status: 'connected',
      logo: '🎙️',
      metrics: {
        calls: 1245,
        cost: '$847.20',
        avgDuration: '3:42'
      },
      lastSync: '2 minutes ago',
      webhookUrl: 'https://api.yourapp.com/webhooks/vapi'
    },
    {
      id: 'retell',
      name: 'Retell AI',
      description: 'Conversational Voice AI for customer service',
      status: 'connected',
      logo: '🤖',
      metrics: {
        calls: 892,
        cost: '$523.40',
        avgDuration: '4:15'
      },
      lastSync: '5 minutes ago',
      webhookUrl: 'https://api.yourapp.com/webhooks/retell'
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs',
      description: 'AI voice generation and text-to-speech',
      status: 'connected',
      logo: '🔊',
      metrics: {
        characters: '2.4M',
        cost: '$156.80',
        avgSpeed: '1.2x'
      },
      lastSync: '1 hour ago',
      webhookUrl: 'https://api.yourapp.com/webhooks/elevenlabs'
    },
    {
      id: 'synthflow',
      name: 'Synthflow',
      description: 'No-code voice AI agent builder',
      status: 'disconnected',
      logo: '⚡',
      metrics: null,
      lastSync: null,
      webhookUrl: null
    },
    {
      id: 'bland',
      name: 'Bland AI',
      description: 'Phone calling AI for businesses',
      status: 'error',
      logo: '📞',
      metrics: {
        calls: 234,
        cost: '$98.60',
        avgDuration: '2:30'
      },
      lastSync: '2 hours ago',
      webhookUrl: 'https://api.yourapp.com/webhooks/bland'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      connected: 'bg-green-100 text-green-700',
      disconnected: 'bg-gray-100 text-gray-700',
      error: 'bg-red-100 text-red-700'
    };
    
    const labels = {
      connected: 'Conectado',
      disconnected: 'Desconectado',
      error: 'Error'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleConnect = (providerId: string) => {
    setSelectedProvider(providerId);
    setShowApiModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Integraciones de Proveedores</h2>
          <p className="text-gray-600 mt-1">Conecta y gestiona tus proveedores de IA de voz</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Agregar Proveedor</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conectados</p>
              <p className="text-2xl font-semibold text-green-600">3</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Errores</p>
              <p className="text-2xl font-semibold text-red-600">1</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Llamadas</p>
              <p className="text-2xl font-semibold text-gray-900">2,371</p>
            </div>
            <div className="text-2xl">📞</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Costo Total</p>
              <p className="text-2xl font-semibold text-gray-900">$1,625</p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{provider.logo}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(provider.status)}
                {getStatusBadge(provider.status)}
              </div>
            </div>

            {/* Metrics */}
            {provider.metrics && (
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                {Object.entries(provider.metrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {key === 'avgDuration' ? 'Promedio' : 
                       key === 'avgSpeed' ? 'Velocidad' : 
                       key === 'characters' ? 'Caracteres' : key}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>
                {provider.lastSync ? `Última sync: ${provider.lastSync}` : 'No sincronizado'}
              </span>
              {provider.webhookUrl && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Webhook activo</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {provider.status === 'connected' ? (
                <>
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Settings className="h-4 w-4" />
                    <span>Configurar</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                    <ExternalLink className="h-4 w-4" />
                    <span>Ver Detalles</span>
                  </button>
                </>
              ) : provider.status === 'error' ? (
                <button 
                  onClick={() => handleConnect(provider.id)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <Settings className="h-4 w-4" />
                  <span>Reconectar</span>
                </button>
              ) : (
                <button 
                  onClick={() => handleConnect(provider.id)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Zap className="h-4 w-4" />
                  <span>Conectar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Webhook Configuration */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Webhooks</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Base para Webhooks
            </label>
            <div className="flex">
              <input
                type="text"
                value="https://api.yourapp.com/webhooks"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
              <button className="px-4 py-2 bg-gray-100 text-gray-600 border border-l-0 border-gray-300 rounded-r-lg text-sm hover:bg-gray-200">
                Copiar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Los proveedores enviarán datos a esta URL seguida de su identificador
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Token
            </label>
            <div className="flex">
              <input
                type="password"
                value="sk_live_abc123..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
              <button className="px-4 py-2 bg-gray-100 text-gray-600 border border-l-0 border-gray-300 rounded-r-lg text-sm hover:bg-gray-200">
                Renovar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Token para validar la autenticidad de los webhooks
            </p>
          </div>
        </div>
      </div>

      {/* API Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conectar {providers.find(p => p.id === selectedProvider)?.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="Ingresa tu API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Región (opcional)
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>US East</option>
                  <option>EU West</option>
                  <option>Asia Pacific</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;