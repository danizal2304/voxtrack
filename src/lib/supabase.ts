import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on the schema
export interface UsageEvent {
  id: string
  workspace_id: string
  provider: string
  external_event_id: string
  agent_id: string
  client_name: string
  call_duration_seconds: number
  call_cost: number
  call_started_at: string
  call_ended_at: string
  phone_number?: string
  call_status: string
  recording_url?: string
  transcript?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface QAScore {
  id: string
  usage_event_id: string
  overall_score: number
  comprehension_score: number
  resolution_score: number
  tone_score: number
  compliance_score: number
  escalation_needed: boolean
  conversation_intent: string
  urgency_level: string
  summary?: string
  risks_detected: string[]
  ai_feedback?: string
  human_reviewed: boolean
  reviewer_notes?: string
  created_at: string
  updated_at: string
}