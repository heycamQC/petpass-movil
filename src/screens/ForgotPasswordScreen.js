
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

function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function changeEmail(value) {
    setEmail(value)
    setSent(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenContainer contentStyle={styles.container}>

        <View style={styles.card}>

          <Text style={styles.brand}>
            PetPass
          </Text>

          <Text style={styles.title}>
            ¿Olvidó su contraseña?
          </Text>

          <Text style={styles.description}>
            Escribe tu dirección de correo electrónico
            para preparar la solicitud de
            restablecimiento de contraseña.
          </Text>

          <FormField
            label="Correo electrónico"
            value={email}
            placeholder="Correo"
            keyboardType="email-address"
            onChangeText={changeEmail}
          />

          <Button
            disabled={!email.trim()}
            onPress={() => setSent(true)}
          >
            Continuar
          </Button>

          {sent && (
            <Text style={styles.success}>
              Solicitud preparada. El envío real se
              conectará al backend. No se ha enviado
              ningún correo.
            </Text>
          )}

          <Pressable
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.back}>
              Volver al LOGIN
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

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingBottom: 80,
  },

  card: {
    backgroundColor: colors.accent,
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    ...shadows.card,
  },

  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 30,
    color: colors.textDark,
    textAlign: 'center',
  },

  title: {
    fontFamily: fonts.displayBold,
    color: colors.textDark,
    fontSize: 25,
    textAlign: 'center',
  },

  description: {
    fontFamily: fonts.body,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },

  success: {
    fontFamily: fonts.bodyMedium,
    color: colors.success,
    fontSize: 13,
    lineHeight: 20,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 14,
  },

  back: {
    textAlign: 'center',
    color: colors.textDark,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    textDecorationLine: 'underline',
    paddingVertical: 8,
  },

})

export default ForgotPasswordScreen
