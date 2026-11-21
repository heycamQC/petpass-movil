import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native'

import {
  colors,
  fonts,
  radius,
} from '../theme'

function FilterTab({
  label,
  active = false,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        active && styles.tabActive,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          active && styles.textActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tab: {
    minHeight: 42,

    paddingHorizontal: 18,
    paddingVertical: 9,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: colors.orange,

    borderRadius: radius.pill,

    backgroundColor: colors.background,
  },

  tabActive: {
    backgroundColor: colors.orange,
  },

  text: {
    color: colors.orange,

    fontFamily: fonts.bodySemiBold,
    fontSize: 12.5,

    textAlign: 'center',
  },

  textActive: {
    color: colors.white,
  },

  pressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },
})

export default FilterTab