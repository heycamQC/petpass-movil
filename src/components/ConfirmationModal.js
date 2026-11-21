import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import Button from './Button'
import { colors } from '../theme'

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Button variant="secondary" onPress={onCancel}>
              {cancelText}
            </Button>

            <Button variant={danger ? 'danger' : 'primary'} onPress={onConfirm}>
              {confirmText}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modal: {
    gap: 14,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  message: {
    color: colors.muted,
    lineHeight: 20,
  },
  actions: {
    gap: 10,
  },
})

export default ConfirmationModal