import { API_URL } from '../config'

const REQUEST_TIMEOUT_MS = 8000

// Contrato EC2: POST /api/alertas -> 201 con JSON; PUT /api/alertas/:id -> 200 con JSON.
// Los GET siguen centralizados en useApi (creado en Parte 2).
export async function sendAlertRequest(path, method, body) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('La solicitud tardó demasiado. Verifica la API y consulta las alertas antes de reintentar.')
    }
    throw new Error('No se pudo conectar con la API. ¿Está encendida?')
  } finally {
    clearTimeout(timeoutId)
  }

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('La API devolvió una respuesta inesperada.')
  }

  if (!response.ok) {
    throw new Error(result?.error || 'La API no pudo completar la operación.')
  }

  return result
}