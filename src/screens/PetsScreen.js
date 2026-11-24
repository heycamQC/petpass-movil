
import { useCallback, useRef, useState } from 'react'
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import Button from '../components/Button'
import ConfirmationModal from '../components/ConfirmationModal'
import Message from '../components/Message'
import PetCard from '../components/PetCard'
import PetSelector from '../components/PetSelector'
import ScreenContainer from '../components/ScreenContainer'

import { API_URL } from '../config'
import useApi from '../hooks/useApi'
import { sendPetRequest } from '../utils/petApi'
import { getPetPhotoSource } from '../utils/petPhoto'
import { colors, fonts, spacing } from '../theme'

function PetsScreen({ navigation }) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useApi(`${API_URL}/api/mascotas`)

  const [selectedPetId, setSelectedPetId] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const firstFocus = useRef(true)
  const deletingLock = useRef(false)

  // Conservar actualización al regresar de otras pantallas.
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false
      } else {
        refetch()
      }
    }, [refetch])
  )

  const pets = Array.isArray(data) ? data : []

  const selectedPet =
    pets.find((pet) => pet.id === selectedPetId) ||
    pets[0] ||
    null

  function openRegister() {
    setActionError('')
    navigation.navigate('RegistrarMascota')
  }

  function openCard() {
    if (selectedPet) {
      navigation.navigate('Carnet', {
        id: selectedPet.id,
      })
    }
  }

  function openEdit() {
    if (!selectedPet) return

    setActionError('')

    navigation.navigate('EditarMascota', {
      id: selectedPet.id,
    })
  }

  function openHistory() {
    if (!selectedPet) return

    navigation.navigate('Historial', {
      id: selectedPet.id,
      petName: selectedPet.name,
    })
  }

  function askDelete() {
    if (!selectedPet || deleting) return

    setActionError('')
    setDeleteModalVisible(true)
  }

  async function handleDeletePet() {
    if (!selectedPet || deletingLock.current) return

    deletingLock.current = true
    setDeleting(true)
    setActionError('')

    const petName = selectedPet.name

    try {
      await sendPetRequest(
        `/api/mascotas/${selectedPet.id}`,
        'DELETE'
      )

      setDeleteModalVisible(false)
      setSelectedPetId(null)
      refetch()

      Alert.alert(
        'Mascota eliminada',
        `${petName} fue eliminada correctamente.`
      )
    } catch (err) {
      setDeleteModalVisible(false)
      setActionError(
        err.message || 'No se pudo eliminar la mascota.'
      )
    } finally {
      deletingLock.current = false
      setDeleting(false)
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>
        Mis Mascotas
      </Text>

      {loading ? (
        <Message loading />
      ) : error ? (
        <>
          <Message error={error} />

          <Button variant="secondary" onPress={refetch}>
            Reintentar
          </Button>
        </>
      ) : !Array.isArray(data) ? (
        <>
          <Message
            error="La API no devolvió una lista válida de mascotas."
          />

          <Button variant="secondary" onPress={refetch}>
            Reintentar
          </Button>
        </>
      ) : pets.length === 0 ? (
        <View style={styles.emptyActions}>
          <Message
            empty
            emptyText="Todavía no hay mascotas registradas."
          />

          <Button onPress={openRegister}>
            Registrar mi primera mascota
          </Button>

          <Button variant="secondary" onPress={refetch}>
            Actualizar lista
          </Button>
        </View>
      ) : (
        <>
          {/* SELECCIÓN DE MASCOTAS */}
          <View style={styles.selectorSection}>
            <View style={styles.selectorHeader}>
              <Text style={styles.sectionTitle}>
                Seleccionar mascota
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Actualizar mascotas"
                onPress={refetch}
                style={styles.refreshControl}
              >
                <Text style={styles.refreshText}>
                  Actualizar
                </Text>
              </Pressable>
            </View>

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
                  selected={selectedPet?.id === item.id}
                  onPress={() => {
                    setSelectedPetId(item.id)
                    setActionError('')
                  }}
                />
              )}
              ListFooterComponent={
                <PetSelector
                  name="Agregar"
                  variant="add"
                  onPress={openRegister}
                />
              }
            />
          </View>

          {/* INFORMACIÓN DE LA MASCOTA */}
          <View style={styles.detailSection}>
            <Text style={styles.infoTitle}>
              Información
            </Text>

            <PetCard
              petId={selectedPet.id}
              name={selectedPet.name}
              photo={getPetPhotoSource(selectedPet.photo)}
              species={selectedPet.species}
              breed={selectedPet.breed}
              age={selectedPet.age || 'No registrada'}
              onQrPress={openCard}
              onEdit={openEdit}
              onHistory={openHistory}
              onDelete={askDelete}
              deleting={deleting}
            />

            {!!actionError && (
              <Message error={actionError} />
            )}
          </View>

          {/* CONSERVAMOS LA CONFIRMACIÓN DE ELIMINACIÓN */}
          <ConfirmationModal
            visible={deleteModalVisible}
            title="Eliminar mascota"
            message={`¿Eliminar a ${selectedPet.name}? También se eliminará su historial médico. Las alertas existentes conservarán su contenido, pero dejarán de estar vinculadas a esta mascota. Esta acción no se puede deshacer.`}
            confirmText={
              deleting ? 'Eliminando...' : 'Sí, eliminar'
            }
            cancelText="No, volver"
            danger
            onConfirm={handleDeletePet}
            onCancel={() => {
              if (!deleting) {
                setDeleteModalVisible(false)
              }
            }}
          />
        </>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  pageTitle: {
    marginBottom: 20,
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 28,
  },

  selectorSection: {
    marginBottom: 26,
  },

  selectorHeader: {
    marginBottom: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 18,
  },

  infoTitle: {
    marginBottom: 4,
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 22,
  },

  refreshControl: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  refreshText: {
    color: colors.blueDark,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  selectorRow: {
    gap: 12,
    paddingRight: 12,
    paddingBottom: 6,
  },

  detailSection: {
    gap: spacing.md,
    paddingBottom: 12,
  },

  emptyActions: {
    gap: spacing.md,
  },
})

export default PetsScreen
