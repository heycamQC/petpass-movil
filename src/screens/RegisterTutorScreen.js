
import { useState } from 'react'

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Button from '../components/Button'
import FormField from '../components/FormField'
import ScreenContainer from '../components/ScreenContainer'

import {
  colors,
  fonts,
  radius,
  shadows,
  spacing,
} from '../theme'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function RegisterTutorScreen({ navigation }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [validated, setValidated] = useState(false)

  function change(field, value) {
    setFormData((old) => ({
      ...old,
      [field]: value,
    }))

    setError('')
    setValidated(false)
  }

  function handleSubmit() {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError('Por favor completa los campos obligatorios.')
      return
    }

    if (
      confirmPassword &&
      password !== confirmPassword
    ) {
      setError('Las contraseñas no coinciden.')
      return
    }

    // Solo validacion local.
    // No crea cuentas ni guarda contrasenas.
    setValidated(true)
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenContainer
        contentStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>
            PetPass
          </Text>

          <Text style={styles.title}>
            Registro de Tutor
          </Text>

          <Text style={styles.subtitle}>
            Crea tu perfil para gestionar la vida de tu mascota
          </Text>
        </View>

        <View style={styles.card}>

          <FormField
            label="Nombre completo *"
            value={formData.name}
            placeholder="Ej. Ana Pérez"
            onChangeText={(v) => change('name', v)}
          />

          <FormField
            label="Correo electrónico *"
            value={formData.email}
            keyboardType="email-address"
            placeholder="ejemplo@correo.com"
            onChangeText={(v) => change('email', v)}
          />

          <FormField
            label="Teléfono / WhatsApp"
            value={formData.phone}
            keyboardType="phone-pad"
            placeholder="+591 ..."
            onChangeText={(v) => change('phone', v)}
          />

          <FormField
            label="Contraseña *"
            value={formData.password}
            secureTextEntry
            placeholder="Contraseña"
            onChangeText={(v) => change('password', v)}
          />

          <FormField
            label="Confirmar contraseña"
            value={formData.confirmPassword}
            secureTextEntry
            placeholder="Repite tu contraseña"
            onChangeText={(v) => change('confirmPassword', v)}
          />

          {!!error && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}

          <Button onPress={handleSubmit}>
            Registrarme
          </Button>

          {validated && (
            <View style={styles.notice}>

              <Text style={styles.noticeText}>
                Formulario validado. Esta versión no crea
                cuentas reales ni guarda contraseñas en
                el servidor.
              </Text>

              <Button
                variant="secondary"
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  })
                }
              >
                Continuar a PetPass
              </Button>

            </View>
          )}

          <Pressable
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.back}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </Pressable>

        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({

  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },

  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },

  brand: {
    color: colors.primaryDark,
    fontFamily: fonts.displayBold,
    fontSize: 30,
  },

  title: {
    color: colors.textDark,
    fontFamily: fonts.displayBold,
    fontSize: 27,
    textAlign: 'center',
  },

  subtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: 'center',
  },

  card: {
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: 20,
    backgroundColor: colors.accent,
    ...shadows.soft,
  },

  error: {
    color: colors.danger,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  notice: {
    padding: 12,
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
  },

  noticeText: {
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 19,
  },

  back: {
    color: colors.textDark,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    paddingVertical: 8,
  },

})

export default RegisterTutorScreen
