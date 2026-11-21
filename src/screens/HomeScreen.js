import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import ConfirmationModal from '../components/ConfirmationModal'
import { colors } from '../theme'

function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Inicio</Text>
      <Text style={styles.text}>PetPass Mobile</Text>

      <Button onPress={() => navigation.navigate('Mascotas')}>
        Mis mascotas
      </Button>

      <Button variant="secondary" onPress={() => navigation.navigate('Alertas')}>
        Alertas
      </Button>

      <Button variant="secondary" onPress={() => navigation.navigate('Mapa')}>
        Mapa
      </Button>

      <Button variant="secondary" onPress={() => navigation.navigate('Cuenta')}>
        Mi cuenta
      </Button>

      <Button variant="danger" onPress={() => setModalVisible(true)}>
        Probar modal
      </Button>

      <ConfirmationModal
        visible={modalVisible}
        title="Confirmar acción"
        message="¿Deseas continuar con esta prueba?"
        onConfirm={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        danger
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
  text: {
    color: colors.muted,
  },
})

export default HomeScreen