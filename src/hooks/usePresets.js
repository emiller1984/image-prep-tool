import { useState, useEffect } from 'react'
import { fetchPresets } from '../services/presetService'
import defaultPresets from '../config/presets'

export default function usePresets() {
  const [presets, setPresets] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchPresets()
      .then(items => {
        if (cancelled) return
        setPresets(items && items.length > 0 ? items : defaultPresets)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        console.error('Failed to fetch presets:', err)
        setError(err)
        setPresets(defaultPresets)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { presets, loading, error }
}
