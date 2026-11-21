import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

function Message({
  loading = false,
  error = '',
  empty = false,
  emptyText = 'No hay información disponible.',
}) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.muted}>Cargando...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (empty) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>{emptyText}</Text>
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 10,
  },
  muted: {
    color: colors.muted,
    textAlign: 'center',
  },
  errorBox: {
    padding: 14,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    backgroundColor: colors.dangerBg,
  },
  errorText: {
    color: colors.danger,
    fontWeight: '600',
  },
})

export default Message