import { useState, useEffect } from 'react'
import { supabase, UsageEvent } from '../lib/supabase'

export const useUsageEvents = () => {
  const [usageEvents, setUsageEvents] = useState<UsageEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsageEvents()
  }, [])

  const fetchUsageEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('usage_events')
        .select('*')
        .order('call_started_at', { ascending: false })

      if (error) throw error
      setUsageEvents(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { usageEvents, loading, error, refetch: fetchUsageEvents }
}