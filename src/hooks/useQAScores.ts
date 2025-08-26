import { useState, useEffect } from 'react'
import { supabase, QAScore, UsageEvent } from '../lib/supabase'

export interface ConversationWithQA extends UsageEvent {
  qa_score?: QAScore
}

export const useQAScores = () => {
  const [conversations, setConversations] = useState<ConversationWithQA[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConversationsWithQA()
  }, [])

  const fetchConversationsWithQA = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('usage_events')
        .select(`
          *,
          qa_score:qa_scores(*)
        `)
        .order('call_started_at', { ascending: false })

      if (error) throw error
      
      const conversationsWithQA = (data || []).map(event => ({
        ...event,
        qa_score: Array.isArray(event.qa_score) ? event.qa_score[0] : event.qa_score
      }))
      
      setConversations(conversationsWithQA)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { conversations, loading, error, refetch: fetchConversationsWithQA }
}