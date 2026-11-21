import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  danger = false,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onCancel}
        />

        <View
          style={[
            styles.modal,
            danger && styles.modalDanger,
          ]}
        >
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.message}>
            {message}
          </Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.action,
                styles.cancelAction,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={styles.cancelText}
              >
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.action,
                danger
                  ? styles.dangerAction
                  : styles.confirmAction,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.actionText}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    padding: 24,

    alignItems: 'center',
    justifyContent: 'center',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      'rgba(0,0,0,0.42)',
  },

  modal: {
    width: '100%',
    maxWidth: 330,

    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,

    borderRadius: 32,

    backgroundColor: colors.blueSoft,

    ...shadows.card,
  },

  modalDanger: {
    backgroundColor: '#9ab2d4',
  },

  title: {
    color: colors.textDark,

    fontFamily: fonts.displayBold,
    fontSize: 24,

    lineHeight: 30,
    textAlign: 'center',
  },

  message: {
    marginTop: 10,

    color: '#4f4c49',

    fontFamily: fonts.body,
    fontSize: 14,

    lineHeight: 21,
    textAlign: 'center',
  },

  actions: {
    marginTop: 22,

    flexDirection: 'row',

    gap: 12,
  },

  action: {
    flex: 1,

    minHeight: 46,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 14,

    borderRadius: radius.pill,
  },

  cancelAction: {
    borderWidth: 2,
    borderColor:
      'rgba(255,255,255,0.85)',

    backgroundColor:
      'rgba(255,255,255,0.28)',
  },

  confirmAction: {
    backgroundColor: colors.primaryDark,
  },

  dangerAction: {
    backgroundColor: colors.orange,
  },

  actionText: {
    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 14,
  },

  cancelText: {
    color: colors.textDark,

    fontFamily: fonts.displayBold,
    fontSize: 14,
  },

  pressed: {
    opacity: 0.82,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },
})

export default ConfirmationModal