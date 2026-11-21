import { useState } from 'react'

import {
  Pressable,
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
  const [currentStep, setCurrentStep] =
    useState(0)

  const {
    width,
    height,
  } = useWindowDimensions()

  const compact = height <= 700

  const step = STEPS[currentStep]

  // Valores trasladados del responsive web original
  const headerMarginTop = compact
    ? 20
    : clamp(
        30,
        height * 0.08,
        70
      )

  const logoWidth = compact
    ? 180
    : clamp(
        190,
        width * 0.65,
        260
      )

  const contentMarginBottom = compact
    ? 12
    : clamp(
        20,
        height * 0.07,
        70
      )

  const titleSize = compact
    ? 26
    : clamp(
        26,
        width * 0.08,
        34
      )

  const descriptionSize = compact
    ? 13
    : clamp(
        13,
        width * 0.037,
        15
      )

  const handleNext = () => {
    if (
      currentStep <
      STEPS.length - 1
    ) {
      setCurrentStep(
        (current) => current + 1
      )

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
          backgroundColor:
            step.background,
        },
      ]}
    >
      <OnboardingConfetti />

      <View
        style={[
          styles.header,
          {
            marginTop:
              headerMarginTop,
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

      <View
        style={[
          styles.mainContent,
          {
            marginBottom:
              contentMarginBottom,
          },
        ]}
      >
        <View
          style={[
            styles.card,
            compact &&
              styles.cardCompact,
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                fontSize: titleSize,
                lineHeight:
                  titleSize * 1.15,
              },
            ]}
          >
            {step.title}
          </Text>

          <Text
            style={[
              styles.description,
              {
                fontSize:
                  descriptionSize,
                lineHeight:
                  descriptionSize *
                  1.45,
              },
              compact &&
                styles.descriptionCompact,
            ]}
          >
            {step.description}
          </Text>

          {currentStep ===
          STEPS.length - 1 ? (
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.startButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <Text
                style={
                  styles.startButtonText
                }
              >
                Empezar
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNext}
              accessibilityLabel="Siguiente paso"
              style={({ pressed }) => [
                styles.circleButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <Text style={styles.arrow}>
                ➔
              </Text>
            </Pressable>
          )}
        </View>

        <View
          style={[
            styles.dots,
            compact &&
              styles.dotsCompact,
          ]}
        >
          {STEPS.map(
            (_, index) => {
              const active =
                index ===
                currentStep

              return (
                <Pressable
                  key={index}
                  onPress={() =>
                    setCurrentStep(
                      index
                    )
                  }
                  style={[
                    styles.dot,
                    active &&
                      styles.dotActive,
                  ]}
                />
              )
            }
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,

    paddingHorizontal: 16,

    alignItems: 'center',
    justifyContent: 'space-between',

    overflow: 'hidden',
  },

  header: {
    position: 'relative',

    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 2,
  },

  mainContent: {
    position: 'relative',

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

    backgroundColor:
      colors.background,

    ...shadows.card,
  },

  cardCompact: {
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },

  title: {
    color: colors.heading,

    fontFamily:
      fonts.displayBold,

    fontWeight: '700',

    letterSpacing: -0.5,

    textAlign: 'center',
  },

  description: {
    maxWidth: 280,

    marginTop: 14,
    marginBottom: 26,

    color: colors.text,

    fontFamily:
      fonts.bodyMedium,

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

    backgroundColor:
      colors.orange,

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

    backgroundColor:
      colors.orange,

    ...shadows.orange,
  },

  startButtonText: {
    color: colors.white,

    fontFamily:
      fonts.displayBold,

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
    borderColor:
      'rgba(255,255,255,0.95)',

    borderRadius: radius.pill,

    backgroundColor:
      'transparent',
  },

  dotActive: {
    backgroundColor:
      colors.white,

    borderColor:
      colors.white,
  },
})

export default OnboardingScreen