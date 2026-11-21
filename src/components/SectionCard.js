import {
  StyleSheet,
  View,
} from 'react-native'

import {
  colors,
  radius,
  shadows,
} from '../theme'

function SectionCard({
  children,
  style,
}) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',

    padding: 20,

    borderRadius: radius.lg,

    backgroundColor: colors.surface,

    ...shadows.card,
  },
})

export default SectionCard