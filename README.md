# PetPass La Paz · App móvil

**PetPass La Paz** es una aplicación móvil para tutores de mascotas que permite registrar a sus animales, consultar su carnet digital y su historial médico, publicar alertas comunitarias y explorar lugares de interés para mascotas en La Paz. Se desarrolla con **React Native + Expo** y comparte la **API Express y la base SQLite** con PetPass Web.

> **Entrega académica:** Taller de Proyectos Interactivos (IMU-324) · EC3. La aplicación se demuestra en un teléfono mediante Expo Go. El **APK no es obligatorio para EC3**; la configuración de EAS queda preparada para una etapa posterior.

## Repositorios

| Proyecto | Repositorio | Función |
|---|---|---|
| **PetPass Mobile (este repositorio)** | [heycamQC/petpass-movil](https://github.com/heycamQC/petpass-movil) | Interfaz nativa, navegación y funcionalidades de dispositivo |
| **PetPass Web + API + SQLite** | [soledadvasquez-a11y/Protecto_Interactivo_PetPass](https://github.com/soledadvasquez-a11y/Protecto_Interactivo_PetPass) | Sitio React/Vite, API Express y datos compartidos |

Los dos proyectos se ejecutan por separado, pero **el móvil y la web leen y escriben en la misma API y la misma SQLite** cuando apuntan al mismo backend. No se necesita ejecutar dos instancias de Express.

## ¿Por qué React Native?

Elegimos **React Native con Expo** porque permite construir una aplicación móvil multiplataforma utilizando JavaScript y la experiencia previa del equipo con React.
Reutilizamos de PetPass Web los flujos, la identidad visual y los contratos de su API Express, adaptando las pantallas a componentes nativos.
Con **Expo Go** podemos probar la app directamente en un celular Android y utilizar cámara, fotografías, GPS y lectura de QR.
Frente a Flutter, React Native nos permitió avanzar usando las tecnologías que ya conocíamos y mantener coherencia con la aplicación web.

## Arquitectura

```text
PetPass Web (React + Vite, puerto 5173) ──┐
                                          ├── API Express (puerto 3000) ── SQLite (petpass.db)
PetPass Mobile (React Native + Expo) ─────┘
```

- La app móvil no se conecta directamente a SQLite: consume endpoints HTTP de Express.
- Los cambios guardados en móvil se reflejan en PetPass Web al volver a consultar la misma API, y viceversa.
- En EC3 se utiliza una **red local**; la IP del laboratorio puede cambiar.
- La autenticación de Login, Registro Tutor, Recuperación y Cuenta **no es real**: esas interfaces conservan validación y estado local, sin Firebase Auth, JWT ni cuentas persistidas.

## Requisitos

- **Node.js y npm** instalados; comprobar con `node -v` y `npm -v`.
- **Git** instalado; comprobar con `git --version`.
- **Android con Expo Go compatible con Expo SDK 58** y permisos de red/cámara/ubicación según cada funcionalidad.
- Computadora y celular en **la misma Wi-Fi**, con comunicación entre dispositivos permitida.
- Acceso a internet para Expo, Leaflet/OpenStreetMap y Google Maps cuando se utilicen esas funciones.
- Repositorios móvil y web/API descargados. En PowerShell se pueden clonar así:

```powershell
# Ejemplo de carpeta de trabajo; elige otra si ya tienes los repositorios.
New-Item -ItemType Directory -Force 'C:\PetPassEC3' | Out-Null
cd 'C:\PetPassEC3'

git clone https://github.com/soledadvasquez-a11y/Protecto_Interactivo_PetPass.git petpass-la-paz
git clone https://github.com/heycamQC/petpass-movil.git petpass-movil
```

Si ya tienes los repositorios, **no los clones de nuevo**: ubica sus carpetas existentes. No elimines `backend/petpass.db` ni reemplaces su base con una descarga nueva.

## Cómo ejecutar: tres terminales

Primero confirma que el repositorio móvil y el repositorio web/API se encuentren actualizados en `main` y que tus cambios locales estén guardados antes de hacer `pull`.

### 1. Terminal A — API Express (puerto 3000)

```powershell
cd 'C:\PetPassEC3\petpass-la-paz\backend'
npm ci
npm run dev
```

Deja esta terminal encendida. Si todo está bien, la API debe responder con `{"status":"ok"}` en `http://localhost:3000/api/health`.

### 2. Terminal B — PetPass Web (puerto 5173)

```powershell
cd 'C:\PetPassEC3\petpass-la-paz'
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Deja Vite encendido para mostrar los cambios web y para abrir los perfiles públicos desde los QR. El parámetro `--strictPort` evita que Vite cambie silenciosamente a otro puerto.

### 3. Identificar la IPv4 del equipo que ejecuta Express y Vite

Desde una terminal PowerShell:

```powershell
ipconfig
```

Busca la **dirección IPv4 del adaptador Wi-Fi que comparte red con el celular**, por ejemplo `192.168.1.105`. **Es solo un ejemplo:** no debes copiar esa IP si tu computadora tiene otra. No utilices la IPv4 de VirtualBox, VPN, Ethernet desconectado ni adaptadores virtuales.

Puedes obtener un resumen de interfaces activas con:

```powershell
Get-NetIPConfiguration | Where-Object { $_.IPv4Address -and $_.NetAdapter.Status -eq 'Up' } |
  Select-Object InterfaceAlias, @{Name='IPv4';Expression={$_.IPv4Address.IPAddress}}
```

### 4. Configurar las direcciones móviles sin cambiar código fuente

En la **raíz de `petpass-movil`** crea un archivo llamado `.env.local` (no se publica en Git). Puedes partir de `.env.example`, que viene con este repositorio:

```powershell
cd 'C:\PetPassEC3\petpass-movil'
Copy-Item .env.example .env.local
notepad .env.local
```

Reemplaza `TU_IPV4_LAN` por la **misma IP real** obtenida en el paso anterior:

```dotenv
EXPO_PUBLIC_API_URL=http://TU_IPV4_LAN:3000
EXPO_PUBLIC_WEB_URL=http://TU_IPV4_LAN:5173
```

**Muy importante:** `src/config.js` prioriza `EXPO_PUBLIC_API_URL`. Si no defines la variable, utiliza una IP de respaldo propia de otra red; por eso debes configurar `.env.local` antes de probar en el laboratorio. El carnet usa `EXPO_PUBLIC_WEB_URL` para crear su URL QR; de no existir, intenta derivarla de la API.

El archivo `.env.local` ya está excluido de Git mediante `.gitignore` (`.env*.local`). **No subas una IP específica como si fuese universal.** Reinicia Expo tras modificarlo.

### 5. Comprobar la red antes de abrir Expo

En la **computadora**:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
Invoke-RestMethod http://TU_IPV4_LAN:3000/api/health
Invoke-RestMethod http://TU_IPV4_LAN:3000/api/mascotas
```

En el **navegador del teléfono**, abre manualmente estas direcciones (sustituyendo la IP):

```text
http://TU_IPV4_LAN:3000/api/health
http://TU_IPV4_LAN:5173/mascotas/1/perfil-publico
```

Para la segunda ruta, utiliza el ID de una mascota que realmente exista. Si la API funciona en `localhost` pero no desde el teléfono, comprueba Wi-Fi, IP, firewall de Windows y aislamiento de clientes de la red. No desactives permanentemente el firewall; habilita únicamente el acceso local autorizado necesario para la práctica.

### 6. Terminal C — Expo Mobile

```powershell
cd 'C:\PetPassEC3\petpass-movil'
npm ci
npx expo install --check
npx expo start --clear
```

Abre **Expo Go** en el Android y escanea el QR de Metro. Si la red impide la conexión de Metro, se puede estudiar `npx expo start --tunnel`, pero **el túnel de Expo no vuelve accesibles automáticamente la API Express ni la web Vite**: esas dos URLs deben seguir funcionando desde el teléfono.

## Flujo principal de PetPass (EC3)

```text
Onboarding → Login demostrativo → Home → Mis mascotas (GET)
                                             ↓
                                    Seleccionar mascota
                                             ↓
                                       Carnet digital
                                             ↓
                                Historial médico (GET/POST/PUT)

Mis mascotas → Registrar (POST) → Volver y verificar GET
Mis mascotas → Editar (PUT) / Eliminar (DELETE)
Carnet → QR → Perfil público web de la mascota
```

El resto de la experiencia migrada incluye alertas comunitarias (publicar, filtrar, resolver/reactivar), mapa interactivo y perfil público por ID, Cuenta, Registro Tutor y Recuperación. Estos últimos formularios **no crean usuarios reales**.

## Módulos y funcionalidades

| Módulo | Qué permite |
|---|---|
| Onboarding / Login | Conocer PetPass y navegar; login demostrativo sin sesiones reales |
| Home / Mascotas | Consultar la API; seleccionar, registrar, editar y eliminar mascotas |
| Carnet y perfil público | Mostrar información por ID, QR del perfil web y estado de pérdida |
| Historial médico | Consultar, filtrar, agregar y editar vacunas, desparasitaciones y consultas |
| Alertas | Filtrar por tipo/zona, publicar, resolver y reactivar; la API sincroniza `pets.status` |
| Mapa | OpenStreetMap + Leaflet en WebView, lugares con GPS verificado y Google Maps externo |
| Fotografía | Selección de galería/cámara, compresión JPEG y persistencia en `pets.photo` |
| Lector QR / GPS / llamada | Escaneo de carnets PetPass, GPS del **teléfono** y apertura del marcador telefónico |
| Cuenta / Registro Tutor / Recuperación | Flujos y validaciones locales, sin autenticación persistente |

## Endpoints que reutiliza la aplicación móvil

| Método | Ruta | Uso |
|---|---|---|
| GET | `/api/health` | Comprobar conexión |
| GET, POST | `/api/mascotas` | Listar y registrar |
| GET, PUT, DELETE | `/api/mascotas/:id` | Detalle, edición y eliminación |
| GET, POST | `/api/mascotas/:petId/historial` | Historial de una mascota |
| GET, PUT | `/api/historial/:id` | Consultar y editar un registro médico |
| GET | `/api/lugares` | Lugares reales y coordenadas verificadas disponibles |
| GET, POST | `/api/alertas` | Listar/publicar alertas |
| GET, PUT | `/api/alertas/:id` | Detalle, resolver y reactivar |

El DELETE de mascota responde **HTTP 204 sin cuerpo**. Al eliminar una mascota, SQLite elimina sus registros médicos asociados y las alertas que la referenciaban mantienen su registro con `petId = NULL`. No existe DELETE individual de alerta o historial médico en esta versión.

## Requisito especial para el mapa GPS

El nuevo `MapScreen.js` muestra marcadores cuando la API devuelve `latitude`, `longitude` y `locationVerified` válidos. El código de ampliación de lugares GPS se fusionó al repositorio Web/API mediante su **PR #75**. En la base de demostración actualizada deberían existir **seis lugares con GPS verificado**; la cantidad total de lugares puede variar según la SQLite local.

Comprobar desde PowerShell, con Express encendido:

```powershell
$places = @(Invoke-RestMethod http://localhost:3000/api/lugares)
$gps = @($places | Where-Object {
  $_.locationVerified -eq $true -and $null -ne $_.latitude -and $null -ne $_.longitude
})
"Total lugares: $($places.Count)"
"Lugares GPS verificados: $($gps.Count)"
```

Si el número es menor al esperado, **no borres ni reemplaces `petpass.db`**. Primero confirma que el código Web/API esté actualizado; después respalda la base SQLite y revisa los scripts de migración del repositorio Web/API. El `git pull` descarga código pero **no necesariamente migra los registros de una base local antigua**.

## Pruebas de funcionamiento y evidencias

El archivo [docs/qa/MATRIZ_QA_PARTE8.csv](docs/qa/MATRIZ_QA_PARTE8.csv) contiene los **78 casos** registrados en la Parte 8. Las pruebas de integración más importantes son:

1. GET de mascotas y detalle correcto por ID, con carga, vacío o error según corresponda.
2. POST de una mascota desde móvil; comprobar su presencia al recargar PetPass Web.
3. PUT o DELETE desde móvil; comprobar el resultado en web y SQLite sin destruir mascotas importantes.
4. GET/POST/PUT del historial médico de la mascota correcta.
5. Publicación y resolución de alertas y cambio coherente de `pets.status`.
6. Fotografía seleccionada, guardada y visible de nuevo; QR que abre el perfil correcto desde otro dispositivo.
7. Mapa con lugares reales, GPS de teléfono, Google Maps externo y acceso a ubicación/cámara sujeto a permisos.
8. Desactivar Express temporalmente para comprobar un mensaje de error y luego reactivarlo.

La matriz registra resultados del equipo. **La evidencia visual (capturas o videos) debe corresponder a pruebas efectivamente realizadas**; evita incorporar datos personales o teléfonos reales en capturas públicas.

## Organización, equipo y aportes

| Integrante | Cuenta GitHub | Pantallas / módulos desarrollados | Funciones especiales y trabajo |
|---|---|---|---|
| **Heidy** | [@heycamQC](https://github.com/heycamQC) | Diseño y sistema visual de Parte 1, `MedicalHistoryScreen` | GET/POST/PUT de historial; QR, fotografía, mapa/GPS junto con Soledad |
| **Soledad** | [@soledadvasquez-a11y](https://github.com/soledadvasquez-a11y) | Navegación, Mascotas/Carnet, Home, Mapa, Perfil Público, Login, Cuenta, Onboarding, Registro Tutor y Recuperación | Integración de funciones nativas junto con Heidy, mapa interactivo y lector QR |
| **Daniel** | [@dani4773](https://github.com/dani4773) | Componentes reutilizables, Registro/Edición/Eliminación de Mascotas, Alertas | CRUD, sincronización con API, QA, README, preparación Android/EAS |

**Distribución por partes:** Parte 0 (equipo); Parte 1 (equipo: navegación, componentes y diseño); Parte 2 (Soledad); Parte 3 (Daniel); Parte 4 (Heidy); Parte 5 (Daniel); Parte 6 (Soledad); Parte 7 (**Heidy y Soledad**); Parte 8 (Daniel). El presente ajuste documental final corresponde a Heidy.

La evaluación individual requiere poder **explicar las pantallas, `route.params`, uso de la API y commits de cada integrante**. Para consultar los autores registrados en `main`:

```powershell
git shortlog -sne main
git log main --format="%h | %an | %ae | %s"
```

No cambies la autoría histórica de los commits ni fuerces el historial. Si las contribuciones fueron integradas mediante PR, conserva sus enlaces como evidencia.

## Preparación Android / APK

- `app.json` define nombre **PetPass La Paz**, iconos, permisos y `android.package` (`com.petpasslapaz.movil`).
- `eas.json` contiene un perfil `preview` para APK y uno `production` para AAB.
- **El APK no se exige en EC3**: la rúbrica permite Expo Go. El APK y la publicación de la API se consideran en EC4.
- El QR y la API actuales dependen de direcciones de una **red local**. Una APK instalada en otra red requerirá una API y una URL web realmente accesibles; la compilación no publica los servidores por sí sola.

## Limitaciones conocidas y seguridad

- Login/Registro Tutor/Recuperación/Cuenta: **demostración local**, no autenticación real.
- La foto de mascota se almacena comprimida como `data:image/jpeg;base64,...` en SQLite; no hay sistema de archivos remoto para fotos.
- El GPS obtiene la ubicación del **celular**, no rastrea mascotas ni guarda posición en SQLite.
- El mapa de OpenStreetMap/Leaflet necesita internet; los lugares sin coordenadas verificadas no reciben marcador geográfico inventado.
- Llamar al tutor abre el marcador (`tel:`) solo si existe un contacto válido asociado a una alerta de pérdida activa.
- El QR del carnet apunta a la web local; para escanearlo desde otro teléfono, Express y Vite deben estar activos en la misma red.
- No publiques `.env.local`, una base `petpass.db`, datos de usuarios, fotografías privadas ni credenciales.

## Solución de problemas frecuentes

| Problema | Qué comprobar |
|---|---|
| La app abre, pero GET muestra error | `EXPO_PUBLIC_API_URL`, IPv4 Wi-Fi, backend en puerto 3000, firewall, Wi-Fi compartida |
| El celular no abre `/api/health` | Verificar primero URL desde PC y luego teléfono; evitar `localhost` en el móvil |
| El QR no abre el perfil | Vite encendido y accesible por `EXPO_PUBLIC_WEB_URL`, ID real y puerto 5173 |
| El mapa sale sin marcadores | API actualizada, SQLite con coordenadas verificadas, internet para Leaflet/teselas |
| Expo muestra cambios viejos | Guardar `.env.local` correctamente, reiniciar `npx expo start --clear` |
| Una foto no aparece | Comprobar conexión y que el POST guardó el campo `photo`; probar consulta GET |
| La API se apagó | Encender Express y volver a cargar la pantalla; debe existir manejo de error |
| La IP cambia al llegar al laboratorio | Ejecutar `ipconfig`, editar `.env.local`, reiniciar Expo y probar los puertos |

---

**Estado EC3:** flujo mínimo y funcionalidades especiales implementados, QA documentado y repositorio de la app móvil separado del repositorio web/API. El requisito de demostración es **Expo Go o APK**, con el código final en `main`.
