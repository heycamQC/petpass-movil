
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'

import Button from '../components/Button'
import FormField from '../components/FormField'
import PetAgeField from '../components/PetAgeField'
import ScreenContainer from '../components/ScreenContainer'
import SelectField from '../components/SelectField'

import { sendPetRequest } from '../utils/petApi'
import { chooseCompressedPetPhoto } from '../utils/nativePhoto'

import {
  colors,
  fonts,
  radius,
  shadows,
  spacing,
} from '../theme'

const EMPTY_FORM = {
  name: '',
  species: '',
  breed: '',
  age: '',
}

const SPECIES_OPTIONS = [
  { label: 'Perro', value: 'Perro' },
  { label: 'Gato', value: 'Gato' },
]

function RegisterPetScreen({ navigation }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [choosingPhoto, setChoosingPhoto] = useState(false)
  const [photoData, setPhotoData] = useState(null)
  const [previewUri, setPreviewUri] = useState(null)

  async function handleSelectPhoto(source = 'gallery') {
    if (saving || choosingPhoto) return

    setChoosingPhoto(true)
    setError('')

    try {
      const selected = await chooseCompressedPetPhoto(source)

      // Si cancela, conservamos la fotografía anterior.
      if (!selected) return

      setPhotoData(selected.photoData)
      setPreviewUri(selected.previewUri)
    } catch (err) {
      setError(
        err.message ||
        'No se pudo seleccionar la foto.'
      )
    } finally {
      setChoosingPhoto(false)
    }
  }

  function changeField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    setError('')
  }

  async function handleSave() {
    if (saving || choosingPhoto) return

    const name = formData.name.trim()
    const species = formData.species

    if (!name || !species) {
      setError(
        'Ingresa al menos el nombre y la especie.'
      )
      return
    }

    if (!['Perro', 'Gato'].includes(species)) {
      setError(
        'Selecciona una especie válida.'
      )
      return
    }

    setSaving(true)
    setError('')

    try {
      // El backend sigue recibiendo age como texto:
      // "2 años", "8 meses" o "" si no se seleccionó.
      await sendPetRequest(
        '/api/mascotas',
        'POST',
        {
          name,
          species,
          breed: formData.breed.trim(),
          age: formData.age.trim(),
          photo: photoData,
          status: 'normal',
        }
      )

      // PetsScreen volverá a consultar la API
      // al recuperar el foco.
      navigation.goBack()
    } catch (err) {
      setError(
        err.message ||
        'No se pudo registrar la mascota.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.heading}>
        <Text style={styles.title}>
          Registrar mascota
        </Text>

        <Text style={styles.subtitle}>
          Completa los datos para crear su
          identidad digital en PetPass.
        </Text>
      </View>

      <View style={styles.panel}>
        {/* Fotografía de mascota */}
        <View style={styles.avatar}>
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              contentFit="cover"
              style={styles.previewPhoto}
            />
          ) : (
            <Text style={styles.paw}>🐾</Text>
          )}

          <Text style={styles.photoHint}>
            {previewUri
              ? 'Fotografía lista para guardar'
              : 'Puedes añadir una foto desde la galería'}
          </Text>

          <Button
            disabled={saving || choosingPhoto}
            onPress={() => handleSelectPhoto('gallery')}
            variant="secondary"
          >
            {choosingPhoto
              ? 'Procesando foto...'
              : previewUri
                ? 'Cambiar desde galería'
                : 'Elegir desde galería'}
          </Button>

          <Button
            disabled={saving || choosingPhoto}
            onPress={() => handleSelectPhoto('camera')}
            variant="secondary"
          >
            Tomar foto con cámara
          </Button>

          {!!previewUri && (
            <Button
              disabled={saving || choosingPhoto}
              variant="secondary"
              onPress={() => {
                setPreviewUri(null)
                setPhotoData(null)
              }}
            >
              Quitar fotografía
            </Button>
          )}
        </View>

        {/* Datos de la mascota */}
        <View style={styles.form}>
          <FormField
            label="Nombre *"
            value={formData.name}
            onChangeText={(value) =>
              changeField('name', value)
            }
            placeholder="Nombre de tu mascota"
            error={
              !formData.name.trim() && error
                ? 'Campo obligatorio'
                : ''
            }
          />

          <SelectField
            label="Especie *"
            value={formData.species}
            options={SPECIES_OPTIONS}
            placeholder="Selecciona Perro o Gato"
            onChange={(value) =>
              changeField('species', value)
            }
          />

          <FormField
            label="Raza"
            value={formData.breed}
            onChangeText={(value) =>
              changeField('breed', value)
            }
            placeholder="Ej. Pug o mestizo"
          />

          {/* NUEVO: edad con selectores */}
          <PetAgeField
            value={formData.age}
            disabled={saving || choosingPhoto}
            onChange={(value) =>
              changeField('age', value)
            }
          />

          {!!error && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}

          <Button
            disabled={saving || choosingPhoto}
            onPress={handleSave}
          >
            {saving
              ? 'Guardando...'
              : 'Guardar mascota'}
          </Button>

          <Button
            variant="secondary"
            disabled={saving || choosingPhoto}
            onPress={() => navigation.goBack()}
          >
            Cancelar
          </Button>
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 22,
  },

  title: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 28,
  },

  subtitle: {
    marginTop: 8,
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },

  panel: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    ...shadows.soft,
  },

  avatar: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    padding: spacing.md,
    gap: spacing.xs,
  },

  paw: {
    fontSize: 48,
  },

  previewPhoto: {
    width: 132,
    height: 132,
    borderRadius: 66,
  },

  photoHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },

  form: {
    gap: spacing.md,
  },

  error: {
    padding: 12,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.sm,
    color: colors.danger,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
})

export default RegisterPetScreen
