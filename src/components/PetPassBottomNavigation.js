import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

import {
  colors,
  fonts,
  shadows,
} from '../theme'

const ITEMS = [
  {
    id: 'qr',
    symbol: '▦',
    route: 'Mascotas',
    label: 'Mascotas',
  },
  {
    id: 'home',
    symbol: '⌂',
    route: 'Home',
    label: 'Inicio',
  },
  {
    id: 'map',
    symbol: '⌖',
    route: 'Mapa',
    label: 'Mapa',
  },
  {
    id: 'settings',
    symbol: '⚙',
    route: 'Cuenta',
    label: 'Cuenta',
  },
]

function PetPassBottomNavigation({
  navigation,
  activeSection = 'home',
}) {
  const handlePress = (item) => {
    navigation.navigate(item.route)
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={styles.safe}
    >
      <View style={styles.navigation}>
        {ITEMS.map((item) => {
          const active =
            activeSection === item.id

          return (
            <Pressable
              key={item.id}
              onPress={() =>
                handlePress(item)
              }
              accessibilityLabel={item.label}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
            >
              <Text
                style={[
                  styles.icon,
                  active && styles.iconActive,
                ]}
              >
                {item.symbol}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    width: '100%',

    backgroundColor: colors.yellowNav,

    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,

    ...shadows.soft,
  },

  navigation: {
    minHeight: 76,

    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 6,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  item: {
    width: 58,
    height: 58,

    alignItems: 'center',
    justifyContent: 'center',
  },

  itemPressed: {
    transform: [
      {
        scale: 0.92,
      },
    ],
  },

  icon: {
    color: colors.orange,

    fontFamily: fonts.bodyBold,
    fontSize: 29,

    opacity: 0.72,
  },

  iconActive: {
    opacity: 1,

    transform: [
      {
        scale: 1.12,
      },
    ],

    textShadowColor:
      'rgba(223, 104, 62, 0.30)',

    textShadowOffset: {
      width: 0,
      height: 2,
    },

    textShadowRadius: 4,
  },
})

export default PetPassBottomNavigation