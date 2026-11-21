import {
  useMemo,
  useState,
} from 'react'

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import AlertCard
  from '../components/AlertCard'

import Button
  from '../components/Button'

import FormField
  from '../components/FormField'

import SelectField
  from '../components/SelectField'

import ScreenContainer
  from '../components/ScreenContainer'

import {
  colors,
  fonts,
  radius,
  shadows,
} from '../theme'

const PUG =
  require('../../assets/pug-avatar.svg')

const FILTERS = [
  'Todos',
  'Perdidos',
  'En Adopción',
  'Emergencias',
]

const FILTER_TO_TYPE = {
  Perdidos: 'lost',
  'En Adopción': 'adoption',
  Emergencias: 'emergency',
}

const ZONAS = [
  {
    value: '',
    label: 'Todas las zonas',
  },
  {
    value: 'sopocachi',
    label: 'Sopocachi',
  },
  {
    value: 'miraflores',
    label: 'Miraflores',
  },
  {
    value: 'zona-sur',
    label: 'Zona Sur',
  },
  {
    value: 'el-alto',
    label: 'El Alto',
  },
  {
    value: 'centro',
    label: 'Centro',
  },
]

const REPORT_ZONES =
  ZONAS.filter(
    (zone) => zone.value !== ''
  )

const PET_OPTIONS = [
  {
    value: '1',
    label: 'Toby',
  },
  {
    value: '2',
    label: 'Mila',
  },
]

const INITIAL_ALERTS = [
  {
    id: 1,
    type: 'lost',
    petId: 1,
    petName: 'Toby',
    photo: PUG,
    zone: 'sopocachi',
    location:
      'Sopocachi, La Paz',
    date: 'Hace 20 min',
    description:
      'Se perdió cerca de la Plaza Abaroa. Lleva collar azul.',
    contact: '70000000',
    status: 'active',
  },

  {
    id: 2,
    type: 'adoption',
    petId: null,
    petName: 'Michi',
    photo: null,
    zone: 'miraflores',
    location:
      'Miraflores, La Paz',
    date: 'Hoy',
    description:
      'Gatito joven busca un hogar responsable y seguro.',
    contact: '71234567',
    status: 'active',
  },

  {
    id: 3,
    type: 'emergency',
    petId: null,
    petName: 'Emergencia',
    photo: null,
    zone: 'centro',
    location:
      'Centro, La Paz',
    date: 'Hace 1 h',
    description:
      'Mascota herida encontrada cerca de la avenida principal.',
    contact: '76543210',
    status: 'active',
  },
]

const EMPTY_FORM = {
  petId: '',
  petName: '',
  zone: '',
  description: '',
  contact: '',
}

function FilterChip({
  label,
  active,
  type,
  onPress,
}) {
  const colorsByType = {
    Todos: colors.text,
    Perdidos: colors.orange,
    'En Adopción':
      colors.primaryDark,
    Emergencias:
      colors.blueDark,
  }

  const accent =
    colorsByType[type] ||
    colors.text

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterChip,
        {
          borderColor: accent,
        },
        active && {
          backgroundColor:
            accent,
        },
        pressed &&
          styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          {
            color:
              active
                ? colors.white
                : accent,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

function AlertsScreen() {
  const [
    alerts,
    setAlerts,
  ] = useState(
    INITIAL_ALERTS
  )

  const [
    activeFilter,
    setActiveFilter,
  ] = useState('Todos')

  const [
    selectedZone,
    setSelectedZone,
  ] = useState('')

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false)

  const [
    reportType,
    setReportType,
  ] = useState('Perdidos')

  const [
    formData,
    setFormData,
  ] = useState(EMPTY_FORM)

  const filteredAlerts =
    useMemo(() => {
      return alerts.filter(
        (alert) => {
          const selectedType =
            FILTER_TO_TYPE[
              activeFilter
            ]

          const matchesType =
            activeFilter ===
              'Todos' ||
            alert.type ===
              selectedType

          const matchesZone =
            !selectedZone ||
            alert.zone ===
              selectedZone

          return (
            matchesType &&
            matchesZone
          )
        }
      )
    }, [
      alerts,
      activeFilter,
      selectedZone,
    ])

  const handleChange =
    (field) => (value) => {
      setFormData(
        (current) => ({
          ...current,
          [field]: value,
        })
      )
    }

  const handleReportType =
    (nextType) => {
      setReportType(nextType)

      setFormData(
        (current) => ({
          ...current,
          petId: '',
        })
      )
    }

  const handleCloseModal =
    () => {
      setIsModalOpen(false)
      setReportType(
        'Perdidos'
      )
      setFormData(
        EMPTY_FORM
      )
    }

  const handlePublish = () => {
    if (
      !formData.zone ||
      !formData.description.trim()
    ) {
      return
    }

    const type =
      FILTER_TO_TYPE[
        reportType
      ] || 'lost'

    const pet =
      PET_OPTIONS.find(
        (item) =>
          item.value ===
          formData.petId
      )

    const zone =
      REPORT_ZONES.find(
        (item) =>
          item.value ===
          formData.zone
      )

    const newAlert = {
      id: Date.now(),

      type,

      petId:
        type === 'lost' &&
        pet
          ? Number(pet.value)
          : null,

      petName:
        type === 'lost'
          ? (
              pet?.label ||
              formData.petName.trim() ||
              'Mascota perdida'
            )
          : type ===
              'adoption'
            ? (
                formData.petName.trim() ||
                'En adopción'
              )
            : 'Emergencia',

      photo:
        type === 'lost' &&
        pet?.value === '1'
          ? PUG
          : null,

      zone:
        formData.zone,

      location:
        zone
          ? `${zone.label}, La Paz`
          : 'La Paz',

      date: 'Ahora',

      description:
        formData.description.trim(),

      contact:
        formData.contact.trim(),

      status: 'active',
    }

    setAlerts(
      (current) => [
        newAlert,
        ...current,
      ]
    )

    handleCloseModal()
  }

  const handleResolve =
    (id) => {
      setAlerts(
        (current) =>
          current.map(
            (alert) =>
              alert.id === id
                ? {
                    ...alert,
                    status:
                      'resolved',
                  }
                : alert
          )
      )
    }

  return (
    <>
      <ScreenContainer>
        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.titleWrapper
            }
          >
            <View
              style={
                styles.highlight
              }
            />

            <Text
              style={
                styles.title
              }
            >
              Comunidad y{'\n'}
              alertas
            </Text>
          </View>

          <Pressable
            onPress={() =>
              setIsModalOpen(
                true
              )
            }
            accessibilityLabel="Crear nuevo reporte"
            style={({ pressed }) => [
              styles.addButton,
              pressed &&
                styles.pressed,
            ]}
          >
            <Text
              style={
                styles.addSymbol
              }
            >
              +
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.filters
          }
        >
          {FILTERS.map(
            (filter) => (
              <FilterChip
                key={filter}
                label={filter}
                type={filter}
                active={
                  activeFilter ===
                  filter
                }
                onPress={() =>
                  setActiveFilter(
                    filter
                  )
                }
              />
            )
          )}
        </ScrollView>

        <View
          style={
            styles.zoneFilter
          }
        >
          <SelectField
            value={
              selectedZone
            }
            options={ZONAS}
            placeholder="Todas las zonas"
            onChange={
              setSelectedZone
            }
          />
        </View>

        <View style={styles.list}>
          {filteredAlerts.length ===
          0 ? (
            <View
              style={
                styles.empty
              }
            >
              <Text
                style={
                  styles.emptyTitle
                }
              >
                No hay alertas
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                No hay alertas
                para estos
                filtros.
              </Text>
            </View>
          ) : (
            filteredAlerts.map(
              (alert) => (
                <View
                  key={
                    alert.id
                  }
                  style={[
                    styles.alertBlock,
                    alert.status ===
                      'resolved' &&
                      styles.resolved,
                  ]}
                >
                  <AlertCard
                    type={
                      alert.type
                    }
                    petName={
                      alert.petName
                    }
                    photo={
                      alert.photo
                    }
                    location={
                      alert.location
                    }
                    date={
                      alert.date
                    }
                    description={
                      alert.description
                    }
                    contact={
                      alert.contact
                    }
                  />

                  <View
                    style={
                      styles.statusRow
                    }
                  >
                    <View
                      style={[
                        styles.statusBadge,
                        alert.status ===
                        'resolved'
                          ? styles.statusResolved
                          : styles.statusActive,
                      ]}
                    >
                      <Text
                        style={
                          styles.statusText
                        }
                      >
                        {alert.status ===
                        'resolved'
                          ? 'Resuelta'
                          : 'Activa'}
                      </Text>
                    </View>

                    {alert.status ===
                      'active' && (
                      <Pressable
                        onPress={() =>
                          handleResolve(
                            alert.id
                          )
                        }
                        style={({ pressed }) => [
                          styles.resolveButton,
                          pressed &&
                            styles.pressed,
                        ]}
                      >
                        <Text
                          style={
                            styles.resolveText
                          }
                        >
                          Marcar resuelta
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )
            )
          )}
        </View>
      </ScreenContainer>

      <Modal
        visible={
          isModalOpen
        }
        transparent
        animationType="slide"
        onRequestClose={
          handleCloseModal
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <Pressable
            style={
              styles.modalBackdrop
            }
            onPress={
              handleCloseModal
            }
          />

          <View
            style={
              styles.modalCard
            }
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={
                  styles.modalTitle
                }
              >
                Nuevo Reporte
              </Text>

              <Pressable
                onPress={
                  handleCloseModal
                }
                style={
                  styles.closeButton
                }
              >
                <Text
                  style={
                    styles.closeText
                  }
                >
                  ×
                </Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              keyboardShouldPersistTaps="handled"
            >
              <Text
                style={
                  styles.typeLabel
                }
              >
                Tipo de Alerta
              </Text>

              <View
                style={
                  styles.reportTypes
                }
              >
                {FILTERS
                  .filter(
                    (filter) =>
                      filter !==
                      'Todos'
                  )
                  .map(
                    (filter) => (
                      <FilterChip
                        key={
                          filter
                        }
                        label={
                          filter
                        }
                        type={
                          filter
                        }
                        active={
                          reportType ===
                          filter
                        }
                        onPress={() =>
                          handleReportType(
                            filter
                          )
                        }
                      />
                    )
                  )}
              </View>

              <View
                style={
                  styles.form
                }
              >
                {reportType ===
                  'Perdidos' && (
                  <SelectField
                    label="Mascota registrada"
                    value={
                      formData.petId
                    }
                    options={
                      PET_OPTIONS
                    }
                    placeholder="Seleccionar mascota"
                    onChange={
                      handleChange(
                        'petId'
                      )
                    }
                  />
                )}

                <FormField
                  label="Nombre de la mascota"
                  value={
                    formData.petName
                  }
                  onChangeText={
                    handleChange(
                      'petName'
                    )
                  }
                  placeholder="Nombre"
                />

                <SelectField
                  label="Zona"
                  value={
                    formData.zone
                  }
                  options={
                    REPORT_ZONES
                  }
                  placeholder="Seleccionar zona"
                  onChange={
                    handleChange(
                      'zone'
                    )
                  }
                />

                <FormField
                  label="Descripción detallada"
                  value={
                    formData.description
                  }
                  onChangeText={
                    handleChange(
                      'description'
                    )
                  }
                  placeholder="Describe la situación"
                  multiline
                />

                <FormField
                  label="Datos de contacto"
                  value={
                    formData.contact
                  }
                  onChangeText={
                    handleChange(
                      'contact'
                    )
                  }
                  placeholder="Teléfono o contacto"
                  keyboardType="phone-pad"
                />

                <Button
                  variant="danger"
                  onPress={
                    handlePublish
                  }
                >
                  Publicar Alerta
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 22,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  titleWrapper: {
    position: 'relative',

    paddingLeft: 10,
  },

  highlight: {
    position: 'absolute',

    left: 0,
    top: 8,

    width: 48,
    height: 48,

    borderRadius: 14,

    backgroundColor:
      colors.yellowNav,
  },

  title: {
    color: colors.textDark,

    fontFamily:
      fonts.displayExtraBold,
    fontSize: 30,

    lineHeight: 33,

    zIndex: 2,
  },

  addButton: {
    width: 52,
    height: 52,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius:
      radius.pill,

    backgroundColor:
      colors.primaryDark,

    ...shadows.card,
  },

  addSymbol: {
    marginTop: -3,

    color: colors.white,

    fontFamily:
      fonts.bodySemiBold,
    fontSize: 32,
  },

  filters: {
    gap: 8,

    paddingRight: 20,
    paddingBottom: 4,
  },

  filterChip: {
    minHeight: 40,

    paddingHorizontal: 16,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,

    borderRadius:
      radius.pill,

    backgroundColor:
      colors.background,
  },

  filterChipText: {
    fontFamily:
      fonts.bodySemiBold,
    fontSize: 11.5,
  },

  zoneFilter: {
    marginTop: 14,
    marginBottom: 22,
  },

  list: {
    gap: 18,
  },

  alertBlock: {
    gap: 9,
  },

  resolved: {
    opacity: 0.62,
  },

  statusRow: {
    paddingHorizontal: 6,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',

    gap: 12,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius:
      radius.pill,
  },

  statusActive: {
    backgroundColor:
      '#E9F0DF',
  },

  statusResolved: {
    backgroundColor:
      '#E7E4DF',
  },

  statusText: {
    color: colors.text,

    fontFamily:
      fonts.bodySemiBold,
    fontSize: 10.5,
  },

  resolveButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius:
      radius.pill,

    backgroundColor:
      colors.blue,
  },

  resolveText: {
    color: colors.white,

    fontFamily:
      fonts.bodySemiBold,
    fontSize: 10.5,
  },

  empty: {
    paddingHorizontal: 22,
    paddingVertical: 34,

    alignItems: 'center',

    borderRadius: 28,

    backgroundColor:
      colors.surface,
  },

  emptyTitle: {
    color: colors.text,

    fontFamily:
      fonts.displayBold,
    fontSize: 18,
  },

  emptyText: {
    marginTop: 5,

    color: colors.muted,

    fontFamily: fonts.body,
    fontSize: 12.5,
  },

  modalOverlay: {
    flex: 1,

    justifyContent:
      'flex-end',

    backgroundColor:
      'rgba(0,0,0,0.42)',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modalCard: {
    width: '100%',
    maxHeight: '90%',

    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 32,

    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,

    backgroundColor:
      colors.background,

    ...shadows.card,
  },

  modalHeader: {
    marginBottom: 18,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  modalTitle: {
    color: colors.text,

    fontFamily:
      fonts.displayBold,
    fontSize: 26,
  },

  closeButton: {
    width: 40,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius:
      radius.pill,

    backgroundColor:
      colors.surface,
  },

  closeText: {
    color: colors.text,

    fontSize: 25,
  },

  typeLabel: {
    marginBottom: 10,

    color: colors.text,

    fontFamily:
      fonts.bodySemiBold,
    fontSize: 13,
  },

  reportTypes: {
    marginBottom: 20,

    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,
  },

  form: {
    gap: 13,
  },

  pressed: {
    opacity: 0.78,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },
})

export default AlertsScreen