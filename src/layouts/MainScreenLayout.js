import { useState } from 'react'

import {
  StyleSheet,
  View,
} from 'react-native'

import PetPassBottomNavigation
  from '../components/PetPassBottomNavigation'

import PetPassHeader
  from '../components/PetPassHeader'

import PetPassSideMenu
  from '../components/PetPassSideMenu'

import {
  colors,
} from '../theme'

function MainScreenLayout({
  children,
  navigation,
  currentRoute,
  activeSection = 'home',
}) {
  const [
    menuVisible,
    setMenuVisible,
  ] = useState(false)

  return (
    <View style={styles.layout}>
      <PetPassHeader
        onMenuPress={() =>
          setMenuVisible(true)
        }
      />

      <View style={styles.content}>
        {children}
      </View>

      <PetPassBottomNavigation
        navigation={navigation}
        activeSection={activeSection}
      />

      <PetPassSideMenu
        visible={menuVisible}
        navigation={navigation}
        currentRoute={currentRoute}
        onClose={() =>
          setMenuVisible(false)
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,

    width: '100%',

    backgroundColor: colors.background,
  },

  content: {
    flex: 1,

    width: '100%',
  },
})

export default MainScreenLayout