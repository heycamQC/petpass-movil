import { StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import { colors } from '../theme'

function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Bienvenido a PetPass</Text>
      <Text style={styles.text}>
        Pantalla temporal de bienvenida.
      </Text>

      <Button onPress={() => navigation.navigate('Login')}>
        Continuar al inicio de sesión
      </Button>
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
  text: {
    color: colors.muted,
  },
})

export default OnboardingScreen