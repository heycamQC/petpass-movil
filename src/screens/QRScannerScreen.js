
import { useCallback, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'

import Button from '../components/Button'
import ScreenContainer from '../components/ScreenContainer'
import { colors, fonts } from '../theme'
import { getPetIdFromPetPassQR } from '../utils/qrContent'

function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions()
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(true)
  const scanned = useRef(false)

  // Al regresar al escáner, permitir leer otro QR.
  useFocusEffect(
    useCallback(() => {
      scanned.current = false
      setError('')
      setScanning(true)

      return () => {
        scanned.current = true
        setScanning(false)
      }
    }, [])
  )

  function onScan(result) {
    // Evitar lecturas repetidas.
    if (scanned.current) return

    scanned.current = true
    setScanning(false)

    const id = getPetIdFromPetPassQR(result?.data)

    if (!id) {
      setError(
        'Este código no corresponde a un perfil de PetPass Web configurado.'
      )
      return
    }

    // Abrir el perfil de la mascota identificada.
    navigation.navigate('PerfilPublico', { id })
  }

  function retryScan() {
    setError('')
    scanned.current = false
    setScanning(true)
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>
        Escanear carnet PetPass
      </Text>

      <Text style={styles.instructions}>
        Escanea el QR de otro carnet PetPass.
        Solo se admiten enlaces de nuestro perfil público.
      </Text>

      {!permission ? (
        <Text>Comprobando permiso de cámara...</Text>
      ) : !permission.granted ? (
        <Button onPress={requestPermission}>
          Permitir acceso a cámara
        </Button>
      ) : (
        <View style={styles.cameraFrame}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={
              scanning ? onScan : undefined
            }
          />
        </View>
      )}

      {!!error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {!!error && (
        <Button variant="secondary" onPress={retryScan}>
          Escanear otra vez
        </Button>
      )}

      <Button
        variant="secondary"
        onPress={() => navigation.goBack()}
      >
        Volver
      </Button>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 24,
    marginBottom: 8,
  },

  instructions: {
    fontFamily: fonts.body,
    color: colors.muted,
    marginBottom: 18,
    lineHeight: 20,
  },

  cameraFrame: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
    borderRadius: 24,
    marginBottom: 14,
  },

  camera: {
    flex: 1,
  },

  error: {
    fontFamily: fonts.bodyMedium,
    color: colors.danger,
    marginBottom: 12,
  },
})

export default QRScannerScreen
