import { API_URL } from '../config'

// La ruta está confirmada en PetPass Web (src/App.jsx).
// Se permite sobrescribir la dirección en desarrollo con EXPO_PUBLIC_WEB_URL.
// Por defecto suponemos que Vite está en el MISMO equipo que Express,
// pero en el puerto 5173. La dirección solo funciona si la web está encendida.
export function getPublicPetProfileUrl(petId) {
  const id = Number(petId)
  if (!Number.isInteger(id) || id <= 0) return null

  const configured = process.env.EXPO_PUBLIC_WEB_URL?.trim()
  const fallback = API_URL.replace(/:3000\/?$/, ':5173')
  const base = (configured || fallback).replace(/\/+$/, '')

  if (!/^https?:\/\/[^/]+$/i.test(base)) return null

  return `${base}/mascotas/${id}/perfil-publico`
}
