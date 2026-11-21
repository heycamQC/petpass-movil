import { useState } from 'react'

import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import {
  colors,
  fonts,
  radius,
} from '../theme'

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error = '',
  keyboardType = 'default',
  multiline = false,
  secureTextEntry = false,
}) {
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.group}>
      {!!label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.focused,
          !!error && styles.inputError,
        ]}
      />

      {!!error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
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

    fontFamily: fonts.bodySemiBold,
    fontSize: 13,

    letterSpacing: 0.2,
  },

  input: {
    width: '100%',
    minHeight: 48,

    paddingHorizontal: 22,
    paddingVertical: 10,

    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radius.pill,

    backgroundColor: colors.surface,
    color: colors.textDark,

    fontFamily: fonts.bodyMedium,
    fontSize: 14,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  focused: {
    borderColor: 'rgba(223, 104, 62, 0.35)',
  },

  multiline: {
    minHeight: 110,
    paddingTop: 16,

    borderRadius: 24,

    textAlignVertical: 'top',
  },

  inputError: {
    borderColor: colors.orange,
  },

  error: {
    paddingLeft: 16,

    color: colors.orange,

    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
})

export default FormField