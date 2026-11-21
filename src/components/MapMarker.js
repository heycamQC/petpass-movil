import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

const MARKERS = {
  park: {
    icon: '🌳',
    color: colors.primary,
  },

  veterinary: {
    icon: '✚',
    color: colors.blue,
  },

  petFriendly: {
    icon: '🐾',
    color: colors.orange,
  },
}

function MapMarker({
  type = 'veterinary',
  label,
  selected = false,
  onPress,
}) {
  const config =
    MARKERS[type] ||
    MARKERS.veterinary

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      style={styles.container}
    >
      <View
        style={[
          styles.pin,
          {
            backgroundColor:
              config.color,
          },
          selected &&
            styles.pinSelected,
        ]}
      >
        <View
          style={
            styles.iconWrapper
          }
        >
          <Text
            style={styles.icon}
          >
            {config.icon}
          </Text>
        </View>
      </View>

      {selected && (
        <View style={styles.label}>
          <Text
            numberOfLines={2}
            style={styles.labelText}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',

    gap: 6,
  },

  pin: {
    width: 46,
    height: 46,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 3,
    borderColor: colors.white,

    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    borderBottomRightRadius: 23,
    borderBottomLeftRadius: 4,

    transform: [
      {
        rotate: '-45deg',
      },
    ],

    ...shadows.soft,
  },

  pinSelected: {
    borderColor: colors.accent,

    transform: [
      {
        rotate: '-45deg',
      },
      {
        scale: 1.15,
      },
    ],
  },

  iconWrapper: {
    transform: [
      {
        rotate: '45deg',
      },
    ],
  },

  icon: {
    color: colors.white,

    fontSize: 18,
  },

  label: {
    maxWidth: 125,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 14,

    backgroundColor: colors.white,

    ...shadows.soft,
  },

  labelText: {
    color: colors.text,

    fontFamily: fonts.bodyBold,
    fontSize: 10.5,

    textAlign: 'center',
  },
})

export default MapMarker