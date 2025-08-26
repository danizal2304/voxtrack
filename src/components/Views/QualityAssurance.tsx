import React, { useState } from 'react';
import { Search, Filter, Play, FileText, AlertCircle, CheckCircle, Star } from 'lucide-react';
import { useQAScores, ConversationWithQA } from '../../hooks/useQAScores';

const QualityAssurance: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const { conversations, loading } = useQAScores();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando conversaciones...</div>
      </div>
    );
  }

  // Transform database data for display
  const conversationData = conversations
    .filter(conv => conv.qa_score) // Only show conversations with QA scores
    .map(conv => ({
      id: conv.id,
      date: new Date(conv.call_started_at).toLocaleString('es-ES'),
      client: conv.client_name,
      agent: conv.agent_id,
      duration: `${Math.floor(conv.call_duration_seconds / 60)}:${(conv.call_duration_seconds % 60).toString().padStart(2, '0')}`,
      score: conv.qa_score?.overall_score || 0,
      intent: conv.qa_score?.conversation_intent || 'Unknown',
      urgency: conv.qa_score?.urgency_level || 'low',
      status: conv.call_status,
      risks: conv.qa_score?.risks_detected || [],
      transcript: conv.transcript || 'No transcript available',
      qa_score: conv.qa_score
    }));

  // Calculate stats from database
  const totalConversations = conversationData.length;
  const avgScore = totalConversations > 0 
    ? conversationData.reduce((sum, conv) => sum + conv.score, 0) / totalConversations 
    : 0;
  const riskyConversations = conversationData.filter(conv => 
    conv.risks.length > 0 && !conv.risks.includes('None')
  ).length;

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
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const selectedConv = conversationData.find(c => c.id === selectedConversation);

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
              <div className="text-lg font-semibold text-gray-900">{totalConversations}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{avgScore.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{riskyConversations}</div>
              <div className="text-xs text-gray-500">Riesgos</div>
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversationData.map((conversation) => (
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
                  {conversation.urgency.charAt(0).toUpperCase() + conversation.urgency.slice(1)}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{conversation.agent}</span>
                  <span className="text-xs text-gray-500">{conversation.duration}</span>
                </div>
                <div className="text-sm text-gray-700 font-medium">{conversation.intent}</div>
                <div className="text-xs text-gray-500">{conversation.date}</div>
                
                {conversation.risks.length > 0 && !conversation.risks.includes('None') ? (
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
          {conversationData.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">No hay conversaciones con QA disponibles</p>
            </div>
          )}
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
                    {selectedConv?.qa_score && [
                      { name: 'Comprensión', score: selectedConv.qa_score.comprehension_score },
                      { name: 'Resolución', score: selectedConv.qa_score.resolution_score },
                      { name: 'Tono', score: selectedConv.qa_score.tone_score },
                      { name: 'Cumplimiento', score: selectedConv.qa_score.compliance_score }
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
                  {selectedConv && selectedConv.risks.length > 0 && !selectedConv.risks.includes('None') && (
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
                  {selectedConv && (
                    <div className="pt-4 border-t border-gray-100">
                      {selectedConv.qa_score?.escalation_needed && (
                        <button className="w-full px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 mb-2">
                          Escalar a Humano
                        </button>
                      )}
                      <button className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                        {selectedConv.qa_score?.human_reviewed ? 'Revisado' : 'Marcar como Revisado'}
                      </button>
                    </div>
                  )}
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