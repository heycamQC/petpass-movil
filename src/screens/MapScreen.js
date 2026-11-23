import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { useFocusEffect } from '@react-navigation/native'

import SearchBar from '../components/SearchBar'
import { API_URL } from '../config'
import useApi from '../hooks/useApi'
import { openPlaceInMaps } from '../utils/nativeMaps'
import { getMyCurrentLocation } from '../utils/nativeLocation'
import { colors, fonts, shadows } from '../theme'

// Mapa real e interactivo con OpenStreetMap + Leaflet.
// Alternativa para Expo Go Android cuando Google Maps deja el fondo vacío.
// Los marcadores se obtienen exclusivamente de la API SQLite.
// Requiere internet para cargar Leaflet y las teselas del mapa.
const MAP_HTML = String.raw`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
    body { background: #eaf0ec; font-family: sans-serif; }
    .leaflet-container { background: #eaf0ec; }
    .leaflet-control-attribution { font-size: 9px !important; }
    .pp-marker { background: none; border: 0; }
    .pp-pin {
      display: flex; width: 34px; height: 34px; align-items: center;
      justify-content: center; border: 2px solid #fff; border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0, 0, 0, .24); font-size: 17px;
    }
    .pp-pin.park { background: #80aa47; }
    .pp-pin.veterinary { background: #7797ba; color: white; }
    .pp-pin.petFriendly { background: #e66a3e; }
  </style>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <div id="map"></div>
  <script>
    (function () {
      function send(type, extra) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify(Object.assign({ type: type }, extra || {}))
          );
        }
      }

      if (!window.L) {
        send('map-error', { message: 'No se pudo cargar Leaflet. Comprueba internet.' });
        return;
      }

      var map = L.map('map', {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([-16.5054, -68.1257], 14);

      var failedTiles = 0;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 3,
        attribution: '&copy; OpenStreetMap contributors',
      })
        .on('tileerror', function () {
          failedTiles += 1;
          if (failedTiles === 4) {
            send('tile-error', { message: 'No se pudieron cargar las calles. Revisa la conexión a OpenStreetMap.' });
          }
        })
        .addTo(map);

      var markers = L.layerGroup().addTo(map);
      var allCoords = [];
      var userMarker = null;
      var hasCenteredInitially = false;
      var iconText = { park: '🌳', veterinary: '✚', petFriendly: '🐾' };

      function fitPlaces() {
        if (allCoords.length > 1) {
          map.fitBounds(allCoords, { padding: [45, 45], maxZoom: 15 });
        } else if (allCoords.length === 1) {
          map.setView(allCoords[0], 15);
        } else {
          map.setView([-16.5054, -68.1257], 14);
        }
      }

      window.petpassSetPlaces = function (places) {
        markers.clearLayers();
        allCoords = [];
        (places || []).forEach(function (place) {
          var lat = Number(place.latitude);
          var lon = Number(place.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

          var category = Object.prototype.hasOwnProperty.call(iconText, place.category)
            ? place.category : 'park';
          var icon = L.divIcon({
            className: 'pp-marker',
            html: '<span class="pp-pin ' + category + '">' + iconText[category] + '</span>',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
          L.marker([lat, lon], { icon: icon, title: String(place.name || '') })
            .on('click', function () { send('select', { id: String(place.id) }); })
            .addTo(markers);
          allCoords.push([lat, lon]);
        });

        // Encaja los lugares solo la primera vez. Después respeta el movimiento
        // que haga la persona; el botón "Todos" vuelve a encuadrarlos.
        if (!hasCenteredInitially && allCoords.length) {
          hasCenteredInitially = true;
          fitPlaces();
        }
        setTimeout(function () { map.invalidateSize(); }, 40);
      };

      window.petpassShowAll = fitPlaces;
      window.petpassZoom = function (amount) { map.setZoom(map.getZoom() + Number(amount)); };
      window.petpassFocus = function (lat, lon, zoom) {
        map.flyTo([Number(lat), Number(lon)], Number(zoom) || 16, { duration: 0.45 });
      };
      window.petpassShowGPS = function (lat, lon) {
        var point = [Number(lat), Number(lon)];
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.circleMarker(point, {
          radius: 9, color: '#ffffff', weight: 3,
          fillColor: '#2979d1', fillOpacity: 1,
        }).addTo(map);
        window.petpassFocus(lat, lon, 16);
      };

      // Notifica a React Native que la comunicación con el mapa funciona.
      map.whenReady(function () { send('ready'); });
    })();
  </script>
</body>
</html>`

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'park', label: 'Parques' },
  { id: 'veterinary', label: 'Veterinarias' },
  { id: 'petFriendly', label: 'Pet Friendly' },
]

const CATEGORY_UI = {
  park: { icon: '🌳', label: 'Parque', color: colors.primary },
  veterinary: { icon: '✚', label: 'Veterinaria', color: colors.blueDark },
  petFriendly: { icon: '🐾', label: 'Pet Friendly', color: colors.orange },
}

function hasValidGPS(place) {
  if (place.latitude == null || place.longitude == null) return false
  if (place.latitude === '' || place.longitude === '') return false
  const lat = Number(place.latitude)
  const lon = Number(place.longitude)
  return Number.isFinite(lat) && Number.isFinite(lon) &&
    lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 &&
    !(lat === 0 && lon === 0)
}

function categoryUI(place) {
  return CATEGORY_UI[place?.category] || CATEGORY_UI.park
}

function MapScreen() {
  const webRef = useRef(null)
  const firstFocus = useRef(true)
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [locating, setLocating] = useState(false)
  const [gpsReady, setGpsReady] = useState(false)

  const { data, loading, error, refetch } = useApi(`${API_URL}/api/lugares`)

  useFocusEffect(useCallback(() => {
    if (firstFocus.current) firstFocus.current = false
    else refetch()
  }, [refetch]))

  const places = useMemo(() => (Array.isArray(data) ? data : [])
    .filter((place) => (
      typeof place.name === 'string' && place.name.trim() &&
      (place.locationVerified === true || place.locationVerified === 1) &&
      hasValidGPS(place)
    ))
    .map((place) => ({
      ...place,
      id: String(place.id),
      category: place.category || place.type || 'park',
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
    })), [data])

  const visiblePlaces = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es')
    return places.filter((place) => (
      (category === 'all' || place.category === category) &&
      (!term || `${place.name} ${place.address || ''}`.toLocaleLowerCase('es').includes(term))
    ))
  }, [places, category, search])

  const selectedPlace = visiblePlaces.find((place) => place.id === selectedId) || null

  // El deslizado de la ficha se captura solo por el asa superior.
  const sheetGesture = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -25) setExpanded(true)
      if (gesture.dy > 25) setExpanded(false)
    },
  })).current

  function runMapJS(expression) {
    if (!mapReady || !webRef.current) return false
    webRef.current.injectJavaScript(`${expression}; true;`)
    return true
  }

  // Sincroniza filtros y búsquedas con los marcadores del mapa.
  // No se guardan ubicaciones del usuario en la API.
  const markersPayload = useMemo(() => visiblePlaces.map((place) => ({
    id: place.id,
    name: place.name,
    category: place.category,
    latitude: place.latitude,
    longitude: place.longitude,
  })), [visiblePlaces])

  // useFocusEffect se utiliza aquí para reinyectar los lugares cuando cambia
  // la consulta o regresa la pantalla; onMessage('ready') también lo activa.
  useFocusEffect(useCallback(() => {
    if (mapReady) {
      runMapJS(`window.petpassSetPlaces(${JSON.stringify(markersPayload)})`)
    }
  }, [mapReady, markersPayload]))

  function onMapMessage(event) {
    try {
      const message = JSON.parse(event.nativeEvent.data)
      if (message.type === 'ready') {
        setMapError('')
        setMapReady(true)
      } else if (message.type === 'select') {
        setSelectedId(String(message.id))
        setExpanded(false)
        Keyboard.dismiss()
      } else if (message.type === 'map-error' || message.type === 'tile-error') {
        setMapError(message.message || 'No se pudo cargar el mapa.')
      }
    } catch {
      // Ignoramos mensajes no relacionados con el mapa.
    }
  }

  function selectPlace(place) {
    Keyboard.dismiss()
    setSelectedId(place.id)
    setExpanded(false)
    runMapJS(`window.petpassFocus(${place.latitude}, ${place.longitude}, 16)`)
  }

  function changeFilter(value) {
    setCategory(value)
    setSelectedId(null)
    setExpanded(false)
  }

  function changeSearch(value) {
    setSearch(value)
    setSelectedId(null)
  }

  function showAll() {
    Keyboard.dismiss()
    setSelectedId(null)
    setExpanded(false)
    runMapJS('window.petpassShowAll()')
  }

  async function showMyLocation() {
    if (locating) return
    setLocating(true)
    try {
      const { latitude, longitude } = await getMyCurrentLocation()
      setGpsReady(true)
      if (runMapJS(`window.petpassShowGPS(${latitude}, ${longitude})`)) {
        // Confirmación visible: antes el GPS solo movía un mapa vacío.
        Alert.alert('GPS activo', 'Ubicación obtenida. Tu posición aparece como un punto azul.')
      } else {
        Alert.alert('GPS activo', 'El celular obtuvo tu ubicación, pero el mapa todavía está cargando.')
      }
      setSelectedId(null)
      setExpanded(false)
    } catch (err) {
      Alert.alert('No se pudo obtener la ubicación', err.message || 'Revisa el permiso de GPS.')
    } finally {
      setLocating(false)
    }
  }

  async function openMaps(place) {
    try {
      await openPlaceInMaps(place)
    } catch (err) {
      Alert.alert('Google Maps', err.message || 'No se pudo abrir Google Maps.')
    }
  }

  return (
    <View style={styles.page}>
      <WebView
        ref={webRef}
        style={styles.map}
        source={{ html: MAP_HTML, baseUrl: 'https://petpass.local/' }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMapMessage}
        onError={() => setMapError('No se pudo abrir el mapa. Revisa tu conexión a internet.')}
        onLoadStart={() => { setMapReady(false); setMapError('') }}
        setSupportMultipleWindows={false}
        // Identifica PetPass al servicio de mapas, sin suplantar navegadores.
        applicationNameForUserAgent="PetPassMobile/1.0"
      />

      {!mapReady && !mapError && (
        <View style={styles.loadingMap} pointerEvents="none">
          <ActivityIndicator color={colors.orange} size="large" />
          <Text style={styles.loadingText}>Preparando mapa...</Text>
        </View>
      )}
      {!!mapError && (
        <View style={styles.mapErrorBox}>
          <Text style={styles.mapErrorText}>{mapError}</Text>
          <Pressable
            onPress={() => { setMapReady(false); setMapError(''); webRef.current?.reload() }}
            accessibilityRole="button"
          >
            <Text style={styles.retryMap}>Reintentar mapa</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.topControls}>
        <SearchBar
          value={search}
          placeholder="Buscar lugares en La Paz..."
          onChangeText={changeSearch}
          onClear={() => changeSearch('')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((filter) => {
            const active = category === filter.id
            return (
              <Pressable
                key={filter.id}
                onPress={() => changeFilter(filter.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [
                  styles.chip, active && styles.chipActive, pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      <View style={styles.mapTools}>
        <Pressable onPress={showAll} accessibilityRole="button" accessibilityLabel="Ver todos los lugares" style={styles.toolButton}>
          <Text style={styles.toolIcon}>⌖</Text>
          <Text style={styles.toolLabel}>Todos</Text>
        </Pressable>
        <View style={styles.toolDivider} />
        <Pressable onPress={showMyLocation} disabled={locating} accessibilityRole="button" accessibilityLabel="Consultar GPS" style={styles.toolButton}>
          <Text style={styles.toolIcon}>{locating ? '…' : gpsReady ? '✓' : '◎'}</Text>
          <Text style={styles.toolLabel}>GPS</Text>
        </Pressable>
        <View style={styles.toolDivider} />
        <Pressable onPress={() => runMapJS('window.petpassZoom(1)')} accessibilityRole="button" accessibilityLabel="Acercar" style={styles.toolButton}>
          <Text style={styles.toolIcon}>+</Text>
        </Pressable>
        <Pressable onPress={() => runMapJS('window.petpassZoom(-1)')} accessibilityRole="button" accessibilityLabel="Alejar" style={styles.toolButton}>
          <Text style={styles.toolIcon}>−</Text>
        </Pressable>
      </View>

      {/* Atribución visible incluso con la tarjeta abierta. */}
      <View pointerEvents="none" style={[styles.attribution, expanded && styles.attributionExpanded]}>
        <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
      </View>

      <View style={[styles.sheet, expanded ? styles.sheetExpanded : styles.sheetCollapsed]}>
        <View style={styles.dragZone} {...sheetGesture.panHandlers}>
          <View style={styles.dragHandle} />
        </View>
        <Pressable
          onPress={() => setExpanded((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Contraer ficha' : 'Abrir ficha de lugares'}
          style={styles.sheetHeading}
        >
          <View style={[styles.sheetCategoryIcon, {
            backgroundColor: selectedPlace ? categoryUI(selectedPlace).color : colors.primary,
          }]}>
            <Text style={styles.sheetCategoryEmoji}>
              {selectedPlace ? categoryUI(selectedPlace).icon : '📍'}
            </Text>
          </View>
          <View style={styles.sheetHeadingText}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {selectedPlace ? selectedPlace.name : 'Explora La Paz'}
            </Text>
            <Text style={styles.sheetSubtitle} numberOfLines={1}>
              {selectedPlace
                ? selectedPlace.address
                : loading ? 'Cargando lugares...' : error ? 'Sin conexión con la API' : `${visiblePlaces.length} lugares con GPS`}
            </Text>
          </View>
          <Text style={styles.expandIcon}>{expanded ? '⌄' : '⌃'}</Text>
        </Pressable>

        {expanded && (
          <View style={styles.sheetBody}>
            {selectedPlace ? (
              <>
                <View style={styles.detailTopRow}>
                  <Text style={styles.detailCategory}>{categoryUI(selectedPlace).label}</Text>
                  <Pressable onPress={() => setSelectedId(null)} accessibilityRole="button">
                    <Text style={styles.backToList}>Ver lista</Text>
                  </Pressable>
                </View>
                <ScrollView style={styles.detailScroll} nestedScrollEnabled>
                  <Text style={styles.detailAddress}>{selectedPlace.address}</Text>
                  {!!selectedPlace.description && (
                    <Text style={styles.detailDescription}>{selectedPlace.description}</Text>
                  )}
                  <Text style={styles.detailNote}>
                    Confirma horarios y acceso con mascotas antes de visitar el lugar.
                  </Text>
                </ScrollView>
                <Pressable
                  onPress={() => openMaps(selectedPlace)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.mapsButton, pressed && styles.pressed]}
                >
                  <Text style={styles.mapsButtonText}>Abrir en Google Maps ↗</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.listIntro}>Selecciona un lugar para consultar sus detalles.</Text>
                <ScrollView style={styles.placesList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                  {visiblePlaces.map((place) => (
                    <Pressable
                      key={place.id}
                      onPress={() => selectPlace(place)}
                      accessibilityRole="button"
                      style={({ pressed }) => [styles.placeRow, pressed && styles.pressed]}
                    >
                      <View style={[styles.placeDot, { backgroundColor: categoryUI(place).color }]} />
                      <View style={styles.placeRowTexts}>
                        <Text style={styles.placeRowName} numberOfLines={1}>{place.name}</Text>
                        <Text style={styles.placeRowAddress} numberOfLines={1}>{place.address}</Text>
                      </View>
                      <Text style={styles.placeArrow}>›</Text>
                    </Pressable>
                  ))}
                  {visiblePlaces.length === 0 && (
                    <Text style={styles.noPlaces}>
                      {loading ? 'Cargando lugares desde SQLite...'
                        : error ? 'No se pudo conectar con Express.'
                          : 'No hay lugares para este filtro.'}
                    </Text>
                  )}
                </ScrollView>
                {!!error && (
                  <Pressable onPress={refetch} accessibilityRole="button" style={styles.retryButton}>
                    <Text style={styles.retryMap}>Reintentar API</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#eaf0ec' },
  map: { flex: 1, backgroundColor: '#eaf0ec' },
  topControls: { position: 'absolute', top: 12, left: 14, right: 14, gap: 9, zIndex: 10 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 12 },
  chip: {
    minHeight: 34, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14,
    borderRadius: 20, backgroundColor: colors.white, borderWidth: 1,
    borderColor: colors.border, ...shadows.soft,
  },
  chipActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  chipText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.text },
  chipTextActive: { color: colors.white },
  pressed: { opacity: 0.72 },
  mapTools: {
    position: 'absolute', top: 120, right: 14, width: 50,
    paddingVertical: 4, borderRadius: 20, backgroundColor: colors.white,
    alignItems: 'center', zIndex: 9, ...shadows.card,
  },
  toolButton: { width: 48, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  toolIcon: { fontSize: 21, lineHeight: 26, color: colors.textDark, fontWeight: '600' },
  toolLabel: { fontFamily: fonts.bodySemiBold, color: colors.muted, fontSize: 9 },
  toolDivider: { height: 1, width: 26, backgroundColor: colors.border },
  sheet: {
    position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: colors.white,
    borderRadius: 25, overflow: 'hidden', zIndex: 12, ...shadows.card,
  },
  sheetCollapsed: { height: 92 },
  sheetExpanded: { height: 320 },
  dragZone: { height: 21, alignItems: 'center', justifyContent: 'center' },
  dragHandle: { width: 38, height: 4, borderRadius: 4, backgroundColor: '#c9c5be' },
  sheetHeading: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 13, gap: 11 },
  sheetCategoryIcon: {
    width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
  },
  sheetCategoryEmoji: { fontSize: 19, color: colors.white, fontWeight: 'bold' },
  sheetHeadingText: { flex: 1, minWidth: 0 },
  sheetTitle: { color: colors.textDark, fontFamily: fonts.displayBold, fontSize: 16 },
  sheetSubtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 11 },
  expandIcon: { width: 25, textAlign: 'center', color: colors.orange, fontSize: 25 },
  sheetBody: { flex: 1, paddingHorizontal: 18, paddingBottom: 14 },
  detailTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 7 },
  detailCategory: { color: colors.primaryDark, fontFamily: fonts.bodyBold, fontSize: 12 },
  backToList: { color: colors.orange, fontFamily: fonts.bodySemiBold, fontSize: 12 },
  detailScroll: { flex: 1 },
  detailAddress: { color: colors.text, fontFamily: fonts.bodySemiBold, fontSize: 12 },
  detailDescription: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, lineHeight: 19, marginTop: 9 },
  detailNote: { color: colors.muted, fontFamily: fonts.body, fontSize: 10, marginTop: 9 },
  mapsButton: {
    marginTop: 10, backgroundColor: colors.orange, minHeight: 43, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  mapsButtonText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 12 },
  listIntro: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, marginBottom: 6 },
  placesList: { flex: 1 },
  placeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 47,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  placeDot: { width: 10, height: 10, borderRadius: 5 },
  placeRowTexts: { flex: 1, minWidth: 0 },
  placeRowName: { fontFamily: fonts.bodySemiBold, color: colors.text, fontSize: 12 },
  placeRowAddress: { fontFamily: fonts.body, color: colors.muted, fontSize: 10 },
  placeArrow: { color: colors.orange, fontSize: 20 },
  noPlaces: { color: colors.muted, fontFamily: fonts.body, padding: 12, fontSize: 12 },
  retryButton: { marginTop: 8, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.orange, alignItems: 'center' },
  retryMap: { fontFamily: fonts.bodySemiBold, color: colors.orange, fontSize: 12 },
  mapErrorBox: {
    position: 'absolute', top: '46%', left: 35, right: 80, backgroundColor: colors.white,
    padding: 14, borderRadius: 15, zIndex: 6, ...shadows.soft,
  },
  mapErrorText: { color: colors.textDark, fontFamily: fonts.body, fontSize: 12, marginBottom: 6 },
  loadingMap: { position: 'absolute', top: '46%', left: 40, alignItems: 'center', gap: 10 },
  loadingText: { fontFamily: fonts.body, fontSize: 12, color: colors.textDark },
  attribution: { position: 'absolute', bottom: 111, left: 16, zIndex: 6, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 4, paddingHorizontal: 4 },
  attributionExpanded: { bottom: 339 },
  attributionText: { fontSize: 9, color: colors.textDark },
})

export default MapScreen
