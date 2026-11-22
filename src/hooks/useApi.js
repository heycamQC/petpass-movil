import { useCallback, useEffect, useState } from 'react'

// Conservamos el timeout y la cancelación que dejó Soledad en Parte 2.
const TIMEOUT_MS = 5000

// refetch() vuelve a ejecutar el mismo GET sin cambiar su URL.
function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState('')
  const [refreshCount, setRefreshCount] = useState(0)

  const refetch = useCallback(() => {
    setRefreshCount((current) => current + 1)
  }, [])

  useEffect(() => {
    let active = true
    let timeoutId
    const controller = new AbortController()

    if (!url) {
      setData(null)
      setLoading(false)
      setError('')

      return () => {
        active = false
        controller.abort()
      }
    }

    async function load() {
      setLoading(true)
      setError('')
      setData(null)

      try {
        const request = async () => {
          const response = await fetch(url, { signal: controller.signal })
          const result = await response.json()
          return { response, result }
        }

        const timeout = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            controller.abort()
            reject(new Error('TIMEOUT'))
          }, TIMEOUT_MS)
        })

        const { response, result } = await Promise.race([request(), timeout])

        if (!active) return

        if (response.ok) {
          setData(result)
        } else {
          setError(result.error || 'Ocurrió un error al consultar la API')
        }
      } catch {
        if (active) {
          setError('No se pudo conectar con la API. ¿Está encendida?')
        }
      } finally {
        clearTimeout(timeoutId)

        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [url, refreshCount])

  return { data, loading, error, refetch }
}

export default useApi