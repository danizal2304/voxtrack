/*
  # Create usage events and QA tables

  1. New Tables
    - `usage_events`
      - `id` (uuid, primary key)
      - `workspace_id` (uuid, for multi-tenancy)
      - `provider` (text, e.g., 'vapi', 'retell', 'elevenlabs')
      - `external_event_id` (text, unique per provider for idempotency)
      - `agent_id` (text, external agent identifier)
      - `client_name` (text, client/customer name)
      - `call_duration_seconds` (integer, duration in seconds)
      - `call_cost` (decimal, cost in USD)
      - `call_started_at` (timestamptz, when call started)
      - `call_ended_at` (timestamptz, when call ended)
      - `phone_number` (text, caller phone number)
      - `call_status` (text, completed/failed/abandoned)
      - `recording_url` (text, optional recording URL)
      - `transcript` (text, call transcript)
      - `metadata` (jsonb, additional provider-specific data)
      - `created_at` (timestamptz, when record was created)
      - `updated_at` (timestamptz, when record was last updated)

    - `qa_scores`
      - `id` (uuid, primary key)
      - `usage_event_id` (uuid, foreign key to usage_events)
      - `overall_score` (integer, 0-100)
      - `comprehension_score` (integer, 0-100)
      - `resolution_score` (integer, 0-100)
      - `tone_score` (integer, 0-100)
      - `compliance_score` (integer, 0-100)
      - `escalation_needed` (boolean, should escalate to human)
      - `conversation_intent` (text, detected intent)
      - `urgency_level` (text, low/medium/high)
      - `summary` (text, brief conversation summary)
      - `risks_detected` (jsonb, array of detected risks)
      - `ai_feedback` (text, AI-generated feedback)
      - `human_reviewed` (boolean, has been reviewed by human)
      - `reviewer_notes` (text, optional human reviewer notes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for workspace-based access control
    - Create indexes for performance

  3. Sample Data
    - Insert sample Vapi usage events
    - Insert corresponding QA scores
*/

-- Create usage_events table
CREATE TABLE IF NOT EXISTS usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('vapi', 'retell', 'elevenlabs', 'synthflow', 'bland')),
  external_event_id text NOT NULL,
  agent_id text NOT NULL,
  client_name text NOT NULL,
  call_duration_seconds integer NOT NULL DEFAULT 0,
  call_cost decimal(10,4) NOT NULL DEFAULT 0.0000,
  call_started_at timestamptz NOT NULL,
  call_ended_at timestamptz NOT NULL,
  phone_number text,
  call_status text NOT NULL DEFAULT 'completed' CHECK (call_status IN ('completed', 'failed', 'abandoned', 'in_progress')),
  recording_url text,
  transcript text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create qa_scores table
CREATE TABLE IF NOT EXISTS qa_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usage_event_id uuid NOT NULL REFERENCES usage_events(id) ON DELETE CASCADE,
  overall_score integer NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  comprehension_score integer NOT NULL DEFAULT 0 CHECK (comprehension_score >= 0 AND comprehension_score <= 100),
  resolution_score integer NOT NULL DEFAULT 0 CHECK (resolution_score >= 0 AND resolution_score <= 100),
  tone_score integer NOT NULL DEFAULT 0 CHECK (tone_score >= 0 AND tone_score <= 100),
  compliance_score integer NOT NULL DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  escalation_needed boolean DEFAULT false,
  conversation_intent text DEFAULT 'unknown',
  urgency_level text DEFAULT 'low' CHECK (urgency_level IN ('low', 'medium', 'high')),
  summary text,
  risks_detected jsonb DEFAULT '[]',
  ai_feedback text,
  human_reviewed boolean DEFAULT false,
  reviewer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_events_workspace_id ON usage_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_provider ON usage_events(provider);
CREATE INDEX IF NOT EXISTS idx_usage_events_client_name ON usage_events(client_name);
CREATE INDEX IF NOT EXISTS idx_usage_events_call_started_at ON usage_events(call_started_at);
CREATE INDEX IF NOT EXISTS idx_usage_events_external_id ON usage_events(provider, external_event_id);
CREATE INDEX IF NOT EXISTS idx_qa_scores_usage_event_id ON qa_scores(usage_event_id);
CREATE INDEX IF NOT EXISTS idx_qa_scores_overall_score ON qa_scores(overall_score);
CREATE INDEX IF NOT EXISTS idx_qa_scores_urgency_level ON qa_scores(urgency_level);

-- Create unique constraint for idempotency
CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_events_unique_external 
ON usage_events(workspace_id, provider, external_event_id);

-- Enable Row Level Security
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for usage_events
CREATE POLICY "Users can read own workspace usage events"
  ON usage_events
  FOR SELECT
  TO authenticated
  USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

CREATE POLICY "Users can insert own workspace usage events"
  ON usage_events
  FOR INSERT
  TO authenticated
  WITH CHECK (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

CREATE POLICY "Users can update own workspace usage events"
  ON usage_events
  FOR UPDATE
  TO authenticated
  USING (workspace_id = (auth.jwt() ->> 'workspace_id')::uuid);

-- Create RLS policies for qa_scores
CREATE POLICY "Users can read qa scores for own workspace"
  ON qa_scores
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usage_events 
      WHERE usage_events.id = qa_scores.usage_event_id 
      AND usage_events.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY "Users can insert qa scores for own workspace"
  ON qa_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usage_events 
      WHERE usage_events.id = qa_scores.usage_event_id 
      AND usage_events.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

CREATE POLICY "Users can update qa scores for own workspace"
  ON qa_scores
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usage_events 
      WHERE usage_events.id = qa_scores.usage_event_id 
      AND usage_events.workspace_id = (auth.jwt() ->> 'workspace_id')::uuid
    )
  );

-- Insert sample data for Vapi usage events
INSERT INTO usage_events (
  workspace_id,
  provider,
  external_event_id,
  agent_id,
  client_name,
  call_duration_seconds,
  call_cost,
  call_started_at,
  call_ended_at,
  phone_number,
  call_status,
  transcript
) VALUES 
(
  gen_random_uuid(),
  'vapi',
  'vapi_call_001',
  'sales_assistant_v1',
  'TechCorp',
  263, -- 4:23 in seconds
  23.50,
  '2025-01-15 14:30:00+00',
  '2025-01-15 14:34:23+00',
  '+1234567890',
  'completed',
  'Usuario: Hola, me gustaría saber más sobre sus servicios de automatización para startups.

Agente: ¡Hola! Gracias por contactarnos. Estaré encantado de ayudarte con información sobre nuestros servicios de automatización. ¿Podrías contarme un poco más sobre tu startup y qué tipo de procesos te gustaría automatizar?

Usuario: Somos una fintech y necesitamos automatizar nuestro servicio al cliente. Recibimos muchas consultas sobre estados de cuenta y transferencias.

Agente: Perfecto, entiendo. Nuestros agentes de IA pueden manejar consultas de servicio al cliente 24/7, incluyendo estados de cuenta y seguimiento de transferencias. ¿Te gustaría agendar una demo para mostrarte cómo funciona?

Usuario: Sí, me interesa mucho. ¿Cuándo podríamos hacerla?

Agente: Excelente. Tengo disponibilidad mañana a las 3 PM o el jueves a las 10 AM. ¿Cuál te conviene mejor?

Usuario: Mañana a las 3 PM está perfecto.

Agente: Perfecto, he agendado la demo para mañana a las 3 PM. Te enviaré un email de confirmación con el link de la reunión. ¿Hay algo específico que te gustaría que cubramos en la demo?

Usuario: Me gustaría ver cómo se integra con nuestro CRM actual.

Agente: Anotado. Cubriremos las integraciones con CRM en detalle. ¡Nos vemos mañana!'
),
(
  gen_random_uuid(),
  'vapi',
  'vapi_call_002',
  'lead_qualifier_v2',
  'Real Estate Pro',
  135, -- 2:15 in seconds
  41.20,
  '2025-01-15 13:45:00+00',
  '2025-01-15 13:47:15+00',
  '+1987654321',
  'completed',
  'Usuario: Estoy interesado en comprar una casa en el centro de la ciudad, tengo un presupuesto de hasta 500,000 euros.

Agente: Perfecto, te puedo ayudar con eso. ¿Cuántas habitaciones necesitas y hay alguna zona específica del centro que prefieras?

Usuario: Necesito al menos 3 habitaciones y me urge encontrar algo esta semana porque me mudo por trabajo.

Agente: Entiendo la urgencia. Tengo varias propiedades disponibles en tu rango de precio. ¿Podrías darme tu email para enviarte las opciones y coordinar visitas para esta semana?

Usuario: Sí, es juan.martinez@email.com. ¿Podrías mostrarme algo mañana?

Agente: Perfecto Juan. Te enviaré las opciones por email en los próximos 30 minutos y te contactaré para coordinar las visitas mañana. Dado tu timeline, también voy a conectarte con nuestro agente senior María para que te dé atención prioritaria.

Usuario: Excelente, muchas gracias por la ayuda.

Agente: De nada Juan. Espera mi email y la llamada de María hoy mismo. ¡Vamos a encontrarte la casa perfecta!'
),
(
  gen_random_uuid(),
  'vapi',
  'vapi_call_003',
  'appointment_setter_v1',
  'MedClinic',
  222, -- 3:42 in seconds
  8.75,
  '2025-01-15 12:20:00+00',
  '2025-01-15 12:23:42+00',
  '+1122334455',
  'completed',
  'Usuario: Necesito agendar una cita con el cardiólogo, es para un chequeo de rutina.

Agente: Por supuesto, te puedo ayudar a agendar tu cita con cardiología. ¿Tienes alguna preferencia de horario? Tengo disponibilidad para la próxima semana.

Usuario: Prefiero por la mañana si es posible, entre 9 y 11 AM.

Agente: Perfecto. Tengo disponible el martes 21 de enero a las 9:30 AM o el miércoles 22 a las 10:15 AM. ¿Cuál te conviene mejor?

Usuario: El martes a las 9:30 está bien.

Agente: Excelente. Para confirmar la cita necesito algunos datos: tu nombre completo y número de seguro médico.

Usuario: Soy Ana García y mi número de seguro es 123456789.

Agente: Perfecto Ana. He agendado tu cita con el Dr. Rodríguez para el martes 21 de enero a las 9:30 AM. Por favor llega 15 minutos antes para el registro. ¿Necesitas la dirección de la clínica?

Usuario: Sí, por favor.

Agente: La clínica está en Av. Principal 123, segundo piso. Te enviaré un SMS de recordatorio el día anterior. ¿Hay algo más en lo que pueda ayudarte?

Usuario: No, eso es todo. Muchas gracias.

Agente: De nada Ana. Nos vemos el martes. ¡Que tengas un buen día!'
);

-- Insert corresponding QA scores for the sample usage events
INSERT INTO qa_scores (
  usage_event_id,
  overall_score,
  comprehension_score,
  resolution_score,
  tone_score,
  compliance_score,
  escalation_needed,
  conversation_intent,
  urgency_level,
  summary,
  risks_detected,
  ai_feedback
) 
SELECT 
  ue.id,
  87,
  90,
  85,
  95,
  80,
  false,
  'Product Demo Request',
  'medium',
  'Cliente interesado en servicios de automatización para fintech. Demo agendada exitosamente.',
  '[]'::jsonb,
  'Excelente manejo de la conversación. El agente identificó correctamente las necesidades del cliente y logró agendar una demo. Buena personalización de la propuesta.'
FROM usage_events ue 
WHERE ue.external_event_id = 'vapi_call_001';

INSERT INTO qa_scores (
  usage_event_id,
  overall_score,
  comprehension_score,
  resolution_score,
  tone_score,
  compliance_score,
  escalation_needed,
  conversation_intent,
  urgency_level,
  summary,
  risks_detected,
  ai_feedback
) 
SELECT 
  ue.id,
  65,
  70,
  60,
  80,
  50,
  true,
  'Property Inquiry',
  'high',
  'Cliente con urgencia alta para compra de propiedad. Escalado correctamente a agente senior.',
  '["Low comprehension of urgency", "Missed escalation opportunity"]'::jsonb,
  'El agente manejó bien la información básica pero tardó en reconocer la urgencia del cliente. Buena decisión de escalar a agente senior.'
FROM usage_events ue 
WHERE ue.external_event_id = 'vapi_call_002';

INSERT INTO qa_scores (
  usage_event_id,
  overall_score,
  comprehension_score,
  resolution_score,
  tone_score,
  compliance_score,
  escalation_needed,
  conversation_intent,
  urgency_level,
  summary,
  risks_detected,
  ai_feedback
) 
SELECT 
  ue.id,
  92,
  95,
  90,
  95,
  85,
  false,
  'Appointment Booking',
  'low',
  'Cita médica agendada exitosamente con todos los datos requeridos.',
  '[]'::jsonb,
  'Excelente ejecución del proceso de agendamiento. El agente siguió todos los protocolos y proporcionó información clara y completa.'
FROM usage_events ue 
WHERE ue.external_event_id = 'vapi_call_003';