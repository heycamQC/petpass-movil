import { getPublicPetProfileUrl } from './publicProfileUrl'

// Solo aceptamos perfiles de NUESTRO PetPass Web configurado, no QR de terceros.
export function getPetIdFromPetPassQR(rawText) {
  if (typeof rawText !== 'string') return null
  const match = rawText.trim().match(/\/mascotas\/(\d+)\/perfil-publico\/?$/i)
  if (!match) return null
  const id = Number(match[1])
  if (!Number.isSafeInteger(id) || id <= 0) return null
  const expected = getPublicPetProfileUrl(id)
  if (!expected) return null
  const given = rawText.trim().replace(/\/$/, '')
  return given === expected ? id : null
}
