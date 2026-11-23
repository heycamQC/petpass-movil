import * as Location from 'expo-location'

// GPS solo bajo acción del usuario. Nunca se sube a SQLite ni a alertas.
export async function getMyCurrentLocation() {
  const permission = await Location.requestForegroundPermissionsAsync()
  if (permission.status !== 'granted') {
    throw new Error('Permiso de ubicación denegado. Puedes habilitarlo en Ajustes.')
  }

  try {
    const result = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })
    const { latitude, longitude } = result.coords || {}
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error('El GPS no devolvió coordenadas válidas.')
    }
    return { latitude, longitude }
  } catch (error) {
    throw new Error(error.message || 'No se pudo obtener la ubicación actual.')
  }
}
