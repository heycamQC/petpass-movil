import { useState } from 'react'

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Image } from 'expo-image'

import ConfirmationModal
  from '../components/ConfirmationModal'

import FormField
  from '../components/FormField'

import Button
  from '../components/Button'

import ScreenContainer
  from '../components/ScreenContainer'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

const CAMERA =
  require('../../assets/Camera.svg')

function AvatarIcon() {
  return (
    <View style={styles.avatarIcon}>
      <View style={styles.avatarHead} />

      <View style={styles.avatarBody} />
    </View>
  )
}

function EditIcon() {
  return (
    <View style={styles.editIcon}>
      <View style={styles.editPencil} />
      <View style={styles.editLine} />
    </View>
  )
}

function AccountScreen() {
  const [formData, setFormData] =
    useState({
      name: 'Tutor PetPass',
      email: 'tutor@petpass.com',
      phone: '70000000',
      zone: 'Sopocachi',
      emergencyContact: '',
    })

  const [
    deleteModalVisible,
    setDeleteModalVisible,
  ] = useState(false)

  const handleChange =
    (field) => (value) => {
      setFormData((current) => ({
        ...current,
        [field]: value,
      }))
    }

  return (
    <ScreenContainer>
      <Text style={styles.title}>
        Mi Cuenta
      </Text>

      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <AvatarIcon />
          </View>

          <Pressable
            accessibilityLabel="Cambiar foto de perfil"
            style={({ pressed }) => [
              styles.cameraButton,
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={CAMERA}
              contentFit="contain"
              style={styles.cameraIcon}
            />
          </Pressable>
        </View>

        <Text style={styles.userName}>
          {formData.name}
        </Text>

        <View style={styles.form}>
          <FormField
            label="Nombre completo"
            value={formData.name}
            onChangeText={
              handleChange('name')
            }
          />

          <FormField
            label="Teléfono"
            value={formData.phone}
            onChangeText={
              handleChange('phone')
            }
            keyboardType="phone-pad"
          />

          <FormField
            label="Correo"
            value={formData.email}
            onChangeText={
              handleChange('email')
            }
            keyboardType="email-address"
          />

          <View style={styles.zoneRow}>
            <View style={styles.zoneField}>
              <FormField
                label="Zona"
                value={formData.zone}
                onChangeText={
                  handleChange('zone')
                }
              />
            </View>

            <Pressable
              accessibilityLabel="Editar zona"
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
            >
              <EditIcon />
            </Pressable>
          </View>

          <FormField
            label="Contacto de emergencia (opcional)"
            value={
              formData.emergencyContact
            }
            onChangeText={
              handleChange(
                'emergencyContact'
              )
            }
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable>
          <Text style={styles.terms}>
            Términos y condiciones
          </Text>
        </Pressable>

        <Button
          variant="danger"
          onPress={() =>
            setDeleteModalVisible(true)
          }
        >
          Eliminar cuenta
        </Button>
      </View>

      <ConfirmationModal
        visible={deleteModalVisible}
        danger
        title="Eliminar Cuenta"
        message="¿Estás seguro de que deseas eliminar tu cuenta? Tendrás que iniciar sesión nuevamente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onCancel={() =>
          setDeleteModalVisible(false)
        }
        onConfirm={() =>
          setDeleteModalVisible(false)
        }
      />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  title: {
    marginTop: 4,
    marginBottom: 18,

    color: colors.text,

    fontFamily: fonts.displayBold,
    fontSize: 32,

    lineHeight: 38,
    textAlign: 'center',
  },

  card: {
    width: '100%',

    paddingHorizontal: 22,
    paddingTop: 34,
    paddingBottom: 28,

    alignItems: 'center',

    borderRadius: 40,

    backgroundColor: colors.primary,

    ...shadows.card,
  },

  avatarWrapper: {
    position: 'relative',

    marginBottom: 8,
  },

  avatar: {
    width: 110,
    height: 110,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 4,
    borderColor: colors.white,

    borderRadius: radius.pill,

    backgroundColor: '#d9d9d9',
  },

  avatarIcon: {
    position: 'relative',

    width: 62,
    height: 62,
  },

  avatarHead: {
    position: 'absolute',

    top: 3,
    left: 19,

    width: 24,
    height: 24,

    borderWidth: 2,
    borderColor: colors.text,

    borderRadius: radius.pill,
  },

  avatarBody: {
    position: 'absolute',

    left: 5,
    bottom: 4,

    width: 52,
    height: 27,

    borderWidth: 2,
    borderColor: colors.text,
    borderBottomWidth: 0,

    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },

  cameraButton: {
    position: 'absolute',

    right: -2,
    bottom: 2,

    width: 36,
    height: 36,

    padding: 6,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: colors.white,

    borderRadius: radius.pill,

    backgroundColor: colors.white,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  cameraIcon: {
    width: 22,
    height: 22,

    tintColor: colors.orange,
  },

  userName: {
    marginTop: 6,
    marginBottom: 20,

    color: colors.white,

    fontFamily: fonts.displayBold,
    fontSize: 30,

    lineHeight: 36,
    textAlign: 'center',
  },

  form: {
    width: '100%',

    gap: 12,
  },

  zoneRow: {
    width: '100%',

    flexDirection: 'row',
    alignItems: 'flex-end',

    gap: 8,
  },

  zoneField: {
    flex: 1,
  },

  editButton: {
    width: 42,
    height: 42,

    marginBottom: 1,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,

    backgroundColor: colors.orange,

    ...shadows.orange,
  },

  editIcon: {
    position: 'relative',

    width: 22,
    height: 22,
  },

  editPencil: {
    position: 'absolute',

    left: 9,
    top: 1,

    width: 4,
    height: 18,

    borderRadius: 3,

    backgroundColor: colors.white,

    transform: [
      {
        rotate: '42deg',
      },
    ],
  },

  editLine: {
    position: 'absolute',

    left: 2,
    bottom: 2,

    width: 16,
    height: 2,

    backgroundColor: colors.white,
  },

  footer: {
    width: '100%',

    marginTop: 20,

    alignItems: 'center',

    gap: 12,
  },

  terms: {
    color: colors.orange,

    fontFamily: fonts.body,
    fontSize: 13,

    textDecorationLine: 'underline',
  },

  pressed: {
    opacity: 0.82,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },
})

export default AccountScreen