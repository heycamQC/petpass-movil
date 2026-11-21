import {
  useState,
} from 'react'

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Image } from 'expo-image'

import Button
  from '../components/Button'

import FormField
  from '../components/FormField'

import ScreenContainer
  from '../components/ScreenContainer'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

const PUG =
  require('../../assets/pug-avatar.svg')

const INITIAL_FORM = {
  name: 'Toby',
  species: 'Perro',
  breed: 'Pug',
  age: '5 años',
}

function EditPetScreen({
  navigation,
}) {
  const [
    formData,
    setFormData,
  ] = useState(INITIAL_FORM)

  const [
    error,
    setError,
  ] = useState('')

  const handleChange =
    (field) => (value) => {
      setFormData(
        (current) => ({
          ...current,

          [field]: value,
        })
      )

      setError('')
    }

  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.species.trim()
    ) {
      setError(
        'El nombre y la especie son obligatorios.'
      )

      return
    }

    /*
      En C1 solo cerramos el flujo visual.

      El PUT real se conectará
      en la parte funcional.
    */
    navigation.goBack()
  }

  return (
    <ScreenContainer>
      <View style={styles.heading}>
        <Pressable
          onPress={() =>
            navigation.goBack()
          }
          style={({ pressed }) => [
            styles.back,
            pressed &&
              styles.pressed,
          ]}
        >
          <Text
            style={styles.backText}
          >
            ← Volver
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Editar mascota
        </Text>

        <Text
          style={styles.subtitle}
        >
          Actualiza la información
          principal de Toby.
        </Text>
      </View>

      <View style={styles.panel}>
        <View
          style={
            styles.avatar
          }
        >
          <Image
            source={PUG}
            contentFit="cover"
            style={styles.photo}
          />
        </View>

        <View style={styles.form}>
          <FormField
            label="Nombre"
            value={
              formData.name
            }
            onChangeText={
              handleChange(
                'name'
              )
            }
            placeholder="Nombre de tu mascota"
          />

          <FormField
            label="Especie"
            value={
              formData.species
            }
            onChangeText={
              handleChange(
                'species'
              )
            }
            placeholder="Ej. Perro"
          />

          <FormField
            label="Raza"
            value={
              formData.breed
            }
            onChangeText={
              handleChange(
                'breed'
              )
            }
            placeholder="Ej. Pug"
          />

          <FormField
            label="Edad"
            value={
              formData.age
            }
            onChangeText={
              handleChange(
                'age'
              )
            }
            placeholder="Ej. 5 años"
          />

          {!!error && (
            <View
              style={
                styles.error
              }
            >
              <Text
                style={
                  styles.errorText
                }
              >
                {error}
              </Text>
            </View>
          )}

          <View
            style={
              styles.actions
            }
          >
            <Button
              onPress={handleSave}
            >
              Guardar cambios
            </Button>

            <Button
              variant="secondary"
              onPress={() =>
                navigation.goBack()
              }
            >
              Cancelar
            </Button>
          </View>
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 22,
  },

  back: {
    alignSelf: 'flex-start',

    marginBottom: 16,
  },

  backText: {
    color: colors.blueDark,

    fontFamily:
      fonts.bodySemiBold,
    fontSize: 13,
  },

  title: {
    color: colors.text,

    fontFamily:
      fonts.displayBold,
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

    padding: 22,

    borderWidth: 1,
    borderColor:
      colors.border,

    borderRadius: 28,

    backgroundColor:
      colors.white,

    ...shadows.soft,
  },

  avatar: {
    width: 120,
    height: 120,

    marginBottom: 24,

    alignSelf: 'center',

    overflow: 'hidden',

    borderRadius:
      radius.pill,

    backgroundColor:
      colors.blue,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  form: {
    gap: 16,
  },

  error: {
    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,

    backgroundColor:
      colors.dangerBg,
  },

  errorText: {
    color: colors.danger,

    fontFamily:
      fonts.bodyMedium,
    fontSize: 12.5,

    lineHeight: 18,
  },

  actions: {
    marginTop: 4,

    gap: 10,
  },

  pressed: {
    opacity: 0.75,
  },
})

export default EditPetScreen