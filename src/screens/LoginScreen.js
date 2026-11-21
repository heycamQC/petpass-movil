
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

function LoginScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <Text style={styles.text}>
        Acceso temporal: todavía no hay autenticación real.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.replace('Home')}
      >
        <Text style={styles.buttonText}>Entrar a PetPass</Text>
      </Pressable>
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
    marginBottom: 12,
    color: colors.muted,
  },
  button: {
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
})

export default LoginScreen
