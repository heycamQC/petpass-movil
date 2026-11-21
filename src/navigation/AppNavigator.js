import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MainScreenLayout from '../layouts/MainScreenLayout'

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

import { colors } from '../theme'

const Stack = createNativeStackNavigator()

function MainRoute({
  children,
  navigation,
  route,
  activeSection,
}) {
  return (
    <MainScreenLayout
      navigation={navigation}
      currentRoute={route.name}
      activeSection={activeSection}
    >
      {children}
    </MainScreenLayout>
  )
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen name="Home">
          {(props) => (
            <MainRoute
              {...props}
              activeSection="home"
            >
              <HomeScreen {...props} />
            </MainRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Mascotas">
          {(props) => (
            <MainRoute
              {...props}
              activeSection="qr"
            >
              <PetsScreen {...props} />
            </MainRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Carnet">
          {(props) => (
            <MainRoute
              {...props}
              activeSection="qr"
            >
              <DigitalCardScreen {...props} />
            </MainRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Historial">
          {(props) => (
            <MainRoute
              {...props}
              activeSection="qr"
            >
              <MedicalHistoryScreen {...props} />
            </MainRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="EditarMascota">
          {(props) => (
            <MainRoute
              {...props}
              activeSection="qr"
            >
              <EditPetScreen {...props} />
            </MainRoute>
          )}
        </Stack.Screen>

        <Stack.Screen
          name="PerfilPublico"
          component={PublicPetProfileScreen}
        />

        <Stack.Screen name="Alertas">
          {(props) => (
            <MainRoute
              {...props}
              activeSection="home"
            >
              <AlertsScreen {...props} />
            </MainRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Mapa">
          {(props) => (
            <MainRoute
              {...props}
              activeSection="map"
            >
              <MapScreen {...props} />
            </MainRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Cuenta">
          {(props) => (
            <MainRoute
              {...props}
              activeSection="settings"
            >
              <AccountScreen {...props} />
            </MainRoute>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator