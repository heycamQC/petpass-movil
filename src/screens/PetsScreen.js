
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme'

function PetsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mis mascotas</Text>
      <Text style={styles.text}>
        Opciones temporales para probar la navegación.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Carnet')}
      >
        <Text style={styles.buttonText}>Ir al carnet</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Historial')}
      >
        <Text style={styles.buttonText}>Ir al historial médico</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('EditarMascota')}
      >
        <Text style={styles.buttonText}>Editar mascota</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('PerfilPublico')}
      >
        <Text style={styles.buttonText}>Ver perfil público</Text>
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

export default PetsScreen
