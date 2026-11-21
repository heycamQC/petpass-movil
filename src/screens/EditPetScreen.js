import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FormField from '../components/FormField'
import { colors } from '../theme'

function EditPetScreen() {
  const [name, setName] = useState('')

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Editar mascota</Text>

      <FormField
        label="Nombre"
        value={name}
        onChangeText={setName}
        placeholder="Ej. Toby"
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
})

export default EditPetScreen