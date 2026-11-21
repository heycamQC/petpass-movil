import { StyleSheet, Text, View } from 'react-native'
import Message from '../components/Message'
import { colors } from '../theme'

function MedicalHistoryScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Historial médico</Text>

      <Message
        empty
        emptyText="Todavía no hay registros médicos para mostrar."
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 12,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
})

export default MedicalHistoryScreen