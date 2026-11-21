import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Image } from 'expo-image'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

function PawBackground() {
  return (
    <View
      pointerEvents="none"
      style={styles.paw}
    >
      <View style={[styles.pawToe, styles.pawToe1]} />
      <View style={[styles.pawToe, styles.pawToe2]} />
      <View style={[styles.pawToe, styles.pawToe3]} />
      <View style={[styles.pawToeSmall, styles.pawToe4]} />

      <View style={styles.pawPad} />
    </View>
  )
}

function EditIcon() {
  return (
    <Text style={styles.editSymbol}>
      ✎
    </Text>
  )
}

function QrIcon() {
  return (
    <View style={styles.qrIcon}>
      <View style={[styles.qrSquare, styles.qr1]} />
      <View style={[styles.qrSquare, styles.qr2]} />
      <View style={[styles.qrSquare, styles.qr3]} />
      <View style={[styles.qrSquare, styles.qr4]} />
    </View>
  )
}

function PetCard({
  name,
  photo,
  species,
  breed,
  age,
  onEdit,
  onQrPress,
}) {
  return (
    <View style={styles.card}>
      <PawBackground />

      {!!onEdit && (
        <Pressable
          onPress={onEdit}
          accessibilityLabel="Editar mascota"
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressed,
          ]}
        >
          <EditIcon />
        </Pressable>
      )}

      <View style={styles.info}>
        <View>
          <Text style={styles.label}>
            Nombre
          </Text>

          <Text style={styles.value}>
            {name}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>
            Raza
          </Text>

          <Text style={styles.value}>
            {breed || species}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>
            Edad
          </Text>

          <Text style={styles.value}>
            {age}
          </Text>
        </View>

        {!!onQrPress && (
          <Pressable
            onPress={onQrPress}
            accessibilityLabel="Ver QR"
            style={({ pressed }) => [
              styles.qrButton,
              pressed && styles.pressed,
            ]}
          >
            <QrIcon />
          </Pressable>
        )}
      </View>

      <View style={styles.photoContainer}>
        {photo ? (
          <Image
            source={photo}
            contentFit="cover"
            style={styles.photo}
          />
        ) : (
          <View style={styles.photoFallback} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',

    width: '100%',
    maxWidth: 384,
    minHeight: 300,

    alignSelf: 'center',

    paddingTop: 24,
    paddingRight: 22,
    paddingBottom: 20,
    paddingLeft: 24,

    overflow: 'hidden',

    borderRadius: 36,

    backgroundColor: colors.blue,

    ...shadows.card,
  },

  paw: {
    position: 'absolute',

    top: -12,
    right: -18,

    width: 255,
    height: 255,

    opacity: 0.18,
  },

  pawToe: {
    position: 'absolute',

    width: 58,
    height: 58,

    borderRadius: radius.pill,

    backgroundColor: colors.white,
  },

  pawToeSmall: {
    position: 'absolute',

    width: 48,
    height: 48,

    borderRadius: radius.pill,

    backgroundColor: colors.white,
  },

  pawToe1: {
    top: 28,
    left: 18,
  },

  pawToe2: {
    top: 4,
    left: 91,
  },

  pawToe3: {
    top: 29,
    right: 15,
  },

  pawToe4: {
    top: 95,
    right: -2,
  },

  pawPad: {
    position: 'absolute',

    left: 54,
    top: 108,

    width: 142,
    height: 77,

    borderRadius: 48,

    backgroundColor: colors.white,

    transform: [
      {
        rotate: '-2deg',
      },
    ],
  },

  editButton: {
    position: 'absolute',

    top: 18,
    right: 18,

    width: 44,
    height: 44,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 14,

    backgroundColor: colors.primaryDark,

    zIndex: 10,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  editSymbol: {
    marginTop: -2,

    color: colors.white,

    fontFamily: fonts.bodyBold,
    fontSize: 23,
  },

  info: {
    position: 'relative',

    width: '50%',

    gap: 10,

    zIndex: 5,
  },

  label: {
    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 21,

    lineHeight: 24,
  },

  value: {
    color: 'rgba(255,255,255,0.95)',

    fontFamily: fonts.body,
    fontSize: 14,
  },

  qrButton: {
    width: 34,
    height: 34,

    marginTop: 8,

    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  qrIcon: {
    position: 'relative',

    width: 26,
    height: 26,
  },

  qrSquare: {
    position: 'absolute',

    width: 10,
    height: 10,

    borderWidth: 2,
    borderColor: colors.white,
  },

  qr1: {
    top: 0,
    left: 0,
  },

  qr2: {
    top: 0,
    right: 0,
  },

  qr3: {
    bottom: 0,
    left: 0,
  },

  qr4: {
    right: 0,
    bottom: 0,
  },

  photoContainer: {
    position: 'absolute',

    right: 12,
    bottom: 12,

    width: 158,
    height: 158,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    borderRadius: radius.pill,

    backgroundColor: colors.yellowNav,

    zIndex: 4,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  photoFallback: {
    width: '100%',
    height: '100%',

    backgroundColor: colors.text,
  },

  pressed: {
    opacity: 0.78,

    transform: [
      {
        scale: 0.95,
      },
    ],
  },
})

export default PetCard