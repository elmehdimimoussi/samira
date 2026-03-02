import { useState } from 'react'
import { Download, Keyboard, Layout, Printer, Save, Settings, Upload, FileText } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/Card'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { TemplateDesignerCanvas } from '../components/settings/TemplateDesignerCanvas'
import { TemplatePropertiesPanel } from '../components/settings/TemplatePropertiesPanel'
import { useTemplateDesigner } from '../hooks/useTemplateDesigner'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('designer')
  const {
    frames,
    selectedFrame,
    setSelectedFrame,
    showGrid,
    setShowGrid,
    testMode,
    setTestMode,
    confirmDeleteId,
    setConfirmDeleteId,
    showShortcuts,
    setShowShortcuts,
    showResetConfirm,
    setShowResetConfirm,
    frameSearch,
    setFrameSearch,
    templateImage,
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
  } = useTemplateDesigner()

  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Configuration du modele et de l'application</p>
        </div>
        {activeTab === 'designer' && (
          <div className="page-actions">
            <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(true)} title="Raccourcis clavier">
              <Keyboard size={16} />
            </Button>
            <Button variant="primary" size="sm" onClick={saveFrames}>
              <Save size={16} /> Sauvegarder
            </Button>
          </div>
        )}
      </header>

      <div className="page-body">
        <div className="mb-6 flex w-fit rounded-xl border border-slate-200/50 bg-slate-100 p-1 dark:border-slate-700/50 dark:bg-slate-800/80">
          <button
            onClick={() => setActiveTab('designer')}
            className={`cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'designer'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layout size={16} /> Éditeur de Modèle
            </span>
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'general'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Settings size={16} /> Paramètres Généraux
            </span>
          </button>
        </div>

        {activeTab === 'designer' && (
          <div className="designer-layout">
            <TemplateDesignerCanvas
              frames={frames}
              selectedFrame={selectedFrame}
              setSelectedFrame={setSelectedFrame}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              testMode={testMode}
              setTestMode={setTestMode}
              templateImage={templateImage}
              imageDimensions={imageDimensions}
              canvasScale={canvasScale}
              setCanvasScale={setCanvasScale}
              canvasRef={canvasRef}
              templateInputRef={templateInputRef}
              handleTemplateUpload={handleTemplateUpload}
              resetTemplateImage={resetTemplateImage}
              exportTemplateConfig={exportTemplateConfig}
              importTemplateConfig={importTemplateConfig}
              setShowResetConfirm={setShowResetConfirm}
              addFrame={addFrame}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              handleTemplateLoad={handleTemplateLoad}
            />

            <TemplatePropertiesPanel
              selectedFrame={selectedFrame}
              frames={frames}
              filteredFrames={filteredFrames}
              frameSearch={frameSearch}
              setFrameSearch={setFrameSearch}
              setSelectedFrame={setSelectedFrame}
              updateFrame={updateFrame}
              duplicateFrame={duplicateFrame}
              deleteFrame={deleteFrame}
            />
          </div>
        )}

        {activeTab === 'general' && (
          <div className="mx-auto max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer size={20} /> Options d'impression
                </CardTitle>
              </CardHeader>
              <CardBody>
                <p className="mb-4 text-sm text-muted">
                  Lors de l'impression sur la lettre de change pre-imprimee, seul le texte sera imprime.
                </p>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                  <span className="font-medium">Imprimer uniquement le texte</span>
                  <label className="toggle">
                    <input type="checkbox" checked disabled readOnly />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} /> Options PDF
                </CardTitle>
              </CardHeader>
              <CardBody>
                <p className="mb-4 text-sm text-muted">Configuration par defaut pour l'exportation PDF.</p>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                  <span className="font-medium">Inclure l'image de fond dans le PDF</span>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save size={20} /> Sauvegarde et Restauration
                </CardTitle>
              </CardHeader>
              <CardBody>
                <p className="mb-4 text-sm text-muted">Exportez une sauvegarde complete de vos donnees.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={handleExportBackup} className="h-auto flex-col gap-2 py-4">
                    <Download size={24} className="mb-1" />
                    <span>Exporter la sauvegarde</span>
                  </Button>
                  <Button variant="outline" onClick={handleImportBackup} className="h-auto flex-col gap-2 py-4">
                    <Upload size={24} className="mb-1" />
                    <span>Restaurer depuis un fichier</span>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDeleteFrame}
        title="Supprimer le champ"
        message="Etes-vous sur de vouloir supprimer ce champ ? Cette action est irreversible."
        confirmText="Supprimer"
      />

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetToDefaults}
        title="Reinitialiser la configuration"
        message="Etes-vous sur de vouloir reinitialiser tous les champs aux valeurs par defaut ?"
        confirmText="Reinitialiser"
      />

      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowShortcuts(false)} />
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Keyboard size={20} /> Raccourcis Clavier
            </h3>
            <div className="space-y-3">
              {[
                { keys: '←↑→↓', desc: 'Deplacer le champ selectionne' },
                { keys: 'Shift + Fleches', desc: 'Deplacer par pas de 10px' },
                { keys: 'Suppr', desc: 'Supprimer le champ selectionne' },
                { keys: 'Ctrl + D', desc: 'Dupliquer le champ selectionne' },
                { keys: 'Ctrl + G', desc: 'Afficher/masquer la grille' },
                { keys: 'Ctrl + T', desc: 'Activer/desactiver l apercu' },
                { keys: 'Echap', desc: 'Deselectionner le champ' },
              ].map(({ keys, desc }) => (
                <div key={keys} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{desc}</span>
                  <kbd className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {keys}
                  </kbd>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-6 w-full" onClick={() => setShowShortcuts(false)}>
              Fermer
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default SettingsPage
