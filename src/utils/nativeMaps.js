import { Linking } from 'react-native'

// EC2 NO guarda latitude/longitude. `position` son porcentajes del SVG.
// Por tanto, Maps realiza una BÚSQUEDA POR TEXTO, no ubicación exacta.

export function getPlaceMapsSearchUrl(place) {
  if (!place) return null

  const parts = [place.name, place.address]
    .map((value) =>
      typeof value === 'string' ? value.trim() : ''
    )
    .filter(Boolean)

  // No buscar si el lugar no tiene información.
  if (!parts.length) return null

  // Agregar la ciudad como contexto de búsqueda.
  parts.push('La Paz, Bolivia')

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(', '))}`
}


export async function openPlaceInMaps(place) {
  const url = getPlaceMapsSearchUrl(place)
  if (!url) throw new Error('Este lugar no tiene nombre ni dirección para buscar.')
  try {
    await Linking.openURL(url)
  } catch {
    throw new Error('No se pudo abrir Google Maps. Comprueba tu conexión.')
  }
}
