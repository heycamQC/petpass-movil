
// Dirección de la API de PetPass.
// En un celular real NO sirve localhost: usa la IPv4
// de la computadora que está ejecutando el backend.
// Esta dirección puede cambiar al cambiar de red Wi-Fi.
//export const API_URL = 'http://192.168.10.104:3000'
//export const API_URL = 'http://10.60.155.163:3000'
const localFallback = 'http://192.168.1.101:3000'
const selected = process.env.EXPO_PUBLIC_API_URL?.trim() || localFallback
export const API_URL = selected.replace(/\/+$/, '')