
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Inicio</Text>
      <Text style={styles.text}>PetPass Mobile</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Mascotas')}
      >
        <Text style={styles.buttonText}>Mis mascotas</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Alertas')}
      >
        <Text style={styles.buttonText}>Alertas</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Mapa')}
      >
        <Text style={styles.buttonText}>Mapa</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Cuenta')}
      >
        <Text style={styles.buttonText}>Mi cuenta</Text>
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

export default HomeScreen
