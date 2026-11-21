import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native'

import {
  colors,
  fonts,
  radius,
  shadows,
  typography,
} from '../theme'

function Button({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
}) {
  const finalVariant = disabled
    ? 'disabled'
    : variant

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[finalVariant],
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${finalVariant}`],
        ]}
      >
        {children}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 50,

    paddingHorizontal: 28,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radius.pill,

    ...shadows.button,
  },

  primary: {
    backgroundColor: colors.primaryDark,
  },

  secondary: {
    backgroundColor: colors.blue,
  },

  danger: {
    backgroundColor: colors.orange,
  },

  disabled: {
    backgroundColor: colors.disabledBg,
    borderColor: colors.disabledBorder,

    shadowOpacity: 0,
    elevation: 0,
  },

  pressed: {
    opacity: 0.88,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  text: {
    fontFamily: fonts.displayBold,
    fontSize: typography.button,
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  text_primary: {
    color: colors.white,
  },

  text_secondary: {
    color: colors.white,
  },

  text_danger: {
    color: colors.white,
  },

  text_disabled: {
    color: colors.orange,
  },
})

export default Button