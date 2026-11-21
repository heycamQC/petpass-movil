import { useState } from 'react'

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Button from '../components/Button'
import ConfirmationModal from '../components/ConfirmationModal'
import PetCard from '../components/PetCard'
import PetSelector from '../components/PetSelector'
import ScreenContainer from '../components/ScreenContainer'

import {
  colors,
  fonts,
  spacing,
} from '../theme'

const PUG =
  require('../../assets/pug-avatar.svg')

const PREVIEW_PETS = [
  {
    id: 1,
    name: 'Toby',
    photo: PUG,
    species: 'Perro',
    breed: 'Pug',
    age: '5 años',
  },
  {
    id: 2,
    name: 'Mila',
    species: 'Perro',
    breed: 'Mestiza',
    age: '3 años',
  },
]

function PetsScreen({ navigation }) {
  const [selectedPetId, setSelectedPetId] =
    useState(PREVIEW_PETS[0].id)

  const [
    deleteModalVisible,
    setDeleteModalVisible,
  ] = useState(false)

  const selectedPet =
    PREVIEW_PETS.find(
      (pet) =>
        pet.id === selectedPetId
    ) || PREVIEW_PETS[0]

  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>
        Mis Mascotas
      </Text>

      <View style={styles.selectorSection}>
        <Text style={styles.sectionTitle}>
          Seleccionar mascota
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.selectorRow
          }
        >
          {PREVIEW_PETS.map((pet) => (
            <PetSelector
              key={pet.id}
              name={pet.name}
              photo={pet.photo}
              selected={
                selectedPet.id === pet.id
              }
              onPress={() =>
                setSelectedPetId(pet.id)
              }
            />
          ))}

          <PetSelector
            name="Agregar"
            variant="add"
          />
        </ScrollView>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>
          Información
        </Text>

        <PetCard
          name={selectedPet.name}
          photo={selectedPet.photo}
          species={selectedPet.species}
          breed={selectedPet.breed}
          age={selectedPet.age}
          onEdit={() =>
            navigation.navigate(
              'EditarMascota'
            )
          }
          onQrPress={() =>
            navigation.navigate('Carnet')
          }
        />

        <View style={styles.actions}>
          <Button
            onPress={() =>
              navigation.navigate('Carnet')
            }
          >
            Ver carnet digital
          </Button>

          <Button
            variant="secondary"
            onPress={() =>
              navigation.navigate(
                'Historial'
              )
            }
          >
            Historial médico
          </Button>

          <Button
            variant="secondary"
            onPress={() =>
              navigation.navigate(
                'EditarMascota'
              )
            }
          >
            Editar mascota
          </Button>

          <Button
            variant="danger"
            onPress={() =>
              setDeleteModalVisible(true)
            }
          >
            Eliminar mascota
          </Button>
        </View>
      </View>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Eliminar mascota"
        message={`¿Seguro que deseas eliminar a ${selectedPet.name}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        danger
        onConfirm={() =>
          setDeleteModalVisible(false)
        }
        onCancel={() =>
          setDeleteModalVisible(false)
        }
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  pageTitle: {
    marginBottom: 24,

    color: colors.text,

    fontFamily: fonts.displayBold,
    fontSize: 28,
  },

  selectorSection: {
    marginBottom: 30,
  },

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

  detailSection: {
    gap: spacing.md,
  },

  actions: {
    gap: 12,

    marginTop: 2,
  },
})

export default PetsScreen