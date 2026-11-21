import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

const VARIANTS = {
  vaccine: {
    background: colors.blue,
    badge: colors.primaryDark,
    icon: '✚',
    label: 'Vacuna',
  },

  deworming: {
    background: colors.yellowSoft,
    badge: colors.orange,
    icon: '◆',
    label: 'Desparasitación',
  },

  consultation: {
    background: colors.primary,
    badge: colors.blueDark,
    icon: '●',
    label: 'Consulta',
  },
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
  const variant =
    VARIANTS[type] ||
    VARIANTS.vaccine

  const darkText =
    type === 'deworming'

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            variant.background,
        },
      ]}
    >
      <View style={styles.top}>
        <View
          style={[
            styles.icon,
            {
              backgroundColor:
                variant.badge,
            },
          ]}
        >
          <Text style={styles.iconText}>
            {variant.icon}
          </Text>
        </View>

        <View style={styles.heading}>
          <Text
            style={[
              styles.type,
              darkText &&
                styles.darkText,
            ]}
          >
            {variant.label}
          </Text>

          <Text
            style={[
              styles.title,
              darkText &&
                styles.darkText,
            ]}
          >
            {title}
          </Text>
        </View>

        {!!onEdit && (
          <Pressable
            onPress={onEdit}
            accessibilityLabel="Editar registro médico"
            style={({ pressed }) => [
              styles.edit,
              pressed &&
                styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.editText,
                darkText &&
                  styles.editTextDark,
              ]}
            >
              ✎
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.details}>
        <Text
          style={[
            styles.detail,
            darkText &&
              styles.darkText,
          ]}
        >
          <Text style={styles.bold}>
            Fecha:{' '}
          </Text>

          {date}
        </Text>

        {!!nextDate && (
          <Text
            style={[
              styles.detail,
              darkText &&
                styles.darkText,
            ]}
          >
            <Text style={styles.bold}>
              Próxima:{' '}
            </Text>

            {nextDate}
          </Text>
        )}

        {!!place && (
          <Text
            style={[
              styles.detail,
              darkText &&
                styles.darkText,
            ]}
          >
            <Text style={styles.bold}>
              Lugar:{' '}
            </Text>

            {place}
          </Text>
        )}
      </View>

      {!!description && (
        <View
          style={[
            styles.descriptionBox,
            darkText &&
              styles.descriptionBoxLight,
          ]}
        >
          <Text
            style={[
              styles.description,
              darkText &&
                styles.descriptionDark,
            ]}
          >
            {description}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',

    padding: 18,

    borderRadius: 28,

    ...shadows.card,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: 12,
  },

  icon: {
    width: 46,
    height: 46,

    flexShrink: 0,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 15,
  },

  iconText: {
    color: colors.white,

    fontFamily:
      fonts.displayBold,
    fontSize: 20,
  },

  heading: {
    flex: 1,
  },

  type: {
    marginBottom: 1,

    color:
      'rgba(255,255,255,0.80)',

    fontFamily: fonts.bodyMedium,
    fontSize: 11,

    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  title: {
    color: colors.white,

    fontFamily:
      fonts.displayBold,
    fontSize: 19,

    lineHeight: 23,
  },

  edit: {
    width: 38,
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',
  },

  editText: {
    color: colors.white,

    fontSize: 22,
  },

  editTextDark: {
    color: colors.text,
  },

  details: {
    marginTop: 15,

    gap: 4,
  },

  detail: {
    color:
      'rgba(255,255,255,0.94)',

    fontFamily: fonts.body,
    fontSize: 12.5,

    lineHeight: 18,
  },

  bold: {
    fontFamily:
      fonts.bodySemiBold,
  },

  darkText: {
    color: colors.text,
  },

  descriptionBox: {
    marginTop: 13,

    paddingHorizontal: 14,
    paddingVertical: 11,

    borderRadius: 18,

    backgroundColor:
      'rgba(255,255,255,0.17)',
  },

  descriptionBoxLight: {
    backgroundColor:
      'rgba(255,255,255,0.50)',
  },

  description: {
    color: colors.white,

    fontFamily: fonts.body,
    fontSize: 12,

    lineHeight: 18,
  },

  descriptionDark: {
    color: colors.text,
  },

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.94,
      },
    ],
  },
})

export default MedicalRecordCard