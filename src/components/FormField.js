import { StyleSheet, Text, TextInput, View } from 'react-native'
import { colors } from '../theme'

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
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
        ]}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  group: { gap: 6 },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  multiline: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
  },
})

export default FormField