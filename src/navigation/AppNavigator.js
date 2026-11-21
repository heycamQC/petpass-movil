
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import OnboardingScreen from '../screens/OnboardingScreen'
import LoginScreen from '../screens/LoginScreen'
import HomeScreen from '../screens/HomeScreen'
import PetsScreen from '../screens/PetsScreen'
import DigitalCardScreen from '../screens/DigitalCardScreen'
import MedicalHistoryScreen from '../screens/MedicalHistoryScreen'
import EditPetScreen from '../screens/EditPetScreen'
import PublicPetProfileScreen from '../screens/PublicPetProfileScreen'
import AlertsScreen from '../screens/AlertsScreen'
import MapScreen from '../screens/MapScreen'
import AccountScreen from '../screens/AccountScreen'

const Stack = createNativeStackNavigator()

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerBackTitle: 'Volver',
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'PetPass' }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'PetPass' }}
        />

        <Stack.Screen
          name="Mascotas"
          component={PetsScreen}
          options={{ title: 'Mis mascotas' }}
        />

        <Stack.Screen
          name="Carnet"
          component={DigitalCardScreen}
          options={{ title: 'Carnet digital' }}
        />

        <Stack.Screen
          name="Historial"
          component={MedicalHistoryScreen}
          options={{ title: 'Historial médico' }}
        />

        <Stack.Screen
          name="EditarMascota"
          component={EditPetScreen}
          options={{ title: 'Editar mascota' }}
        />

        <Stack.Screen
          name="PerfilPublico"
          component={PublicPetProfileScreen}
          options={{ title: 'Perfil público' }}
        />

        <Stack.Screen
          name="Alertas"
          component={AlertsScreen}
          options={{ title: 'Alertas' }}
        />

        <Stack.Screen
          name="Mapa"
          component={MapScreen}
          options={{ title: 'Mapa' }}
        />

        <Stack.Screen
          name="Cuenta"
          component={AccountScreen}
          options={{ title: 'Mi cuenta' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
