import { StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import { colors } from '../theme'

function LoginScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <Text style={styles.text}>
        Acceso temporal: todavía no hay autenticación real.
      </Text>

      <Button onPress={() => navigation.replace('Home')}>
        Entrar a PetPass
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

export default LoginScreen