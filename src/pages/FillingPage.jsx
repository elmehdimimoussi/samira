import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { convertAmountToFrench } from '../services/frenchTextConverter'
import { formatAmountLive, parseAmount } from '../services/amountFormatter'
import { formatDate, formatDateForInput, parseFrenchDate } from '../services/dateFormatter'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'
import { ResponsivePreviewWrapper } from '../components/ResponsivePreviewWrapper'
import { Maximize2, Minimize2, Printer, Save, FileText, ZoomIn, ZoomOut } from 'lucide-react'

// Template image path (from public folder)
const templateImage = '/assets/templates/bmci-template.jpg'

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
        // beneficiaryAddress removed from requirements as per image analysis (image has "Bénéficiaire" label and line, address usually separate or part of it? Image shows just "Bénéficiaire" with space. The request said "Exact French names". Image has "Bénéficiaire" then "Nom ou dénomination". I will keep it simple.)
        amountText: '',

        // Creation
        creationPlace: 'Agadir', // Default
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

    // Customer autocomplete state
    const [customers, setCustomers] = useState([])
    const [showAutocomplete, setShowAutocomplete] = useState(false)
    const [autocompleteQuery, setAutocompleteQuery] = useState('')
    const [filteredCustomers, setFilteredCustomers] = useState([])

    // Template frames
    const [frames, setFrames] = useState([])

    // Image dimensions state
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

    // UI Expand state
    const [isExpanded, setIsExpanded] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1) // 1 = 100% fit width

    // Load customers and frames from database on mount
    useEffect(() => {
        loadCustomers()
        loadFrames()

        // Check for cloned operation
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
    }, [])

    // Update amount text when amount changes
    useEffect(() => {
        if (formData.amount) {
            const numAmount = parseAmount(formData.amount)
            const textAmount = convertAmountToFrench(numAmount)
            setFormData(prev => ({ ...prev, amountText: textAmount }))
        } else {
            setFormData(prev => ({ ...prev, amountText: '' }))
        }
    }, [formData.amount])

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
                    // Ensure boolean conversion for flags
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

    // Handle amount input with live formatting
    const handleAmountChange = (e) => {
        const formatted = formatAmountLive(e.target.value)
        setFormData(prev => ({ ...prev, amount: formatted }))
    }

    // Handle customer autocomplete (for Tiré/Drawee or Beneficiary? Usually autocomplete is for the Client/Tiré)
    // In this app, "Customers" usually refers to the people we bill (Le Tiré).
    const handleDrawerChange = (e) => {
        const value = e.target.value
        setFormData(prev => ({ ...prev, drawerName: value }))
        setAutocompleteQuery(value)

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
            city: customer.city || '', // Assuming customer has city
        }))
        setShowAutocomplete(false)
    }

    // Handle form input change
    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    // Handle image load to get dimensions
    const handleImageLoad = (e) => {
        setImageDimensions({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight
        })
    }

    // Save operation
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

    // Print (text only)
    const handlePrint = () => {
        window.print()
    }

    // Export PDF
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

    // Get frame value based on frame TYPE
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

    // Toggle expanded mode
    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <>
            <header className="page-header">
                <h1 className="page-title">Remplissage de Lettre de Change</h1>
                <div className="page-actions">
                    <Button variant="outline" onClick={saveOperation}>
                        <Save size={16} /> Enregistrer
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer size={16} /> Imprimer
                    </Button>
                    <Button onClick={handleExportPDF}>
                        <FileText size={16} /> Exporter PDF
                    </Button>
                </div>
            </header>

            <div className="page-body">
                <div className={`filling-layout ${isExpanded ? 'expanded-preview' : ''}`}>
                    {/* Left Panel - Form */}
                    <div className="filling-form">

                        {/* 1. Header Information */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 dark:bg-slate-800/50">
                                <CardTitle className="text-sm font-bold uppercase text-slate-500">Général</CardTitle>
                            </CardHeader>
                            <CardBody className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        type="date"
                                        label="Date d'échéance"
                                        value={formData.dateDue}
                                        onChange={handleInputChange('dateDue')}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label="Montant (Chiffres)"
                                        className="font-mono font-bold text-right"
                                        placeholder="0,00"
                                        value={formData.amount}
                                        onChange={handleAmountChange}
                                    />
                                </div>
                            </CardBody>
                        </Card>

                        {/* 2. Le Tireur (Issuer) */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 dark:bg-slate-800/50">
                                <CardTitle className="text-sm font-bold uppercase text-slate-500">Le Tireur (Vous)</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-4">
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
                            </CardBody>
                        </Card>

                        {/* 3. Beneficiary & Details */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 dark:bg-slate-800/50">
                                <CardTitle className="text-sm font-bold uppercase text-slate-500">Bénéficiaire & Détails</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <Input
                                    label="Bénéficiaire (Nom ou dénomination)"
                                    value={formData.beneficiaryName}
                                    onChange={handleInputChange('beneficiaryName')}
                                    placeholder="Nom du bénéficiaire"
                                />
                                {formData.amountText && (
                                    <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm italic dark:bg-blue-900/30 dark:text-blue-300">
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
                            </CardBody>
                        </Card>

                        {/* 4. Le Tiré (Client) */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 dark:bg-slate-800/50">
                                <CardTitle className="text-sm font-bold uppercase text-slate-500">Le Tiré (Client)</CardTitle>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                {/* Autocomplete for Client Name */}
                                <div className="form-group relative mb-0">
                                    <label className="form-label">Nom ou dénomination</label>
                                    <div className="autocomplete-container">
                                        <input
                                            type="text"
                                            className="form-input"
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
                            </CardBody>
                        </Card>

                        {/* 5. Footer */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 dark:bg-slate-800/50">
                                <CardTitle className="text-sm font-bold uppercase text-slate-500">Pied de page</CardTitle>
                            </CardHeader>
                            <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Panel - Preview */}
                    <div className={`filling-preview ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
                        <div className="preview-header">
                            <div className="flex items-center gap-2">
                                <span className="preview-title">Aperçu en direct</span>
                                <span className="badge badge-primary">BMCI</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))} title="Zoom arrière">
                                    <ZoomOut size={16} />
                                </Button>
                                <span className="text-xs font-mono w-12 text-center">
                                    {Math.round(zoomLevel * 100)}%
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.1))} title="Zoom avant">
                                    <ZoomIn size={16} />
                                </Button>
                                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2" />
                                <Button variant="ghost" size="sm" onClick={toggleExpand} title={isExpanded ? "Réduire" : "Agrandir"}>
                                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </Button>
                            </div>
                        </div>
                        <div className="preview-canvas">
                            {/* Hidden image to load dimensions first */}
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
                                            alt="Template de lettre de change"
                                            className="preview-image"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                maxWidth: 'none'
                                            }}
                                        />
                                        {/* Render text frames */}
                                        {frames.filter(f => f.enabled).map((frame) => (
                                            <div
                                                key={frame.id}
                                                className="preview-frame"
                                                style={{
                                                    left: `${frame.x}px`,
                                                    top: `${frame.y}px`,
                                                    width: `${frame.width}px`,
                                                    height: `${frame.height}px`,
                                                    fontSize: `${frame.font_size || frame.fontSize || 12}px`,
                                                    fontFamily: frame.fontFamily || 'Arial',
                                                    fontWeight: frame.fontWeight || 'bold',
                                                    textAlign: frame.text_align || frame.textAlign || 'left',
                                                    justifyContent: (frame.center_enabled || frame.center) ? 'center' : 'flex-start',
                                                    alignItems: (frame.center_enabled || frame.center) ? 'center' : 'flex-start',
                                                    color: '#000', // Ensure text is black and visible
                                                    zIndex: 10,  // Ensure it's above image
                                                }}
                                            >
                                                <span
                                                    className="preview-frame-text"
                                                    style={{
                                                        wordWrap: (frame.wrap_enabled || frame.wrap) ? 'break-word' : 'normal',
                                                        whiteSpace: (frame.wrap_enabled || frame.wrap) ? 'normal' : 'nowrap',
                                                        overflow: (frame.wrap_enabled || frame.wrap) ? 'hidden' : 'visible',
                                                    }}
                                                >
                                                    {getFrameValue(frame.frame_type || frame.id)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </ResponsivePreviewWrapper>
                            ) : (
                                <div className="text-muted">Chargement du modèle...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for expanded mode */}
            {isExpanded && <div className="modal-overlay" onClick={toggleExpand} style={{ zIndex: 40 }}></div>}
        </>
    )
}

export default FillingPage
