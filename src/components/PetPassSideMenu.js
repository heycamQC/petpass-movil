
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
import { PetPassIcon } from './PetPassBottomNavigation'
import { colors, fonts, radius, spacing } from '../theme'

const OPTIONS = [
  { id: 'home', icon: 'home', label: 'Inicio', route: 'Home' },
  { id: 'account', icon: 'account', label: 'Mi cuenta', route: 'Cuenta' },
  { id: 'pets', icon: 'pets', label: 'Mis mascotas', route: 'Mascotas' },
  { id: 'alerts', icon: 'alerts', label: 'Comunidad y alertas', route: 'Alertas' },
  { id: 'map', icon: 'map', label: 'Mapa Pet Friendly', route: 'Mapa' },
]

function PetPassSideMenu({ visible, navigation, currentRoute, onClose }) {
  const handleNavigate = (route) => {
    onClose()
    navigation.navigate(route)
  }

  const handleLogout = () => {
    onClose()
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.menu}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>PETPASS</Text>
              <Text style={styles.title}>Menú</Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar menú"
              style={({ pressed }) => [
                styles.close,
                pressed && styles.closePressed,
              ]}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.options}>
            {OPTIONS.map((item) => {
              const active = currentRoute === item.route

              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleNavigate(item.route)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    styles.option,
                    active && styles.optionActive,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <View style={[
                    styles.optionIcon,
                    active && styles.optionIconActive,
                  ]}>
                    <PetPassIcon
                      name={item.icon}
                      color={active ? colors.white : colors.accent}
                      size={23}
                    />
                  </View>

                  <Text style={[
                    styles.optionLabel,
                    active && styles.optionLabelActive,
                  ]}>
                    {item.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.footer}>
            <Pressable
              onPress={handleLogout}
              accessibilityRole="button"
              accessibilityLabel="Cerrar sesión"
              style={({ pressed }) => [
                styles.logout,
                pressed && styles.logoutPressed,
              ]}
            >
              <PetPassIcon
                name="logout"
                color="#f3a083"
                size={20}
              />

              <Text style={styles.logoutText}>
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>

        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Cerrar menú"
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(37, 36, 34, 0.48)',
  },

  menu: {
    width: '82%',
    maxWidth: 330,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.text,
    zIndex: 2,
  },

  backdrop: {
    flex: 1,
  },

  header: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  eyebrow: {
    marginBottom: 2,
    color: colors.accent,
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.4,
  },

  title: {
    color: colors.white,
    fontFamily: fonts.displayExtraBold,
    fontSize: 27,
    lineHeight: 32,
  },

  close: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  closePressed: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },

  closeText: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },

  options: {
    gap: spacing.sm,
  },

  option: {
    width: '100%',
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
  },

  optionPressed: {
    opacity: 0.82,
  },

  optionActive: {
    backgroundColor: colors.primary,
  },

  optionIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  optionIconActive: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },

  optionLabel: {
    flex: 1,
    color: 'rgba(255,255,255,0.88)',
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },

  optionLabelActive: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },

  logout: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(223,109,65,0.55)',
    borderRadius: 18,
    backgroundColor: 'rgba(223,109,65,0.08)',
  },

  logoutPressed: {
    backgroundColor: 'rgba(223,109,65,0.16)',
  },

  logoutText: {
    color: '#f3a083',
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
})

export default PetPassSideMenu
