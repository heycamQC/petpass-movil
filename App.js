import { StatusBar } from 'expo-status-bar'
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { API_URL } from './src/config'
import useApi from './src/hooks/useApi'
import { colors } from './src/theme'

export default function App() {
  const {
    data: pets,
    loading,
    error,
  } = useApi(`${API_URL}/api/mascotas`)

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>PetPass Mobile</Text>
        <Text style={styles.subtitle}>Fundación EC3</Text>

        {loading && (
          <View style={styles.status}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.muted}>Cargando mascotas...</Text>
          </View>
        )}

        {!loading && error && (
          <Text style={styles.error}>{error}</Text>
        )}

        {!loading && !error && (
          <>
            <Text style={styles.success}>API conectada</Text>

            <Text style={styles.text}>
              Mascotas recibidas: {pets?.length ?? 0}
            </Text>
          </>
        )}
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },

  card: {
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    backgroundColor: colors.surface,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },

  subtitle: {
    marginTop: 4,
    marginBottom: 24,
    color: colors.muted,
  },

  status: {
    gap: 10,
    alignItems: 'flex-start',
  },

  muted: {
    color: colors.muted,
  },

  text: {
    marginTop: 8,
    color: colors.text,
  },

  success: {
    fontWeight: '700',
    color: colors.success,
  },

  error: {
    fontWeight: '600',
    color: colors.danger,
  },
})