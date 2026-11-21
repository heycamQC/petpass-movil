
import { useEffect, useState } from 'react'

function useApi(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let timeoutId

    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError('')
      setData(null)

      try {
        // Tiempo máximo de espera: 10 segundos
        const timeout = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            controller.abort()
            reject(new Error('Tiempo de espera agotado'))
          }, 10000)
        })

        // Consultar la API con tiempo límite
        const request = async () => {
          const response = await fetch(url, {
            signal: controller.signal,
          })

          const result = await response.json()
          return { response, result }
        }

        const { response, result } = await Promise.race([
          request(),
          timeout,
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
