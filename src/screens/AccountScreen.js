
import { useState } from 'react'

import {
  Alert,
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

import SelectField
  from '../components/SelectField'

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

const CAMERA = require('../../assets/Camera.svg')

// Opciones de zona para el perfil del tutor.
// Coinciden con las zonas utilizadas en PetPass.
const ZONE_OPTIONS = [
  { label: 'Sopocachi', value: 'Sopocachi' },
  { label: 'Miraflores', value: 'Miraflores' },
  { label: 'Zona Sur', value: 'Zona Sur' },
  { label: 'El Alto', value: 'El Alto' },
  { label: 'Centro', value: 'Centro' },
]

// Ícono del avatar original.
function AvatarIcon() {
  return (
    <View style={styles.avatarIcon}>
      <View style={styles.avatarHead} />
      <View style={styles.avatarBody} />
    </View>
  )
}

function AccountScreen() {
  // Conservamos los datos de demostración actuales.
  const [formData, setFormData] = useState({
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

  // Actualiza los campos localmente.
  const handleChange = (field) => (value) => {
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

        {/* AVATAR */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <AvatarIcon />
          </View>

          <Pressable
            accessibilityLabel="Cambiar foto de perfil"
            onPress={() =>
              Alert.alert(
                'Foto de perfil',
                'La selección de fotografías se integrará en una etapa posterior.'
              )
            }
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

        {/* NOMBRE DEL TUTOR */}
        <Text style={styles.userName}>
          {formData.name}
        </Text>

        {/* FORMULARIO */}
        <View style={styles.form}>

          <FormField
            label="Nombre completo"
            value={formData.name}
            onChangeText={handleChange('name')}
            placeholder="Nombre completo"
          />

          <FormField
            label="Teléfono"
            value={formData.phone}
            onChangeText={handleChange('phone')}
            keyboardType="phone-pad"
            placeholder="Ej. 70000000"
          />

          <FormField
            label="Correo"
            value={formData.email}
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            placeholder="correo@ejemplo.com"
          />

          {/*
            NUEVO SELECTOR DE ZONA

            Reemplaza el campo de texto manual
            y el antiguo botón naranja de lápiz.
          */}
          <SelectField
            label="Zona"
            value={formData.zone}
            options={ZONE_OPTIONS}
            placeholder="Selecciona tu zona"
            onChange={handleChange('zone')}
          />

          <Text style={styles.zoneHelp}>
            Selecciona la zona de La Paz donde
            te encuentras habitualmente.
          </Text>

          <FormField
            label="Contacto de emergencia (opcional)"
            value={formData.emergencyContact}
            onChangeText={
              handleChange('emergencyContact')
            }
            keyboardType="phone-pad"
            placeholder="Teléfono de emergencia"
          />

        </View>
      </View>

      {/* PIE DE PÁGINA */}
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              'Términos y condiciones',
              'Documento informativo pendiente de integrar.'
            )
          }
        >
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

      {/* CONFIRMACIÓN ORIGINAL */}
      <ConfirmationModal
        visible={deleteModalVisible}
        danger
        title="Eliminar Cuenta"
        message="Esta es una demostración de confirmación. No se eliminará ninguna cuenta porque todavía no existe autenticación real."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onCancel={() =>
          setDeleteModalVisible(false)
        }
        onConfirm={() => {
          setDeleteModalVisible(false)

          Alert.alert(
            'Cuenta sin cambios',
            'No se eliminó ninguna cuenta. La gestión real requiere backend de usuarios.'
          )
        }}
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

  // Texto auxiliar para el selector de zona.
  zoneHelp: {
    paddingHorizontal: 16,
    marginTop: -5,
    marginBottom: 4,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    opacity: 0.9,
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
