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
} from '../theme'

const DEFAULT_DOG =
  require('../../assets/VectorDog.png')

function PlusIcon() {
  return (
    <View style={styles.plusIcon}>
      <View style={styles.plusHorizontal} />
      <View style={styles.plusVertical} />
    </View>
  )
}

function PetSelector({
  name = 'Dog',
  photo,
  variant = 'default',
  selected = false,
  onPress,
}) {
  const isAdd =
    variant === 'add' ||
    name.toLowerCase() === 'agregar'

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.selector,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.circle,
          selected && styles.circleSelected,
          isAdd && styles.circleAdd,
        ]}
      >
        {isAdd ? (
          <PlusIcon />
        ) : (
          <Image
            source={photo || DEFAULT_DOG}
            contentFit={
              photo ? 'cover' : 'contain'
            }
            style={
              photo
                ? styles.photo
                : styles.defaultDog
            }
          />
        )}
      </View>

      <Text style={styles.label}>
        {isAdd ? 'Agregar' : name}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  selector: {
    width: 86,

    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    paddingVertical: 4,
  },

  pressed: {
    transform: [
      {
        translateY: 1,
      },
    ],

    opacity: 0.88,
  },

  circle: {
    width: 78,
    height: 78,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 12,

    overflow: 'hidden',

    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: radius.pill,

    backgroundColor: '#d6d6d6',

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  circleSelected: {
    borderColor: colors.primaryDark,

    shadowColor: colors.primaryDark,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  circleAdd: {
    backgroundColor: '#e2ded9',
  },

  defaultDog: {
    width: 30,
    height: 40,
  },

  photo: {
    position: 'absolute',

    width: '100%',
    height: '100%',
  },

  label: {
    color: colors.textDark,

    fontFamily: fonts.bodyMedium,
    fontSize: 13.5,

    letterSpacing: 0.1,

    textAlign: 'center',
  },

  plusIcon: {
    width: 30,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',
  },

  plusHorizontal: {
    position: 'absolute',

    width: 26,
    height: 3,

    borderRadius: 3,

    backgroundColor: colors.muted,
  },

  plusVertical: {
    position: 'absolute',

    width: 3,
    height: 26,

    borderRadius: 3,

    backgroundColor: colors.muted,
  },
})

export default PetSelector