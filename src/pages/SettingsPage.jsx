import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

// Template image path (from public folder)
const templateImage = '/assets/templates/bmci-template.jpg'

// Frame types
const frameTypes = [
    { value: 'date_due', label: "Date d'échéance" },
    { value: 'amount_numeric', label: 'Montant (chiffres)' },
    { value: 'tireur_name', label: 'Le Tireur - Nom ou dénomination' },
    { value: 'tireur_address', label: 'Le Tireur - Adresse ou siège' },
    { value: 'beneficiary_name', label: 'Bénéficiaire - Nom ou dénomination' },
    { value: 'amount_text', label: 'Montant (lettres)' },
    { value: 'creation_place', label: 'Lieu de création' },
    { value: 'date_creation', label: 'Date de création' },
    { value: 'cause', label: 'La cause' },
    { value: 'drawer_name', label: 'Le Tiré - Nom ou dénomination' },
    { value: 'drawer_address', label: 'Le Tiré - Adresse ou siège' },
    { value: 'account_number', label: 'Le Tiré - Compte N°' },
    { value: 'agency', label: 'Le Tiré - Agence' },
    { value: 'city', label: 'Le Tiré - Ville' },
    { value: 'date_acceptance', label: "Date de l'acceptation" },
    { value: 'aval', label: 'Bon pour aval' },
    { value: 'custom', label: 'Personnalisé' },
]

// Default frames
const defaultFrames = [
    { id: 1, frame_type: 'date_due', label: "Date d'échéance", x: 650, y: 30, width: 120, height: 20, font_size: 11, text_align: 'center', enabled: true },
    { id: 2, frame_type: 'amount_numeric', label: 'Montant (chiffres)', x: 650, y: 60, width: 120, height: 20, font_size: 12, text_align: 'right', enabled: true },

    { id: 3, frame_type: 'tireur_name', label: 'Tireur - Nom', x: 20, y: 40, width: 250, height: 20, font_size: 11, text_align: 'left', enabled: true },
    { id: 4, frame_type: 'tireur_address', label: 'Tireur - Adresse', x: 20, y: 60, width: 250, height: 20, font_size: 10, text_align: 'left', enabled: true },

    { id: 5, frame_type: 'beneficiary_name', label: 'Bénéficiaire', x: 300, y: 110, width: 300, height: 20, font_size: 11, text_align: 'left', enabled: true },
    { id: 6, frame_type: 'amount_text', label: 'Montant (lettres)', x: 300, y: 140, width: 400, height: 30, font_size: 10, text_align: 'left', enabled: true, wrap_enabled: true },

    { id: 7, frame_type: 'creation_place', label: 'Lieu création', x: 300, y: 170, width: 100, height: 20, font_size: 11, text_align: 'left', enabled: true },
    { id: 8, frame_type: 'date_creation', label: 'Date création', x: 410, y: 170, width: 100, height: 20, font_size: 11, text_align: 'center', enabled: true },
    { id: 9, frame_type: 'cause', label: 'La cause', x: 300, y: 200, width: 200, height: 20, font_size: 10, text_align: 'left', enabled: true },

    { id: 10, frame_type: 'drawer_name', label: 'Tiré - Nom', x: 300, y: 240, width: 250, height: 20, font_size: 11, text_align: 'left', enabled: true },
    { id: 11, frame_type: 'drawer_address', label: 'Tiré - Adresse', x: 300, y: 260, width: 250, height: 30, font_size: 10, text_align: 'left', enabled: true, wrap_enabled: true },

    { id: 12, frame_type: 'account_number', label: 'Compte N°', x: 300, y: 300, width: 150, height: 20, font_size: 10, text_align: 'left', enabled: true },
    { id: 13, frame_type: 'agency', label: 'Agence', x: 460, y: 300, width: 100, height: 20, font_size: 10, text_align: 'left', enabled: true },
    { id: 14, frame_type: 'city', label: 'Ville', x: 460, y: 320, width: 100, height: 20, font_size: 10, text_align: 'left', enabled: true },

    { id: 15, frame_type: 'date_acceptance', label: 'Date acceptation', x: 20, y: 200, width: 150, height: 20, font_size: 10, text_align: 'left', enabled: true },
    { id: 16, frame_type: 'aval', label: 'Bon pour aval', x: 20, y: 300, width: 200, height: 20, font_size: 10, text_align: 'left', enabled: true },
]

function SettingsPage() {
    const [activeTab, setActiveTab] = useState('designer')
    const [frames, setFrames] = useState(defaultFrames)
    const [selectedFrame, setSelectedFrame] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [resizeHandle, setResizeHandle] = useState(null)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, frameX: 0, frameY: 0 })
    const [showGrid, setShowGrid] = useState(false)
    const [testMode, setTestMode] = useState(false)

    const canvasRef = useRef(null)

    // Load frames from database on mount
    useEffect(() => {
        loadFrames()
    }, [])

    const loadFrames = async () => {
        try {
            if (window.electronAPI) {
                const result = await window.electronAPI.frames.getAll()
                if (result && result.length > 0) {
                    setFrames(result)
                }
            }
        } catch (error) {
            console.error('Error loading frames:', error)
        }
    }

    const saveFrames = async () => {
        try {
            if (window.electronAPI) {
                await window.electronAPI.frames.save(frames)
                toast.success('Configuration sauvegardée avec succès!')
            } else {
                toast.error('Fonctionnalité disponible uniquement dans l\'application Electron')
            }
        } catch (error) {
            console.error('Error saving frames:', error)
            toast.error('Erreur lors de la sauvegarde')
        }
    }

    const addFrame = () => {
        const newId = Math.max(...frames.map(f => f.id), 0) + 1
        const newFrame = {
            id: newId,
            frame_type: 'custom',
            label: `Champ ${newId}`,
            x: 100,
            y: 100,
            width: 150,
            height: 25,
            font_size: 12,
            text_align: 'left',
            enabled: true,
            wrap_enabled: false,
            center_enabled: false
        }
        setFrames([...frames, newFrame])
        setSelectedFrame(newFrame)
    }

    const deleteFrame = (id) => {
        if (confirm('Supprimer ce champ ?')) {
            setFrames(frames.filter(f => f.id !== id))
            if (selectedFrame?.id === id) {
                setSelectedFrame(null)
            }
        }
    }

    const updateFrame = (id, updates) => {
        setFrames(frames.map(f => f.id === id ? { ...f, ...updates } : f))
        if (selectedFrame?.id === id) {
            setSelectedFrame({ ...selectedFrame, ...updates })
        }
    }

    // Mouse handlers for drag and resize
    const handleMouseDown = (e, frame, handle = null) => {
        e.preventDefault()
        e.stopPropagation()

        const rect = canvasRef.current.getBoundingClientRect()

        if (handle) {
            setIsResizing(true)
            setResizeHandle(handle)
        } else {
            setIsDragging(true)
        }

        setSelectedFrame(frame)
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            frameX: frame.x,
            frameY: frame.y,
            frameW: frame.width,
            frameH: frame.height
        })
    }

    const handleMouseMove = (e) => {
        if (!isDragging && !isResizing) return
        if (!selectedFrame) return

        const rect = canvasRef.current.getBoundingClientRect()
        const currentX = e.clientX - rect.left
        const currentY = e.clientY - rect.top
        const deltaX = currentX - dragStart.x
        const deltaY = currentY - dragStart.y

        if (isDragging) {
            let newX = Math.max(0, dragStart.frameX + deltaX)
            let newY = Math.max(0, dragStart.frameY + deltaY)

            // Snap to grid if enabled
            if (showGrid) {
                newX = Math.round(newX / 10) * 10
                newY = Math.round(newY / 10) * 10
            }

            updateFrame(selectedFrame.id, { x: newX, y: newY })
        } else if (isResizing) {
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

            // Snap to grid if enabled
            if (showGrid) {
                newX = Math.round(newX / 10) * 10
                newY = Math.round(newY / 10) * 10
                newW = Math.round(newW / 10) * 10
                newH = Math.round(newH / 10) * 10
            }

            updateFrame(selectedFrame.id, { x: newX, y: newY, width: newW, height: newH })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        setIsResizing(false)
        setResizeHandle(null)
    }

    // Keyboard handlers for precise movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedFrame) return
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

            const step = e.shiftKey ? 10 : 1
            let updates = null

            switch (e.key) {
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
            }

            if (updates) {
                e.preventDefault()
                updateFrame(selectedFrame.id, updates)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedFrame])

    // Backup handlers
    const handleExportBackup = async () => {
        try {
            if (window.electronAPI) {
                const data = await window.electronAPI.backup.export()
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `lc-backup-${new Date().toISOString().split('T')[0]}.json`
                a.click()
                URL.revokeObjectURL(url)
                toast.success('Sauvegarde exportée avec succès')
            }
        } catch (error) {
            console.error('Error exporting backup:', error)
            toast.error('Erreur lors de l\'exportation')
        }
    }

    const handleImportBackup = async () => {
        try {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.json'
            input.onchange = async (e) => {
                const file = e.target.files[0]
                if (!file) return

                const reader = new FileReader()
                reader.onload = async (e) => {
                    try {
                        if (window.electronAPI) {
                            const result = await window.electronAPI.backup.import(e.target.result)
                            if (result.success) {
                                toast.success('Restauration réussie! L\'application va se recharger...')
                                setTimeout(() => window.location.reload(), 1500)
                            } else {
                                toast.error('Erreur: ' + result.error)
                            }
                        }
                    } catch (err) {
                        console.error('Import error:', err)
                        toast.error('Fichier invalide')
                    }
                }
                reader.readAsText(file)
            }
            input.click()
        } catch (error) {
            console.error('Error importing backup:', error)
            toast.error('Erreur inattendue')
        }
    }

    return (
        <>
            <header className="page-header">
                <h1 className="page-title">Paramètres</h1>
            </header>

            <div className="page-body">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={activeTab === 'designer' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('designer')}
                    >
                        🎨 Éditeur de Modèle
                    </Button>
                    <Button
                        variant={activeTab === 'general' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('general')}
                    >
                        ⚙️ Paramètres Généraux
                    </Button>
                </div>

                {/* Designer Tab */}
                {activeTab === 'designer' && (
                    <div className="designer-layout">
                        {/* Canvas */}
                        <div className="designer-canvas-container">
                            <div className="flex gap-2 mb-4">
                                <Button variant="outline" size="sm" onClick={addFrame}>
                                    ➕ Ajouter un champ
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${showGrid ? 'bg-primary-light text-primary' : ''}`}
                                    onClick={() => setShowGrid(!showGrid)}
                                >
                                    🔲 Grille
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${testMode ? 'bg-accent text-white' : ''}`}
                                    onClick={() => setTestMode(!testMode)}
                                >
                                    🧪 Mode Test
                                </Button>
                                <div style={{ flex: 1 }} />
                                <Button variant="primary" size="sm" onClick={saveFrames}>
                                    💾 Sauvegarder
                                </Button>
                            </div>

                            <div
                                ref={canvasRef}
                                className="designer-canvas"
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onClick={() => setSelectedFrame(null)}
                                style={{
                                    backgroundImage: showGrid
                                        ? 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 10px)'
                                        : 'none'
                                }}
                            >
                                <img src={templateImage} alt="Template" style={{ display: 'block' }} />

                                {/* Render frames */}
                                {frames.map((frame) => (
                                    <div
                                        key={frame.id}
                                        className={`designer-frame ${selectedFrame?.id === frame.id ? 'selected' : ''} ${!frame.enabled ? 'disabled' : ''}`}
                                        style={{
                                            left: `${frame.x}px`,
                                            top: `${frame.y}px`,
                                            width: `${frame.width}px`,
                                            height: `${frame.height}px`,
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, frame)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span className="designer-frame-label">{frame.label}</span>

                                        {/* Test mode content */}
                                        {testMode && (
                                            <span style={{
                                                fontSize: `${frame.font_size}px`,
                                                textAlign: frame.text_align,
                                                width: '100%',
                                                display: 'block',
                                                overflow: 'hidden'
                                            }}>
                                                {frame.frame_type === 'amount_numeric' ? '10 500,00' :
                                                    frame.frame_type === 'amount_text' ? 'Dix mille cinq cents dirhams' :
                                                        frame.frame_type.includes('date') ? '17-01-2026' :
                                                            'TEXTE EXEMPLE'}
                                            </span>
                                        )}

                                        {/* Resize handles */}
                                        {selectedFrame?.id === frame.id && (
                                            <>
                                                <div className="designer-frame-handle nw" onMouseDown={(e) => handleMouseDown(e, frame, 'nw')} />
                                                <div className="designer-frame-handle n" onMouseDown={(e) => handleMouseDown(e, frame, 'n')} />
                                                <div className="designer-frame-handle ne" onMouseDown={(e) => handleMouseDown(e, frame, 'ne')} />
                                                <div className="designer-frame-handle e" onMouseDown={(e) => handleMouseDown(e, frame, 'e')} />
                                                <div className="designer-frame-handle se" onMouseDown={(e) => handleMouseDown(e, frame, 'se')} />
                                                <div className="designer-frame-handle s" onMouseDown={(e) => handleMouseDown(e, frame, 's')} />
                                                <div className="designer-frame-handle sw" onMouseDown={(e) => handleMouseDown(e, frame, 'sw')} />
                                                <div className="designer-frame-handle w" onMouseDown={(e) => handleMouseDown(e, frame, 'w')} />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs text-muted mt-md">
                                💡 Utilisez les flèches du clavier pour un déplacement précis (Shift + flèches pour 10 pixels)
                            </p>
                        </div>

                        {/* Properties Panel */}
                        <div className="designer-properties">
                            <div className="properties-header">
                                <h4 className="properties-title">Propriétés du Champ</h4>
                            </div>
                            <div className="properties-body">
                                {selectedFrame ? (
                                    <>
                                        <Input
                                            label="Nom"
                                            value={selectedFrame.label}
                                            onChange={(e) => updateFrame(selectedFrame.id, { label: e.target.value })}
                                        />

                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select
                                                className="form-select"
                                                value={selectedFrame.frame_type}
                                                onChange={(e) => updateFrame(selectedFrame.id, { frame_type: e.target.value })}
                                            >
                                                {frameTypes.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex gap-4 mb-4">
                                            <Input
                                                type="number"
                                                label="X"
                                                containerClassName="flex-1"
                                                value={selectedFrame.x}
                                                onChange={(e) => updateFrame(selectedFrame.id, { x: parseInt(e.target.value) || 0 })}
                                            />
                                            <Input
                                                type="number"
                                                label="Y"
                                                containerClassName="flex-1"
                                                value={selectedFrame.y}
                                                onChange={(e) => updateFrame(selectedFrame.id, { y: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>

                                        <div className="flex gap-4 mb-4">
                                            <Input
                                                type="number"
                                                label="Largeur"
                                                containerClassName="flex-1"
                                                value={selectedFrame.width}
                                                onChange={(e) => updateFrame(selectedFrame.id, { width: parseInt(e.target.value) || 50 })}
                                            />
                                            <Input
                                                type="number"
                                                label="Hauteur"
                                                containerClassName="flex-1"
                                                value={selectedFrame.height}
                                                onChange={(e) => updateFrame(selectedFrame.id, { height: parseInt(e.target.value) || 20 })}
                                            />
                                        </div>

                                        <Input
                                            type="number"
                                            label="Taille de police"
                                            value={selectedFrame.font_size}
                                            onChange={(e) => updateFrame(selectedFrame.id, { font_size: parseInt(e.target.value) || 12 })}
                                        />

                                        <div className="form-group">
                                            <label className="form-label">Alignement</label>
                                            <div className="flex gap-2">
                                                {['left', 'center', 'right'].map(align => (
                                                    <Button
                                                        key={align}
                                                        size="sm"
                                                        variant={selectedFrame.text_align === align ? 'primary' : 'outline'}
                                                        onClick={() => updateFrame(selectedFrame.id, { text_align: align })}
                                                    >
                                                        {align === 'left' ? '⬅️' : align === 'center' ? '↔️' : '➡️'}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-group flex items-center justify-between">
                                            <label className="form-label" style={{ marginBottom: 0 }}>Retour à la ligne</label>
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFrame.wrap_enabled}
                                                    onChange={(e) => updateFrame(selectedFrame.id, { wrap_enabled: e.target.checked })}
                                                />
                                                <span className="toggle-slider" />
                                            </label>
                                        </div>

                                        <div className="form-group flex items-center justify-between">
                                            <label className="form-label" style={{ marginBottom: 0 }}>Activé</label>
                                            <label className="toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFrame.enabled}
                                                    onChange={(e) => updateFrame(selectedFrame.id, { enabled: e.target.checked })}
                                                />
                                                <span className="toggle-slider" />
                                            </label>
                                        </div>

                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="w-full mt-4"
                                            onClick={() => deleteFrame(selectedFrame.id)}
                                        >
                                            🗑️ Supprimer ce champ
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-semibold text-muted mb-2">
                                            Liste des champs ({frames.length})
                                        </p>
                                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-1">
                                            {frames.map(frame => (
                                                <div
                                                    key={frame.id}
                                                    className={`
                                                        p-3 rounded-lg border cursor-pointer flex items-center justify-between group transition-all
                                                        ${frame.enabled ? 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700' : 'bg-slate-50 border-slate-200 opacity-60 dark:bg-slate-800/50 dark:border-slate-700'}
                                                        hover:border-blue-400 dark:hover:border-blue-500
                                                    `}
                                                    onClick={() => setSelectedFrame(frame)}
                                                >
                                                    <span className="text-sm font-medium truncate flex-1 mr-2">{frame.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${frame.enabled ? 'text-green-600' : 'text-slate-400'}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateFrame(frame.id, { enabled: !frame.enabled });
                                                            }}
                                                            title={frame.enabled ? "Masquer ce champ" : "Afficher ce champ"}
                                                        >
                                                            {frame.enabled ? '👁️' : '🙈'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted mt-4 text-center">
                                            Cliquez sur un champ pour modifier ses propriétés détaillées.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* General Settings Tab */}
                {activeTab === 'general' && (
                    <div style={{ maxWidth: '600px' }}>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>🖨️ Options d'impression</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <p className="text-muted text-sm mb-4">
                                    Lors de l'impression sur la lettre de change pré-imprimée, seul le texte sera imprimé (sans l'image de fond).
                                </p>
                                <div className="flex items-center justify-between">
                                    <span>Imprimer uniquement le texte</span>
                                    <label className="toggle">
                                        <input type="checkbox" checked disabled />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>📄 Options PDF</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <p className="text-muted text-sm mb-4">
                                    Configuration par défaut pour l'exportation PDF.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span>Inclure l'image de fond dans le PDF</span>
                                    <label className="toggle">
                                        <input type="checkbox" defaultChecked />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>💾 Sauvegarde et Restauration</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <p className="text-muted text-sm mb-4">
                                    Exportez une sauvegarde complète de vos données (clients, historique, configuration) ou restaurez à partir d'un fichier de sauvegarde.
                                </p>
                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={handleExportBackup}>
                                        📤 Exporter une sauvegarde
                                    </Button>
                                    <Button variant="outline" onClick={handleImportBackup}>
                                        📥 Importer une sauvegarde
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </>
    )
}

export default SettingsPage
