import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  colors,
  fonts,
  spacing,
  typography,
} from '../theme'

function ScreenHeader({
  eyebrow,
  title,
  subtitle,
}) {
  return (
    <View style={styles.header}>
      {!!eyebrow && (
        <Text style={styles.eyebrow}>
          {eyebrow}
        </Text>
      )}

      <Text style={styles.title}>
        {title}
      </Text>

      {!!subtitle && (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  eyebrow: {
    color: colors.orange,

    fontFamily: fonts.bodyBold,
    fontSize: typography.small,

    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  title: {
    color: colors.heading,

    fontFamily: fonts.displayBold,
    fontSize: typography.title,

    lineHeight: 39,
    letterSpacing: -0.4,
  },

  subtitle: {
    maxWidth: 340,

    color: colors.text,

    fontFamily: fonts.bodyMedium,
    fontSize: typography.bodyLarge,

    lineHeight: 23,
  },
})

export default ScreenHeader