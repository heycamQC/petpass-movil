import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

function AccountScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mi cuenta</Text>
      <Text style={styles.text}>Pantalla temporal de PetPass Mobile.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  text: {
    marginTop: 8,
    color: colors.muted,
  },
})

export default AccountScreen
