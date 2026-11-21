import {
  useMemo,
  useState,
} from 'react'

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Image } from 'expo-image'

import FilterTab
  from '../components/FilterTab'

import MapMarker
  from '../components/MapMarker'

import PlaceCard
  from '../components/PlaceCard'

import SearchBar
  from '../components/SearchBar'

import {
  colors,
  fonts,
  shadows,
} from '../theme'

const MAP_BACKGROUND =
  require('../../assets/map-background.svg')

const CATEGORIES = [
  {
    id: 'all',
    label: 'Todos',
  },
  {
    id: 'park',
    label: 'Parques',
  },
  {
    id: 'veterinary',
    label: 'Veterinarias',
  },
  {
    id: 'petFriendly',
    label: 'Pet Friendly',
  },
]

const PLACE_BADGES = {
  park: 'Parque Pet-Friendly',
  veterinary:
    'Atención para mascotas',
  petFriendly:
    'Lugar Pet-Friendly',
}

/*
  Datos temporales únicamente para C1.

  En la fase de integración,
  esta lista se reemplaza por
  GET /api/lugares.
*/
const PREVIEW_PLACES = [
  {
    id: 1,
    category: 'park',
    type: 'park',

    name: 'Parque Pet Friendly',

    address:
      'Zona Sur, La Paz',

    schedule:
      'Abierto todo el día',

    description:
      'Espacio abierto para pasear y compartir con tu mascota.',

    position: {
      top: '30%',
      left: '25%',
    },
  },

  {
    id: 2,
    category: 'veterinary',
    type: 'veterinary',

    name: 'Veterinaria Central',

    address:
      'Sopocachi, La Paz',

    schedule:
      '08:00 – 20:00',

    description:
      'Atención veterinaria y servicios para mascotas.',

    position: {
      top: '47%',
      left: '68%',
    },
  },

  {
    id: 3,
    category: 'petFriendly',
    type: 'petFriendly',

    name: 'Café Pet Friendly',

    address:
      'Miraflores, La Paz',

    schedule:
      '09:00 – 21:00',

    description:
      'Espacio donde puedes ingresar acompañado de tu mascota.',

    position: {
      top: '64%',
      left: '39%',
    },
  },
]

function MapScreen() {
  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const [
    activeCategory,
    setActiveCategory,
  ] = useState('all')

  const [
    selectedPlaceId,
    setSelectedPlaceId,
  ] = useState(1)

  const places =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase()

      return PREVIEW_PLACES.filter(
        (place) => {
          const matchesCategory =
            activeCategory ===
              'all' ||
            place.category ===
              activeCategory

          const matchesSearch =
            !query ||
            place.name
              .toLowerCase()
              .includes(query) ||
            place.address
              .toLowerCase()
              .includes(query)

          return (
            matchesCategory &&
            matchesSearch
          )
        }
      )
    }, [
      activeCategory,
      searchQuery,
    ])

  const selectedPlace =
    places.find(
      (place) =>
        place.id ===
        selectedPlaceId
    ) ??
    places[0] ??
    null

  const handleCategoryChange =
    (categoryId) => {
      setActiveCategory(
        categoryId
      )

      setSelectedPlaceId(null)
    }

  const handleSearch =
    (value) => {
      setSearchQuery(value)
      setSelectedPlaceId(null)
    }

  const handleClearSearch =
    () => {
      setSearchQuery('')
      setSelectedPlaceId(null)
    }

  const panelColor =
    selectedPlace?.type === 'park'
      ? colors.primary
      : selectedPlace?.type ===
          'veterinary'
        ? colors.blue
        : colors.text

  return (
    <View style={styles.page}>
      <View style={styles.canvas}>
        <Image
          source={MAP_BACKGROUND}
          contentFit="cover"
          style={styles.map}
        />

        <View style={styles.controls}>
          <SearchBar
            value={searchQuery}
            placeholder="Buscar por nombre o dirección..."
            onChangeText={
              handleSearch
            }
            onClear={
              handleClearSearch
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.categories
            }
          >
            {CATEGORIES.map(
              (category) => (
                <FilterTab
                  key={category.id}
                  label={
                    category.label
                  }
                  active={
                    activeCategory ===
                    category.id
                  }
                  onPress={() =>
                    handleCategoryChange(
                      category.id
                    )
                  }
                />
              )
            )}
          </ScrollView>
        </View>

        {places.map(
          (place) => {
            const selected =
              selectedPlace?.id ===
              place.id

            return (
              <View
                key={place.id}
                style={[
                  styles.markerSpot,
                  {
                    top:
                      place.position
                        .top,

                    left:
                      place.position
                        .left,
                  },

                  selected &&
                    styles.markerSelected,
                ]}
              >
                <MapMarker
                  type={place.type}
                  label={place.name}
                  selected={
                    selected
                  }
                  onPress={() =>
                    setSelectedPlaceId(
                      place.id
                    )
                  }
                />
              </View>
            )
          }
        )}

        {places.length === 0 && (
          <View style={styles.empty}>
            <Text
              style={styles.emptyIcon}
            >
              📍
            </Text>

            <Text
              style={styles.emptyText}
            >
              No se encontraron
              lugares para esta
              categoría o búsqueda.
            </Text>
          </View>
        )}

        {!!selectedPlace && (
          <View
            style={[
              styles.placePanel,
              {
                backgroundColor:
                  panelColor,
              },
            ]}
          >
            <View
              style={
                styles.badge
              }
            >
              <Text
                style={
                  styles.badgeText
                }
              >
                ✓{' '}
                {
                  PLACE_BADGES[
                    selectedPlace
                      .type
                  ]
                }
              </Text>
            </View>

            <Text
              style={
                styles.placeTitle
              }
            >
              {selectedPlace.name}
            </Text>

            <PlaceCard
              embedded
              type={
                selectedPlace.type
              }
              name={
                selectedPlace.name
              }
              address={
                selectedPlace.address
              }
              schedule={
                selectedPlace.schedule
              }
              description={
                selectedPlace.description
              }
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,

    width: '100%',

    backgroundColor:
      '#e8ecf0',
  },

  canvas: {
    position: 'relative',

    flex: 1,

    width: '100%',

    overflow: 'hidden',
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

  markerSpot: {
    position: 'absolute',

    zIndex: 10,

    transform: [
      {
        translateX: -23,
      },
      {
        translateY: -46,
      },
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

    shadowColor:
      colors.black,

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

    backgroundColor:
      '#bbf7d0',
  },

  badgeText: {
    color: '#14532d',

    fontFamily:
      fonts.bodyBold,
    fontSize: 10.5,
  },

  placeTitle: {
    marginBottom: 8,

    color: colors.white,

    fontFamily:
      fonts.displayBold,
    fontSize: 21,

    textAlign: 'center',
  },
})

export default MapScreen