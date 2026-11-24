
import { useEffect, useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
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

// Números disponibles del 1 al 20.
const NUMBERS = Array.from(
  { length: 20 },
  (_, index) => index + 1
)

// Interpretar la edad existente de una mascota.
function parseAge(value) {
  const text = String(value ?? '').trim()

  const match =
    /^(\d{1,2})\s*(años?|anos?|mes(?:es)?)?$/i.exec(text)

  if (!match) return null

  const number = Number(match[1])

  if (number < 1 || number > 20) {
    return null
  }

  const unit = /^mes/i.test(match[2] || '')
    ? 'meses'
    : 'años'

  return { number, unit }
}

// Mantener el formato de texto que recibe el backend.
function formatAge(number, unit) {
  if (!number) return ''

  if (unit === 'meses') {
    return `${number} ${number === 1 ? 'mes' : 'meses'}`
  }

  return `${number} ${number === 1 ? 'año' : 'años'}`
}

function PetAgeField({
  value = '',
  onChange,
  disabled = false,
}) {
  const parsedAge = parseAge(value)

  const [unit, setUnit] = useState(
    parsedAge?.unit || 'años'
  )

  const [modalVisible, setModalVisible] =
    useState(false)

  // Recuperar meses o años cuando se edita una mascota.
  useEffect(() => {
    const saved = parseAge(value)

    if (saved) {
      setUnit(saved.unit)
    }
  }, [value])

  function changeUnit(nextUnit) {
    if (disabled) return

    setUnit(nextUnit)

    if (parsedAge) {
      onChange(
        formatAge(parsedAge.number, nextUnit)
      )
    }
  }

  function selectNumber(number) {
    onChange(formatAge(number, unit))
    setModalVisible(false)
  }

  function clearAge() {
    if (disabled) return

    onChange('')
    setUnit('años')
  }

  const hasValue =
    String(value ?? '').trim() !== ''

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Edad (opcional)
      </Text>

      {/* Selector principal */}
      <View style={styles.row}>
        <Pressable
          disabled={disabled}
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Seleccionar edad"
          style={({ pressed }) => [
            styles.numberButton,
            disabled && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.numberText,
              !parsedAge && styles.placeholder,
            ]}
          >
            {parsedAge
              ? parsedAge.number
              : 'Edad'}
          </Text>

          <Text style={styles.arrow}>
            ▾
          </Text>
        </Pressable>

        {/* Meses y años */}
        <View style={styles.unitGroup}>
          {['meses', 'años'].map((option) => {
            const active = unit === option

            return (
              <Pressable
                key={option}
                disabled={disabled}
                onPress={() => changeUnit(option)}
                accessibilityRole="button"
                accessibilityState={{
                  selected: active,
                }}
                style={({ pressed }) => [
                  styles.unitButton,
                  active && styles.unitButtonActive,
                  disabled && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    active && styles.unitTextActive,
                  ]}
                >
                  {option === 'meses'
                    ? 'Meses'
                    : 'Años'}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <Text style={styles.helpText}>
        Selecciona un número del 1 al 20.
      </Text>

      {/* Conservar edades antiguas no reconocidas */}
      {hasValue && !parsedAge && (
        <Text style={styles.savedText}>
          Edad guardada: {String(value)}.
          Puedes conservarla o seleccionar una nueva.
        </Text>
      )}

      {hasValue && (
        <Pressable
          disabled={disabled}
          onPress={clearAge}
          accessibilityRole="button"
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>
            Quitar edad
          </Text>
        </Pressable>
      )}

      {/* MODAL: SELECTOR VERTICAL DESLIZABLE */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() =>
              setModalVisible(false)
            }
          />

          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Seleccionar edad
            </Text>

            <Text style={styles.modalSubtitle}>
              Desliza para ver los números del 1 al 20
            </Text>

            {/* Una sola columna con desplazamiento vertical */}
            <ScrollView
              style={styles.numberScroll}
              contentContainerStyle={styles.numberList}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled
            >
              {NUMBERS.map((number) => {
                const active =
                  parsedAge?.number === number &&
                  parsedAge?.unit === unit

                return (
                  <Pressable
                    key={number}
                    onPress={() =>
                      selectNumber(number)
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Edad ${number}`}
                    accessibilityState={{
                      selected: active,
                    }}
                    style={({ pressed }) => [
                      styles.numberOption,
                      active &&
                        styles.numberOptionActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberOptionText,
                        active &&
                          styles.numberOptionTextActive,
                      ]}
                    >
                      {number}
                    </Text>

                    {active && (
                      <Text style={styles.check}>
                        ✓
                      </Text>
                    )}
                  </Pressable>
                )
              })}
            </ScrollView>

            <Pressable
              onPress={() =>
                setModalVisible(false)
              }
              accessibilityRole="button"
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },

  label: {
    paddingLeft: 16,
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  numberButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },

  numberText: {
    color: colors.textDark,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  placeholder: {
    color: colors.placeholder,
  },

  arrow: {
    color: colors.orange,
    fontSize: 18,
  },

  unitGroup: {
    flex: 1.35,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },

  unitButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },

  unitButtonActive: {
    backgroundColor: colors.primaryDark,
  },

  unitText: {
    color: colors.textDark,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },

  unitTextActive: {
    color: colors.white,
  },

  helpText: {
    paddingLeft: 12,
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11,
  },

  savedText: {
    paddingHorizontal: 12,
    color: colors.muted,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },

  clearButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  clearText: {
    color: colors.orange,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },

  disabled: {
    opacity: 0.5,
  },

  pressed: {
    opacity: 0.8,
  },

  overlay: {
    flex: 1,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modal: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 28,
    backgroundColor: colors.background,
    ...shadows.card,
  },

  modalTitle: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 22,
    textAlign: 'center',
  },

  modalSubtitle: {
    marginTop: 5,
    marginBottom: 15,
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    textAlign: 'center',
  },

  // Ventana con altura limitada para deslizar.
  numberScroll: {
    width: '100%',
    maxHeight: 300,
    flexGrow: 0,
  },

  // Los números aparecen uno debajo de otro.
  numberList: {
    gap: 7,
    paddingBottom: 8,
  },

  numberOption: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.surface,
  },

  numberOptionActive: {
    backgroundColor: colors.primaryDark,
  },

  numberOptionText: {
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
  },

  numberOptionTextActive: {
    color: colors.white,
  },

  check: {
    position: 'absolute',
    right: 18,
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },

  cancelButton: {
    marginTop: 16,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: colors.orange,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
})

export default PetAgeField
