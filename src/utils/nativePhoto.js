import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

// Express usa express.json() con límite por defecto de ~100 KB.
// 70 000 caracteres base64 dejan margen para el resto del JSON.
const MAX_BASE64_LENGTH = 70000
const ATTEMPTS = [
  { width: 480, compress: 0.45 },
  { width: 360, compress: 0.32 },
  { width: 280, compress: 0.24 },
]

export async function chooseCompressedPetPhoto(source = 'gallery') {
  let result
  if (source === 'camera') {
    // La cámara sí requiere un permiso explícito de tiempo de ejecución.
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (permission.status !== 'granted') {
      throw new Error('Permiso de cámara denegado. Puedes habilitarlo en Ajustes.')
    }
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    })
  } else {
    // El selector del sistema permite elegir fotos sin pedir acceso general.
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
      selectionLimit: 1,
    })
  }

  if (result.canceled || !result.assets?.length) return null

  const asset = result.assets[0]
  if (!asset?.uri) {
    throw new Error('No se pudo leer la fotografía seleccionada.')
  }

  for (const attempt of ATTEMPTS) {
    const width = Math.min(
      Number(asset.width) > 0 ? Number(asset.width) : attempt.width,
      attempt.width
    )

    // manipulateAsync sigue funcionando en Expo SDK 58, aunque la API
    // contextual nueva es la recomendada para desarrollos futuros.
    const image = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width } }],
      {
        format: ImageManipulator.SaveFormat.JPEG,
        compress: attempt.compress,
        base64: true,
      }
    )

    if (image.base64 && image.base64.length <= MAX_BASE64_LENGTH) {
      return {
        previewUri: image.uri,
        photoData: `data:image/jpeg;base64,${image.base64}`,
      }
    }
  }

  throw new Error(
    'La fotografía sigue siendo demasiado grande. Prueba con otra imagen más simple.'
  )
}
