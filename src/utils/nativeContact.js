import { Linking } from 'react-native'

// NO existe ownerPhone en la tabla pets. Se busca un número explícito
// en una alerta activa de pérdida vinculada a esta mascota.
export function getPhoneFromLostAlerts(alerts, petId) {
  if (!Array.isArray(alerts)) return null
  for (const alert of alerts) {
    if (alert.type !== 'lost' || alert.status !== 'active') continue
    if (Number(alert.petId) !== Number(petId)) continue
    const input = String(alert.contact || '').trim()
    // Solo aceptar campos cuyo contenido sea realmente un teléfono.
    if (!/^\+?[\d\s()\-]{7,22}$/.test(input)) continue
    const cleaned = input.replace(/[\s()\-]/g, '')
    if (!/^\+?\d{7,15}$/.test(cleaned)) continue
    return cleaned
  }
  return null
}

export async function openPhoneDialer(phone) {
  if (!phone || !/^\+?\d{7,15}$/.test(phone)) {
    throw new Error('No hay un número de teléfono válido disponible.')
  }
  try {
    await Linking.openURL(`tel:${phone}`)
  } catch {
    throw new Error('No fue posible abrir el marcador del teléfono.')
  }
}
