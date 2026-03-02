import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export const DEFAULT_TEMPLATE_IMAGE = '/assets/templates/bmci-template.jpg'

export const fontFamilies = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
]

export const frameTypes = [
  { value: 'date_due', label: "Date d'echeance" },
  { value: 'amount_numeric', label: 'Montant (chiffres)' },
  { value: 'tireur_name', label: 'Le Tireur - Nom ou denomination' },
  { value: 'tireur_address', label: 'Le Tireur - Adresse ou siege' },
  { value: 'beneficiary_name', label: 'Beneficiaire - Nom ou denomination' },
  { value: 'amount_text', label: 'Montant (lettres)' },
  { value: 'creation_place', label: 'Lieu de creation' },
  { value: 'date_creation', label: 'Date de creation' },
  { value: 'cause', label: 'La cause' },
  { value: 'drawer_name', label: 'Le Tire - Nom ou denomination' },
  { value: 'drawer_address', label: 'Le Tire - Adresse ou siege' },
  { value: 'account_number', label: 'Le Tire - Compte N' },
  { value: 'agency', label: 'Le Tire - Agence' },
  { value: 'city', label: 'Le Tire - Ville' },
  { value: 'date_acceptance', label: "Date de l'acceptation" },
  { value: 'aval', label: 'Bon pour aval' },
  { value: 'custom', label: 'Personnalise' },
]

export const testData = {
  date_due: '15/03/2026',
  amount_numeric: '25 750,00',
  tireur_name: 'STE ATLAS EXPORT SARL',
  tireur_address: '45, BD MOHAMMED V - CASABLANCA',
  beneficiary_name: 'STE MOROCCO TRADING SA',
  amount_text: 'Vingt-cinq mille sept cent cinquante dirhams',
  creation_place: 'CASABLANCA',
  date_creation: '05/02/2026',
  cause: 'FACTURE N 2026-0142',
  drawer_name: 'ETS EL AMRANI & FILS',
  drawer_address: 'RUE IBN SINA, N12 - AGADIR',
  account_number: '0011 7850 0001 2345 67',
  agency: 'AGADIR CENTRE',
  city: 'AGADIR',
  date_acceptance: '10/02/2026',
  aval: 'BON POUR AVAL',
  custom: 'TEXTE PERSONNALISE',
}

export const defaultFrames = [
  { id: 1, frame_type: 'date_due', label: "Date d'echeance", x: 650, y: 30, width: 120, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'center', enabled: true },
  { id: 2, frame_type: 'amount_numeric', label: 'Montant (chiffres)', x: 650, y: 60, width: 120, height: 20, font_size: 12, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'right', enabled: true },
  { id: 3, frame_type: 'tireur_name', label: 'Tireur - Nom', x: 20, y: 40, width: 250, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 4, frame_type: 'tireur_address', label: 'Tireur - Adresse', x: 20, y: 60, width: 250, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 5, frame_type: 'beneficiary_name', label: 'Beneficiaire', x: 300, y: 110, width: 300, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 6, frame_type: 'amount_text', label: 'Montant (lettres)', x: 300, y: 140, width: 400, height: 30, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true, wrap_enabled: true },
  { id: 7, frame_type: 'creation_place', label: 'Lieu creation', x: 300, y: 170, width: 100, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 8, frame_type: 'date_creation', label: 'Date creation', x: 410, y: 170, width: 100, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'center', enabled: true },
  { id: 9, frame_type: 'cause', label: 'La cause', x: 300, y: 200, width: 200, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 10, frame_type: 'drawer_name', label: 'Tire - Nom', x: 300, y: 240, width: 250, height: 20, font_size: 11, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 11, frame_type: 'drawer_address', label: 'Tire - Adresse', x: 300, y: 260, width: 250, height: 30, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true, wrap_enabled: true },
  { id: 12, frame_type: 'account_number', label: 'Compte N', x: 300, y: 300, width: 150, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 13, frame_type: 'agency', label: 'Agence', x: 460, y: 300, width: 100, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 14, frame_type: 'city', label: 'Ville', x: 460, y: 320, width: 100, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 15, frame_type: 'date_acceptance', label: 'Date acceptation', x: 20, y: 200, width: 150, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
  { id: 16, frame_type: 'aval', label: 'Bon pour aval', x: 20, y: 300, width: 200, height: 20, font_size: 10, font_family: 'Arial', font_weight: 'bold', font_style: 'normal', color: '#000000', text_align: 'left', enabled: true },
]

const normalizeFrame = (frame) => ({
  ...frame,
  font_family: frame.font_family || 'Arial',
  font_weight: frame.font_weight || 'bold',
  font_style: frame.font_style || 'normal',
  color: frame.color || '#000000',
})

export function useTemplateDesigner() {
  const [frames, setFrames] = useState(defaultFrames)
  const [selectedFrame, setSelectedFrame] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, frameX: 0, frameY: 0 })
  const [showGrid, setShowGrid] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [templateImage, setTemplateImage] = useState(DEFAULT_TEMPLATE_IMAGE)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [frameSearch, setFrameSearch] = useState('')
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [canvasScale, setCanvasScale] = useState(1)
  const canvasRef = useRef(null)
  const templateInputRef = useRef(null)

  const getDocumentPoint = useCallback(
    (event) => {
      if (!canvasRef.current || !canvasScale) return { x: 0, y: 0 }
      const rect = canvasRef.current.getBoundingClientRect()
      return {
        x: (event.clientX - rect.left) / canvasScale,
        y: (event.clientY - rect.top) / canvasScale,
      }
    },
    [canvasScale],
  )

  useEffect(() => {
    const loadFrames = async () => {
      try {
        if (!window.electronAPI) return
        const result = await window.electronAPI.frames.getAll()
        if (result && result.length > 0) {
          setFrames(result.map(normalizeFrame))
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

    loadFrames()
    loadTemplateImage()
  }, [])

  const saveFrames = useCallback(async () => {
    try {
      if (!window.electronAPI) {
        toast.error('Fonctionnalite disponible uniquement dans l application Electron')
        return
      }
      await window.electronAPI.frames.save(frames)
      toast.success('Configuration sauvegardee avec succes!')
    } catch (error) {
      console.error('Error saving frames:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }, [frames])

  const addFrame = useCallback(() => {
    const newId = Math.max(...frames.map((frame) => frame.id), 0) + 1
    const newFrame = {
      id: newId,
      frame_type: 'custom',
      label: `Champ ${newId}`,
      x: 100,
      y: 100,
      width: 150,
      height: 25,
      font_size: 12,
      font_family: 'Arial',
      font_weight: 'bold',
      font_style: 'normal',
      color: '#000000',
      text_align: 'left',
      enabled: true,
      wrap_enabled: false,
      center_enabled: false,
    }
    setFrames((prev) => [...prev, newFrame])
    setSelectedFrame(newFrame)
  }, [frames])

  const duplicateFrame = useCallback(
    (frame) => {
      const newId = Math.max(...frames.map((f) => f.id), 0) + 1
      const duplicate = { ...frame, id: newId, label: `${frame.label} (copie)`, x: frame.x + 20, y: frame.y + 20 }
      setFrames((prev) => [...prev, duplicate])
      setSelectedFrame(duplicate)
      toast.success('Champ duplique')
    },
    [frames],
  )

  const deleteFrame = useCallback((id) => setConfirmDeleteId(id), [])

  const confirmDeleteFrame = useCallback(() => {
    if (confirmDeleteId === null) return
    setFrames((prev) => prev.filter((frame) => frame.id !== confirmDeleteId))
    setSelectedFrame((prev) => (prev?.id === confirmDeleteId ? null : prev))
    setConfirmDeleteId(null)
  }, [confirmDeleteId])

  const updateFrame = useCallback((id, updates) => {
    setFrames((prev) => prev.map((frame) => (frame.id === id ? { ...frame, ...updates } : frame)))
    setSelectedFrame((prev) => (prev?.id === id ? { ...prev, ...updates } : prev))
  }, [])

  const resetToDefaults = useCallback(() => {
    setFrames(defaultFrames)
    setSelectedFrame(null)
    setShowResetConfirm(false)
    toast.success('Configuration reinitialisee aux valeurs par defaut')
  }, [])

  const handleTemplateUpload = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez selectionner un fichier image')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L image est trop volumineuse (max 5 Mo)')
      return
    }
    const reader = new FileReader()
    reader.onload = async (loadEvent) => {
      const dataUrl = loadEvent.target.result
      setTemplateImage(dataUrl)
      try {
        if (window.electronAPI?.settings?.set) {
          await window.electronAPI.settings.set('templateImage', dataUrl)
          toast.success('Image du modele mise a jour')
        }
      } catch (error) {
        console.error('Error saving template image:', error)
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const resetTemplateImage = useCallback(async () => {
    setTemplateImage(DEFAULT_TEMPLATE_IMAGE)
    try {
      if (window.electronAPI?.settings?.set) {
        await window.electronAPI.settings.set('templateImage', null)
        toast.success('Image du modele reinitialisee')
      }
    } catch (error) {
      console.error('Error resetting template image:', error)
    }
  }, [])

  const exportTemplateConfig = useCallback(() => {
    const config = {
      version: 1,
      frames,
      templateImage: templateImage !== DEFAULT_TEMPLATE_IMAGE ? templateImage : null,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `template-config-${new Date().toISOString().split('T')[0]}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success('Configuration du modele exportee')
  }, [frames, templateImage])

  const importTemplateConfig = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (loadEvent) => {
        try {
          const config = JSON.parse(loadEvent.target.result)
          if (!config.frames || !Array.isArray(config.frames)) {
            toast.error('Fichier de configuration invalide')
            return
          }
          setFrames(config.frames.map(normalizeFrame))
          if (config.templateImage) setTemplateImage(config.templateImage)
          setSelectedFrame(null)
          toast.success('Configuration importee avec succes')
        } catch (error) {
          console.error(error)
          toast.error('Fichier invalide')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  const handleMouseDown = useCallback(
    (event, frame, handle = null) => {
      event.preventDefault()
      event.stopPropagation()
      const pointer = getDocumentPoint(event)
      if (handle) {
        setIsResizing(true)
        setResizeHandle(handle)
      } else {
        setIsDragging(true)
      }
      setSelectedFrame(frame)
      setDragStart({
        x: pointer.x,
        y: pointer.y,
        frameX: frame.x,
        frameY: frame.y,
        frameW: frame.width,
        frameH: frame.height,
      })
    },
    [getDocumentPoint],
  )

  const handleMouseMove = useCallback(
    (event) => {
      if (!isDragging && !isResizing) return
      if (!selectedFrame) return

      const pointer = getDocumentPoint(event)
      const deltaX = pointer.x - dragStart.x
      const deltaY = pointer.y - dragStart.y

      if (isDragging) {
        let newX = Math.max(0, dragStart.frameX + deltaX)
        let newY = Math.max(0, dragStart.frameY + deltaY)
        if (showGrid) {
          newX = Math.round(newX / 10) * 10
          newY = Math.round(newY / 10) * 10
        }
        updateFrame(selectedFrame.id, { x: newX, y: newY })
        return
      }

      let newX = dragStart.frameX
      let newY = dragStart.frameY
      let newW = dragStart.frameW
      let newH = dragStart.frameH

      if (resizeHandle.includes('e')) newW = Math.max(20, dragStart.frameW + deltaX)
      if (resizeHandle.includes('w')) {
        newW = Math.max(20, dragStart.frameW - deltaX)
        newX = dragStart.frameX + deltaX
      }
      if (resizeHandle.includes('s')) newH = Math.max(15, dragStart.frameH + deltaY)
      if (resizeHandle.includes('n')) {
        newH = Math.max(15, dragStart.frameH - deltaY)
        newY = dragStart.frameY + deltaY
      }

      if (showGrid) {
        newX = Math.round(newX / 10) * 10
        newY = Math.round(newY / 10) * 10
        newW = Math.round(newW / 10) * 10
        newH = Math.round(newH / 10) * 10
      }

      updateFrame(selectedFrame.id, { x: newX, y: newY, width: newW, height: newH })
    },
    [dragStart, getDocumentPoint, isDragging, isResizing, resizeHandle, selectedFrame, showGrid, updateFrame],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }, [])

  const handleTemplateLoad = useCallback((event) => {
    setImageDimensions({ width: event.target.naturalWidth, height: event.target.naturalHeight })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return

      if (event.ctrlKey && event.key === 'd' && selectedFrame) {
        event.preventDefault()
        duplicateFrame(selectedFrame)
        return
      }
      if (event.ctrlKey && event.key === 'g') {
        event.preventDefault()
        setShowGrid((prev) => !prev)
        return
      }
      if (event.ctrlKey && event.key === 't') {
        event.preventDefault()
        setTestMode((prev) => !prev)
        return
      }
      if (event.key === 'Escape') {
        setSelectedFrame(null)
        return
      }

      if (!selectedFrame) return
      const step = event.shiftKey ? 10 : 1
      let updates = null
      switch (event.key) {
        case 'ArrowLeft':
          updates = { x: Math.max(0, selectedFrame.x - step) }
          break
        case 'ArrowRight':
          updates = { x: selectedFrame.x + step }
          break
        case 'ArrowUp':
          updates = { y: Math.max(0, selectedFrame.y - step) }
          break
        case 'ArrowDown':
          updates = { y: selectedFrame.y + step }
          break
        case 'Delete':
          deleteFrame(selectedFrame.id)
          return
        default:
          break
      }

      if (updates) {
        event.preventDefault()
        updateFrame(selectedFrame.id, updates)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [deleteFrame, duplicateFrame, selectedFrame, updateFrame])

  const filteredFrames = frames.filter((frame) => !frameSearch || frame.label.toLowerCase().includes(frameSearch.toLowerCase()))

  const handleExportBackup = useCallback(async () => {
    try {
      if (!window.electronAPI) return
      const data = await window.electronAPI.backup.export()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `lc-backup-${new Date().toISOString().split('T')[0]}.json`
      anchor.click()
      URL.revokeObjectURL(url)
      toast.success('Sauvegarde exportee avec succes')
    } catch (error) {
      console.error('Error exporting backup:', error)
      toast.error('Erreur lors de l exportation')
    }
  }, [])

  const handleImportBackup = useCallback(async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = async (event) => {
        const file = event.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = async (loadEvent) => {
          try {
            if (!window.electronAPI) return
            const result = await window.electronAPI.backup.import(loadEvent.target.result)
            if (result.success) {
              toast.success('Restauration reussie!')
              setTimeout(() => window.location.reload(), 1500)
            } else {
              toast.error(`Erreur: ${result.error}`)
            }
          } catch (error) {
            console.error(error)
            toast.error('Fichier invalide')
          }
        }
        reader.readAsText(file)
      }
      input.click()
    } catch (error) {
      console.error(error)
      toast.error('Erreur inattendue')
    }
  }, [])

  return {
    frames,
    selectedFrame,
    setSelectedFrame,
    showGrid,
    setShowGrid,
    testMode,
    setTestMode,
    confirmDeleteId,
    setConfirmDeleteId,
    templateImage,
    setTemplateImage,
    showShortcuts,
    setShowShortcuts,
    showResetConfirm,
    setShowResetConfirm,
    frameSearch,
    setFrameSearch,
    imageDimensions,
    canvasScale,
    setCanvasScale,
    canvasRef,
    templateInputRef,
    filteredFrames,
    saveFrames,
    addFrame,
    duplicateFrame,
    deleteFrame,
    confirmDeleteFrame,
    updateFrame,
    resetToDefaults,
    handleTemplateUpload,
    resetTemplateImage,
    exportTemplateConfig,
    importTemplateConfig,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTemplateLoad,
    handleExportBackup,
    handleImportBackup,
  }
}
