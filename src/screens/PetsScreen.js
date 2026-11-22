import { useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'

import Button from '../components/Button'
import ConfirmationModal from '../components/ConfirmationModal'
import Message from '../components/Message'
import PetCard from '../components/PetCard'
import PetSelector from '../components/PetSelector'
import ScreenContainer from '../components/ScreenContainer'

import { API_URL } from '../config'
import useApi from '../hooks/useApi'
import { getPetPhotoSource } from '../utils/petPhoto'
import { colors, fonts, spacing } from '../theme'

function PetsScreen({ navigation }) {
  const { data, loading, error } = useApi(`${API_URL}/api/mascotas`)
  const [selectedPetId, setSelectedPetId] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  // La API de EC2 responde con un arreglo, ordenado por ID.
  const pets = Array.isArray(data) ? data : []
  const selectedPet =
    pets.find((pet) => pet.id === selectedPetId) || pets[0] || null

  function openCard() {
    if (selectedPet) {
      navigation.navigate('Carnet', { id: selectedPet.id })
    }
  }

  function openFutureRoute(routeName) {
    if (selectedPet) {
      // Esta pantalla aún usa datos visuales locales (Parte 1).
      // El módulo correspondiente se conectará en Partes 3 o 4.
      navigation.navigate(routeName, { id: selectedPet.id })
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Mis Mascotas</Text>

      {loading ? (
        <Message loading />
      ) : error ? (
        <Message error={error} />
      ) : !Array.isArray(data) ? (
        <Message error="La API no devolvió una lista válida de mascotas." />
      ) : pets.length === 0 ? (
        <Message empty emptyText="Todavía no hay mascotas registradas." />
      ) : (
        <>
          <View style={styles.selectorSection}>
            <Text style={styles.sectionTitle}>Seleccionar mascota</Text>

            {/* Horizontal: conserva el selector de C1 sin anidar listas verticales. */}
            <FlatList
              horizontal
              data={pets}
              keyExtractor={(item) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectorRow}
              renderItem={({ item }) => (
                <PetSelector
                  name={item.name}
                  photo={getPetPhotoSource(item.photo)}
                  selected={selectedPet.id === item.id}
                  onPress={() => setSelectedPetId(item.id)}
                />
              )}
              ListFooterComponent={
                <PetSelector
                  name="Agregar"
                  variant="add"
                  onPress={() =>
                    Alert.alert(
                      'Registrar mascota',
                      'El registro desde el celular estará disponible próximamente.'
                    )
                  }
                />
              }
            />
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Información</Text>

            <PetCard
              name={selectedPet.name}
              photo={getPetPhotoSource(selectedPet.photo)}
              species={selectedPet.species}
              breed={selectedPet.breed}
              age={selectedPet.age || 'No registrada'}
              onEdit={() => openFutureRoute('EditarMascota')}
              onQrPress={openCard}
            />

            <View style={styles.actions}>
              <Button onPress={openCard}>Ver carnet digital</Button>

              <Button
                variant="secondary"
                onPress={() => openFutureRoute('Historial')}
              >
                Historial médico
              </Button>

              <Button
                variant="secondary"
                onPress={() => openFutureRoute('EditarMascota')}
              >
                Editar mascota
              </Button>

              <Button
                variant="danger"
                onPress={() => setDeleteModalVisible(true)}
              >
                Eliminar mascota
              </Button>
            </View>
          </View>

          <ConfirmationModal
            visible={deleteModalVisible}
            title="Eliminar mascota"
            message={`La opción de eliminar a ${selectedPet.name} estará disponible próximamente. No se eliminará ningún dato.`}
            confirmText="Entendido"
            cancelText="Volver"
            danger
            onConfirm={() => setDeleteModalVisible(false)}
            onCancel={() => setDeleteModalVisible(false)}
          />
        </>
      )}
    </ScreenContainer>
  )
}

// Estilos conservados de PetsScreen de la Parte 1.
const styles = StyleSheet.create({
  pageTitle: {
    marginBottom: 24,
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 28,
  },
  selectorSection: { marginBottom: 30 },
  sectionTitle: {
    marginBottom: 16,
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 20,
  },
  selectorRow: {
    gap: 12,
    paddingRight: 12,
    paddingBottom: 6,
  },
  detailSection: { gap: spacing.md },
  actions: { gap: 12, marginTop: 2 },
})

export default PetsScreen