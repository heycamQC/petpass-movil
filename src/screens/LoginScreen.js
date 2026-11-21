import { useState } from 'react'

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

import Button from '../components/Button'
import FormField from '../components/FormField'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')

  const { height } = useWindowDimensions()

  const compact = height < 700

  const handleLogin = () => {
    navigation.replace('Home')
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.page}
    >
      <View style={styles.yellowBlob} />
      <View style={styles.orangeBlob} />
      <View style={styles.blueBlob} />

      <View
        style={[
          styles.wrapper,
          compact && styles.wrapperCompact,
        ]}
      >
        <View style={styles.brand}>
          <Text
            style={[
              styles.brandText,
              compact && styles.brandTextCompact,
            ]}
          >
            PetPass
          </Text>
        </View>

        <View
          style={[
            styles.box,
            compact && styles.boxCompact,
          ]}
        >
          <Text style={styles.title}>
            LOGIN
          </Text>

          <View style={styles.form}>
            <FormField
              value={email}
              onChangeText={setEmail}
              placeholder="Correo"
              keyboardType="email-address"
            />

            <FormField
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              secureTextEntry
            />

            <Pressable
              disabled
              style={styles.textAction}
            >
              <Text style={styles.textActionText}>
                Restablecer contraseña
              </Text>
            </Pressable>

            <Button onPress={handleLogin}>
              Iniciar sesión
            </Button>

            <Pressable
              disabled
              style={styles.registerAction}
            >
              <Text style={styles.registerText}>
                ¿Aún no tienes cuenta? Regístrate
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,

    paddingHorizontal: 24,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    backgroundColor: colors.backgroundSoft,
  },

  yellowBlob: {
    position: 'absolute',

    top: -85,
    left: -65,

    width: 280,
    height: 280,

    borderTopLeftRadius: 140,
    borderTopRightRadius: 120,
    borderBottomLeftRadius: 110,
    borderBottomRightRadius: 150,

    backgroundColor: colors.yellowSoft,

    transform: [
      {
        rotate: '-12deg',
      },
    ],
  },

  orangeBlob: {
    position: 'absolute',

    top: 180,
    right: -70,

    width: 270,
    height: 260,

    borderTopLeftRadius: 155,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 150,

    backgroundColor: colors.orangeSoft,

    transform: [
      {
        rotate: '18deg',
      },
    ],
  },

  blueBlob: {
    position: 'absolute',

    bottom: -110,
    left: -65,

    width: 320,
    height: 390,

    borderTopLeftRadius: 180,
    borderTopRightRadius: 150,
    borderBottomLeftRadius: 130,
    borderBottomRightRadius: 190,

    backgroundColor: colors.blueSoft,

    transform: [
      {
        rotate: '-8deg',
      },
    ],
  },

  wrapper: {
    width: '100%',
    maxWidth: 360,

    alignItems: 'center',

    zIndex: 2,
  },

  wrapperCompact: {
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  brand: {
    marginBottom: 24,

    alignItems: 'center',
  },

  brandText: {
    color: colors.brandDark,

    fontFamily: fonts.displayExtraBold,
    fontSize: 38,

    lineHeight: 44,

    letterSpacing: 0.5,
  },

  brandTextCompact: {
    fontSize: 33,
  },

  box: {
    width: '100%',

    paddingHorizontal: 28,
    paddingVertical: 32,

    borderRadius: 36,

    backgroundColor: colors.darkCard,

    ...shadows.card,
  },

  boxCompact: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  title: {
    marginBottom: 20,

    color: colors.white,

    fontFamily: fonts.displayExtraBold,
    fontSize: 26,

    letterSpacing: 2,

    textAlign: 'center',
  },

  form: {
    gap: 14,
  },

  textAction: {
    alignSelf: 'center',

    paddingVertical: 4,
  },

  textActionText: {
    color: '#e0e0e0',

    fontFamily: fonts.body,
    fontSize: 12,
  },

  registerAction: {
    alignSelf: 'center',

    marginTop: 4,
  },

  registerText: {
    color: '#e0e0e0',

    fontFamily: fonts.body,
    fontSize: 13,

    textAlign: 'center',
  },
})

export default LoginScreen