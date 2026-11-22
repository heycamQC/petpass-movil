import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'

import Button from '../components/Button'
import FormField from '../components/FormField'
import Message from '../components/Message'
import ScreenContainer from '../components/ScreenContainer'
import SelectField from '../components/SelectField'
import { API_URL } from '../config'
import useApi from '../hooks/useApi'
import { sendPetRequest } from '../utils/petApi'
import { getPetPhotoSource } from '../utils/petPhoto'
import { colors, fonts, radius, shadows, spacing } from '../theme'

const SPECIES_OPTIONS = [
  { label: 'Perro', value: 'Perro' },
  { label: 'Gato', value: 'Gato' },
]

const EMPTY_FORM = { name: '', species: '', breed: '', age: '' }

function EditPetScreen({ navigation, route }) {
  const petId = Number(route.params?.id)
  const validId = Number.isInteger(petId) && petId > 0
  const url = validId ? `${API_URL}/api/mascotas/${petId}` : null
  const { data: pet, loading, error } = useApi(url)

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)

  // No mostramos más los datos fijos de Toby: usamos el GET individual.
  useEffect(() => {
    if (!pet) return

    setFormData({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
    })
    setSaveError('')
  }, [pet])

  function changeField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }))
    setSaveError('')
  }

  async function handleSave() {
    if (saving || !pet) return

    const name = formData.name.trim()
    const species = formData.species

    if (!name || !species) {
      setSaveError('El nombre y la especie son obligatorios.')
      return
    }

    if (!['Perro', 'Gato'].includes(species)) {
      setSaveError('Selecciona una especie válida.')
      return
    }

    setSaving(true)
    setSaveError('')

    try {
      // Solo cambiamos estos cuatro campos. El backend conserva los demás.
      await sendPetRequest(`/api/mascotas/${petId}`, 'PUT', {
        name,
        species,
        breed: formData.breed.trim(),
        age: formData.age.trim(),
      })
      navigation.goBack()
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!validId) {
    return (
      <ScreenContainer>
        <Message error="No se recibió un ID válido de mascota." />
        <Button variant="secondary" onPress={() => navigation.goBack()}>
          Volver
        </Button>
      </ScreenContainer>
    )
  }

  if (loading || error || !pet) {
    return (
      <ScreenContainer>
        <Message loading={loading} error={error || (!loading && 'No se encontró la mascota.')} />
        {!loading && (
          <Button variant="secondary" onPress={() => navigation.goBack()}>
            Volver a mascotas
          </Button>
        )}
      </ScreenContainer>
    )
  }

  const photo = getPetPhotoSource(pet.photo)

  return (
    <ScreenContainer>
      <View style={styles.heading}>
        <Text style={styles.title}>Editar mascota</Text>
        <Text style={styles.subtitle}>
          Actualiza la información principal de {pet.name}.
        </Text>
      </View>

      <View style={styles.panel}>
        <View style={styles.avatar}>
          {photo ? (
            <Image source={photo} contentFit="cover" style={styles.photo} />
          ) : (
            <Text style={styles.fallback}>
              {pet.species === 'Gato' ? '🐱' : '🐶'}
            </Text>
          )}
        </View>

        <View style={styles.form}>
          <FormField
            label="Nombre *"
            value={formData.name}
            onChangeText={(value) => changeField('name', value)}
            placeholder="Nombre de tu mascota"
          />

          <SelectField
            label="Especie *"
            value={formData.species}
            options={SPECIES_OPTIONS}
            onChange={(value) => changeField('species', value)}
          />

          <FormField
            label="Raza"
            value={formData.breed}
            onChangeText={(value) => changeField('breed', value)}
            placeholder="Ej. Pug o mestizo"
          />

          <FormField
            label="Edad"
            value={formData.age}
            onChangeText={(value) => changeField('age', value)}
            placeholder="Ej. 5 años"
          />

          {!!saveError && <Text style={styles.error}>{saveError}</Text>}

          <Button disabled={saving} onPress={handleSave}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>

          <Button
            variant="secondary"
            disabled={saving}
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
  heading: { marginBottom: 22 },
  title: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  avatar: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.blue,
  },
  photo: { width: '100%', height: '100%' },
  fallback: { fontSize: 48 },
  form: { gap: spacing.md },
  error: {
    padding: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerBg,
    color: colors.danger,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
})

export default EditPetScreen