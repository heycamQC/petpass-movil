
import { useCallback, useRef, useState } from 'react'

import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Image } from 'expo-image'
import { useFocusEffect } from '@react-navigation/native'

import FilterTab from '../components/FilterTab'
import MapMarker from '../components/MapMarker'
import PlaceCard from '../components/PlaceCard'
import SearchBar from '../components/SearchBar'

import { API_URL } from '../config'
import useApi from '../hooks/useApi'
import { colors, fonts, shadows } from '../theme'

const MAP_BACKGROUND = require('../../assets/map-background.svg')

// Ampliacion ligera para permitir movimiento sin bordes vacios.
const MAP_SCALE = 1.35

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'park', label: 'Parques' },
  { id: 'veterinary', label: 'Veterinarias' },
  { id: 'petFriendly', label: 'Pet Friendly' },
]

const PLACE_BADGES = {
  park: 'Parque Pet-Friendly',
  veterinary: 'Atención para mascotas',
  petFriendly: 'Lugar Pet-Friendly',
}

function limit(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum))
}

function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPlaceId, setSelectedPlaceId] = useState(null)

  const firstFocus = useRef(true)

  // ==========================================
  // MOVIMIENTO DEL MAPA
  // ==========================================

  const mapPosition = useRef(
    new Animated.ValueXY({ x: 0, y: 0 })
  ).current

  const mapSize = useRef({
    width: 0,
    height: 0,
  })

  const currentPosition = useRef({
    x: 0,
    y: 0,
  })

  const gestureStart = useRef({
    x: 0,
    y: 0,
  })

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, gesture) => {
        return (
          Math.abs(gesture.dx) > 7 ||
          Math.abs(gesture.dy) > 7
        )
      },

      onPanResponderGrant: () => {
        gestureStart.current = {
          ...currentPosition.current,
        }
      },

      onPanResponderMove: (_, gesture) => {
        // Limites para que no aparezcan
        // espacios vacios alrededor del mapa.
        const maxX = mapSize.current.width * 0.12
        const maxY = mapSize.current.height * 0.12

        const nextX = limit(
          gestureStart.current.x + gesture.dx,
          -maxX,
          maxX
        )

        const nextY = limit(
          gestureStart.current.y + gesture.dy,
          -maxY,
          maxY
        )

        currentPosition.current = {
          x: nextX,
          y: nextY,
        }

        mapPosition.setValue({
          x: nextX,
          y: nextY,
        })
      },

      onPanResponderRelease: () => {
        // El mapa permanece donde lo dejaste.
      },

      onPanResponderTerminate: () => {
        // Conservamos la posicion alcanzada.
      },
    })
  ).current

  function handleMapLayout(event) {
    const { width, height } = event.nativeEvent.layout

    mapSize.current = {
      width,
      height,
    }
  }

  function centerMap() {
    currentPosition.current = {
      x: 0,
      y: 0,
    }

    Animated.spring(mapPosition, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 8,
      tension: 45,
    }).start()
  }

  // ==========================================
  // CONSULTAS A SQLITE
  // ==========================================

  const queryParts = []

  if (activeCategory !== 'all') {
    queryParts.push(
      `category=${encodeURIComponent(activeCategory)}`
    )
  }

  if (searchQuery.trim()) {
    queryParts.push(
      `q=${encodeURIComponent(searchQuery.trim())}`
    )
  }

  const url =
    `${API_URL}/api/lugares` +
    (queryParts.length
      ? `?${queryParts.join('&')}`
      : '')

  const {
    data,
    loading,
    error,
    refetch,
  } = useApi(url)

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false
      } else {
        refetch()
      }
    }, [refetch])
  )

  const validList = Array.isArray(data)
  const places = validList ? data : []

  const selectedPlace =
    places.find(
      (place) => place.id === selectedPlaceId
    ) ||
    places[0] ||
    null

  const visibleError =
    error ||
    (!loading && !validList
      ? 'La API no devolvió una lista válida de lugares.'
      : '')

  const selectedType =
    selectedPlace?.type || selectedPlace?.category

  const panelColor =
    selectedType === 'park'
      ? colors.primary
      : selectedType === 'veterinary'
        ? colors.blue
        : colors.text

  function changeCategory(id) {
    setActiveCategory(id)
    setSelectedPlaceId(null)
  }

  function changeSearch(value) {
    setSearchQuery(value)
    setSelectedPlaceId(null)
  }

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <View style={styles.page}>
      <View
        style={styles.canvas}
        onLayout={handleMapLayout}
      >

        {/* MAPA QUE SE PUEDE ARRASTRAR */}

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.movableMap,
            {
              transform: [
                { translateX: mapPosition.x },
                { translateY: mapPosition.y },
                { scale: MAP_SCALE },
              ],
            },
          ]}
        >
          <Image
            source={MAP_BACKGROUND}
            contentFit="cover"
            style={styles.map}
          />

          {/* Los marcadores se mueven con el mapa */}

          {!loading &&
            !visibleError &&
            places.map((place) => {
              const selected =
                place.id === selectedPlace?.id

              return (
                <View
                  key={String(place.id)}
                  style={[
                    styles.markerSpot,
                    {
                      top:
                        place.position?.top || '50%',
                      left:
                        place.position?.left || '50%',
                    },
                    selected &&
                      styles.markerSelected,
                  ]}
                >
                  <MapMarker
                    type={
                      place.type ||
                      place.category
                    }
                    label={place.name}
                    selected={selected}
                    onPress={() =>
                      setSelectedPlaceId(place.id)
                    }
                  />
                </View>
              )
            })}
        </Animated.View>

        {/* CONTROLES FIJOS */}

        <View style={styles.controls}>
          <SearchBar
            value={searchQuery}
            placeholder="Buscar por nombre o dirección..."
            onChangeText={changeSearch}
            onClear={() => changeSearch('')}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {CATEGORIES.map((category) => (
              <FilterTab
                key={category.id}
                label={category.label}
                active={
                  activeCategory === category.id
                }
                onPress={() =>
                  changeCategory(category.id)
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* BOTON PARA VOLVER AL CENTRO */}

        <Pressable
          onPress={centerMap}
          accessibilityRole="button"
          accessibilityLabel="Centrar mapa"
          style={({ pressed }) => [
            styles.centerButton,
            pressed && styles.centerButtonPressed,
          ]}
        >
          <Text style={styles.centerButtonText}>
            ⌖ Centrar
          </Text>
        </Pressable>

        {/* CARGA Y ERRORES */}

        {loading ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              ⏳
            </Text>

            <Text style={styles.emptyText}>
              Cargando lugares...
            </Text>
          </View>
        ) : visibleError ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              ⚠️
            </Text>

            <Text style={styles.emptyText}>
              {visibleError}
            </Text>

            <Pressable
              onPress={refetch}
              accessibilityLabel="Reintentar carga de lugares"
            >
              <Text style={styles.retryText}>
                Tocar para reintentar
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {places.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>
                  📍
                </Text>

                <Text style={styles.emptyText}>
                  No se encontraron lugares para
                  esta categoría o búsqueda.
                </Text>
              </View>
            )}

            {!!selectedPlace && (
              <View
                style={[
                  styles.placePanel,
                  {
                    backgroundColor: panelColor,
                  },
                ]}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    ✓{' '}
                    {PLACE_BADGES[selectedType] ||
                      'Lugar para mascotas'}
                  </Text>
                </View>

                <Text style={styles.placeTitle}>
                  {selectedPlace.name}
                </Text>

                <PlaceCard
                  embedded
                  type={selectedType}
                  name={selectedPlace.name}
                  address={selectedPlace.address}
                  schedule={selectedPlace.schedule}
                  description={selectedPlace.description}
                />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e8ecf0',
  },

  canvas: {
    position: 'relative',
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },

  movableMap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  controls: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    zIndex: 20,
    gap: 10,
  },

  categories: {
    gap: 8,
    paddingRight: 12,
    paddingBottom: 4,
  },

  centerButton: {
    position: 'absolute',
    top: 112,
    right: 14,
    zIndex: 21,

    paddingHorizontal: 13,
    paddingVertical: 9,

    borderRadius: 16,

    backgroundColor:
      'rgba(255,255,255,0.96)',

    ...shadows.soft,
  },

  centerButtonPressed: {
    opacity: 0.75,
  },

  centerButtonText: {
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },

  markerSpot: {
    position: 'absolute',
    zIndex: 10,

    transform: [
      { translateX: -23 },
      { translateY: -46 },
    ],
  },

  markerSelected: {
    zIndex: 15,
  },

  empty: {
    position: 'absolute',
    top: '42%',
    left: 24,
    right: 24,

    zIndex: 22,

    padding: 18,
    alignItems: 'center',

    borderRadius: 24,

    backgroundColor:
      'rgba(255,255,255,0.94)',

    ...shadows.card,
  },

  emptyIcon: {
    marginBottom: 6,
    fontSize: 27,
  },

  emptyText: {
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  placePanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 25,

    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 22,

    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,

    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -7,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },

  badge: {
    alignSelf: 'center',
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#bbf7d0',
  },

  badgeText: {
    color: '#14532d',
    fontFamily: fonts.bodyBold,
    fontSize: 10.5,
  },

  placeTitle: {
    marginBottom: 8,
    color: colors.white,
    fontFamily: fonts.displayBold,
    fontSize: 21,
    textAlign: 'center',
  },

  retryText: {
    paddingTop: 12,
    color: colors.blueDark,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: fonts.bodySemiBold,
  },
})

export default MapScreen
