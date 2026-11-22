
import { API_URL } from '../config'

// Solo POST/PUT del historial médico. GET se mantiene en useApi.
const TIMEOUT_MS = 8000

export async function sendMedicalRequest(path, method, payload) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('La API tardó demasiado en responder. Intenta nuevamente.')
    }
    throw new Error('No se pudo conectar con la API. ¿Está encendida?')
  } finally {
    clearTimeout(timeoutId)
  }

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error('La API respondió con un formato inesperado.')
  }

  if (!response.ok) {
    throw new Error(result?.error || 'No se pudo guardar el registro médico.')
  }

  return result
}
