
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Image } from 'expo-image'
import Svg, { Circle, Path } from 'react-native-svg'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

// Recuperamos los círculos decorativos de la tarjeta original.
function SoftBubbles() {
  return (
    <View
      style={styles.bubbles}
      pointerEvents="none"
    >
      <View style={[styles.bubble, styles.bubbleOne]} />
      <View style={[styles.bubble, styles.bubbleTwo]} />
      <View style={[styles.bubble, styles.bubbleThree]} />
      <View style={[styles.bubble, styles.bubbleFour]} />
    </View>
  )
}

// Iconos SVG.
// Se utiliza react-native-svg, que ya tiene PetPass.
function CardIcon({
  type,
  color = '#FFFFFF',
  size = 26,
}) {
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      {/* ESTETOSCOPIO PARA HISTORIAL MÉDICO */}
      {type === 'medical' && (
        <>
          <Path
            d="M6 3v5a5 5 0 0 0 10 0V3"
            {...stroke}
          />
          <Path
            d="M4 3h4M14 3h4"
            {...stroke}
          />
          <Path
            d="M11 13v3a4 4 0 0 0 8 0v-2"
            {...stroke}
          />
          <Circle
            cx="19"
            cy="12"
            r="2"
            {...stroke}
          />
        </>
      )}

      {/* EDITAR */}
      {type === 'edit' && (
        <>
          <Path
            d="M12 20h9"
            {...stroke}
          />
          <Path
            d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4 10.5-10.5Z"
            {...stroke}
          />
        </>
      )}

      {/* ELIMINAR */}
      {type === 'delete' && (
        <>
          <Path
            d="M3 6h18M8 6V4h8v2M5 6l1 14h12l1-14"
            {...stroke}
          />
          <Path
            d="M10 10v7M14 10v7"
            {...stroke}
          />
        </>
      )}

      {/* ACCESO DIRECTO AL CARNET */}
      {type === 'qr' && (
        <>
          <Path
            d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z"
            {...stroke}
          />
          <Path
            d="M14 14h3v3h-3zM20 14v3M17 20h4M14 20v1"
            {...stroke}
          />
        </>
      )}
    </Svg>
  )
}

// Acción secundaria con icono y texto.
function QuickAction({
  label,
  icon,
  onPress,
  danger = false,
  disabled = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.quickAction,
        danger && styles.quickActionDanger,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <CardIcon type={icon} />

      <Text style={styles.quickActionText}>
        {label}
      </Text>
    </Pressable>
  )
}

function PetCard({
  petId,
  name,
  photo,
  species,
  breed,
  age,
  onEdit,
  onQrPress,
  onHistory,
  onDelete,
  deleting = false,
}) {
  return (
    <View style={styles.card}>
      <SoftBubbles />

      {/* ENCABEZADO DIFERENTE AL CARNET DIGITAL */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            Mi mascota
          </Text>

          <Text style={styles.headerSubtitle}>
            Información y cuidados
          </Text>
        </View>

        {!!onQrPress && (
          <Pressable
            onPress={onQrPress}
            accessibilityRole="button"
            accessibilityLabel="Abrir carnet QR"
            style={({ pressed }) => [
              styles.qrShortcut,
              pressed && styles.pressed,
            ]}
          >
            <CardIcon
              type="qr"
              size={22}
            />
          </Pressable>
        )}
      </View>

      {/* DATOS A LA IZQUIERDA Y FOTO A LA DERECHA */}
      <View style={styles.petDetails}>
        <View style={styles.infoColumn}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>
              Nombre
            </Text>

            <Text
              style={styles.infoValue}
              numberOfLines={2}
            >
              {name}
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>
              Raza
            </Text>

            <Text
              style={styles.infoValue}
              numberOfLines={2}
            >
              {breed || species || 'No registrada'}
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>
              Edad
            </Text>

            <Text style={styles.infoValue}>
              {age || 'No registrada'}
            </Text>
          </View>
        </View>

        {/* FOTO ORIGINAL DE LA MASCOTA */}
        <View style={styles.photoContainer}>
          {photo ? (
            <Image
              source={photo}
              contentFit="cover"
              style={styles.photo}
            />
          ) : (
            <View style={styles.photoFallback}>
              <Text style={styles.photoFallbackText}>
                {species === 'Gato'
                  ? '🐱'
                  : species === 'Perro'
                    ? '🐶'
                    : '🐾'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* CONSERVAMOS ESPECIE E ID PETPASS */}
      <View style={styles.identityRow}>
        <Text
          style={styles.identityText}
          numberOfLines={1}
        >
          {species || 'Mascota'}
        </Text>

        <Text
          style={styles.identityText}
          numberOfLines={1}
        >
          ID PetPass · PP-{petId}
        </Text>
      </View>

      {/* ACCIÓN PRINCIPAL */}
      <Pressable
        onPress={onQrPress}
        disabled={!onQrPress}
        accessibilityRole="button"
        accessibilityLabel="Ver carnet digital"
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.primaryText}>
          Ver carnet digital
        </Text>
      </Pressable>

      {/* ACCIONES SECUNDARIAS CON ICONOS */}
      <View style={styles.quickActions}>
        <QuickAction
          label="Historial"
          icon="medical"
          onPress={onHistory}
        />

        <QuickAction
          label="Editar"
          icon="edit"
          onPress={onEdit}
        />

        <QuickAction
          label="Eliminar"
          icon="delete"
          danger
          disabled={deleting}
          onPress={onDelete}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: colors.blue,
    ...shadows.card,
  },

  // CÍRCULOS DECORATIVOS
  bubbles: {
    ...StyleSheet.absoluteFillObject,
  },

  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  bubbleOne: {
    width: 95,
    height: 95,
    top: 28,
    right: 92,
  },

  bubbleTwo: {
    width: 76,
    height: 76,
    top: 96,
    right: -20,
  },

  bubbleThree: {
    width: 126,
    height: 126,
    top: 176,
    right: 20,
  },

  bubbleFour: {
    width: 70,
    height: 70,
    top: 210,
    right: 176,
  },

  // ENCABEZADO
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    color: colors.white,
    fontFamily: fonts.displayBold,
    fontSize: 25,
    lineHeight: 30,
  },

  headerSubtitle: {
    marginTop: 3,
    color: 'rgba(255,255,255,0.88)',
    fontFamily: fonts.body,
    fontSize: 12,
  },

  qrShortcut: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
  },

  // NOMBRE, RAZA, EDAD Y FOTO
  petDetails: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    minHeight: 202,
  },

  infoColumn: {
    flex: 1,
    minWidth: 0,
    gap: 13,
    paddingBottom: 4,
  },

  infoBlock: {
    gap: 2,
  },

  infoLabel: {
    color: colors.white,
    fontFamily: fonts.displayBold,
    fontSize: 20,
    lineHeight: 24,
  },

  infoValue: {
    color: 'rgba(255,255,255,0.95)',
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20,
  },

  photoContainer: {
    width: 132,
    height: 132,
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: colors.yellowNav,
    ...shadows.soft,
  },

  photo: {
    width: '100%',
    height: '100%',
  },

  photoFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  photoFallbackText: {
    fontSize: 48,
  },

  // IDENTIFICACIÓN
  identityRow: {
    marginTop: 22,
    marginBottom: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },

  identityText: {
    flexShrink: 1,
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
  },

  // VER CARNET DIGITAL
  primaryButton: {
    minHeight: 51,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
    ...shadows.soft,
  },

  primaryText: {
    color: colors.white,
    fontFamily: fonts.displayBold,
    fontSize: 17,
    textAlign: 'center',
  },

  // HISTORIAL, EDITAR Y ELIMINAR
  quickActions: {
    marginTop: 13,
    flexDirection: 'row',
    gap: 8,
  },

  quickAction: {
    flex: 1,
    minWidth: 0,
    minHeight: 75,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  quickActionDanger: {
    backgroundColor: 'rgba(225,103,71,0.30)',
  },

  quickActionText: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: 11.5,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.8,
    transform: [
      { scale: 0.97 },
    ],
  },

  disabled: {
    opacity: 0.45,
  },
})

export default PetCard
