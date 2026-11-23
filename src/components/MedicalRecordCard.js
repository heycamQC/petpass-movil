
import { useState } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { colors, fonts, shadows } from '../theme'

const VARIANTS = {
  vaccine: {
    background: '#D7D798',
    iconColor: '#59552C',
  },
  deworming: {
    background: '#F8BBA8',
    iconColor: '#963F20',
  },
  consultation: {
    background: '#FBE4B7',
    iconColor: '#796226',
  },
}

// Iconos dibujados con React Native.
// No se necesitan imagenes ni librerias adicionales.
function MedicalIcon({ type }) {
  if (type === 'deworming') {
    return (
      <View style={styles.clock}>
        <View style={styles.clockHandOne} />
        <View style={styles.clockHandTwo} />
      </View>
    )
  }

  if (type === 'consultation') {
    return (
      <View style={styles.stethoscope}>
        <View style={styles.stethoTube} />
        <View style={styles.stethoLeft} />
        <View style={styles.stethoRight} />
        <View style={styles.stethoStem} />
        <View style={styles.stethoConnector} />
        <View style={styles.stethoHead} />
      </View>
    )
  }

  return (
    <Text style={styles.checkIcon}>
      ✓
    </Text>
  )
}

// La web presenta las fechas como AAAA-MM-DD.
function toWebDate(value) {
  if (!value) return ''

  const match = String(value).match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  )

  if (!match) return String(value)

  return `${match[3]}-${match[2]}-${match[1]}`
}

function MedicalRecordCard({
  title,
  date,
  nextDate,
  place,
  description,
  type = 'vaccine',
  onEdit,
}) {
  const [expanded, setExpanded] = useState(false)

  const variant =
    VARIANTS[type] || VARIANTS.vaccine

  const hasDetails = Boolean(
    nextDate || place || description
  )

  return (
    <View style={styles.card}>

      <View style={styles.top}>

        <Pressable
          onPress={() => setExpanded((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalles de ${title}`}
          accessibilityState={{ expanded }}
          style={({ pressed }) => [
            styles.summary,
            pressed && styles.pressed,
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: variant.background },
            ]}
          >
            <View
              style={[
                styles.iconContent,
                { tintColor: variant.iconColor },
              ]}
            >
              <MedicalIcon type={type} />
            </View>
          </View>

          <View style={styles.heading}>
            <Text style={styles.title}>
              {title}
            </Text>

            <Text style={styles.date}>
              {toWebDate(date)}
            </Text>
          </View>
        </Pressable>

        {!!onEdit && (
          <Pressable
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${title}`}
            style={({ pressed }) => [
              styles.edit,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.editText}>
              ✎
            </Text>
          </Pressable>
        )}

      </View>

      {hasDetails && (
        <Pressable
          onPress={() => setExpanded((value) => !value)}
          style={styles.detailsButton}
        >
          <Text style={styles.detailsButtonText}>
            {expanded
              ? 'Ocultar detalles  ▲'
              : 'Ver detalles  ▼'}
          </Text>
        </Pressable>
      )}

      {expanded && hasDetails && (
        <View style={styles.details}>

          {!!nextDate && (
            <Text style={styles.detail}>
              <Text style={styles.bold}>
                Próxima fecha:{' '}
              </Text>
              {nextDate}
            </Text>
          )}

          {!!place && (
            <Text style={styles.detail}>
              <Text style={styles.bold}>
                Lugar:{' '}
              </Text>
              {place}
            </Text>
          )}

          {!!description && (
            <View style={styles.descriptionBox}>
              <Text style={styles.description}>
                {description}
              </Text>
            </View>
          )}

        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingHorizontal: 17,
    paddingVertical: 17,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: '#F0EDE7',
    backgroundColor: '#FBFAF8',
    ...shadows.soft,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  summary: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  iconContent: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heading: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },

  title: {
    color: colors.textDark,
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 21,
  },

  date: {
    marginTop: 1,
    color: '#8E8985',
    fontFamily: fonts.body,
    fontSize: 12,
  },

  edit: {
    width: 34,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editText: {
    color: '#8C8780',
    fontSize: 22,
  },

  detailsButton: {
    alignSelf: 'flex-end',
    paddingTop: 9,
    paddingHorizontal: 4,
    paddingBottom: 2,
  },

  detailsButtonText: {
    color: '#8B867B',
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
  },

  details: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EBE6DE',
    gap: 6,
  },

  detail: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 19,
  },

  bold: {
    fontFamily: fonts.bodySemiBold,
  },

  descriptionBox: {
    marginTop: 6,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 15,
    backgroundColor: '#F4F0E9',
  },

  description: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 19,
  },

  pressed: {
    opacity: 0.75,
  },

  // VACUNAS: CHECK
  checkIcon: {
    color: '#59552C',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 35,
  },

  // DESPARASITACION: RELOJ
  clock: {
    width: 23,
    height: 23,
    borderWidth: 2.5,
    borderColor: '#963F20',
    borderRadius: 12,
    position: 'relative',
  },

  clockHandOne: {
    position: 'absolute',
    width: 2.5,
    height: 8,
    top: 3,
    left: 8,
    borderRadius: 2,
    backgroundColor: '#963F20',
  },

  clockHandTwo: {
    position: 'absolute',
    width: 7,
    height: 2.5,
    top: 10,
    left: 9,
    borderRadius: 2,
    backgroundColor: '#963F20',
    transform: [{ rotate: '38deg' }],
  },

  // CONSULTAS: ESTETOSCOPIO
  stethoscope: {
    width: 30,
    height: 30,
    position: 'relative',
  },

  stethoTube: {
    position: 'absolute',
    top: 2,
    left: 3,
    width: 19,
    height: 18,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: '#796226',
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
  },

  stethoLeft: {
    position: 'absolute',
    top: 0,
    left: 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#796226',
  },

  stethoRight: {
    position: 'absolute',
    top: 0,
    left: 19,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#796226',
  },

  stethoStem: {
    position: 'absolute',
    top: 19,
    left: 12,
    width: 2.5,
    height: 6,
    backgroundColor: '#796226',
  },

  stethoConnector: {
    position: 'absolute',
    top: 23,
    left: 12,
    width: 13,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#796226',
  },

  stethoHead: {
    position: 'absolute',
    top: 21,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#796226',
  },
})

export default MedicalRecordCard
