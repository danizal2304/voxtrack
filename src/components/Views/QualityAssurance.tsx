import React, { useState } from 'react';
import { Search, Filter, Play, FileText, AlertCircle, CheckCircle, Star } from 'lucide-react';

const QualityAssurance: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  const conversations = [
    {
      id: 1,
      date: '2025-01-15 14:30',
      client: 'TechCorp',
      agent: 'Sales Assistant',
      duration: '4:23',
      score: 87,
      intent: 'Product Demo Request',
      urgency: 'Medium',
      status: 'Completed',
      risks: ['None'],
      transcript: 'Usuario: Hola, me gustaría saber más sobre sus servicios...\n\nAgente: ¡Hola! Gracias por contactarnos. Estaré encantado de ayudarte con información sobre nuestros servicios. ¿Podrías contarme un poco más sobre tu empresa y qué tipo de solución estás buscando?\n\nUsuario: Somos una startup de fintech y necesitamos automatizar nuestro servicio al cliente...'
    },
    {
      id: 2,
      date: '2025-01-15 13:45',
      client: 'Real Estate Pro',
      agent: 'Lead Qualifier',
      duration: '2:15',
      score: 65,
      intent: 'Property Inquiry',
      urgency: 'High',
      status: 'Escalated',
      risks: ['Low comprehension', 'Missed escalation'],
      transcript: 'Usuario: Estoy interesado en comprar una casa en el centro de la ciudad...\n\nAgente: Perfecto, te puedo ayudar con eso. ¿Cuál es tu presupuesto?\n\nUsuario: Tengo hasta 500,000 euros, pero me urge encontrar algo esta semana porque me mudo por trabajo...'
    },
    {
      id: 3,
      date: '2025-01-15 12:20',
      client: 'MedClinic',
      agent: 'Appointment Setter',
      duration: '3:42',
      score: 92,
      intent: 'Appointment Booking',
      urgency: 'Low',
      status: 'Completed',
      risks: ['None'],
      transcript: 'Usuario: Necesito agendar una cita con el cardiólogo...\n\nAgente: Por supuesto, te puedo ayudar a agendar tu cita con cardiología. Tengo disponibilidad para la próxima semana. ¿Prefieres mañana o tarde?\n\nUsuario: Prefiero por la mañana si es posible...'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="h-full flex">
      {/* Conversation List */}
      <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Conversaciones</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">234</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">87.2</div>
              <div className="text-xs text-gray-500">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">12</div>
              <div className="text-xs text-gray-500">Riesgos</div>
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${getScoreBg(conversation.score)} ${getScoreColor(conversation.score)}`}>
                    {conversation.score}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{conversation.client}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(conversation.urgency)}`}>
                  {conversation.urgency}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{conversation.agent}</span>
                  <span className="text-xs text-gray-500">{conversation.duration}</span>
                </div>
                <div className="text-sm text-gray-700 font-medium">{conversation.intent}</div>
                <div className="text-xs text-gray-500">{conversation.date}</div>
                
                {conversation.risks.length > 1 || conversation.risks[0] !== 'None' ? (
                  <div className="flex items-center space-x-1 mt-2">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600">Requiere atención</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 mt-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Sin problemas</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Detail */}
      <div className="w-1/2 bg-white flex flex-col">
        {selectedConv ? (
          <>
            {/* Detail Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${getScoreBg(selectedConv.score)} ${getScoreColor(selectedConv.score)}`}>
                    {selectedConv.score}/100
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedConv.client}</h3>
                    <p className="text-sm text-gray-600">{selectedConv.agent} • {selectedConv.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Play className="h-4 w-4" />
                    <span>Escuchar</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FileText className="h-4 w-4" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Intención:</span>
                  <span className="ml-2 font-medium">{selectedConv.intent}</span>
                </div>
                <div>
                  <span className="text-gray-500">Estado:</span>
                  <span className="ml-2 font-medium">{selectedConv.status}</span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex">
              {/* Transcript */}
              <div className="flex-1 p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Transcripción</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                    {selectedConv.transcript}
                  </pre>
                </div>
              </div>

              {/* Scorecard */}
              <div className="w-80 border-l border-gray-200 p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Evaluación de Calidad</h4>
                
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className="text-center pb-4 border-b border-gray-100">
                    <div className={`text-3xl font-bold ${getScoreColor(selectedConv.score)}`}>
                      {selectedConv.score}
                    </div>
                    <div className="text-sm text-gray-500">Puntuación General</div>
                  </div>

                  {/* Individual Scores */}
                  <div className="space-y-3">
                    {[
                      { name: 'Comprensión', score: 90 },
                      { name: 'Resolución', score: 85 },
                      { name: 'Tono', score: 95 },
                      { name: 'Cumplimiento', score: 80 },
                      { name: 'Escalado', score: 70 }
                    ].map((metric) => (
                      <div key={metric.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{metric.name}</span>
                          <span className={`font-medium ${getScoreColor(metric.score)}`}>
                            {metric.score}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              metric.score >= 80 ? 'bg-green-500' :
                              metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Risks */}
                  {selectedConv.risks[0] !== 'None' && (
                    <div className="pt-4 border-t border-gray-100">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Riesgos Detectados</h5>
                      <div className="space-y-2">
                        {selectedConv.risks.map((risk, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-sm text-red-600">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100">
                    <button className="w-full px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 mb-2">
                      Escalar a Humano
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                      Marcar como Revisado
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Selecciona una conversación para ver los detalles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityAssurance;