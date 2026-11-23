import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'

import { Image } from 'expo-image'
import QRCode from 'react-native-qrcode-svg'

import Button from '../components/Button'
import Message from '../components/Message'
import useApi from '../hooks/useApi'
import { API_URL } from '../config'
import { getPetPhotoSource } from '../utils/petPhoto'
import { getPublicPetProfileUrl } from '../utils/publicProfileUrl'
import ScreenContainer from '../components/ScreenContainer'

import {
  colors,
  fonts,
  radius,
  spacing,
} from '../theme'

function InfoBox({
  label,
  value,
  fullWidth = false,
}) {
  return (
    <View
      style={[
        styles.infoBox,
        fullWidth && styles.infoBoxFull,
      ]}
    >
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  )
}

function DigitalCardScreen({ navigation, route }) {
  const { width } = useWindowDimensions()
  const mobile = width <= 440

  // El ID viene de PetsScreen, NO de un objeto fijo Toby.
  const petId = Number(route.params?.id)
  const validId = Number.isInteger(petId) && petId > 0
  const url = validId ? `${API_URL}/api/mascotas/${petId}` : null
  const { data: pet, loading, error } = useApi(url)

  if (!validId) {
    return (
      <ScreenContainer>
        <Message error="No se recibió un ID válido de mascota." />
        <Button variant="secondary" onPress={() => navigation.goBack()}>
          Volver a mascotas
        </Button>
      </ScreenContainer>
    )
  }

  if (loading || error || !pet) {
    return (
      <ScreenContainer>
        <Message loading={loading} error={error || (!loading && 'No se encontró la mascota.')} />
        {!loading && (
          <Button variant="secondary" onPress={() => navigation.goBack()}>
            Volver a mascotas
          </Button>
        )}
      </ScreenContainer>
    )
  }

  const photoSource = getPetPhotoSource(pet.photo)
  const profileUrl = getPublicPetProfileUrl(pet.id)

  async function openProfileWeb() {
    if (!profileUrl) return
    try {
      await Linking.openURL(profileUrl)
    } catch {
      Alert.alert('No se pudo abrir el perfil', 'Comprueba que PetPass Web esté encendida en la misma red.')
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.heading}>
        <Text style={styles.pageTitle}>
          Carnet digital
        </Text>

        <Text style={styles.pageSubtitle}>
          Identificación digital de tu mascota.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.brand}>
          <Text style={styles.brandName}>
            PetPass
          </Text>

          <Text style={styles.brandSmall}>
            Identidad de mascota
          </Text>
        </View>

        <View
          style={[
            styles.petSection,
            mobile &&
              styles.petSectionMobile,
          ]}
        >
          <View style={styles.photoWrapper}>
            {photoSource ? (
              <Image
                source={photoSource}
                contentFit="cover"
                style={styles.photo}
              />
            ) : (
              <Text style={styles.photoFallback}>
                {pet.species === 'Gato' ? '🐱' : pet.species === 'Perro' ? '🐶' : '🐾'}
              </Text>
            )}
          </View>

          <View
            style={[
              styles.petText,
              mobile &&
                styles.petTextMobile,
            ]}
          >
            <Text style={styles.petName}>
              {pet.name}
            </Text>

            <Text style={styles.petMeta}>
              {pet.species} · {pet.breed || 'Raza no registrada'}
            </Text>

            <Text style={styles.petMeta}>
              {pet.age || 'Edad no registrada'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.infoGrid,
            mobile &&
              styles.infoGridMobile,
          ]}
        >
          <InfoBox
            label="Tutor"
            value="Usuario PetPass"
            fullWidth={mobile}
          />

          <InfoBox
            label="ID PetPass"
            value={`PP-${pet.id}`}
            fullWidth={mobile}
          />
        </View>


          <View style={styles.qrSection}>
            {profileUrl ? (
              <View style={styles.qrFrame}>
                <QRCode
                  value={profileUrl}
                  size={180}
                  color="#111827"
                  backgroundColor="#FFFFFF"
                  ecl="M"
                />
              </View>
            ) : (
              <Text style={styles.qrText}>
                No se pudo generar el código QR.
              </Text>
            )}

            <Text style={styles.qrText}>
              Escanea este código para ver el perfil público de {pet.name}.
            </Text>
          </View>

      </View>

      <View style={styles.actions}>
        <Button
          variant="secondary"
          onPress={() => navigation.navigate('EscanearQR')}
        >
          Escanear otro carnet
        </Button>
        {!!profileUrl && (
          <Button variant="secondary" onPress={openProfileWeb}>
            Probar enlace del QR en navegador
          </Button>
        )}

        <Button
          onPress={() =>
            navigation.navigate(
              'PerfilPublico', { id: pet.id }
            )
          }
        >
          Ver perfil público
        </Button>

        <Button
          variant="secondary"
          onPress={() => navigation.navigate('Historial', {
            id: pet.id,
            petName: pet.name,
          })}
        >
          Ver historial médico
        </Button>

        <Button
          variant="secondary"
          onPress={() =>
            Alert.alert(
              'Carnet digital',
              'La descarga del carnet se integrará en una siguiente etapa.'
            )
          }
        >
          Descargar carnet
        </Button>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 24,
  },

  pageTitle: {
    color: colors.text,

    fontFamily: fonts.displayBold,
    fontSize: 28,

    lineHeight: 34,
  },

  pageSubtitle: {
    marginTop: 6,

    color: colors.muted,

    fontFamily: fonts.body,
    fontSize: 14,

    lineHeight: 20,
  },

  card: {
    width: '100%',

    padding: 24,

    overflow: 'hidden',

    borderRadius: 36,

    backgroundColor: colors.blue,
  },

  brand: {
    marginBottom: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    gap: spacing.md,
  },

  brandName: {
    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 22,
  },

  brandSmall: {
    flexShrink: 1,

    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 11,

    textAlign: 'right',
  },

  petSection: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 18,
  },

  petSectionMobile: {
    flexDirection: 'column',
  },

  photoWrapper: {
    width: 100,
    height: 100,

    flexShrink: 0,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    borderRadius: radius.pill,

    backgroundColor: colors.accent,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  photoFallback: {
    fontSize: 46,
  },

  petText: {
    flex: 1,
  },

  petTextMobile: {
    alignItems: 'center',
  },

  petName: {
    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 26,

    lineHeight: 32,
  },

  petMeta: {
    marginTop: 4,

    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 13,

    lineHeight: 18,
  },

  infoGrid: {
    marginTop: 22,

    flexDirection: 'row',

    gap: 12,
  },

  infoGridMobile: {
    flexDirection: 'column',
  },

  infoBox: {
    flex: 1,

    gap: 3,

    padding: 12,

    borderRadius: 18,

    backgroundColor:
      'rgba(255,255,255,0.85)',
  },

  infoBoxFull: {
    width: '100%',
    flex: 0,
  },

  infoLabel: {
    color: colors.muted,

    fontFamily: fonts.body,
    fontSize: 10,
  },

  infoValue: {
    color: colors.text,

    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },

  qrSection: {
    marginTop: 24,

    alignItems: 'center',

    gap: 8,
  },


  qrFrame: {
    width: 204,
    height: 204,

    padding: 12,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,
    backgroundColor: colors.white,
  },


  qrText: {
    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 11,

    textAlign: 'center',
  },

  qrNote: {
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.85,
  },

  actions: {
    marginTop: 20,

    gap: 12,
  },
})

export default DigitalCardScreen