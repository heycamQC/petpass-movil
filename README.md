# PetPass Mobile · EC3

Aplicación móvil de **PetPass La Paz**, construida con **React Native + Expo SDK 58**, conectada a la **API Express + SQLite de PetPass Web/EC2**.

## 1. Alcance real

| Módulo | Función disponible |
|---|---|
| Onboarding | Tres pantallas de introducción y paso a Login |
| Login | Formulario y navegación demostrativa; **sin autenticación real** |
| Registro tutor / recuperación | Validaciones e interfaz locales; no se crean cuentas ni se envían correos |
| Home | Mascotas leídas desde API |
| Mascotas | GET, POST, PUT, DELETE por API |
| Carnet digital | Detalle por ID, QR de URL web pública del perfil |
| Historial | GET/POST/PUT, filtros vacuna/desparasitación/consulta |
| Alertas | GET/POST/PUT, filtros tipo/zona, resolución/reactivación; `pets.status` sincronizado por backend |
| Mapa | OpenStreetMap/Leaflet en WebView, lugares GPS verificados, búsqueda/filtros, Google Maps externo |
| Perfil público | GET por mascota, contacto telefónico desde alerta activa, indicación demostrativa de ubicación de mascota |
| Funciones nativas | Cámara, galería, foto comprimida y persistente, QR escáner, GPS del teléfono, abrir marcador telefónico |
| Cuenta | Datos/formularios locales sin cuenta persistente |

## 2. Arquitectura

    PetPass Web (React + Vite) ─┐
                                ├── Express API (:3000) ── SQLite (petpass.db)
    PetPass Mobile (Expo) ─────┘

- **Repositorio móvil:** `[https://github.com/heycamQC/petpass-movil](https://github.com/heycamQC/petpass-movil)`
- **Repositorio web/API:** `[https://github.com/soledadvasquez-a11y/Protecto_Interactivo_PetPass](https://github.com/soledadvasquez-a11y/Protecto_Interactivo_PetPass)`
- **Mapa GPS:** integrado con la rama `feat/places-real-map-support` (fusionada en `main` mediante PR #75).
- No se incorporaron Firebase Auth, JWT, tabla de cuentas de tutor ni almacenamiento remoto de fotografías.

## 3. Requisitos de entorno

- Windows 11 / PowerShell y VS Code (u otra máquina compatible).
- Node.js y npm compatibles con el proyecto (`node -v`, `npm -v`).
- `npm ci` en la raíz móvil y en las carpetas correspondientes del backend y web.
- Expo Go compatible con SDK 58 para las pruebas de desarrollo; Android físico para cámara, GPS y llamadas.
- El teléfono y la computadora deben estar en la misma red local (sin aislamiento de clientes).
- Conexión a internet para cargar Leaflet, teselas OpenStreetMap, Google Maps y servicios de Expo/EAS.

## 4. Encender los tres procesos

**Terminal 1 — Express API** (desde la carpeta `backend` del repositorio web):

    npm ci
    npm run dev

**Terminal 2 — PetPass Web** (desde la raíz del repositorio web):

    npm ci
    npm run dev -- --host 0.0.0.0

**Terminal 3 — PetPass Mobile** (desde la raíz móvil):

    npm ci
    npx expo install --check
    npx expo start --clear

## 5. URLs y red

Para desarrollo local, crear `.env.local` en la raíz móvil (excluido por `.gitignore`) con la IPv4 real de la computadora que ejecuta Express y Vite:

    EXPO_PUBLIC_API_URL=http://TU_IP:3000
    EXPO_PUBLIC_WEB_URL=http://TU_IP:5173

Comprobar desde el navegador del teléfono:

    http://TU_IP:3000/api/health
    http://TU_IP:5173/mascotas/1/perfil-publico

El QR utiliza una URL web local durante EC3; funciona únicamente dentro de la red local mientras los servidores estén encendidos.

## 6. Lugares GPS y base SQLite

El mapa móvil representa únicamente lugares con `locationVerified` y coordenadas numéricas válidas (seis lugares GPS verificados en la base de demostración). Encender siempre el backend desde su carpeta `backend` para evitar crear una `petpass.db` vacía en otro directorio.

## 7. Módulos principales y endpoints

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/api/health` | Estado de la API |
| GET/POST | `/api/mascotas` | Listado y registro de mascotas |
| GET/PUT/DELETE | `/api/mascotas/:id` | Detalle, edición y eliminación de mascota |
| GET/POST | `/api/mascotas/:petId/historial` | Listado y registro médico |
| GET/PUT | `/api/historial/:id` | Edición de registro médico |
| GET | `/api/lugares` | Lugares verificados del mapa |
| GET/POST | `/api/alertas` | Listado y publicación de alertas |
| GET/PUT | `/api/alertas/:id` | Cambio de estado de alerta (`active` / `resolved`) |

Al eliminar una mascota, su historial médico se elimina en cascada y las alertas asociadas conservan su registro con `petId = NULL`. No existe endpoint `DELETE` para alertas ni para registros médicos individuales.

## 8. Pruebas QA

El registro completo de los 78 casos de verificación se encuentra en `docs/qa/MATRIZ_QA_PARTE8.csv`.

## 9. Preparación Android / EAS

- **`app.json`:** configurado con `android.package` (`com.petpasslapaz.movil`), `versionCode: 1`, permisos mínimos de cámara, galería y ubicación en primer plano, y `expo-build-properties` con `usesCleartextTraffic: true` para tráfico HTTP local durante EC3.
- **`eas.json`:** perfil `preview` configurado como `apk` interno y `production` como `app-bundle`.
- **Estado de compilación:** Configuración lista; APK no generado por alcance de rúbrica.

## 10. Limitaciones conocidas

1. Login, registro de tutor y recuperación de contraseña son interfaces demostrativas: no autentican ni envían correos reales.
2. Las fotografías se comprimen y almacenan como `data:image/jpeg;base64,...` en `pets.photo`.
3. El GPS identifica la ubicación del **teléfono**, no la de la mascota, y no se persiste en SQLite.
4. El mapa utiliza Leaflet y teselas de OpenStreetMap por internet; no cuenta con modo offline.
5. El botón de llamada abre la aplicación de teléfono del dispositivo (`tel:`); no realiza llamadas automáticamente.
6. El QR del carnet apunta a la URL web local de PetPass; requiere que Express y Vite estén activos en la misma red.

## 11. Equipo (atribución real)

- **Parte 2:** Soledad (mascotas lectura y carnet).
- **Parte 3:** Daniel (CRUD de mascotas).
- **Parte 4:** Heidy (historial médico).
- **Parte 5:** Daniel (alertas comunitarias).
- **Parte 6:** Soledad (migración web).
- **Parte 7:** Heidy **y** Soledad (funciones nativas).
- **Parte 8:** Daniel (estabilización, QA, documentación y preparación Android/APK).
