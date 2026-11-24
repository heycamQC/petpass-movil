
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useFocusEffect } from '@react-navigation/native'
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Button from '../components/Button'
import FormField from '../components/FormField'
import MedicalDateField from '../components/MedicalDateField'
import MedicalRecordCard from '../components/MedicalRecordCard'
import Message from '../components/Message'
import ScreenContainer from '../components/ScreenContainer'

import { API_URL } from '../config'
import useApi from '../hooks/useApi'
import { sendMedicalRequest } from '../utils/medicalApi'

import {
  colors,
  fonts,
  radius,
  shadows,
  spacing,
} from '../theme'

// Los tipos que acepta la API actual.
const FILTERS = [
  { id: 'vaccine', label: 'Vacunas' },
  { id: 'deworming', label: 'Desparasitación' },
  { id: 'consultation', label: 'Consultas' },
]

const EMPTY_FORM = {
  title: '',
  date: '',
  nextDate: '',
  place: '',
  description: '',
}

// La API recibe fechas en formato AAAA-MM-DD.
function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const [year, month, day] =
    value.split('-').map(Number)

  const parsed = new Date(
    Date.UTC(year, month - 1, day)
  )

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}

// Las tarjetas siguen mostrando DD/MM/AAAA.
function displayDate(value) {
  if (!value) return ''
  if (!isValidISODate(value)) return String(value)

  const [year, month, day] = value.split('-')

  return `${day}/${month}/${year}`
}

function MedicalHistoryScreen({ navigation, route }) {
  const petId = Number(route.params?.id)

  const validPetId =
    Number.isInteger(petId) && petId > 0

  const petName =
    route.params?.petName ||
    `Mascota #${petId}`

  const url = validPetId
    ? `${API_URL}/api/mascotas/${petId}/historial`
    : null

  const {
    data,
    loading,
    error,
    refetch,
  } = useApi(url)

  const [activeFilter, setActiveFilter] =
    useState('vaccine')

  const [medicalFormOpen, setMedicalFormOpen] =
    useState(false)

  const [editingRecordId, setEditingRecordId] =
    useState(null)

  const [formData, setFormData] =
    useState(EMPTY_FORM)

  const [formError, setFormError] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  const savingLock = useRef(false)
  const firstFocus = useRef(true)

  // Actualizar datos al volver a la pantalla.
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false
      } else if (validPetId) {
        refetch()
      }
    }, [validPetId, refetch])
  )

  const records = Array.isArray(data) ? data : []

  const visibleRecords = useMemo(
    () =>
      records.filter(
        (record) => record.type === activeFilter
      ),
    [data, activeFilter]
  )

  const activeFilterLabel =
    FILTERS.find(
      (filter) => filter.id === activeFilter
    )?.label || ''

  function handleChange(field) {
    return (value) => {
      setFormData((current) => ({
        ...current,
        [field]: value,
      }))

      setFormError('')
    }
  }

  function resetForm() {
    setMedicalFormOpen(false)
    setEditingRecordId(null)
    setFormData(EMPTY_FORM)
    setFormError('')
  }

  function handleFilterChange(type) {
    if (saving) return

    setActiveFilter(type)
    resetForm()
  }

  function handleNewRecord() {
    if (saving) return

    setEditingRecordId(null)
    setFormData(EMPTY_FORM)
    setFormError('')
    setMedicalFormOpen(true)
  }

  function handleEdit(record) {
    if (saving) return

    setActiveFilter(record.type)
    setEditingRecordId(record.id)

    // Los valores llegan de SQLite en formato ISO.
    // El calendario reconoce estos valores.
    setFormData({
      title: record.title || '',
      date: record.date || '',
      nextDate: record.nextDate || '',
      place: record.place || '',
      description: record.description || '',
    })

    setFormError('')
    setMedicalFormOpen(true)
  }

  async function handleSave() {
    if (!validPetId || savingLock.current) return

    const title = formData.title.trim()
    const date = formData.date.trim()
    const nextDate = formData.nextDate.trim()

    if (!title) {
      setFormError('El título es obligatorio.')
      return
    }

    if (!date) {
      setFormError('Selecciona la fecha del registro.')
      return
    }

    if (!isValidISODate(date)) {
      setFormError(
        'Selecciona una fecha válida en el calendario.'
      )
      return
    }

    if (
      nextDate &&
      !isValidISODate(nextDate)
    ) {
      setFormError(
        'Selecciona una próxima fecha válida.'
      )
      return
    }

    // Payload original de la API.
    // date y nextDate permanecen en formato AAAA-MM-DD.
    const payload = {
      type: activeFilter,
      title,
      date,
      nextDate,
      place: formData.place.trim(),
      description: formData.description.trim(),
    }

    const editing = editingRecordId !== null

    const path = editing
      ? `/api/historial/${editingRecordId}`
      : `/api/mascotas/${petId}/historial`

    savingLock.current = true
    setSaving(true)
    setFormError('')

    try {
      await sendMedicalRequest(
        path,
        editing ? 'PUT' : 'POST',
        payload
      )

      resetForm()
      refetch()
    } catch (requestError) {
      setFormError(
        requestError.message ||
        'No se pudo guardar el registro.'
      )
    } finally {
      savingLock.current = false
      setSaving(false)
    }
  }

  if (!validPetId) {
    return (
      <ScreenContainer>
        <Message
          error="No se recibió un ID válido de mascota."
        />

        <Button
          variant="secondary"
          onPress={() => navigation.goBack()}
        >
          Volver a mascotas
        </Button>
      </ScreenContainer>
    )
  }

  if (
    loading ||
    error ||
    !Array.isArray(data)
  ) {
    return (
      <ScreenContainer>
        <View style={styles.heading}>
          <Text style={styles.title}>
            Historial Médico
          </Text>

          <Text style={styles.subtitle}>
            {petName}
          </Text>
        </View>

        <Message
          loading={loading}
          error={
            error ||
            (!loading
              ? 'La API no devolvió una lista válida de registros.'
              : '')
          }
        />

        {!loading && (
          <View style={styles.formActions}>
            <Button
              variant="secondary"
              onPress={refetch}
            >
              Reintentar
            </Button>

            <Button
              variant="secondary"
              onPress={() => navigation.goBack()}
            >
              Volver a mascotas
            </Button>
          </View>
        )}
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      {/* Encabezado */}
      <View style={styles.heading}>
        <Text style={styles.title}>
          Historial Médico
        </Text>

        <Text style={styles.subtitle}>
          {petName}
        </Text>
      </View>

      {/* Filtros originales */}
      <View style={styles.filters}>
        {FILTERS.map((filter) => {
          const active = activeFilter === filter.id

          return (
            <Pressable
              key={filter.id}
              onPress={() =>
                handleFilterChange(filter.id)
              }
              disabled={saving}
              accessibilityRole="button"
              accessibilityState={{
                selected: active,
              }}
              style={({ pressed }) => [
                styles.filterButton,
                filter.id === 'deworming' &&
                  styles.filterButtonWide,
                active &&
                  styles.filterButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={[
                  styles.filterText,
                  active &&
                    styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {/* Título de la categoría */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            {activeFilterLabel}
          </Text>

          <Text style={styles.sectionSubtitle}>
            {visibleRecords.length} registro
            {visibleRecords.length === 1 ? '' : 's'}
          </Text>
        </View>

        <Pressable
          onPress={handleNewRecord}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Agregar registro médico"
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.addSymbol}>
            +
          </Text>
        </Pressable>
      </View>

      {/* Formulario de nuevo registro / edición */}
      {medicalFormOpen && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingRecordId !== null
              ? 'Editar registro'
              : 'Nuevo registro'}
          </Text>

          <Text style={styles.formSubtitle}>
            {activeFilterLabel}
          </Text>

          <View style={styles.form}>
            <FormField
              label="Título *"
              value={formData.title}
              onChangeText={handleChange('title')}
              placeholder="Ej. Vacuna antirrábica"
            />

            {/* NUEVO CALENDARIO OBLIGATORIO */}
            <MedicalDateField
              label="Fecha del registro *"
              value={formData.date}
              onChange={handleChange('date')}
              disabled={saving}
              onBlue
            />

            {/* NUEVO CALENDARIO OPCIONAL */}
            <MedicalDateField
              label="Próxima fecha (opcional)"
              value={formData.nextDate}
              onChange={handleChange('nextDate')}
              optional
              disabled={saving}
              onBlue
            />

            <FormField
              label="Lugar"
              value={formData.place}
              onChangeText={handleChange('place')}
              placeholder="Veterinaria"
            />

            <FormField
              label="Descripción"
              value={formData.description}
              onChangeText={handleChange('description')}
              placeholder="Notas del registro"
              multiline
            />

            {!!formError && (
              <Message error={formError} />
            )}
          </View>

          <View style={styles.formActions}>
            <Button
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? 'Guardando...'
                : editingRecordId !== null
                  ? 'Guardar cambios'
                  : 'Guardar registro'}
            </Button>

            <Pressable
              onPress={resetForm}
              disabled={saving}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Registros existentes */}
      {!medicalFormOpen && (
        <View style={styles.records}>
          {visibleRecords.length > 0 ? (
            visibleRecords.map((record) => (
              <MedicalRecordCard
                key={record.id}
                type={record.type}
                title={record.title}
                date={displayDate(record.date)}
                nextDate={displayDate(record.nextDate)}
                place={record.place}
                description={record.description}
                onEdit={() => handleEdit(record)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptySymbol}>
                  +
                </Text>
              </View>

              <Text style={styles.emptyTitle}>
                Sin registros
              </Text>

              <Text style={styles.emptyText}>
                Todavía no hay registros en esta categoría.
              </Text>
            </View>
          )}
        </View>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: 20,
  },

  title: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 29,
    lineHeight: 35,
  },

  subtitle: {
    marginTop: 2,
    color: colors.orange,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },

  filters: {
    width: '100%',
    marginBottom: 26,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 6,
  },

  filterButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    paddingHorizontal: 3,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.orange,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },

  filterButtonWide: {
    flex: 1.7,
  },

  filterButtonActive: {
    backgroundColor: colors.orange,
  },

  filterText: {
    color: colors.orange,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    textAlign: 'center',
  },

  filterTextActive: {
    color: colors.white,
  },

  sectionHeader: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 21,
  },

  sectionSubtitle: {
    marginTop: 1,
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 11.5,
  },

  addButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.orange,
    ...shadows.orange,
  },

  addSymbol: {
    marginTop: -3,
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: 29,
    lineHeight: 32,
  },

  records: {
    gap: 14,
  },

  formCard: {
    width: '100%',
    padding: 20,
    borderRadius: 30,
    backgroundColor: colors.blue,
    ...shadows.card,
  },

  formTitle: {
    color: colors.white,
    fontFamily: fonts.displayBold,
    fontSize: 23,
    lineHeight: 28,
  },

  formSubtitle: {
    marginTop: 2,
    marginBottom: 18,
    color: 'rgba(255,255,255,0.80)',
    fontFamily: fonts.body,
    fontSize: 12,
  },

  form: {
    gap: 11,
  },

  formActions: {
    marginTop: 18,
    gap: 10,
  },

  cancelButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    textDecorationLine: 'underline',
  },

  emptyState: {
    width: '100%',
    paddingHorizontal: 22,
    paddingVertical: 34,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    backgroundColor: colors.surface,
  },

  emptyIcon: {
    width: 54,
    height: 54,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },

  emptySymbol: {
    color: colors.orange,
    fontFamily: fonts.displayBold,
    fontSize: 25,
  },

  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 18,
  },

  emptyText: {
    maxWidth: 240,
    marginTop: 5,
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },
})

export default MedicalHistoryScreen
