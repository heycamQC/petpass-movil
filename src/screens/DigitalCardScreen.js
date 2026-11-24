
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'

import { Image } from 'expo-image'
import QRCode from 'react-native-qrcode-svg'
import Svg, { Path } from 'react-native-svg'

import Button from '../components/Button'
import Message from '../components/Message'
import ScreenContainer from '../components/ScreenContainer'

import useApi from '../hooks/useApi'
import { API_URL } from '../config'
import { getPetPhotoSource } from '../utils/petPhoto'
import { getPublicPetProfileUrl } from '../utils/publicProfileUrl'

import {
  colors,
  fonts,
  radius,
  spacing,
} from '../theme'

// ===================================================
// INFORMACIÓN DE LA MASCOTA
// ===================================================

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

// ===================================================
// ICONOS DEL CARNET
// Se usa react-native-svg, ya instalado en PetPass.
// ===================================================

function ActionIcon({ type }) {
  const iconProps = {
    fill: 'none',
    stroke: '#FFFFFF',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 24 24"
    >
      {type === 'link' && (
        <>
          <Path
            d="M13 5h6v6M19 5l-9 9"
            {...iconProps}
          />

          <Path
            d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"
            {...iconProps}
          />
        </>
      )}

      {type === 'download' && (
        <>
          <Path
            d="M12 3v12"
            {...iconProps}
          />

          <Path
            d="m7 10 5 5 5-5"
            {...iconProps}
          />

          <Path
            d="M4 17v3h16v-3"
            {...iconProps}
          />
        </>
      )}

      {type === 'scan' && (
        <>
          <Path
            d="M4 9V5a1 1 0 0 1 1-1h4"
            {...iconProps}
          />

          <Path
            d="M15 4h4a1 1 0 0 1 1 1v4"
            {...iconProps}
          />

          <Path
            d="M4 15v4a1 1 0 0 0 1 1h4"
            {...iconProps}
          />

          <Path
            d="M15 20h4a1 1 0 0 0 1-1v-4"
            {...iconProps}
          />

          <Path
            d="M4 12h16"
            {...iconProps}
          />
        </>
      )}
    </Svg>
  )
}

// ===================================================
// ACCIÓN SECUNDARIA CON ICONO
// ===================================================

function QuickAction({
  label,
  icon,
  onPress,
  disabled = false,
  pending = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={
        pending
          ? 'Funcionalidad pendiente de implementar'
          : undefined
      }
      style={({ pressed }) => [
        styles.quickAction,
        disabled && styles.quickActionDisabled,
        pressed && styles.pressed,
      ]}
    >
      <ActionIcon type={icon} />

      <Text
        style={styles.quickActionText}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {label}
      </Text>

      {pending && (
        <Text style={styles.pendingText}>
          Próximamente
        </Text>
      )}
    </Pressable>
  )
}

// ===================================================
// PANTALLA PRINCIPAL
// ===================================================

function DigitalCardScreen({ navigation, route }) {
  const { width } = useWindowDimensions()

  const mobile = width <= 440

  // Siempre utilizamos el ID real de la mascota.
  const petId = Number(route.params?.id)

  const validId =
    Number.isInteger(petId) && petId > 0

  const url = validId
    ? `${API_URL}/api/mascotas/${petId}`
    : null

  const {
    data: pet,
    loading,
    error,
  } = useApi(url)

  // -----------------------------------------------
  // VALIDACIÓN DE ID
  // -----------------------------------------------

  if (!validId) {
    return (
      <ScreenContainer>
        <Message
          error="No se recibió un ID válido de mascota."
        />

        <Button
          variant="secondary"
          onPress={() => navigation.goBack()}
        >
          Volver a mascotas
        </Button>
      </ScreenContainer>
    )
  }

  // -----------------------------------------------
  // CARGA DE DATOS DESDE LA API
  // -----------------------------------------------

  if (loading || error || !pet) {
    return (
      <ScreenContainer>
        <Message
          loading={loading}
          error={
            error ||
            (!loading
              ? 'No se encontró la mascota.'
              : '')
          }
        />

        {!loading && (
          <Button
            variant="secondary"
            onPress={() => navigation.goBack()}
          >
            Volver a mascotas
          </Button>
        )}
      </ScreenContainer>
    )
  }

  const photoSource = getPetPhotoSource(pet.photo)

  // Se conserva el generador original del enlace QR.
  const profileUrl = getPublicPetProfileUrl(pet.id)

  // -----------------------------------------------
  // ABRIR ENLACE DEL QR EN EL NAVEGADOR
  // -----------------------------------------------

  async function openProfileWeb() {
    if (!profileUrl) return

    try {
      await Linking.openURL(profileUrl)
    } catch {
      Alert.alert(
        'No se pudo abrir el perfil',
        'Comprueba que PetPass Web esté encendida en la misma red.'
      )
    }
  }

  // -----------------------------------------------
  // DESCARGAR CARNET
  // Aún no existe descarga real en este proyecto.
  // Se conserva el aviso de la versión anterior.
  // -----------------------------------------------

  function handleDownload() {
    Alert.alert(
      'Descargar carnet',
      'La descarga del carnet se integrará en una siguiente etapa.'
    )
  }

  // -----------------------------------------------
  // NAVEGACIÓN ORIGINAL
  // -----------------------------------------------

  function openPublicProfile() {
    navigation.navigate(
      'PerfilPublico',
      { id: pet.id }
    )
  }

  function openMedicalHistory() {
    navigation.navigate(
      'Historial',
      {
        id: pet.id,
        petName: pet.name,
      }
    )
  }

  function openScanner() {
    navigation.navigate('EscanearQR')
  }

  // ===================================================
  // INTERFAZ VISUAL DEL CARNET
  // ===================================================

  return (
    <ScreenContainer>

      {/* ENCABEZADO */}
      <View style={styles.heading}>
        <Text style={styles.pageTitle}>
          Carnet digital
        </Text>

        <Text style={styles.pageSubtitle}>
          Identificación digital de tu mascota.
        </Text>
      </View>

      {/* TARJETA PRINCIPAL AZUL */}
      <View style={styles.card}>

        {/* MARCA PETPASS */}
        <View style={styles.brand}>
          <Text style={styles.brandName}>
            PetPass
          </Text>

          <Text style={styles.brandSmall}>
            Identidad de mascota
          </Text>
        </View>

        {/* FOTOGRAFÍA Y DATOS */}
        <View
          style={[
            styles.petSection,
            mobile && styles.petSectionMobile,
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
                {pet.species === 'Gato'
                  ? '🐱'
                  : pet.species === 'Perro'
                    ? '🐶'
                    : '🐾'}
              </Text>
            )}
          </View>

          <View
            style={[
              styles.petText,
              mobile && styles.petTextMobile,
            ]}
          >
            <Text style={styles.petName}>
              {pet.name}
            </Text>

            <Text style={styles.petMeta}>
              {pet.species}
              {' · '}
              {pet.breed || 'Raza no registrada'}
            </Text>

            <Text style={styles.petMeta}>
              {pet.age || 'Edad no registrada'}
            </Text>
          </View>
        </View>

        {/* INFORMACIÓN DEL CARNET */}
        <View
          style={[
            styles.infoGrid,
            mobile && styles.infoGridMobile,
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

        {/* CÓDIGO QR REAL */}
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
            Escanea este código para ver el
            perfil público de {pet.name}.
          </Text>
        </View>

        {/* NUEVO: ACCIONES SECUNDARIAS CON ICONOS */}
        <View style={styles.quickActions}>
          <QuickAction
            label="Enlace QR"
            icon="link"
            onPress={openProfileWeb}
            disabled={!profileUrl}
          />

          <QuickAction
            label="Descargar"
            icon="download"
            onPress={handleDownload}
            pending
          />

          <QuickAction
            label="Escanear"
            icon="scan"
            onPress={openScanner}
          />
        </View>

      </View>

      {/* SOLO DOS BOTONES PRINCIPALES */}
      <View style={styles.actions}>

        <Button onPress={openPublicProfile}>
          Ver perfil público
        </Button>

        <Button
          variant="secondary"
          onPress={openMedicalHistory}
        >
          Ver historial médico
        </Button>

      </View>
    </ScreenContainer>
  )
}

// ===================================================
// ESTILOS
// ===================================================

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

  // TARJETA AZUL
  card: {
    width: '100%',
    padding: 22,
    overflow: 'hidden',
    borderRadius: 36,
    backgroundColor: colors.blue,
  },

  // MARCA
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

  // MASCOTA
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
    textAlign: 'center',
  },

  petMeta: {
    marginTop: 4,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },

  // INFORMACIÓN
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
    backgroundColor: 'rgba(255,255,255,0.85)',
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

  // SECCIÓN QR
  qrSection: {
    marginTop: 24,
    alignItems: 'center',
    gap: 10,
  },

  qrFrame: {
    width: 204,
    height: 204,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.white,
  },

  qrText: {
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  // NUEVA FILA DE ICONOS
  quickActions: {
    width: '100%',
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 8,
  },

  quickAction: {
    flex: 1,
    minWidth: 0,
    minHeight: 79,
    paddingHorizontal: 4,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  quickActionDisabled: {
    opacity: 0.45,
  },

  quickActionText: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    textAlign: 'center',
  },

  pendingText: {
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 9,
    textAlign: 'center',
    opacity: 0.85,
  },

  // BOTONES PRINCIPALES
  actions: {
    marginTop: 20,
    gap: 12,
  },

  pressed: {
    opacity: 0.75,
    transform: [
      { scale: 0.97 },
    ],
  },
})

export default DigitalCardScreen
