import { API_URL } from '../config'

// POST y PUT devuelven JSON. DELETE /api/mascotas/:id devuelve 204 sin JSON.
export async function sendPetRequest(path, method, body) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con la API. ¿Está encendida?')
  }

  // En EC2 DELETE correcto = HTTP 204 (No Content).
  if (response.status === 204 && response.ok) {
    return null
  }

  let result

  try {
    result = await response.json()
  } catch {
    throw new Error('La API respondió con un formato inesperado.')
  }

  if (!response.ok) {
    throw new Error(result?.error || 'La API no pudo completar la operación.')
  }

  return result
}