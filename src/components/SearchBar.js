import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

function SearchBar({
  value = '',
  placeholder = 'Buscar...',
  onChangeText,
  onClear,
}) {
  const filled =
    value.trim().length > 0

  return (
    <View
      style={[
        styles.container,
        filled && styles.filled,
      ]}
    >
      <Text style={styles.searchIcon}>
        🔍
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={
          colors.muted
        }
        style={styles.input}
      />

      {filled && (
        <Pressable
          onPress={onClear}
          accessibilityLabel="Limpiar búsqueda"
          style={({ pressed }) => [
            styles.clear,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.clearText}>
            ×
          </Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 44,

    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 10,

    borderWidth: 1.5,
    borderColor: '#dcd7ce',
    borderRadius: radius.pill,

    backgroundColor: colors.white,

    ...shadows.soft,
  },

  filled: {
    borderColor: colors.primary,
  },

  searchIcon: {
    flexShrink: 0,

    fontSize: 17,
  },

  input: {
    flex: 1,

    minWidth: 0,

    paddingVertical: 9,

    color: colors.text,

    fontFamily: fonts.body,
    fontSize: 14,
  },

  clear: {
    width: 30,
    height: 30,

    flexShrink: 0,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: radius.pill,

    backgroundColor: colors.accent,
  },

  clearText: {
    marginTop: -2,

    color: colors.text,

    fontSize: 21,
    lineHeight: 24,
  },

  pressed: {
    opacity: 0.7,
  },
})

export default SearchBar