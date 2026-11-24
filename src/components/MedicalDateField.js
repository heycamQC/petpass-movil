
import { useState } from 'react'

import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

// Convertir fecha al formato que recibe el backend.
function toISODate(date) {
  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')
  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Mostrar fechas en formato DD/MM/AAAA.
function toDisplayDate(value) {
  if (!value) return 'Seleccionar fecha'

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) return String(value)

  return `${match[3]}/${match[2]}/${match[1]}`
}

// Obtener la fecha actual o una fecha existente.
function getPickerDate(value) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      String(value || '')
    )

  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])

    const result = new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0
    )

    if (
      result.getFullYear() === year &&
      result.getMonth() === month - 1 &&
      result.getDate() === day
    ) {
      return result
    }
  }

  const today = new Date()
  today.setHours(12, 0, 0, 0)

  return today
}

// NUEVO: icono de calendario delineado.
// Está dibujado con View, sin instalar bibliotecas.
function CalendarOutlineIcon() {
  return (
    <View style={styles.iconContainer}>
      <View style={styles.calendarBody}>
        <View style={styles.calendarDivider} />

        <View style={styles.calendarDays}>
          <View style={styles.dayDot} />
          <View style={styles.dayDot} />
          <View style={styles.dayDot} />
          <View style={styles.dayDot} />
        </View>
      </View>

      <View
        style={[
          styles.calendarPin,
          styles.calendarPinLeft,
        ]}
      />

      <View
        style={[
          styles.calendarPin,
          styles.calendarPinRight,
        ]}
      />
    </View>
  )
}

function MedicalDateField({
  label,
  value = '',
  onChange,
  optional = false,
  disabled = false,
  onBlue = false,
}) {
  const [iosVisible, setIosVisible] =
    useState(false)

  const [draftDate, setDraftDate] =
    useState(getPickerDate(value))

  function openCalendar() {
    if (disabled) return

    const initialDate = getPickerDate(value)

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialDate,
        mode: 'date',
        display: 'calendar',

        onChange: (event, selectedDate) => {
          if (
            event.type === 'set' &&
            selectedDate
          ) {
            onChange(toISODate(selectedDate))
          }
        },
      })

      return
    }

    setDraftDate(initialDate)
    setIosVisible(true)
  }

  function confirmIOSDate() {
    onChange(toISODate(draftDate))
    setIosVisible(false)
  }

  function clearDate() {
    if (disabled || !optional) return

    onChange('')
  }

  return (
    <View style={styles.container}>

      {/* Etiqueta */}
      <Text
        style={[
          styles.label,
          onBlue && styles.labelOnBlue,
        ]}
      >
        {label}
      </Text>

      {/* Campo de fecha con icono */}
      <Pressable
        onPress={openCalendar}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`Elegir ${label}`}
        style={({ pressed }) => [
          styles.field,
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <Text
          style={[
            styles.dateText,
            !value && styles.placeholder,
          ]}
        >
          {toDisplayDate(value)}
        </Text>

        {/* ICONO DE CALENDARIO */}
        <CalendarOutlineIcon />
      </Pressable>

      {/* Eliminar próxima fecha, si existe */}
      {optional && !!value && (
        <Pressable
          onPress={clearDate}
          disabled={disabled}
          accessibilityRole="button"
          style={styles.clearButton}
        >
          <Text
            style={[
              styles.clearText,
              onBlue && styles.clearTextOnBlue,
            ]}
          >
            Quitar fecha
          </Text>
        </Pressable>
      )}

      {/* Calendario de iOS */}
      <Modal
        visible={iosVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setIosVisible(false)
        }
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() =>
              setIosVisible(false)
            }
          />

          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Seleccionar fecha
            </Text>

            {Platform.OS === 'ios' && (
              <DateTimePicker
                value={draftDate}
                mode="date"
                display="spinner"
                themeVariant="light"
                onChange={(
                  event,
                  selectedDate
                ) => {
                  if (selectedDate) {
                    setDraftDate(selectedDate)
                  }
                }}
              />
            )}

            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  setIosVisible(false)
                }
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmIOSDate}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmText}>
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },

  label: {
    paddingLeft: 16,
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  labelOnBlue: {
    color: colors.white,
  },

  field: {
    width: '100%',
    minHeight: 50,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },

  dateText: {
    flex: 1,
    color: colors.textDark,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  placeholder: {
    color: colors.placeholder,
  },

  // DISEÑO DEL NUEVO ICONO
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  calendarBody: {
    width: 20,
    height: 19,
    marginTop: 3,
    borderWidth: 1.8,
    borderColor: colors.textDark,
    borderRadius: 4,
    alignItems: 'center',
  },

  calendarDivider: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: colors.textDark,
  },

  calendarPin: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 7,
    borderRadius: 2,
    backgroundColor: colors.textDark,
  },

  calendarPinLeft: {
    left: 7,
  },

  calendarPinRight: {
    right: 7,
  },

  calendarDays: {
    marginTop: 10,
    width: 11,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 2,
  },

  dayDot: {
    width: 3,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.textDark,
  },

  clearButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },

  clearText: {
    color: colors.orange,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },

  clearTextOnBlue: {
    color: colors.white,
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.8,
  },

  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCard: {
    width: '100%',
    maxWidth: 370,
    padding: 20,
    borderRadius: 26,
    backgroundColor: colors.background,
    ...shadows.card,
  },

  modalTitle: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },

  cancelButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },

  confirmButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
  },

  cancelText: {
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  confirmText: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
})

export default MedicalDateField
