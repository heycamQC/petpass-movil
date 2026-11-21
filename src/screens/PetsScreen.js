import { StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import { colors } from '../theme'

function PetsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mis mascotas</Text>
      <Text style={styles.text}>
        Opciones temporales para probar la navegación.
      </Text>

      <Button onPress={() => navigation.navigate('Carnet')}>
        Ir al carnet
      </Button>

      <Button variant="secondary" onPress={() => navigation.navigate('Historial')}>
        Ir al historial médico
      </Button>

      <Button variant="secondary" onPress={() => navigation.navigate('EditarMascota')}>
        Editar mascota
      </Button>

      <Button variant="secondary" onPress={() => navigation.navigate('PerfilPublico')}>
        Ver perfil público
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

export default PetsScreen