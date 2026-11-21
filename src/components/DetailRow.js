import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    flex: 1,
    color: colors.muted,
  },
  value: {
    flex: 1,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'right',
  },
})

export default DetailRow