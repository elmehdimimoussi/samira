import { toast } from 'sonner'
import { FileText, Printer, RotateCcw, Save, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { FillingForm } from '../components/filling/FillingForm'
import { PreviewPanel } from '../components/filling/PreviewPanel'
import { useLCForm } from '../hooks/useLCForm'
import { useFullscreen } from '../hooks/useFullscreen'

function FillingPage() {
  const {
    formData,
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
    totalSections,
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
  } = useLCForm()

  const { isFullscreen, openFullscreen, closeFullscreen } = useFullscreen()

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
        },
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const imgWidth = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`LC_${formData.drawerName || 'export'}.pdf`)
      toast.dismiss(toastId)
      toast.success('PDF exporte avec succes')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Erreur lors de l exportation PDF')
    }
  }

  return (
    <>
      <header className="page-header sticky top-0 z-30">
        <div>
          <h1 className="page-title">Remplissage de Lettre de Change</h1>
          <p className="page-subtitle">
            {completedSections < totalSections
              ? `${completedSections}/${totalSections} sections completees`
              : 'Toutes les sections sont completees'}
          </p>
        </div>
        <div className="page-actions">
          <Button variant="ghost" size="sm" onClick={resetForm} title="Reinitialiser">
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
        <div className="filling-layout">
          <FillingForm
            formData={formData}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sectionStatus={sectionStatus}
            customers={customers}
            applySelectedCustomer={applySelectedCustomer}
            isFrameEnabled={isFrameEnabled}
            handleInputChange={handleInputChange}
            handleAmountChange={handleAmountChange}
            nextSection={nextSection}
            saveOperation={saveOperation}
          />

          <PreviewPanel
            imageDimensions={imageDimensions}
            templateImage={templateImage}
            frames={frames}
            getFrameValue={getFrameValue}
            handleImageLoad={handleImageLoad}
            previewScale={previewScale}
            setPreviewScale={setPreviewScale}
            isFullscreen={false}
            onToggleFullscreen={openFullscreen}
          />
        </div>
      </div>

      {isFullscreen && (
        <div className="fullscreen-overlay">
          <button type="button" className="fullscreen-close" onClick={closeFullscreen} aria-label="Fermer plein ecran">
            <X size={20} />
          </button>
          <div className="fullscreen-content">
            <PreviewPanel
              imageDimensions={imageDimensions}
              templateImage={templateImage}
              frames={frames}
              getFrameValue={getFrameValue}
              handleImageLoad={handleImageLoad}
              previewScale={previewScale}
              setPreviewScale={setPreviewScale}
              isFullscreen
              onToggleFullscreen={closeFullscreen}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmReset}
        title="Reinitialiser le formulaire"
        message="Etes-vous sur de vouloir reinitialiser tous les champs du formulaire ? Toutes les donnees non enregistrees seront perdues."
        confirmText="Reinitialiser"
      />
    </>
  )
}

export default FillingPage
