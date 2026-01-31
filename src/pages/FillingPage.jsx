import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { convertAmountToFrench } from '../services/frenchTextConverter'
import { formatAmountLive, parseAmount } from '../services/amountFormatter'
import { formatDate, formatDateForInput, parseFrenchDate } from '../services/dateFormatter'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import { Accordion, AccordionItem } from '../components/ui/Accordion'
import { ResponsivePreviewWrapper } from '../components/ResponsivePreviewWrapper'
import { Maximize2, Minimize2, Printer, Save, FileText, ZoomIn, ZoomOut, ArrowRight, CheckCircle2 } from 'lucide-react'

// Template image path
const templateImage = '/assets/templates/bmci-template.jpg'

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

    // Load initial data
    useEffect(() => {
        loadCustomers()
        loadFrames()
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
                    })))
                }
            }
        } catch (error) {
            console.error('Error loading frames:', error)
        }
    }

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
                backgroundColor: null
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

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const NextButton = () => (
        <div className="flex justify-end mt-4">
            <Button size="sm" onClick={nextSection} className="gap-1">
                Suivant <ArrowRight size={14} />
            </Button>
        </div>
    )

    return (
        <>
            <header className="page-header sticky top-0 z-30 shadow-sm">
                <h1 className="page-title">Remplissage de Lettre de Change</h1>
                <div className="page-actions flex gap-2">
                    <Button variant="outline" onClick={saveOperation}>
                        <Save size={16} /> Enregistrer
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer size={16} /> Imprimer
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
                        <Accordion type="single" value={activeSection} onValueChange={setActiveSection} className="w-full">

                            {/* 1. General */}
                            <AccordionItem value="general" title="1. Informations Générales">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        label="Date d'échéance"
                                        value={formData.dateDue}
                                        onChange={handleInputChange('dateDue')}
                                    />
                                    <Input
                                        label="Montant (Chiffres)"
                                        className="font-mono font-bold text-right text-lg"
                                        placeholder="0,00"
                                        value={formData.amount}
                                        onChange={handleAmountChange}
                                        autoFocus
                                    />
                                </div>
                                <NextButton />
                            </AccordionItem>

                            {/* 2. Tireur */}
                            <AccordionItem value="tireur" title="2. Le Tireur (Vous)">
                                <div className="space-y-4">
                                    <Input
                                        label="Nom ou dénomination"
                                        value={formData.tireurName}
                                        onChange={handleInputChange('tireurName')}
                                        placeholder="Votre nom ou société"
                                    />
                                    <Textarea
                                        label="Adresse ou siège"
                                        rows={2}
                                        value={formData.tireurAddress}
                                        onChange={handleInputChange('tireurAddress')}
                                    />
                                </div>
                                <NextButton />
                            </AccordionItem>

                            {/* 3. Beneficiary */}
                            <AccordionItem value="beneficiary" title="3. Bénéficiaire & Détails">
                                <div className="space-y-4">
                                    <Input
                                        label="Bénéficiaire"
                                        value={formData.beneficiaryName}
                                        onChange={handleInputChange('beneficiaryName')}
                                        placeholder="Nom du bénéficiaire"
                                    />
                                    {formData.amountText && (
                                        <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm italic border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                            {formData.amountText}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Lieu de création"
                                            value={formData.creationPlace}
                                            onChange={handleInputChange('creationPlace')}
                                        />
                                        <Input
                                            type="date"
                                            label="Date de création"
                                            value={formData.creationDate}
                                            onChange={handleInputChange('creationDate')}
                                        />
                                    </div>
                                    <Input
                                        label="La cause"
                                        value={formData.cause}
                                        onChange={handleInputChange('cause')}
                                        placeholder="Ex: Facture N° 123"
                                    />
                                </div>
                                <NextButton />
                            </AccordionItem>

                            {/* 4. Drawer (Client) */}
                            <AccordionItem value="drawer" title="4. Le Tiré (Client)">
                                <div className="space-y-4">
                                    <div className="form-group relative mb-0">
                                        <label className="form-label">Nom ou dénomination</label>
                                        <div className="autocomplete-container">
                                            <input
                                                type="text"
                                                className="form-input font-bold"
                                                placeholder="Rechercher un client..."
                                                value={formData.drawerName}
                                                onChange={handleDrawerChange}
                                                onFocus={() => formData.drawerName.length >= 2 && setShowAutocomplete(true)}
                                                onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                                            />
                                            {showAutocomplete && (
                                                <div className="autocomplete-dropdown">
                                                    {filteredCustomers.map((customer) => (
                                                        <div
                                                            key={customer.id}
                                                            className="autocomplete-item"
                                                            onClick={() => selectCustomer(customer)}
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

                                    <Textarea
                                        label="Adresse ou siège"
                                        rows={2}
                                        value={formData.drawerAddress}
                                        onChange={handleInputChange('drawerAddress')}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Compte N°"
                                            value={formData.accountNumber}
                                            onChange={handleInputChange('accountNumber')}
                                        />
                                        <Input
                                            label="Agence"
                                            value={formData.agency}
                                            onChange={handleInputChange('agency')}
                                        />
                                    </div>
                                    <Input
                                        label="Ville"
                                        value={formData.city}
                                        onChange={handleInputChange('city')}
                                    />
                                </div>
                                <NextButton />
                            </AccordionItem>

                            {/* 5. Footer */}
                            <AccordionItem value="footer" title="5. Pied de page (Optionnel)">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        label="Date de l'acceptation"
                                        value={formData.dateAcceptance}
                                        onChange={handleInputChange('dateAcceptance')}
                                    />
                                    <Input
                                        label="Bon pour aval"
                                        value={formData.aval}
                                        onChange={handleInputChange('aval')}
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button variant="accent" onClick={saveOperation}>
                                        <CheckCircle2 size={16} /> Terminer & Enregistrer
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
                                                    fontFamily: frame.fontFamily || 'Arial',
                                                    fontWeight: frame.fontWeight || 'bold',
                                                    textAlign: frame.text_align || 'left',
                                                    justifyContent: (frame.center_enabled) ? 'center' : 'flex-start',
                                                    alignItems: (frame.center_enabled) ? 'center' : 'flex-start',
                                                    color: '#000',
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
        </>
    )
}

export default FillingPage
