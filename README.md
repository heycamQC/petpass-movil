
# PetPass Mobile 🐾

## Descripción del proyecto

PetPass Mobile es la adaptación móvil de PetPass La Paz,
desarrollada con React Native y Expo.

Su objetivo es ofrecer una experiencia móvil para acceder
a la información de mascotas y, en futuras etapas,
incorporar funcionalidades relacionadas con identificación,
seguimiento, alertas y servicios para mascotas.

La aplicación reutiliza la API desarrollada con Express
y la base de datos SQLite de PetPass Web.

## Estado actual del proyecto

Evaluación Continua 3 (EC3)

**Parte 0: Fundación móvil y validación en dispositivo real.**

En esta etapa se implementó:

- Estructura inicial del proyecto con Expo.
- Configuración de React Native.
- Dependencias de React Navigation.
- Configuración centralizada de la API.
- Hook reutilizable useApi.
- Manejo de estados loading, data y error.
- Conexión con el backend Express.
- Validación desde un celular Android real.
- Pruebas de desconexión y recuperación de la API.

## Tecnologías utilizadas

### Aplicación móvil
- React Native
- Expo
- JavaScript
- React Navigation
- Fetch API

### Backend compartido
- Node.js
- Express
- CORS
- SQLite

### Herramientas de desarrollo
- Visual Studio Code
- Git y GitHub
- Expo Go
- PowerShell

## Requisitos

Para ejecutar el proyecto se necesita:

- Node.js 22.5 o superior.
- npm.
- Expo Go instalado en el celular.
- Repositorio PetPass Web con el backend disponible.
- Computadora y celular conectados a una red que permita
  la comunicación entre ambos dispositivos.

## Instalación y ejecución

### 1. Clonar el repositorio móvil

```powershell
git clone https://github.com/heycamQC/petpass-movil.git
cd petpass-movil
```

### 2. Instalar dependencias

```powershell
npm install
```

### 3. Preparar el backend web

Desde el repositorio de PetPass Web, ingresar a:

```powershell
cd backend
npm install
npm run dev
```

El backend debe estar disponible en el puerto 3000.

### 4. Identificar la dirección IPv4

Desde PowerShell ejecutar:

```powershell
ipconfig
```

Buscar la Dirección IPv4 del adaptador Wi-Fi activo.

### 5. Configurar la conexión

Abrir el archivo:

src/config.js

Configurar la dirección IP de la computadora que ejecuta
el backend.

Ejemplo:

```javascript
export const API_URL = 'http://192.168.1.25:3000'
```

La dirección IP debe actualizarse según la red utilizada.

En un celular real no debe utilizarse localhost para
conectarse al backend de la computadora.

### 6. Comprobar la API

Desde el navegador del celular, verificar:

```text
http://<IP-DE-LA-PC>:3000/api/health
http://<IP-DE-LA-PC>:3000/api/mascotas
```

### 7. Ejecutar PetPass Mobile

Desde la carpeta del proyecto móvil:

```powershell
npx expo start
```

Escanear el código QR generado utilizando Expo Go.

## Arquitectura de conexión

PetPass Web y PetPass Mobile consumen una misma API.

```text
       PETPASS WEB
            |
            v
       EXPRESS API
            |
            v
          SQLite
            ^
            |
       EXPRESS API
            ^
            |
       PETPASS MOBILE
```

El backend es compartido y no se requiere una segunda
base de datos para la aplicación móvil.

## Validación en dispositivo real

Las pruebas de PetPass Mobile se realizaron utilizando
un dispositivo Android y Expo Go.

### Prueba 1: Conexión exitosa

Resultado:

- La aplicación inició correctamente.
- La conexión con Express fue exitosa.
- Se recibieron 7 mascotas registradas en SQLite.
- Se mostró el mensaje "API conectada".

### Prueba 2: Desconexión de la API

Procedimiento:

1. Apagar temporalmente Express.
2. Recargar la aplicación móvil.
3. Esperar el resultado de la petición.

Resultado:

La aplicación mostró el mensaje:

"No se pudo conectar con la API. ¿Está encendida?"

Se incorporó un tiempo límite de 10 segundos para
evitar que la aplicación permanezca cargando
indefinidamente.

### Prueba 3: Recuperación de conexión

Procedimiento:

1. Reiniciar Express.
2. Recargar PetPass Mobile.
3. Verificar nuevamente los registros.

Resultado:

La aplicación recuperó la comunicación y volvió
a mostrar "API conectada".

## ¿Por qué elegimos React Native?

React Native permite desarrollar aplicaciones móviles
utilizando conocimientos de React, tecnología ya
empleada en PetPass Web.

Esto facilita aprovechar conocimientos sobre
componentes, propiedades, hooks, estados y consumo
de APIs.

Además, Expo simplifica el desarrollo y las pruebas
en dispositivos físicos mediante Expo Go.

En futuras etapas permitirá integrar funciones
móviles como cámara, códigos QR, ubicación y llamadas.

## Equipo de desarrollo

- Heidy Quispe
- Daniel Gutierrez
- Soledad Vasquez

## Distribución de responsabilidades - Parte 0

### Daniel Gutierrez
- Configuración CORS en Express.
- Verificación de acceso al backend mediante IPv4.
- Preparación de la API para clientes móviles.

### Heidy Quispe
- Creación del proyecto React Native con Expo.
- Configuración de dependencias iniciales.
- Estructura y tema de la aplicación.
- Configuración centralizada de la API.
- Implementación inicial del hook useApi.

### Soledad Vasquez
- Instalación y ejecución del proyecto en entorno local.
- Configuración de conexión mediante IPv4.
- Validación en un dispositivo Android real.
- Comprobación de recepción de registros desde SQLite.
- Pruebas de desconexión y recuperación.
- Mejora del manejo de errores y tiempo de espera.
- Documentación inicial del repositorio móvil.

## Próximas etapas

En las siguientes fases del EC3 se desarrollarán
las pantallas y funcionalidades móviles, reutilizando
la API existente de PetPass.

La generación de APK se realizará en una etapa
posterior, según los requisitos finales del proyecto.
