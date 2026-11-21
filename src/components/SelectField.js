import {
  Modal,
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

function SelectField({
  label,
  value,
  options = [],
  placeholder = 'Seleccionar',
  onChange,
}) {
  const selected =
    options.find(
      (option) =>
        option.value === value
    )

  const [open, setOpen] =
    require('react').useState(false)

  return (
    <>
      <View style={styles.group}>
        {!!label && (
          <Text style={styles.label}>
            {label}
          </Text>
        )}

        <Pressable
          onPress={() => setOpen(true)}
          style={({ pressed }) => [
            styles.field,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.value,
              !selected &&
                styles.placeholder,
            ]}
          >
            {selected
              ? selected.label
              : placeholder}
          </Text>

          <Text style={styles.arrow}>
            ▾
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setOpen(false)
        }
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() =>
              setOpen(false)
            }
          />

          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {label || placeholder}
            </Text>

            <View style={styles.options}>
              {options.map((option) => {
                const active =
                  option.value === value

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(
                        option.value
                      )
                      setOpen(false)
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      active &&
                        styles.optionActive,
                      pressed &&
                        styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        active &&
                          styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    gap: 4,
  },

  label: {
    paddingLeft: 16,

    color: colors.text,

    fontFamily:
      fonts.bodySemiBold,
    fontSize: 13,
  },

  field: {
    width: '100%',
    minHeight: 48,

    paddingHorizontal: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',

    borderRadius: radius.pill,

    backgroundColor:
      colors.surface,

    ...shadows.soft,
  },

  value: {
    flex: 1,

    color: colors.textDark,

    fontFamily:
      fonts.bodyMedium,
    fontSize: 14,
  },

  placeholder: {
    color: colors.placeholder,
  },

  arrow: {
    marginLeft: 10,

    color: colors.orange,

    fontSize: 18,
  },

  overlay: {
    flex: 1,

    padding: 24,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(0,0,0,0.42)',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modal: {
    width: '100%',
    maxWidth: 330,

    padding: 20,

    borderRadius: 30,

    backgroundColor:
      colors.background,

    ...shadows.card,
  },

  modalTitle: {
    marginBottom: 14,

    color: colors.text,

    fontFamily:
      fonts.displayBold,
    fontSize: 21,
  },

  options: {
    gap: 8,
  },

  option: {
    minHeight: 46,

    paddingHorizontal: 16,

    justifyContent: 'center',

    borderRadius: 16,

    backgroundColor:
      colors.surface,
  },

  optionActive: {
    backgroundColor:
      colors.primary,
  },

  optionText: {
    color: colors.text,

    fontFamily:
      fonts.bodyMedium,
    fontSize: 14,
  },

  optionTextActive: {
    color: colors.white,

    fontFamily:
      fonts.bodyBold,
  },

  pressed: {
    opacity: 0.8,
  },
})

export default SelectField