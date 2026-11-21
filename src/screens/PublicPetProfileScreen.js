import { useState } from 'react'

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Image } from 'expo-image'
import {
  SafeAreaView,
} from 'react-native-safe-area-context'

import Button
  from '../components/Button'

import OnboardingConfetti
  from '../components/decorative/OnboardingConfetti'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

const PUG =
  require('../../assets/pug-avatar.svg')

const PREVIEW_PET = {
  id: 1,
  name: 'Toby',
  photo: PUG,
  species: 'Perro',
  breed: 'Pug',
  status: 'lost',
}

function PublicPetProfileScreen() {
  const [isCalling, setIsCalling] =
    useState(false)

  const [
    locationModalVisible,
    setLocationModalVisible,
  ] = useState(false)

  const [
    successModalVisible,
    setSuccessModalVisible,
  ] = useState(false)

  const pet = PREVIEW_PET

  const handleAllowLocation = () => {
    setLocationModalVisible(false)
    setSuccessModalVisible(true)
  }

  if (isCalling) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={styles.page}
      >
        <View style={styles.confetti}>
          <OnboardingConfetti />
        </View>

        <View style={styles.callCard}>
          <View style={styles.callAvatar}>
            <Image
              source={pet.photo}
              contentFit="cover"
              style={styles.photo}
            />
          </View>

          <Text style={styles.callTitle}>
            Llamada de emergencia
          </Text>

          <Text style={styles.callSubtitle}>
            Contactando al tutor de{' '}
            <Text style={styles.bold}>
              {pet.name}
            </Text>
          </Text>

          <View style={styles.callControls}>
            <View style={styles.callControl}>
              <View style={styles.callCircle}>
                <Text style={styles.callIcon}>
                  🔊
                </Text>
              </View>

              <Text style={styles.callLabel}>
                Speaker
              </Text>
            </View>

            <View style={styles.callControl}>
              <View style={styles.callCircle}>
                <Text style={styles.callIcon}>
                  🔇
                </Text>
              </View>

              <Text style={styles.callLabel}>
                Mute
              </Text>
            </View>

            <View style={styles.callControl}>
              <View style={styles.callCircle}>
                <Text style={styles.callIcon}>
                  ▦
                </Text>
              </View>

              <Text style={styles.callLabel}>
                Keypad
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              setIsCalling(false)
            }
            accessibilityLabel="Finalizar llamada"
            style={({ pressed }) => [
              styles.endCall,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.endCallIcon}>
              ☎
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.page}
    >
      <View style={styles.confetti}>
        <OnboardingConfetti />
      </View>

      <View style={styles.card}>
        <View style={styles.info}>
          <View style={styles.photoContainer}>
            <Image
              source={pet.photo}
              contentFit="cover"
              style={styles.photo}
            />
          </View>

          <Text style={styles.title}>
            {pet.status === 'lost'
              ? '¡Estoy perdido!'
              : `Hola, soy ${pet.name}`}
          </Text>

          <Text style={styles.subtitle}>
            {pet.status === 'lost'
              ? 'Ayúdame a volver a casa'
              : 'Este es mi perfil público de PetPass'}
          </Text>

          <View style={styles.petData}>
            <Text style={styles.dataText}>
              <Text style={styles.bold}>
                Nombre:{' '}
              </Text>

              {pet.name}
            </Text>

            <Text style={styles.dataText}>
              <Text style={styles.bold}>
                Especie:{' '}
              </Text>

              {pet.species}
            </Text>

            <Text style={styles.dataText}>
              <Text style={styles.bold}>
                Raza:{' '}
              </Text>

              {pet.breed}
            </Text>
          </View>
        </View>

        {pet.status === 'lost' ? (
          <View style={styles.actions}>
            <Button
              variant="danger"
              onPress={() =>
                setLocationModalVisible(true)
              }
            >
              Enviar Alerta GPS
            </Button>

            <Pressable
              onPress={() =>
                setIsCalling(true)
              }
              style={({ pressed }) => [
                styles.callButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.callButtonText}>
                Llamada de emergencia
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.safeMessage}>
            <View style={styles.safeIcon}>
              <Text style={styles.safeIconText}>
                ✓
              </Text>
            </View>

            <Text style={styles.safeText}>
              Esta mascota no está
              reportada como perdida.
            </Text>
          </View>
        )}
      </View>

      <Modal
        visible={locationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setLocationModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.permissionModal}>
            <Pressable
              onPress={() =>
                setLocationModalVisible(false)
              }
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>
                ×
              </Text>
            </Pressable>

            <Text style={styles.modalTitle}>
              Ubicación
            </Text>

            <View style={styles.modalInner}>
              <Text style={styles.modalBadge}>
                GPS
              </Text>

              <Text style={styles.modalInnerText}>
                ¿Permitir que PetPass acceda
                a tu ubicación?
              </Text>
            </View>

            <Pressable
              onPress={handleAllowLocation}
              style={styles.modalAction}
            >
              <Text style={styles.modalActionText}>
                Aceptar
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setLocationModalVisible(false)
              }
            >
              <Text style={styles.rejectText}>
                Rechazar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setSuccessModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.modalTitle}>
              ¡Alerta enviada!
            </Text>

            <View style={styles.modalInner}>
              <Text style={styles.successIcon}>
                ✓
              </Text>

              <Text style={styles.modalInnerText}>
                El tutor ya tiene la ubicación.
                Por favor quédate con la mascota
                unos minutos.
              </Text>
            </View>

            <Pressable
              onPress={() =>
                setSuccessModalVisible(false)
              }
              style={styles.modalAction}
            >
              <Text style={styles.modalActionText}>
                Aceptar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,

    paddingHorizontal: 20,
    paddingVertical: 28,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    backgroundColor: colors.background,
  },

  confetti: {
    ...StyleSheet.absoluteFillObject,

    opacity: 0.55,
  },

  card: {
    position: 'relative',

    width: '100%',
    maxWidth: 380,

    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 24,

    gap: 18,

    borderRadius: 36,

    backgroundColor: colors.primary,

    ...shadows.card,

    zIndex: 2,
  },

  info: {
    width: '100%',
  },

  photoContainer: {
    width: '100%',
    height: 190,

    overflow: 'hidden',

    borderRadius: 26,

    backgroundColor:
      'rgba(250,248,241,0.16)',

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  title: {
    marginTop: 15,

    color: colors.text,

    fontFamily: fonts.displayExtraBold,
    fontSize: 27,

    lineHeight: 30,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 3,
    marginBottom: 10,

    color: colors.text,

    fontFamily: fonts.bodySemiBold,
    fontSize: 14,

    textAlign: 'center',
  },

  petData: {
    alignItems: 'center',

    gap: 4,
  },

  dataText: {
    color: colors.text,

    fontFamily: fonts.body,
    fontSize: 13.5,

    textAlign: 'center',
  },

  bold: {
    fontFamily: fonts.bodyBold,
  },

  actions: {
    gap: 10,
  },

  callButton: {
    width: '100%',
    minHeight: 50,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: colors.orange,

    borderRadius: radius.pill,

    backgroundColor: colors.white,
  },

  callButtonText: {
    color: colors.orange,

    fontFamily: fonts.displayBold,
    fontSize: 16,
  },

  safeMessage: {
    paddingHorizontal: 16,
    paddingVertical: 13,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    borderRadius: 20,

    backgroundColor: colors.background,
  },

  safeIcon: {
    width: 24,
    height: 24,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: radius.pill,

    backgroundColor: colors.primary,
  },

  safeIconText: {
    color: colors.white,

    fontFamily: fonts.bodyBold,
  },

  safeText: {
    flex: 1,

    color: colors.text,

    fontFamily: fonts.body,
    fontSize: 12.5,

    lineHeight: 18,
  },

  callCard: {
    width: '100%',
    maxWidth: 380,

    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 36,

    alignItems: 'center',

    borderRadius: 36,

    backgroundColor: colors.orange,

    ...shadows.orange,

    zIndex: 2,
  },

  callAvatar: {
    width: 126,
    height: 126,

    marginBottom: 14,

    overflow: 'hidden',

    borderWidth: 4,
    borderColor: colors.white,

    borderRadius: radius.pill,

    backgroundColor: colors.background,
  },

  callTitle: {
    marginBottom: 6,

    color: colors.text,

    fontFamily: fonts.displayExtraBold,
    fontSize: 27,

    textAlign: 'center',
  },

  callSubtitle: {
    marginBottom: 28,

    color: colors.text,

    fontFamily: fonts.body,
    fontSize: 13,

    textAlign: 'center',
  },

  callControls: {
    marginBottom: 30,

    flexDirection: 'row',
    justifyContent: 'center',

    gap: 18,
  },

  callControl: {
    alignItems: 'center',

    gap: 5,
  },

  callCircle: {
    width: 58,
    height: 58,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: radius.pill,

    backgroundColor: colors.text,
  },

  callIcon: {
    fontSize: 19,
  },

  callLabel: {
    color: colors.text,

    fontFamily: fonts.bodyMedium,
    fontSize: 9,
  },

  endCall: {
    width: 62,
    height: 62,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: radius.pill,

    backgroundColor: '#b92727',

    shadowColor: '#640000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 4,
  },

  endCallIcon: {
    color: colors.white,

    fontSize: 27,

    transform: [
      {
        rotate: '135deg',
      },
    ],
  },

  modalOverlay: {
    flex: 1,

    padding: 20,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(0,0,0,0.45)',
  },

  permissionModal: {
    position: 'relative',

    width: '100%',
    maxWidth: 290,

    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 22,

    alignItems: 'center',

    borderRadius: 32,

    backgroundColor: colors.blue,
  },

  successModal: {
    width: '100%',
    maxWidth: 290,

    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 22,

    alignItems: 'center',

    borderRadius: 32,

    backgroundColor: colors.blue,
  },

  modalClose: {
    position: 'absolute',

    top: 8,
    right: 14,

    zIndex: 5,
  },

  modalCloseText: {
    color: colors.white,

    fontSize: 28,
  },

  modalTitle: {
    marginBottom: 14,

    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 23,

    textAlign: 'center',
  },

  modalInner: {
    width: '100%',

    minHeight: 118,

    padding: 16,

    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    borderRadius: 20,

    backgroundColor: colors.white,
  },

  modalBadge: {
    color: colors.orange,

    fontFamily: fonts.displayExtraBold,
    fontSize: 20,
  },

  successIcon: {
    color: colors.primary,

    fontFamily: fonts.displayExtraBold,
    fontSize: 30,
  },

  modalInnerText: {
    color: colors.text,

    fontFamily: fonts.body,
    fontSize: 12,

    lineHeight: 18,
    textAlign: 'center',
  },

  modalAction: {
    width: '100%',
    minHeight: 44,

    marginTop: 14,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: radius.pill,

    backgroundColor: colors.white,
  },

  modalActionText: {
    color: colors.textDark,

    fontFamily: fonts.displayBold,
    fontSize: 15,
  },

  rejectText: {
    marginTop: 10,

    color: colors.white,

    fontFamily: fonts.bodyMedium,
    fontSize: 12,

    textDecorationLine: 'underline',
  },

  pressed: {
    opacity: 0.8,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },
})

export default PublicPetProfileScreen