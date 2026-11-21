import { useMemo, useState } from 'react'

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Button
  from '../components/Button'

import FilterTab
  from '../components/FilterTab'

import FormField
  from '../components/FormField'

import MedicalRecordCard
  from '../components/MedicalRecordCard'

import ScreenContainer
  from '../components/ScreenContainer'

import {
  colors,
  fonts,
  radius,
  shadows,
  spacing,
} from '../theme'

const FILTERS = [
  {
    id: 'vaccine',
    label: 'Vacunas',
  },
  {
    id: 'deworming',
    label: 'Desparasitación',
  },
  {
    id: 'consultation',
    label: 'Consultas',
  },
]

const INITIAL_RECORDS = [
  {
    id: 1,
    petId: 1,
    type: 'vaccine',
    title: 'Vacuna antirrábica',
    date: '10/08/2026',
    nextDate: '10/08/2027',
    place: 'Veterinaria San Martín',
    description:
      'Vacuna anual aplicada sin complicaciones.',
  },

  {
    id: 2,
    petId: 1,
    type: 'vaccine',
    title: 'Vacuna múltiple',
    date: '14/03/2026',
    nextDate: '14/03/2027',
    place: 'VetCare La Paz',
    description:
      'Refuerzo anual de vacuna múltiple.',
  },

  {
    id: 3,
    petId: 1,
    type: 'deworming',
    title: 'Desparasitación interna',
    date: '25/09/2026',
    nextDate: '25/12/2026',
    place: 'VetCare La Paz',
    description:
      'Tratamiento preventivo de rutina.',
  },

  {
    id: 4,
    petId: 1,
    type: 'consultation',
    title: 'Consulta general',
    date: '02/10/2026',
    nextDate: '',
    place: 'Veterinaria Central',
    description:
      'Control general. Peso y signos vitales normales.',
  },
]

const EMPTY_FORM = {
  title: '',
  date: '',
  nextDate: '',
  place: '',
  description: '',
}

function MedicalHistoryScreen() {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState('vaccine')

  const [
    records,
    setRecords,
  ] = useState(INITIAL_RECORDS)

  const [
    medicalFormOpen,
    setMedicalFormOpen,
  ] = useState(false)

  const [
    editingRecordId,
    setEditingRecordId,
  ] = useState(null)

  const [
    formData,
    setFormData,
  ] = useState(EMPTY_FORM)

  const visibleRecords =
    useMemo(() => {
      return records.filter(
        (record) =>
          record.type ===
          activeFilter
      )
    }, [
      activeFilter,
      records,
    ])

  const activeFilterLabel =
    FILTERS.find(
      (filter) =>
        filter.id ===
        activeFilter
    )?.label || ''

  const handleChange =
    (field) => (value) => {
      setFormData((current) => ({
        ...current,
        [field]: value,
      }))
    }

  const resetForm = () => {
    setMedicalFormOpen(false)
    setEditingRecordId(null)
    setFormData(EMPTY_FORM)
  }

  const handleNewRecord = () => {
    setEditingRecordId(null)
    setFormData(EMPTY_FORM)
    setMedicalFormOpen(true)
  }

  const handleEdit = (record) => {
    setEditingRecordId(record.id)

    setFormData({
      title: record.title,
      date: record.date,
      nextDate:
        record.nextDate || '',
      place:
        record.place || '',
      description:
        record.description || '',
    })

    setActiveFilter(record.type)
    setMedicalFormOpen(true)
  }

  const handleSave = () => {
    if (!formData.title.trim()) {
      return
    }

    if (editingRecordId !== null) {
      setRecords((current) =>
        current.map((record) =>
          record.id ===
          editingRecordId
            ? {
                ...record,
                ...formData,
              }
            : record
        )
      )

      resetForm()
      return
    }

    const newRecord = {
      id: Date.now(),
      petId: 1,
      type: activeFilter,
      ...formData,
    }

    setRecords((current) => [
      ...current,
      newRecord,
    ])

    resetForm()
  }

  return (
    <ScreenContainer>
      <View style={styles.heading}>
        <Text style={styles.title}>
          Historial Médico
        </Text>

        <Text style={styles.subtitle}>
          Toby
        </Text>
      </View>

      <View style={styles.filters}>
        {FILTERS.map(
          (filter) => (
            <FilterTab
              key={filter.id}
              label={filter.label}
              active={
                activeFilter ===
                filter.id
              }
              onPress={() => {
                setActiveFilter(
                  filter.id
                )

                setMedicalFormOpen(
                  false
                )

                setEditingRecordId(
                  null
                )
              }}
            />
          )
        )}
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text
            style={
              styles.sectionTitle
            }
          >
            {activeFilterLabel}
          </Text>

          <Text
            style={
              styles.sectionSubtitle
            }
          >
            {
              visibleRecords.length
            }{' '}
            registro
            {visibleRecords.length === 1
              ? ''
              : 's'}
          </Text>
        </View>

        <Pressable
          onPress={handleNewRecord}
          accessibilityLabel="Agregar registro médico"
          style={({ pressed }) => [
            styles.addButton,
            pressed &&
              styles.pressed,
          ]}
        >
          <Text
            style={styles.addSymbol}
          >
            +
          </Text>
        </Pressable>
      </View>

      {medicalFormOpen && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingRecordId !== null
              ? 'Editar registro'
              : 'Nuevo registro'}
          </Text>

          <Text
            style={
              styles.formSubtitle
            }
          >
            {activeFilterLabel}
          </Text>

          <View style={styles.form}>
            <FormField
              label="Título"
              value={formData.title}
              onChangeText={
                handleChange('title')
              }
              placeholder="Ej. Vacuna antirrábica"
            />

            <FormField
              label="Fecha"
              value={formData.date}
              onChangeText={
                handleChange('date')
              }
              placeholder="DD/MM/AAAA"
            />

            <FormField
              label="Próxima fecha"
              value={
                formData.nextDate
              }
              onChangeText={
                handleChange(
                  'nextDate'
                )
              }
              placeholder="Opcional"
            />

            <FormField
              label="Lugar"
              value={formData.place}
              onChangeText={
                handleChange('place')
              }
              placeholder="Veterinaria"
            />

            <FormField
              label="Descripción"
              value={
                formData.description
              }
              onChangeText={
                handleChange(
                  'description'
                )
              }
              placeholder="Notas del registro"
              multiline
            />
          </View>

          <View
            style={
              styles.formActions
            }
          >
            <Button
              onPress={handleSave}
            >
              {editingRecordId !==
              null
                ? 'Guardar cambios'
                : 'Guardar registro'}
            </Button>

            <Pressable
              onPress={resetForm}
              style={
                styles.cancelButton
              }
            >
              <Text
                style={
                  styles.cancelText
                }
              >
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {!medicalFormOpen && (
        <View style={styles.records}>
          {visibleRecords.length >
          0 ? (
            visibleRecords.map(
              (record) => (
                <MedicalRecordCard
                  key={record.id}
                  title={record.title}
                  date={record.date}
                  nextDate={
                    record.nextDate
                  }
                  place={record.place}
                  description={
                    record.description
                  }
                  type={record.type}
                  onEdit={() =>
                    handleEdit(
                      record
                    )
                  }
                />
              )
            )
          ) : (
            <View
              style={
                styles.emptyState
              }
            >
              <View
                style={
                  styles.emptyIcon
                }
              >
                <Text
                  style={
                    styles.emptySymbol
                  }
                >
                  +
                </Text>
              </View>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                Sin registros
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Todavía no hay
                registros en esta
                categoría.
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

    fontFamily:
      fonts.displayBold,
    fontSize: 29,

    lineHeight: 35,
  },

  subtitle: {
    marginTop: 2,

    color: colors.orange,

    fontFamily:
      fonts.bodySemiBold,
    fontSize: 14,
  },

  filters: {
    marginBottom: 26,

    flexDirection: 'row',
    flexWrap: 'wrap',

    gap: 8,
  },

  sectionHeader: {
    marginBottom: 15,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',

    gap: spacing.md,
  },

  sectionTitle: {
    color: colors.text,

    fontFamily:
      fonts.displayBold,
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

    backgroundColor:
      colors.orange,

    ...shadows.orange,
  },

  addSymbol: {
    marginTop: -3,

    color: colors.white,

    fontFamily:
      fonts.bodySemiBold,
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

    backgroundColor:
      colors.blue,

    ...shadows.card,
  },

  formTitle: {
    color: colors.white,

    fontFamily:
      fonts.displayBold,
    fontSize: 23,

    lineHeight: 28,
  },

  formSubtitle: {
    marginTop: 2,
    marginBottom: 18,

    color:
      'rgba(255,255,255,0.80)',

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

    fontFamily:
      fonts.bodySemiBold,
    fontSize: 13,

    textDecorationLine:
      'underline',
  },

  emptyState: {
    width: '100%',

    paddingHorizontal: 22,
    paddingVertical: 34,

    alignItems: 'center',

    borderWidth: 1,
    borderColor:
      colors.border,

    borderRadius: 28,

    backgroundColor:
      colors.surface,
  },

  emptyIcon: {
    width: 54,
    height: 54,

    marginBottom: 10,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: radius.pill,

    backgroundColor:
      colors.accent,
  },

  emptySymbol: {
    color: colors.orange,

    fontFamily:
      fonts.displayBold,
    fontSize: 25,
  },

  emptyTitle: {
    color: colors.text,

    fontFamily:
      fonts.displayBold,
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