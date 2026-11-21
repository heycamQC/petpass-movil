import {
  Alert,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'

import { Image } from 'expo-image'

import Button from '../components/Button'
import ScreenContainer from '../components/ScreenContainer'

import {
  colors,
  fonts,
  radius,
  spacing,
} from '../theme'

const PUG =
  require('../../assets/pug-avatar.svg')

const PREVIEW_PET = {
  id: 1,
  name: 'Toby',
  photo: PUG,
  species: 'Perro',
  breed: 'Pug',
  age: '5 años',
}

function QrPlaceholder() {
  const size = 11

  return (
    <View style={styles.qrFrame}>
      <View style={styles.qrGrid}>
        {Array.from({
          length: size * size,
        }).map((_, index) => {
          const row =
            Math.floor(index / size)

          const column =
            index % size

          const filled =
            (
              row * 3 +
              column * 5 +
              row * column
            ) % 7 < 3

          return (
            <View
              key={index}
              style={[
                styles.qrPixel,
                {
                  backgroundColor:
                    filled
                      ? colors.textDark
                      : colors.white,
                },
              ]}
            />
          )
        })}
      </View>

      <View style={styles.qrLabel}>
        <Text style={styles.qrLabelText}>
          QR
        </Text>
      </View>
    </View>
  )
}

function InfoBox({
  label,
  value,
  fullWidth = false,
}) {
  return (
    <View
      style={[
        styles.infoBox,
        fullWidth && styles.infoBoxFull,
      ]}
    >
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  )
}

function DigitalCardScreen({
  navigation,
}) {
  const { width } =
    useWindowDimensions()

  const mobile =
    width <= 440

  const pet = PREVIEW_PET

  return (
    <ScreenContainer>
      <View style={styles.heading}>
        <Text style={styles.pageTitle}>
          Carnet digital
        </Text>

        <Text style={styles.pageSubtitle}>
          Identificación digital de tu mascota.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.brand}>
          <Text style={styles.brandName}>
            PetPass
          </Text>

          <Text style={styles.brandSmall}>
            Identidad de mascota
          </Text>
        </View>

        <View
          style={[
            styles.petSection,
            mobile &&
              styles.petSectionMobile,
          ]}
        >
          <View style={styles.photoWrapper}>
            <Image
              source={pet.photo}
              contentFit="cover"
              style={styles.photo}
            />
          </View>

          <View
            style={[
              styles.petText,
              mobile &&
                styles.petTextMobile,
            ]}
          >
            <Text style={styles.petName}>
              {pet.name}
            </Text>

            <Text style={styles.petMeta}>
              {pet.species} · {pet.breed}
            </Text>

            <Text style={styles.petMeta}>
              {pet.age}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.infoGrid,
            mobile &&
              styles.infoGridMobile,
          ]}
        >
          <InfoBox
            label="Tutor"
            value="Usuario PetPass"
            fullWidth={mobile}
          />

          <InfoBox
            label="ID PetPass"
            value={`PP-${pet.id}`}
            fullWidth={mobile}
          />
        </View>

        <View style={styles.qrSection}>
          <QrPlaceholder />

          <Text style={styles.qrText}>
            Escanea para ver el perfil público
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          onPress={() =>
            navigation.navigate(
              'PerfilPublico'
            )
          }
        >
          Ver perfil público
        </Button>

        <Button
          variant="secondary"
          onPress={() =>
            Alert.alert(
              'Carnet digital',
              'La descarga del carnet se integrará en una siguiente etapa.'
            )
          }
        >
          Descargar carnet
        </Button>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 24,
  },

  pageTitle: {
    color: colors.text,

    fontFamily: fonts.displayBold,
    fontSize: 28,

    lineHeight: 34,
  },

  pageSubtitle: {
    marginTop: 6,

    color: colors.muted,

    fontFamily: fonts.body,
    fontSize: 14,

    lineHeight: 20,
  },

  card: {
    width: '100%',

    padding: 24,

    overflow: 'hidden',

    borderRadius: 36,

    backgroundColor: colors.blue,
  },

  brand: {
    marginBottom: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: spacing.md,
  },

  brandName: {
    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 22,
  },

  brandSmall: {
    flexShrink: 1,

    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 11,

    textAlign: 'right',
  },

  petSection: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 18,
  },

  petSectionMobile: {
    flexDirection: 'column',
  },

  photoWrapper: {
    width: 100,
    height: 100,

    flexShrink: 0,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    borderRadius: radius.pill,

    backgroundColor: colors.accent,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  petText: {
    flex: 1,
  },

  petTextMobile: {
    alignItems: 'center',
  },

  petName: {
    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 26,

    lineHeight: 32,
  },

  petMeta: {
    marginTop: 4,

    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 13,

    lineHeight: 18,
  },

  infoGrid: {
    marginTop: 22,

    flexDirection: 'row',

    gap: 12,
  },

  infoGridMobile: {
    flexDirection: 'column',
  },

  infoBox: {
    flex: 1,

    gap: 3,

    padding: 12,

    borderRadius: 18,

    backgroundColor:
      'rgba(255,255,255,0.85)',
  },

  infoBoxFull: {
    width: '100%',
    flex: 0,
  },

  infoLabel: {
    color: colors.muted,

    fontFamily: fonts.body,
    fontSize: 10,
  },

  infoValue: {
    color: colors.text,

    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },

  qrSection: {
    marginTop: 24,

    alignItems: 'center',

    gap: 8,
  },

  qrFrame: {
    position: 'relative',

    width: 130,
    height: 130,

    padding: 10,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.white,
  },

  qrGrid: {
    width: '100%',
    height: '100%',

    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  qrPixel: {
    width: '9.09%',
    height: '9.09%',
  },

  qrLabel: {
    position: 'absolute',

    width: 42,
    height: 42,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.textDark,
  },

  qrLabelText: {
    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 14,
  },

  qrText: {
    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 11,

    textAlign: 'center',
  },

  actions: {
    marginTop: 20,

    gap: 12,
  },
})

export default DigitalCardScreen