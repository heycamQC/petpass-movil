import { useCallback, useRef } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useFocusEffect } from '@react-navigation/native'

import Button from '../components/Button'
import Message from '../components/Message'
import ScreenContainer from '../components/ScreenContainer'
import { API_URL } from '../config'
import useApi from '../hooks/useApi'
import { getPetPhotoSource } from '../utils/petPhoto'
import { colors, fonts, radius, shadows, spacing } from '../theme'

function PawDecoration() {
  return (
    <View style={styles.paw}>
      <View style={[styles.pawToe, styles.toe1]} />
      <View style={[styles.pawToe, styles.toe2]} />
      <View style={[styles.pawToe, styles.toe3]} />
      <View style={[styles.pawToe, styles.toe4]} />
      <View style={styles.pawPad} />
    </View>
  )
}

function HomeScreen({ navigation }) {
  const { data, loading, error, refetch } = useApi(`${API_URL}/api/mascotas`)
  const firstFocus = useRef(true)

  // Actualizar al volver de registrar/editar/eliminar desde otras pantallas.
  useFocusEffect(useCallback(() => {
    if (firstFocus.current) {
      firstFocus.current = false
    } else {
      refetch()
    }
  }, [refetch]))

  const pets = Array.isArray(data) ? data : []

  return (
    <ScreenContainer>
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Hola, Usuario!</Text>
        <PawDecoration />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Mascotas</Text>

        {loading ? (
          <View style={styles.emptyCard}><Message loading /></View>
        ) : error ? (
          <View style={styles.emptyCard}>
            <Message error={error} />
            <Button variant="secondary" onPress={refetch}>Reintentar</Button>
          </View>
        ) : !Array.isArray(data) ? (
          <View style={styles.emptyCard}>
            <Message error="La API no devolvió una lista válida de mascotas." />
            <Button variant="secondary" onPress={refetch}>Reintentar</Button>
          </View>
        ) : pets.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyTitle}>Aún no tienes mascotas registradas</Text>
            <Text style={styles.emptyText}>
              Puedes registrar una mascota desde tu celular para ver su carnet e historial.
            </Text>
          </View>
        ) : (
          <View style={styles.petList}>
            <Text style={styles.listHint}>
              {pets.length} mascota{pets.length === 1 ? '' : 's'} registrada{pets.length === 1 ? '' : 's'}
            </Text>
            {pets.map((pet) => {
              const photo = getPetPhotoSource(pet.photo)
              return (
                <Pressable
                  key={String(pet.id)}
                  onPress={() => navigation.navigate('Carnet', { id: pet.id })}
                  accessibilityLabel={`Ver carnet de ${pet.name}`}
                  style={({ pressed }) => [styles.petItem, pressed && styles.petActionPressed]}
                >
                  <View style={styles.petThumb}>
                    {photo ? (
                      <Image source={photo} contentFit="cover" style={styles.petThumbImage} />
                    ) : (
                      <Text style={styles.petThumbEmoji}>{pet.species === 'Gato' ? '🐱' : '🐶'}</Text>
                    )}
                  </View>

                  <View style={styles.petItemText}>

                    <Text style={styles.petItemName}>
                      {pet.name}
                    </Text>

                    <Text style={styles.petItemMeta}>
                      {pet.species || 'Mascota'} · {pet.breed || 'Raza no registrada'}
                    </Text>

                    {pet.status === 'lost' && (
                      <View style={styles.lostBadge}>
                        <Text style={styles.lostBadgeText}>
                          ⚠ MASCOTA PERDIDA
                        </Text>
                      </View>
                    )}

                    <Text style={styles.petItemLink}>
                      Ver carnet digital ›
                    </Text>

                  </View>

                </Pressable>
              )
            })}
          </View>
        )}

        <Pressable
          onPress={() => navigation.navigate('RegistrarMascota')}
          style={({ pressed }) => [styles.petAction, pressed && styles.petActionPressed]}
        >
          <View style={styles.petActionIcon}><Text style={styles.plus}>+</Text></View>
          <View style={styles.petActionText}>
            <Text style={styles.petActionTitle}>Registrar mascota</Text>
            <Text style={styles.petActionSubtitle}>Crea su carnet en PetPass</Text>
          </View>
        </Pressable>
        <Button variant="secondary" onPress={() => navigation.navigate('Mascotas')}>
          Ver todas mis mascotas
        </Button>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  welcome: {
    position: 'relative',

    minHeight: 100,

    marginBottom: 28,
    padding: 24,

    justifyContent: 'center',

    overflow: 'hidden',

    borderRadius: 28,

    backgroundColor: '#EFEFEA',

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },

  welcomeTitle: {
    maxWidth: '70%',

    color: '#333333',

    fontFamily: fonts.displayBold,
    fontSize: 28,

    lineHeight: 34,

    zIndex: 2,
  },

  paw: {
    position: 'absolute',

    right: 0,
    bottom: -8,

    width: 125,
    height: 115,

    opacity: 0.85,
  },

  pawToe: {
    position: 'absolute',

    width: 27,
    height: 27,

    borderRadius: radius.pill,

    backgroundColor: '#C2C095',
  },

  toe1: {
    left: 2,
    top: 29,
  },

  toe2: {
    left: 32,
    top: 5,
  },

  toe3: {
    right: 27,
    top: 15,
  },

  toe4: {
    right: 0,
    top: 42,
  },

  pawPad: {
    position: 'absolute',

    left: 31,
    bottom: 10,

    width: 68,
    height: 47,

    borderRadius: 30,

    backgroundColor: '#C2C095',

    transform: [
      {
        rotate: '-4deg',
      },
    ],
  },

  section: {
    gap: spacing.md,
  },

  sectionTitle: {
    color: '#E16E42',

    fontFamily: fonts.displayBold,
    fontSize: 22,
  },

  emptyCard: {
    width: '100%',

    alignItems: 'center',

    gap: 10,

    paddingHorizontal: 20,
    paddingVertical: 26,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderRadius: 28,

    backgroundColor: colors.surface,
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    color: '#333333',

    fontFamily: fonts.displayBold,
    fontSize: 19,

    textAlign: 'center',
  },

  emptyText: {
    maxWidth: 320,

    color: '#6B7280',

    fontFamily: fonts.body,
    fontSize: 13,

    lineHeight: 20,
    textAlign: 'center',
  },

  petAction: {
    width: '100%',

    minHeight: 76,

    paddingHorizontal: 20,
    paddingVertical: 16,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 16,

    borderRadius: 20,

    backgroundColor: '#E16E42',

    ...shadows.orange,
  },

  petActionPressed: {
    transform: [
      {
        scale: 0.98,
      },
    ],

    opacity: 0.92,
  },

  petActionIcon: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    flexShrink: 0,

    borderRadius: radius.pill,

    backgroundColor: colors.white,
  },

  plus: {
    marginTop: -2,

    color: '#E16E42',

    fontFamily: fonts.bodyBold,
    fontSize: 29,

    lineHeight: 32,
  },

  petActionText: {
    flex: 1,
  },

  petActionTitle: {
    marginBottom: 2,

    color: colors.white,

    fontFamily: fonts.bodyBold,
    fontSize: 15,

    lineHeight: 19,
  },

lostBadge: {
  alignSelf: 'flex-start',
  backgroundColor: '#FDE8E5',
  borderColor: '#E6AAA0',
  borderWidth: 1,
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 5,
  marginTop: 4,
},

lostBadgeText: {
  color: '#A73A2D',
  fontFamily: fonts.bodySemiBold,
  fontSize: 11,
},


  petActionSubtitle: {
    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 12,

    opacity: 0.95,
  },
  petList: { gap: 12 },
  listHint: { color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
  petItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12,
    backgroundColor: colors.white, borderRadius: 22, borderWidth: 1, borderColor: colors.border,
    ...shadows.soft },
  petThumb: { width: 68, height: 68, borderRadius: 18, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent },
  petThumbImage: { width: '100%', height: '100%' },
  petThumbEmoji: { fontSize: 30 },
  petItemText: { flex: 1, gap: 2 },
  petItemName: { color: colors.textDark, fontFamily: fonts.displayBold, fontSize: 17 },
  petItemMeta: { color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  petItemLink: { color: colors.orange, fontFamily: fonts.bodySemiBold, fontSize: 12 },
})

export default HomeScreen