
 // Parte 2: imágenes compatibles con el backend de EC2.
 // La foto de Toby se guarda como /pets/pug-photo.svg en SQLite,
 // pero Express NO publica automáticamente la carpeta public/ de la web.
const LOCAL_TOBY_IMAGE = require('../../assets/pug-avatar.svg')

const RASTER_IMAGE = /\.(png|jpe?g|webp)(?:[?#].*)?$/i

export function getPetPhotoSource(photo) {
  if (typeof photo !== 'string' || !photo.trim()) {
    return null
  }

  const path = photo.trim()

  // Compatibilidad concreta con el seed de EC2, sin pedir un SVG remoto.
  if (path === '/pets/pug-photo.svg') {
    return LOCAL_TOBY_IMAGE
  }

  // La app móvil admite fotos remotas públicas en formato ráster.
  // No convertimos paths relativos en URLs: el backend actual no sirve archivos.
  if (/^https?:\/\//i.test(path) && RASTER_IMAGE.test(path)) {
    return { uri: path }
  }

  // SVG remoto, URI local de otro equipo, imagen no disponible o ruta relativa.
  return null
}
