import { StyleSheet, Text, View } from 'react-native'
import DetailRow from '../components/DetailRow'
import SectionCard from '../components/SectionCard'
import { colors } from '../theme'

function DigitalCardScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Carnet digital</Text>

      <SectionCard>
        <DetailRow label="Mascota" value="Demo" />
        <DetailRow label="Especie" value="Perro" />
      </SectionCard>
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

export default DigitalCardScreen