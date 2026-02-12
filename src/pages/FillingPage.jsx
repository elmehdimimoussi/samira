import { useState, useEffect, useId, useMemo } from 'react'
import { toast } from 'sonner'
import { convertAmountToFrench } from '../services/frenchTextConverter'
import { formatAmountLive, parseAmount } from '../services/amountFormatter'
import { formatDate, formatDateForInput, parseFrenchDate } from '../services/dateFormatter'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { Accordion, AccordionItem } from '../components/ui/Accordion'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { ResponsivePreviewWrapper } from '../components/ResponsivePreviewWrapper'
import { Maximize2, Minimize2, Printer, Save, FileText, ZoomIn, ZoomOut, ArrowRight, CheckCircle2, Check, CircleDot, Circle, RotateCcw } from 'lucide-react'

// Default template image path
const DEFAULT_TEMPLATE_IMAGE = '/assets/templates/bmci-template.jpg'

const SECTIONS = ['general', 'tireur', 'beneficiary', 'drawer', 'footer']

function FillingPage() {
    // Form state
    const [formData, setFormData] = useState({
        // Header
        dateDue: formatDateForInput(new Date()),
        amount: '',

        // Tireur (Issuer)
        tireurName: '',
        tireurAddress: '',

        // Beneficiary
        beneficiaryName: '',
        amountText: '',

        // Creation
        creationPlace: 'Agadir',
        creationDate: formatDateForInput(new Date()),
        cause: '',

        // Tiré (Drawee/Client)
        drawerName: '',
        drawerAddress: '',
        accountNumber: '',
        agency: '',
        city: '',

        // Footer
        dateAcceptance: '',
        aval: ''
    })

    // UI State
    const [activeSection, setActiveSection] = useState('general')
    const [isExpanded, setIsExpanded] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)

    // Data State
    const [customers, setCustomers] = useState([])
    const [showAutocomplete, setShowAutocomplete] = useState(false)
    const [filteredCustomers, setFilteredCustomers] = useState([])
    const [frames, setFrames] = useState([])
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
    const [showResetConfirm, setShowResetConfirm] = useState(false)
    const [templateImage, setTemplateImage] = useState(DEFAULT_TEMPLATE_IMAGE)

    const drawerNameId = useId()

    // Load initial data
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                if (window.electronAPI) {
                    const result = await window.electronAPI.customers.getAll()
                    setCustomers(result || [])
                }
            } catch (error) {
                console.error('Error loading customers:', error)
            }
        }

        const loadFrames = async () => {
            try {
                if (window.electronAPI) {
                    const result = await window.electronAPI.frames.getAll()
                    if (result && result.length > 0) {
                        setFrames(result.map(f => ({
                            ...f,
                            enabled: Boolean(f.enabled),
                            wrap_enabled: Boolean(f.wrap_enabled),
                            center_enabled: Boolean(f.center_enabled),
                            font_family: f.font_family || 'Arial',
                            font_weight: f.font_weight || 'bold',
                            font_style: f.font_style || 'normal',
                            color: f.color || '#000000',
                        })))
                    }
                }
            } catch (error) {
                console.error('Error loading frames:', error)
            }
        }

        const loadTemplateImage = async () => {
            try {
                if (window.electronAPI?.settings?.get) {
                    const savedImage = await window.electronAPI.settings.get('templateImage')
                    if (savedImage) setTemplateImage(savedImage)
                }
            } catch (error) {
                console.error('Error loading template image:', error)
            }
        }

        const checkClonedOperation = () => {
            const clonedOpStr = sessionStorage.getItem('cloneOperation')
            if (clonedOpStr) {
                try {
                    const op = JSON.parse(clonedOpStr)
                    let dueDateVal = formatDateForInput(new Date())
                    if (op.due_date) {
                        const parsed = parseFrenchDate(op.due_date)
                        if (parsed) dueDateVal = formatDateForInput(parsed)
                    }

                    setFormData(prev => ({
                        ...prev,
                        dateDue: dueDateVal,
                        amount: op.amount_numeric || '',
                        amountText: op.amount_text || '',
                        tireurName: op.tireur_name || '',
                        tireurAddress: op.tireur_address || '',
                        beneficiaryName: op.beneficiary_name || '',
                        creationPlace: op.creation_place || '',
                        creationDate: formatDateForInput(new Date()),
                        cause: op.cause || '',
                        drawerName: op.drawer_name || '',
                        drawerAddress: op.drawer_address || '',
                        accountNumber: op.account_number || '',
                        agency: op.agency || '',
                        city: op.city || '',
                        dateAcceptance: op.date_acceptance || '',
                        aval: op.aval || ''
                    }))
                    toast.success('Données chargées depuis l\'historique')
                    sessionStorage.removeItem('cloneOperation')
                } catch (e) {
                    console.error('Error parsing cloned operation', e)
                }
            }
        }

        loadCustomers()
        loadFrames()
        loadTemplateImage()
        checkClonedOperation()
    }, [])

    // Update amount text
    useEffect(() => {
        if (formData.amount) {
            const numAmount = parseAmount(formData.amount)
            const textAmount = convertAmountToFrench(numAmount)
            setFormData(prev => ({ ...prev, amountText: textAmount }))
        } else {
            setFormData(prev => ({ ...prev, amountText: '' }))
        }
    }, [formData.amount])

    const handleAmountChange = (e) => {
        const formatted = formatAmountLive(e.target.value)
        setFormData(prev => ({ ...prev, amount: formatted }))
    }

    const handleDrawerChange = (e) => {
        const value = e.target.value
        setFormData(prev => ({ ...prev, drawerName: value }))

        if (value.length >= 2) {
            const filtered = customers.filter(c =>
                c.name.toLowerCase().includes(value.toLowerCase())
            )
            setFilteredCustomers(filtered)
            setShowAutocomplete(filtered.length > 0)
        } else {
            setShowAutocomplete(false)
        }
    }

    const selectCustomer = (customer) => {
        setFormData(prev => ({
            ...prev,
            drawerName: customer.name,
            drawerAddress: customer.address || '',
            city: customer.city || '',
        }))
        setShowAutocomplete(false)
    }

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleImageLoad = (e) => {
        setImageDimensions({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight
        })
    }

    const nextSection = () => {
        const currentIndex = SECTIONS.indexOf(activeSection)
        if (currentIndex < SECTIONS.length - 1) {
            setActiveSection(SECTIONS[currentIndex + 1])
        }
    }

    const saveOperation = async () => {
        try {
            if (!window.electronAPI) {
                toast.error('Fonctionnalité disponible uniquement dans l\'application Electron')
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
                status: 'created'
            }

            await window.electronAPI.operations.add(operation)
            toast.success(`Opération enregistrée ! Référence: ${refNumber}`)
        } catch (error) {
            console.error('Error saving operation:', error)
            toast.error('Erreur lors de l\'enregistrement')
        }
    }

    const handlePrint = () => window.print()

    const handleExportPDF = async () => {
        try {
            const { jsPDF } = await import('jspdf')
            const html2canvas = (await import('html2canvas')).default
            const previewElement = document.getElementById('preview-container')
            if (!previewElement) return

            const toastId = toast.loading('Exportation PDF en cours...')
            const canvas = await html2canvas(previewElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: null,
                width: imageDimensions.width,
                height: imageDimensions.height,
                onclone: (clonedDoc) => {
                    const clonedPreview = clonedDoc.getElementById('preview-container')
                    if (!clonedPreview) return
                    let parent = clonedPreview.parentElement
                    while (parent) {
                        if (parent.style.transform && parent.style.transform.includes('scale')) {
                            parent.style.transform = 'none'
                            break
                        }
                        parent = parent.parentElement
                    }
                }
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            })

            const imgWidth = 297
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

            const fileName = `LC_${formData.drawerName || 'export'}_${formatDate(new Date(), '-')}.pdf`
            pdf.save(fileName)
            toast.dismiss(toastId)
            toast.success('PDF exporté avec succès')
        } catch (error) {
            console.error('Error exporting PDF:', error)
            toast.error('Erreur lors de l\'exportation PDF')
        }
    }

    const getFrameValue = (frameType) => {
        switch (frameType) {
            case 'date_due': return formatDate(formData.dateDue)
            case 'amount_numeric': return formData.amount
            case 'tireur_name': return formData.tireurName.toUpperCase()
            case 'tireur_address': return formData.tireurAddress.toUpperCase()
            case 'beneficiary_name': return formData.beneficiaryName.toUpperCase()
            case 'amount_text': return formData.amountText
            case 'creation_place': return formData.creationPlace.toUpperCase()
            case 'date_creation': return formatDate(formData.creationDate)
            case 'cause': return formData.cause.toUpperCase()
            case 'drawer_name': return formData.drawerName.toUpperCase()
            case 'drawer_address': return formData.drawerAddress.toUpperCase()
            case 'account_number': return formData.accountNumber
            case 'agency': return formData.agency.toUpperCase()
            case 'city': return formData.city.toUpperCase()
            case 'date_acceptance': return formData.dateAcceptance ? formatDate(formData.dateAcceptance) : ''
            case 'aval': return formData.aval.toUpperCase()
            default: return ''
        }
    }

    // Helper to check if a specific frame type is enabled in settings
    const isFrameEnabled = (type) => {
        // If frames aren't loaded yet or array is empty, default to show
        if (!frames || frames.length === 0) return true
        const frame = frames.find(f => f.frame_type === type)
        // If frame config exists, check enabled status. If generic fallback, allow.
        return frame ? frame.enabled : true
    }

    const toggleExpand = () => setIsExpanded(!isExpanded);

    // Calculate section completion status
    const sectionStatus = useMemo(() => {
        return {
            general: !!(formData.dateDue && formData.amount),
            tireur: !!(formData.tireurName),
            beneficiary: !!(formData.beneficiaryName),
            drawer: !!(formData.drawerName),
            footer: true // optional section, always "done"
        }
    }, [formData])

    const completedSections = Object.values(sectionStatus).filter(Boolean).length
    const totalSections = SECTIONS.length

    const resetForm = () => {
        setShowResetConfirm(true)
    }

    const confirmReset = () => {
        setFormData({
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
            aval: ''
        })
        setActiveSection('general')
        toast.success('Formulaire réinitialisé')
    }

    const SECTION_LABELS = {
        general: 'Général',
        tireur: 'Tireur',
        beneficiary: 'Bénéficiaire',
        drawer: 'Tiré',
        footer: 'Pied'
    }

    const NextButton = () => (
        <div className="flex justify-end mt-4">
            <Button size="sm" onClick={nextSection} className="gap-1">
                Suivant <ArrowRight size={14} />
            </Button>
        </div>
    )

    return (
        <>
            <header className="page-header sticky top-0 z-30">
                <div>
                    <h1 className="page-title">Remplissage de Lettre de Change</h1>
                    <p className="page-subtitle">
                        {completedSections < totalSections
                            ? `${completedSections}/${totalSections} sections complétées`
                            : 'Toutes les sections sont complétées'}
                    </p>
                </div>
                <div className="page-actions">
                    <Button variant="ghost" size="sm" onClick={resetForm} title="Réinitialiser">
                        <RotateCcw size={16} />
                    </Button>
                    <Button variant="outline" onClick={saveOperation}>
                        <Save size={16} /> <span className="hidden sm:inline">Enregistrer</span>
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer size={16} /> <span className="hidden sm:inline">Imprimer</span>
                    </Button>
                    <Button onClick={handleExportPDF}>
                        <FileText size={16} /> PDF
                    </Button>
                </div>
            </header>

            <div className="page-body">
                <div className={`filling-layout ${isExpanded ? 'expanded-preview' : ''}`}>

                    {/* Left Panel - Form Accordion */}
                    <div className="filling-form pb-20">
                        {/* Progress Steps */}
                        <div className="progress-steps mb-5">
                            {SECTIONS.map((section, index) => (
                                <div key={section} className="progress-step flex items-center">
                                    <button
                                        onClick={() => setActiveSection(section)}
                                        className={`progress-step-dot ${
                                            activeSection === section ? 'active' :
                                            sectionStatus[section] ? 'completed' : 'pending'
                                        }`}
                                        title={SECTION_LABELS[section]}
                                    >
                                        {sectionStatus[section] && activeSection !== section
                                            ? <Check size={14} strokeWidth={2.5} />
                                            : <span>{index + 1}</span>
                                        }
                                    </button>
                                    <span className="progress-step-label">{SECTION_LABELS[section]}</span>
                                    {index < SECTIONS.length - 1 && (
                                        <div className={`progress-step-line ${sectionStatus[section] ? 'completed' : ''}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <Accordion type="single" value={activeSection} onValueChange={setActiveSection} className="w-full">

                            {/* 1. General */}
                            <AccordionItem value="general" title="1. Informations Générales">
                                <div className="grid grid-cols-2 gap-4">
                                    {isFrameEnabled('date_due') && (
                                        <Input
                                            type="date"
                                            label="Date d'échéance"
                                            value={formData.dateDue}
                                            onChange={handleInputChange('dateDue')}
                                        />
                                    )}
                                    {(isFrameEnabled('amount_numeric') || isFrameEnabled('amount_text')) && (
                                        <Input
                                            label="Montant (DH)"
                                            className="font-mono font-bold text-right text-lg"
                                            placeholder="0,00"
                                            value={formData.amount}
                                            onChange={handleAmountChange}
                                            autoFocus
                                        />
                                    )}
                                </div>
                                {formData.amount && (isFrameEnabled('amount_numeric') || isFrameEnabled('amount_text')) && (
                                    <div className="mt-3 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 p-3 rounded-xl text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 font-medium">
                                        💰 {formData.amount} DH
                                    </div>
                                )}
                                <NextButton />
                            </AccordionItem>

                            {/* 2. Tireur */}
                            <AccordionItem value="tireur" title="2. Le Tireur (Vous)">
                                <div className="space-y-4">
                                    {isFrameEnabled('tireur_name') && (
                                        <Input
                                            label="Nom ou dénomination"
                                            value={formData.tireurName}
                                            onChange={handleInputChange('tireurName')}
                                            placeholder="Votre nom ou société"
                                        />
                                    )}
                                    {isFrameEnabled('tireur_address') && (
                                        <Textarea
                                            label="Adresse ou siège"
                                            rows={2}
                                            value={formData.tireurAddress}
                                            onChange={handleInputChange('tireurAddress')}
                                        />
                                    )}
                                </div>
                                <NextButton />
                            </AccordionItem>

                            {/* 3. Beneficiary */}
                            <AccordionItem value="beneficiary" title="3. Bénéficiaire & Détails">
                                <div className="space-y-4">
                                    {isFrameEnabled('beneficiary_name') && (
                                        <Input
                                            label="Bénéficiaire"
                                            value={formData.beneficiaryName}
                                            onChange={handleInputChange('beneficiaryName')}
                                            placeholder="Nom du bénéficiaire"
                                        />
                                    )}
                                    {formData.amountText && isFrameEnabled('amount_text') && (
                                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-800 p-3.5 rounded-xl text-sm italic border border-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 dark:text-emerald-300 dark:border-emerald-800/50 leading-relaxed">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 not-italic block mb-1">Montant en lettres</span>
                                            {formData.amountText}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        {isFrameEnabled('creation_place') && (
                                            <Input
                                                label="Lieu de création"
                                                value={formData.creationPlace}
                                                onChange={handleInputChange('creationPlace')}
                                            />
                                        )}
                                        {isFrameEnabled('date_creation') && (
                                            <Input
                                                type="date"
                                                label="Date de création"
                                                value={formData.creationDate}
                                                onChange={handleInputChange('creationDate')}
                                            />
                                        )}
                                    </div>
                                    {isFrameEnabled('cause') && (
                                        <Input
                                            label="La cause"
                                            value={formData.cause}
                                            onChange={handleInputChange('cause')}
                                            placeholder="Ex: Facture N° 123"
                                        />
                                    )}
                                </div>
                                <NextButton />
                            </AccordionItem>

                            {/* 4. Drawer (Client) */}
                            <AccordionItem value="drawer" title="4. Le Tiré (Client)">
                                <div className="space-y-4">
                                    {isFrameEnabled('drawer_name') && (
                                        <div className="form-group relative mb-0">
                                            <label htmlFor={drawerNameId} className="form-label">Nom ou dénomination</label>
                                            <div className="autocomplete-container">
                                                <input
                                                    id={drawerNameId}
                                                    type="text"
                                                    className="form-input font-bold"
                                                    placeholder="Rechercher un client..."
                                                    value={formData.drawerName}
                                                    onChange={handleDrawerChange}
                                                    onFocus={() => formData.drawerName.length >= 2 && setShowAutocomplete(true)}
                                                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                                                />
                                                {showAutocomplete && (
                                                    <div className="autocomplete-dropdown" role="listbox">
                                                        {filteredCustomers.map((customer) => (
                                                            <div
                                                                key={customer.id}
                                                                className="autocomplete-item"
                                                                role="option"
                                                                onPointerDown={(e) => { e.preventDefault(); selectCustomer(customer) }}
                                                                onKeyDown={(e) => { if (e.key === 'Enter') selectCustomer(customer) }}
                                                                tabIndex={0}
                                                            >
                                                                <div className="autocomplete-item-name">{customer.name}</div>
                                                                {customer.address && (
                                                                    <div className="autocomplete-item-address">{customer.address}</div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {isFrameEnabled('drawer_address') && (
                                        <Textarea
                                            label="Adresse ou siège"
                                            rows={2}
                                            value={formData.drawerAddress}
                                            onChange={handleInputChange('drawerAddress')}
                                        />
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {isFrameEnabled('account_number') && (
                                            <Input
                                                label="Compte N°"
                                                value={formData.accountNumber}
                                                onChange={handleInputChange('accountNumber')}
                                            />
                                        )}
                                        {isFrameEnabled('agency') && (
                                            <Input
                                                label="Agence"
                                                value={formData.agency}
                                                onChange={handleInputChange('agency')}
                                            />
                                        )}
                                    </div>
                                    {isFrameEnabled('city') && (
                                        <Input
                                            label="Ville"
                                            value={formData.city}
                                            onChange={handleInputChange('city')}
                                        />
                                    )}
                                </div>
                                <NextButton />
                            </AccordionItem>

                            {/* 5. Footer */}
                            <AccordionItem value="footer" title="5. Pied de page (Optionnel)">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {isFrameEnabled('date_acceptance') && (
                                        <Input
                                            type="date"
                                            label="Date de l'acceptation"
                                            value={formData.dateAcceptance}
                                            onChange={handleInputChange('dateAcceptance')}
                                        />
                                    )}
                                    {isFrameEnabled('aval') && (
                                        <Input
                                            label="Bon pour aval"
                                            value={formData.aval}
                                            onChange={handleInputChange('aval')}
                                        />
                                    )}
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                    <Button variant="accent" onClick={saveOperation} className="w-full py-3">
                                        <CheckCircle2 size={18} /> Terminer & Enregistrer
                                    </Button>
                                </div>
                            </AccordionItem>

                        </Accordion>
                    </div>

                    {/* Right Panel - Sticky Preview */}
                    <div className={`filling-preview sticky top-0 ${isExpanded ? 'fixed inset-4 z-50 h-auto' : 'h-[calc(100vh-140px)]'}`}>
                        <div className="preview-header">
                            <div className="flex items-center gap-2">
                                <span className="preview-title">Aperçu</span>
                                <span className="badge badge-primary">BMCI</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}>
                                    <ZoomOut size={16} />
                                </Button>
                                <span className="text-xs font-mono w-12 text-center select-none">
                                    {Math.round(zoomLevel * 100)}%
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.1))}>
                                    <ZoomIn size={16} />
                                </Button>
                                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2" />
                                <Button variant="ghost" size="sm" onClick={toggleExpand}>
                                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </Button>
                            </div>
                        </div>
                        <div className="preview-canvas bg-slate-200/50 dark:bg-slate-900/50">
                            <img
                                src={templateImage}
                                onLoad={handleImageLoad}
                                style={{ display: 'none' }}
                                alt=""
                            />

                            {imageDimensions.width > 0 ? (
                                <ResponsivePreviewWrapper
                                    width={imageDimensions.width}
                                    height={imageDimensions.height}
                                    zoomMultiplier={zoomLevel}
                                >
                                    <div
                                        id="preview-container"
                                        className="preview-image-container"
                                        style={{
                                            width: `${imageDimensions.width}px`,
                                            height: `${imageDimensions.height}px`
                                        }}
                                    >
                                        <img
                                            src={templateImage}
                                            alt="Template"
                                            className="preview-image"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                maxWidth: 'none'
                                            }}
                                        />
                                        {frames.filter(f => f.enabled).map((frame) => (
                                            <div
                                                key={frame.id}
                                                className="preview-frame"
                                                style={{
                                                    left: `${frame.x}px`,
                                                    top: `${frame.y}px`,
                                                    width: `${frame.width}px`,
                                                    height: `${frame.height}px`,
                                                    fontSize: `${frame.font_size || 12}px`,
                                                    fontFamily: frame.font_family || 'Arial',
                                                    fontWeight: frame.font_weight || 'bold',
                                                    fontStyle: frame.font_style || 'normal',
                                                    textAlign: frame.text_align || 'left',
                                                    justifyContent: (frame.center_enabled) ? 'center' : 'flex-start',
                                                    alignItems: (frame.center_enabled) ? 'center' : 'flex-start',
                                                    color: frame.color || '#000',
                                                    zIndex: 10,
                                                }}
                                            >
                                                <span
                                                    className="preview-frame-text"
                                                    style={{
                                                        wordWrap: (frame.wrap_enabled) ? 'break-word' : 'normal',
                                                        whiteSpace: (frame.wrap_enabled) ? 'normal' : 'nowrap',
                                                        overflow: (frame.wrap_enabled) ? 'hidden' : 'visible',
                                                    }}
                                                >
                                                    {getFrameValue(frame.frame_type || frame.id)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </ResponsivePreviewWrapper>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                                    <span className="text-sm">Chargement du modèle...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && <div className="modal-overlay" onClick={toggleExpand} style={{ zIndex: 40 }}></div>}

            <ConfirmModal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={confirmReset}
                title="Réinitialiser le formulaire"
                message="Êtes-vous sûr de vouloir réinitialiser tous les champs du formulaire ? Toutes les données non enregistrées seront perdues."
                confirmText="Réinitialiser"
            />
        </>
    )
}

export default FillingPage
