
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Bienvenido a PetPass</Text>
      <Text style={styles.text}>
        Pantalla temporal de bienvenida.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>
          Continuar al inicio de sesión
        </Text>
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

export default OnboardingScreen
