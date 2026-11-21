import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import ScreenContainer from '../components/ScreenContainer'

import {
  colors,
  fonts,
  radius,
  shadows,
  spacing,
} from '../theme'

function PawDecoration() {
  return (
    <View style={styles.paw}>
      <View style={[styles.pawToe, styles.toe1]} />
      <View style={[styles.pawToe, styles.toe2]} />
      <View style={[styles.pawToe, styles.toe3]} />
      <View style={[styles.pawToe, styles.toe4]} />

      <View style={styles.pawPad} />
    </View>
  )
}

function HomeScreen({ navigation }) {
  return (
    <ScreenContainer>
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>
          Hola, Usuario!
        </Text>

        <PawDecoration />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Mis Mascotas
        </Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            🐾
          </Text>

          <Text style={styles.emptyTitle}>
            Tus mascotas en PetPass
          </Text>

          <Text style={styles.emptyText}>
            Aquí podrás consultar rápidamente
            sus perfiles, carnet digital e
            historial.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            navigation.navigate('Mascotas')
          }
          style={({ pressed }) => [
            styles.petAction,
            pressed && styles.petActionPressed,
          ]}
        >
          <View style={styles.petActionIcon}>
            <Text style={styles.plus}>
              +
            </Text>
          </View>

          <View style={styles.petActionText}>
            <Text style={styles.petActionTitle}>
              Mis mascotas
            </Text>

            <Text style={styles.petActionSubtitle}>
              Consulta sus perfiles y carnet
            </Text>
          </View>
        </Pressable>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  welcome: {
    position: 'relative',

    minHeight: 100,

    marginBottom: 28,
    padding: 24,

    justifyContent: 'center',

    overflow: 'hidden',

    borderRadius: 28,

    backgroundColor: '#EFEFEA',

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },

  welcomeTitle: {
    maxWidth: '70%',

    color: '#333333',

    fontFamily: fonts.displayBold,
    fontSize: 28,

    lineHeight: 34,

    zIndex: 2,
  },

  paw: {
    position: 'absolute',

    right: 0,
    bottom: -8,

    width: 125,
    height: 115,

    opacity: 0.85,
  },

  pawToe: {
    position: 'absolute',

    width: 27,
    height: 27,

    borderRadius: radius.pill,

    backgroundColor: '#C2C095',
  },

  toe1: {
    left: 2,
    top: 29,
  },

  toe2: {
    left: 32,
    top: 5,
  },

  toe3: {
    right: 27,
    top: 15,
  },

  toe4: {
    right: 0,
    top: 42,
  },

  pawPad: {
    position: 'absolute',

    left: 31,
    bottom: 10,

    width: 68,
    height: 47,

    borderRadius: 30,

    backgroundColor: '#C2C095',

    transform: [
      {
        rotate: '-4deg',
      },
    ],
  },

  section: {
    gap: spacing.md,
  },

  sectionTitle: {
    color: '#E16E42',

    fontFamily: fonts.displayBold,
    fontSize: 22,
  },

  emptyCard: {
    width: '100%',

    alignItems: 'center',

    gap: 10,

    paddingHorizontal: 20,
    paddingVertical: 26,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderRadius: 28,

    backgroundColor: colors.surface,
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    color: '#333333',

    fontFamily: fonts.displayBold,
    fontSize: 19,

    textAlign: 'center',
  },

  emptyText: {
    maxWidth: 320,

    color: '#6B7280',

    fontFamily: fonts.body,
    fontSize: 13,

    lineHeight: 20,
    textAlign: 'center',
  },

  petAction: {
    width: '100%',

    minHeight: 76,

    paddingHorizontal: 20,
    paddingVertical: 16,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 16,

    borderRadius: 20,

    backgroundColor: '#E16E42',

    ...shadows.orange,
  },

  petActionPressed: {
    transform: [
      {
        scale: 0.98,
      },
    ],

    opacity: 0.92,
  },

  petActionIcon: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    flexShrink: 0,

    borderRadius: radius.pill,

    backgroundColor: colors.white,
  },

  plus: {
    marginTop: -2,

    color: '#E16E42',

    fontFamily: fonts.bodyBold,
    fontSize: 29,

    lineHeight: 32,
  },

  petActionText: {
    flex: 1,
  },

  petActionTitle: {
    marginBottom: 2,

    color: colors.white,

    fontFamily: fonts.bodyBold,
    fontSize: 15,

    lineHeight: 19,
  },

  petActionSubtitle: {
    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 12,

    opacity: 0.95,
  },
})

export default HomeScreen