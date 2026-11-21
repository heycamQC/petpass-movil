import { Pressable, StyleSheet, Text } from 'react-native'
import { colors } from '../theme'

function Button({ children, onPress, variant = 'primary', disabled = false }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[
        styles.text,
        variant === 'secondary' && styles.textSecondary,
      ]}>
        {children}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  textSecondary: {
    color: colors.text,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.45 },
})

export default Button