
import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'

import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'

import OnboardingConfetti
  from '../components/decorative/OnboardingConfetti'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

const LOGO = require('../../assets/logo-petpass.svg')

// Conservamos los tres pasos originales.
const STEPS = [
  {
    background: colors.blue,
    title: 'Bienvenido',
    description:
      'El carnet digital y guía pet-friendly para tu peludo en La Paz',
  },
  {
    background: colors.yellow,
    title: 'Explora La Paz',
    description:
      'Encuentra parques, cafés y veterinarias que aceptan a tu mascota cerca de ti.',
  },
  {
    background: colors.primaryDark,
    title: 'Todo en un solo lugar',
    description:
      'Lleva la cartilla de vacunación y datos de emergencia siempre listos con tu código QR.',
  },
]

function clamp(min, value, max) {
  return Math.min(
    Math.max(value, min),
    max
  )
}

function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0)

  const {
    width,
    height,
  } = useWindowDimensions()

  const compact = height <= 700
  const step = STEPS[currentStep]

  // Tamaños responsivos.
  // El logo y la tarjeta permanecerán como un bloque centrado.
  const logoWidth = clamp(
    145,
    Math.min(width * 0.55, height * 0.24),
    220
  )

  const titleSize = compact
    ? 26
    : clamp(26, width * 0.08, 34)

  const descriptionSize = compact
    ? 13
    : clamp(13, width * 0.037, 15)

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((current) => current + 1)
      return
    }

    navigation.navigate('Login')
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[
        styles.page,
        {
          backgroundColor: step.background,
        },
      ]}
    >
      {/* Decoraciones originales de PetPass */}
      <OnboardingConfetti />

      {/* Permite centrar y desplazarse en pantallas pequeñas */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* LOGO */}
          <View
            style={[
              styles.header,
              {
                marginBottom: compact ? 14 : 24,
              },
            ]}
          >
            <Image
              source={LOGO}
              contentFit="contain"
              style={{
                width: logoWidth,
                height: logoWidth,
              }}
            />
          </View>

          {/* TARJETA E INDICADORES */}
          <View style={styles.mainContent}>

            <View
              style={[
                styles.card,
                compact && styles.cardCompact,
              ]}
            >
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: titleSize,
                    lineHeight: titleSize * 1.15,
                  },
                ]}
              >
                {step.title}
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    fontSize: descriptionSize,
                    lineHeight: descriptionSize * 1.45,
                  },
                  compact && styles.descriptionCompact,
                ]}
              >
                {step.description}
              </Text>

              {currentStep === STEPS.length - 1 ? (
                <Pressable
                  onPress={handleNext}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.startButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.startButtonText}>
                    Empezar
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleNext}
                  accessibilityRole="button"
                  accessibilityLabel="Siguiente paso"
                  style={({ pressed }) => [
                    styles.circleButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.arrow}>
                    ➔
                  </Text>
                </Pressable>
              )}
            </View>

            {/* INDICADORES DE PANTALLAS */}
            <View
              style={[
                styles.dots,
                compact && styles.dotsCompact,
              ]}
            >
              {STEPS.map((_, index) => (
                <Pressable
                  key={index}
                  accessibilityRole="button"
                  accessibilityLabel={`Ir a presentación ${index + 1}`}
                  accessibilityState={{
                    selected: index === currentStep,
                  }}
                  onPress={() => setCurrentStep(index)}
                  style={[
                    styles.dot,
                    index === currentStep &&
                      styles.dotActive,
                  ]}
                />
              ))}
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    overflow: 'hidden',
  },

  scroll: {
    flex: 1,
    width: '100%',
    zIndex: 2,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 22,
  },

  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  mainContent: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    zIndex: 3,
  },

  card: {
    width: '100%',
    paddingTop: 30,
    paddingHorizontal: 22,
    paddingBottom: 26,
    alignItems: 'center',
    borderRadius: 38,
    backgroundColor: colors.background,
    ...shadows.card,
  },

  cardCompact: {
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },

  title: {
    color: colors.heading,
    fontFamily: fonts.displayBold,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },

  description: {
    maxWidth: 280,
    marginTop: 14,
    marginBottom: 26,
    color: colors.text,
    fontFamily: fonts.bodyMedium,
    fontWeight: '500',
    textAlign: 'center',
  },

  descriptionCompact: {
    marginTop: 10,
    marginBottom: 16,
  },

  circleButton: {
    alignSelf: 'flex-end',
    width: 52,
    height: 52,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.orange,
    ...shadows.orange,
  },

  startButton: {
    width: '100%',
    maxWidth: 230,
    minHeight: 50,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.orange,
    ...shadows.orange,
  },

  startButtonText: {
    color: colors.white,
    fontFamily: fonts.displayBold,
    fontSize: 17,
  },

  arrow: {
    marginTop: -2,
    color: colors.white,
    fontSize: 25,
  },

  pressed: {
    opacity: 0.88,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  dots: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  dotsCompact: {
    marginTop: 12,
  },

  dot: {
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },

  dotActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
})

export default OnboardingScreen
