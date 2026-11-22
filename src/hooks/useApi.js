
import { useEffect, useState } from 'react'

// Tiempo máximo de espera: 5 segundos
const TIMEOUT_MS = 5000

// GET reutilizable: admite URL null cuando falta un ID.
function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState('')

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
        // Consulta real a la API
        const request = async () => {
          const response = await fetch(url, {
            signal: controller.signal
          })

          const result = await response.json()
          return { response, result }
        }

        // Evita esperar indefinidamente
        const timeout = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            controller.abort()
            reject(new Error('TIMEOUT'))
          }, TIMEOUT_MS)
        })

        const { response, result } = await Promise.race([
          request(),
          timeout
        ])

        if (!active) return

        if (response.ok) {
          setData(result)
        } else {
          setError(
            result.error ||
            'Ocurrió un error al consultar la API'
          )
        }

      } catch {
        if (active) {
          setError(
            'No se pudo conectar con la API. ¿Está encendida?'
          )
        }

      } finally {
        clearTimeout(timeoutId)

        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
      clearTimeout(timeoutId)
      controller.abort()
    }

  }, [url])

  return { data, loading, error }
}

export default useApi
