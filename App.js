import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'

import { useFonts } from 'expo-font'

import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular'
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium'
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold'
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold'

import { MuseoModerno_600SemiBold } from '@expo-google-fonts/museomoderno/600SemiBold'
import { MuseoModerno_700Bold } from '@expo-google-fonts/museomoderno/700Bold'
import { MuseoModerno_800ExtraBold } from '@expo-google-fonts/museomoderno/800ExtraBold'

import AppNavigator from './src/navigation/AppNavigator'
import { colors } from './src/theme'

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    MuseoModerno_600SemiBold,
    MuseoModerno_700Bold,
    MuseoModerno_800ExtraBold,
  })

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    )
  }

  return <AppNavigator />
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
})