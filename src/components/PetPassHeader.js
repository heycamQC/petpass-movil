import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { Image } from 'expo-image'

import {
  SafeAreaView,
} from 'react-native-safe-area-context'

import {
  colors,
  shadows,
} from '../theme'

const LOGO =
  require('../../assets/Logo.svg')

function PetPassHeader({
  onMenuPress,
}) {
  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safe}
    >
      <View style={styles.header}>
        <Image
          source={LOGO}
          contentFit="contain"
          contentPosition="left center"
          style={styles.logo}
        />

        <Pressable
          onPress={onMenuPress}
          accessibilityLabel="Abrir menú"
          style={({ pressed }) => [
            styles.menu,
            pressed &&
              styles.menuPressed,
          ]}
        >
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    width: '100%',

    backgroundColor: colors.blue,

    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,

    ...shadows.soft,

    zIndex: 10,
  },

  header: {
    minHeight: 74,

    paddingHorizontal: 24,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  logo: {
    width: 220,
    height: 56,
  },

  menu: {
    width: 44,
    height: 44,

    alignItems: 'center',
    justifyContent: 'center',

    gap: 5.5,
  },

  menuPressed: {
    opacity: 0.75,
  },

  line: {
    width: 32,
    height: 4.5,

    borderRadius: 999,

    backgroundColor:
      colors.white,
  },
})

export default PetPassHeader