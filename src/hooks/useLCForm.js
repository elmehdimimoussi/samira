import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { convertAmountToFrench } from '../services/frenchTextConverter'
import { formatAmountLive, parseAmount } from '../services/amountFormatter'
import { formatDate, formatDateForInput, parseFrenchDate } from '../services/dateFormatter'

const DEFAULT_TEMPLATE_IMAGE = '/assets/templates/bmci-template.jpg'

export const SECTIONS = ['general', 'tireur', 'beneficiary', 'drawer', 'footer']

export const SECTION_LABELS = {
  general: 'General',
  tireur: 'Tireur',
  beneficiary: 'Beneficiaire',
  drawer: 'Tire',
  footer: 'Pied',
}

const createDefaultFormData = () => ({
  dateDue: formatDateForInput(new Date()),
  amount: '',
  tireurName: '',
  tireurAddress: '',
  beneficiaryName: '',
  amountText: '',
  creationPlace: 'Agadir',
  creationDate: formatDateForInput(new Date()),
  cause: '',
  drawerName: '',
  drawerAddress: '',
  accountNumber: '',
  agency: '',
  city: '',
  dateAcceptance: '',
  aval: '',
})

const normalizeFrames = (result) =>
  result.map((frame) => ({
    ...frame,
    enabled: Boolean(frame.enabled),
    wrap_enabled: Boolean(frame.wrap_enabled),
    center_enabled: Boolean(frame.center_enabled),
    font_family: frame.font_family || 'Arial',
    font_weight: frame.font_weight || 'bold',
    font_style: frame.font_style || 'normal',
    color: frame.color || '#000000',
  }))

export function useLCForm() {
  const [formData, setFormData] = useState(createDefaultFormData)
  const [activeSection, setActiveSection] = useState('general')
  const [customers, setCustomers] = useState([])
  const [frames, setFrames] = useState([])
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [templateImage, setTemplateImage] = useState(DEFAULT_TEMPLATE_IMAGE)
  const [previewScale, setPreviewScale] = useState(1)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        if (!window.electronAPI) return
        const result = await window.electronAPI.customers.getAll()
        setCustomers(result || [])
      } catch (error) {
        console.error('Error loading customers:', error)
      }
    }

    const loadFrames = async () => {
      try {
        if (!window.electronAPI) return
        const result = await window.electronAPI.frames.getAll()
        if (result && result.length > 0) {
          setFrames(normalizeFrames(result))
        }
      } catch (error) {
        console.error('Error loading frames:', error)
      }
    }

    const loadTemplateImage = async () => {
      try {
        if (!window.electronAPI?.settings?.get) return
        const savedImage = await window.electronAPI.settings.get('templateImage')
        if (savedImage) setTemplateImage(savedImage)
      } catch (error) {
        console.error('Error loading template image:', error)
      }
    }

    const checkClonedOperation = () => {
      const clonedOpStr = sessionStorage.getItem('cloneOperation')
      if (!clonedOpStr) return
      try {
        const operation = JSON.parse(clonedOpStr)
        let dueDateVal = formatDateForInput(new Date())
        if (operation.due_date) {
          const parsed = parseFrenchDate(operation.due_date)
          if (parsed) dueDateVal = formatDateForInput(parsed)
        }
        setFormData((prev) => ({
          ...prev,
          dateDue: dueDateVal,
          amount: operation.amount_numeric || '',
          amountText: operation.amount_text || '',
          tireurName: operation.tireur_name || '',
          tireurAddress: operation.tireur_address || '',
          beneficiaryName: operation.beneficiary_name || '',
          creationPlace: operation.creation_place || '',
          creationDate: formatDateForInput(new Date()),
          cause: operation.cause || '',
          drawerName: operation.drawer_name || '',
          drawerAddress: operation.drawer_address || '',
          accountNumber: operation.account_number || '',
          agency: operation.agency || '',
          city: operation.city || '',
          dateAcceptance: operation.date_acceptance || '',
          aval: operation.aval || '',
        }))
        toast.success('Donnees chargees depuis l historique')
        sessionStorage.removeItem('cloneOperation')
      } catch (error) {
        console.error('Error parsing cloned operation', error)
      }
    }

    loadCustomers()
    loadFrames()
    loadTemplateImage()
    checkClonedOperation()
  }, [])

  const handleInputChange = useCallback(
    (field) => (event) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
    },
    [],
  )

  const handleAmountChange = useCallback((event) => {
    const formatted = formatAmountLive(event.target.value)
    const numAmount = parseAmount(formatted)
    const textAmount = formatted ? convertAmountToFrench(numAmount) : ''
    setFormData((prev) => ({ ...prev, amount: formatted, amountText: textAmount }))
  }, [])

  const applySelectedCustomer = useCallback((mappedFields) => {
    setFormData((prev) => ({ ...prev, ...mappedFields }))
  }, [])

  const handleImageLoad = useCallback((event) => {
    setImageDimensions({
      width: event.target.naturalWidth,
      height: event.target.naturalHeight,
    })
  }, [])

  const nextSection = useCallback(() => {
    const currentIndex = SECTIONS.indexOf(activeSection)
    if (currentIndex < SECTIONS.length - 1) {
      setActiveSection(SECTIONS[currentIndex + 1])
    }
  }, [activeSection])

  const saveOperation = useCallback(async () => {
    try {
      if (!window.electronAPI) {
        toast.error('Fonctionnalite disponible uniquement dans l application Electron')
        return
      }

      const refNumber = await window.electronAPI.operations.generateRef()
      const operation = {
        reference_number: refNumber,
        amount_numeric: formData.amount,
        amount_text: formData.amountText,
        due_date: formatDate(formData.dateDue),
        tireur_name: formData.tireurName,
        tireur_address: formData.tireurAddress,
        beneficiary_name: formData.beneficiaryName,
        creation_place: formData.creationPlace,
        creation_date: formatDate(formData.creationDate),
        cause: formData.cause,
        drawer_name: formData.drawerName,
        drawer_address: formData.drawerAddress,
        account_number: formData.accountNumber,
        agency: formData.agency,
        city: formData.city,
        date_acceptance: formatDate(formData.dateAcceptance),
        aval: formData.aval,
        status: 'created',
      }

      await window.electronAPI.operations.add(operation)
      toast.success(`Operation enregistree ! Reference: ${refNumber}`)
    } catch (error) {
      console.error('Error saving operation:', error)
      toast.error('Erreur lors de l enregistrement')
    }
  }, [formData])

  const getFrameValue = useCallback(
    (frameType) => {
      switch (frameType) {
        case 'date_due':
          return formatDate(formData.dateDue)
        case 'amount_numeric':
          return formData.amount
        case 'tireur_name':
          return formData.tireurName.toUpperCase()
        case 'tireur_address':
          return formData.tireurAddress.toUpperCase()
        case 'beneficiary_name':
          return formData.beneficiaryName.toUpperCase()
        case 'amount_text':
          return formData.amountText
        case 'creation_place':
          return formData.creationPlace.toUpperCase()
        case 'date_creation':
          return formatDate(formData.creationDate)
        case 'cause':
          return formData.cause.toUpperCase()
        case 'drawer_name':
          return formData.drawerName.toUpperCase()
        case 'drawer_address':
          return formData.drawerAddress.toUpperCase()
        case 'account_number':
          return formData.accountNumber
        case 'agency':
          return formData.agency.toUpperCase()
        case 'city':
          return formData.city.toUpperCase()
        case 'date_acceptance':
          return formData.dateAcceptance ? formatDate(formData.dateAcceptance) : ''
        case 'aval':
          return formData.aval.toUpperCase()
        default:
          return ''
      }
    },
    [formData],
  )

  const isFrameEnabled = useCallback(
    (type) => {
      if (!frames || frames.length === 0) return true
      const frame = frames.find((item) => item.frame_type === type)
      return frame ? frame.enabled : true
    },
    [frames],
  )

  const sectionStatus = useMemo(
    () => ({
      general: Boolean(formData.dateDue && formData.amount),
      tireur: Boolean(formData.tireurName),
      beneficiary: Boolean(formData.beneficiaryName),
      drawer: Boolean(formData.drawerName),
      footer: true,
    }),
    [formData],
  )

  const completedSections = useMemo(
    () => Object.values(sectionStatus).filter(Boolean).length,
    [sectionStatus],
  )

  const resetForm = useCallback(() => setShowResetConfirm(true), [])

  const confirmReset = useCallback(() => {
    setFormData(createDefaultFormData())
    setActiveSection('general')
    setShowResetConfirm(false)
    toast.success('Formulaire reinitialise')
  }, [])

  return {
    formData,
    setFormData,
    activeSection,
    setActiveSection,
    customers,
    frames,
    imageDimensions,
    templateImage,
    previewScale,
    setPreviewScale,
    showResetConfirm,
    setShowResetConfirm,
    sectionStatus,
    completedSections,
    totalSections: SECTIONS.length,
    handleInputChange,
    handleAmountChange,
    applySelectedCustomer,
    handleImageLoad,
    nextSection,
    saveOperation,
    getFrameValue,
    isFrameEnabled,
    resetForm,
    confirmReset,
  }
}
