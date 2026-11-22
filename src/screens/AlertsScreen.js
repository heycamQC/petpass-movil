import { useCallback, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  Modal, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native'

import AlertCard from '../components/AlertCard'
import Button from '../components/Button'
import FormField from '../components/FormField'
import Message from '../components/Message'
import ScreenContainer from '../components/ScreenContainer'
import SelectField from '../components/SelectField'
import { API_URL } from '../config'
import useApi from '../hooks/useApi'
import { sendAlertRequest } from '../utils/alertApi'
import { getPetPhotoSource } from '../utils/petPhoto'
import { colors, fonts, radius, shadows } from '../theme'

// Estos valores coinciden con alerts.controller.js del backend de EC2.
const FILTERS = ['Todos', 'Perdidos', 'En Adopción', 'Emergencias']
const FILTER_TO_TYPE = {
  Perdidos: 'lost',
  'En Adopción': 'adoption',
  Emergencias: 'emergency',
}
const ZONAS = [
  { value: '', label: 'Todas las zonas' },
  { value: 'sopocachi', label: 'Sopocachi' },
  { value: 'miraflores', label: 'Miraflores' },
  { value: 'zona-sur', label: 'Zona Sur' },
  { value: 'el-alto', label: 'El Alto' },
  { value: 'centro', label: 'Centro' },
]
const REPORT_ZONES = ZONAS.filter((zone) => zone.value !== '')
const EMPTY_FORM = {
  petId: '', petName: '', zone: '', description: '', contact: '',
}

function formatAlertDate(date) {
  if (typeof date !== 'string') return ''
  // EC2 guarda 2026-11-22. Mostramos 22/11/2026 sin modificar SQLite.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : date
}

function FilterChip({ label, active, onPress }) {
  const accents = {
    Todos: colors.text,
    Perdidos: colors.orange,
    'En Adopción': colors.primaryDark,
    Emergencias: colors.blueDark,
  }
  const accent = accents[label] || colors.text
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterChip,
        { borderColor: accent },
        active && { backgroundColor: accent },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.filterChipText, { color: active ? colors.white : accent }]}>
        {label}
      </Text>
    </Pressable>
  )
}

function AlertsScreen() {
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [selectedZone, setSelectedZone] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reportType, setReportType] = useState('Perdidos')
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [actionError, setActionError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const savingLock = useRef(false)
  const statusLock = useRef(false)
  const firstFocus = useRef(true)

  // Los filtros se aplican EN EXPRESS: /api/alertas?type=lost&zone=sopocachi.
  // No enviamos "Todos" ni una zona vacía: ambos significan sin filtro.
  const query = []
  const type = FILTER_TO_TYPE[activeFilter]
  if (type) query.push(`type=${encodeURIComponent(type)}`)
  if (selectedZone) query.push(`zone=${encodeURIComponent(selectedZone)}`)
  const alertsURL = `${API_URL}/api/alertas${query.length ? `?${query.join('&')}` : ''}`
  const { data, loading, error, refetch } = useApi(alertsURL)
  const {
    data: petsData, loading: petsLoading, error: petsError,
    refetch: refetchPets,
  } = useApi(`${API_URL}/api/mascotas`)

  // Si volvemos del módulo Mascotas, los selectores y alertas se actualizan.
  useFocusEffect(useCallback(() => {
    if (firstFocus.current) {
      firstFocus.current = false
    } else {
      refetch()
      refetchPets()
    }
  }, [refetch, refetchPets]))

  const validAlerts = Array.isArray(data)
  const alerts = validAlerts
    ? [...data].sort((a, b) => Number(b.id) - Number(a.id))
    : []
  const pets = Array.isArray(petsData) ? petsData : []
  const petOptions = pets.map((pet) => ({
    value: String(pet.id), label: pet.name,
  }))

  function setField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
      // Si se escribe otro nombre, evitar asociarlo a un ID distinto.
      ...(field === 'petName' ? { petId: '' } : {}),
    }))
    setFormError('')
  }

  function selectPet(value) {
    const selectedPet = pets.find((pet) => String(pet.id) === value)
    setFormData((current) => ({
      ...current,
      petId: value,
      petName: selectedPet?.name || (value === '' ? '' : current.petName),
    }))
    setFormError('')
  }

  function openModal() {
    setFeedback('')
    setActionError('')
    setFormError('')
    refetchPets()
    setIsModalOpen(true)
  }

  function closeModal() {
    if (savingLock.current) return
    setIsModalOpen(false)
    setReportType('Perdidos')
    setFormData(EMPTY_FORM)
    setFormError('')
  }

  function changeReportType(nextType) {
    if (saving) return
    setReportType(nextType)
    setFormData((current) => ({ ...current, petId: '' }))
    setFormError('')
  }

  async function publish() {
    if (savingLock.current) return
    const nextType = FILTER_TO_TYPE[reportType]
    if (!nextType || !formData.zone || !formData.description.trim()) {
      setFormError('Selecciona una zona y escribe una descripción.')
      return
    }

    const chosenPet = nextType === 'lost'
      ? pets.find((pet) => String(pet.id) === formData.petId)
      : null
    savingLock.current = true
    setSaving(true)
    setFormError('')
    try {
      await sendAlertRequest('/api/alertas', 'POST', {
        type: nextType,
        zone: formData.zone,
        description: formData.description.trim(),
        contact: formData.contact.trim(),
        // petId es OPCIONAL, pero solo una mascota real vincula pets.status.
        petId: chosenPet ? chosenPet.id : null,
        petName: nextType === 'emergency'
          ? ''
          : (chosenPet?.name || formData.petName.trim()),
      })
      setIsModalOpen(false)
      setReportType('Perdidos')
      setFormData(EMPTY_FORM)
      // Mostrar el registro creado aunque estuviera activo un filtro diferente.
      setActiveFilter('Todos')
      setSelectedZone('')
      refetch()
      setFeedback('La alerta se publicó correctamente.')
    } catch (err) {
      setFormError(err.message || 'No se pudo publicar la alerta.')
    } finally {
      setSaving(false)
      savingLock.current = false
    }
  }

  async function changeStatus(alert) {
    if (statusLock.current) return
    statusLock.current = true
    setUpdatingId(alert.id)
    setActionError('')
    setFeedback('')
    const nextStatus = alert.status === 'active' ? 'resolved' : 'active'
    try {
      await sendAlertRequest(`/api/alertas/${alert.id}`, 'PUT', {
        status: nextStatus,
      })
      refetch()
      setFeedback(nextStatus === 'resolved'
        ? 'La alerta se marcó como resuelta.'
        : 'La alerta se reactivó correctamente.')
    } catch (err) {
      setActionError(err.message || 'No se pudo actualizar la alerta.')
    } finally {
      setUpdatingId(null)
      statusLock.current = false
    }
  }

  return (
    <>
      <ScreenContainer>
        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <View style={styles.highlight} />
            <Text style={styles.title}>Comunidad y{'\n'}alertas</Text>
          </View>
          <Pressable
            onPress={openModal}
            accessibilityRole="button"
            accessibilityLabel="Crear nuevo reporte"
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          >
            <Text style={styles.addSymbol}>+</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>

        <View style={styles.zoneFilter}>
          <SelectField
            value={selectedZone}
            options={ZONAS}
            placeholder="Todas las zonas"
            onChange={setSelectedZone}
          />
        </View>

        {!!feedback && (
          <View style={styles.feedback}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}
        {!!actionError && <View style={styles.errorPanel}><Message error={actionError} /></View>}

        {loading ? (
          <Message loading />
        ) : error ? (
          <View style={styles.errorPanel}>
            <Message error={error} />
            <Button variant="secondary" onPress={refetch}>Reintentar</Button>
          </View>
        ) : !validAlerts ? (
          <View style={styles.errorPanel}>
            <Message error="La API no devolvió una lista válida de alertas." />
            <Button variant="secondary" onPress={refetch}>Reintentar</Button>
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No hay alertas</Text>
            <Text style={styles.emptyText}>No hay alertas para estos filtros.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {alerts.map((alert) => (
              <View
                key={String(alert.id)}
                style={[styles.alertBlock, alert.status === 'resolved' && styles.resolved]}
              >
                <AlertCard
                  type={alert.type}
                  petName={alert.petName}
                  photo={getPetPhotoSource(alert.photo)}
                  location={alert.location}
                  date={formatAlertDate(alert.date)}
                  description={alert.description}
                  contact={alert.contact}
                />
                <View style={styles.statusRow}>
                  <View style={[
                    styles.statusBadge,
                    alert.status === 'resolved' ? styles.statusResolved : styles.statusActive,
                  ]}>
                    <Text style={styles.statusText}>
                      {alert.status === 'resolved' ? 'Resuelta' : 'Activa'}
                    </Text>
                  </View>
                  <Pressable
                    disabled={updatingId !== null}
                    onPress={() => changeStatus(alert)}
                    style={({ pressed }) => [
                      styles.resolveButton,
                      updatingId !== null && styles.actionsDisabled,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.resolveText}>
                      {updatingId === alert.id
                        ? 'Guardando...'
                        : alert.status === 'resolved' ? 'Reactivar' : 'Marcar resuelta'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScreenContainer>

      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            disabled={saving}
            onPress={closeModal}
          />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Reporte</Text>
              <Pressable
                disabled={saving}
                onPress={closeModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.typeLabel}>Tipo de alerta</Text>
              <View style={styles.reportTypes}>
                {FILTERS.filter((filter) => filter !== 'Todos').map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    active={reportType === filter}
                    onPress={() => changeReportType(filter)}
                  />
                ))}
              </View>
              <View style={styles.form}>
                {reportType === 'Perdidos' && (
                  <>
                    <SelectField
                      label="Mascota registrada (opcional)"
                      value={formData.petId}
                      options={[{ value: '', label: 'Sin asociar mascota' }, ...petOptions]}
                      placeholder="Seleccionar mascota"
                      onChange={selectPet}
                    />
                    {petsLoading ? (
                      <Text style={styles.helperText}>Cargando mascotas registradas...</Text>
                    ) : petsError ? (
                      <Text style={styles.helperText}>
                        No se cargaron las mascotas. Puedes escribir un nombre sin asociar un ID.
                      </Text>
                    ) : (
                      <Text style={styles.helperText}>
                        Si seleccionas una mascota registrada, el backend actualizará su estado a perdida.
                      </Text>
                    )}
                  </>
                )}
                {reportType !== 'Emergencias' && (
                  <FormField
                    label="Nombre de la mascota"
                    value={formData.petName}
                    onChangeText={(text) => setField('petName', text)}
                    placeholder="Nombre"
                  />
                )}
                <SelectField
                  label="Zona"
                  value={formData.zone}
                  options={REPORT_ZONES}
                  placeholder="Seleccionar zona"
                  onChange={(value) => setField('zone', value)}
                />
                <FormField
                  label="Descripción detallada"
                  value={formData.description}
                  onChangeText={(text) => setField('description', text)}
                  placeholder="Describe la situación"
                  multiline
                />
                <FormField
                  label="Datos de contacto (opcional)"
                  value={formData.contact}
                  onChangeText={(text) => setField('contact', text)}
                  placeholder="Teléfono o contacto"
                  keyboardType="phone-pad"
                />
                {!!formError && <View style={styles.formMessage}><Message error={formError} /></View>}
                <Button variant="danger" disabled={saving} onPress={publish}>
                  {saving ? 'Publicando...' : 'Publicar alerta'}
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
    justifyContent: 'space-between',
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
    backgroundColor: colors.yellowNav,
  },
  title: {
    color: colors.textDark,
    fontFamily: fonts.displayExtraBold,
    fontSize: 30,
    lineHeight: 33,
    zIndex: 2,
  },
  addButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
    ...shadows.card,
  },
  addSymbol: {
    marginTop: -3,
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
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
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  filterChipText: {
    fontFamily: fonts.bodySemiBold,
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
    justifyContent: 'space-between',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  statusActive: {
    backgroundColor: '#E9F0DF',
  },
  statusResolved: {
    backgroundColor: '#E7E4DF',
  },
  statusText: {
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
    fontSize: 10.5,
  },
  resolveButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.blue,
  },
  resolveText: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: 10.5,
  },
  empty: {
    paddingHorizontal: 22,
    paddingVertical: 34,
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fonts.displayBold,
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.42)',
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
    backgroundColor: colors.background,
    ...shadows.card,
  },
  modalHeader: {
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 26,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  closeText: {
    color: colors.text,
    fontSize: 25,
  },
  typeLabel: {
    marginBottom: 10,
    color: colors.text,
    fontFamily: fonts.bodySemiBold,
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
  helperText: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  formMessage: { marginBottom: 4 },
  errorPanel: { gap: 12, marginBottom: 16 },
  feedback: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#E9F0DF',
  },
  feedbackText: {
    color: colors.textDark,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
  },
  actionsDisabled: { opacity: 0.45 },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },
})

export default AlertsScreen