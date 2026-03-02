import {
  Eye,
  FileDown,
  FileUp,
  Grid,
  Image,
  Move,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { ResponsivePreviewWrapper } from '../ResponsivePreviewWrapper'
import { testData } from '../../hooks/useTemplateDesigner'

export function TemplateDesignerCanvas({
  frames,
  selectedFrame,
  setSelectedFrame,
  showGrid,
  setShowGrid,
  testMode,
  setTestMode,
  templateImage,
  imageDimensions,
  canvasScale,
  setCanvasScale,
  canvasRef,
  templateInputRef,
  handleTemplateUpload,
  resetTemplateImage,
  exportTemplateConfig,
  importTemplateConfig,
  setShowResetConfirm,
  addFrame,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTemplateLoad,
}) {
  const isDev = import.meta.env.DEV

  return (
    <div className="designer-canvas-container">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={addFrame}>
          <Plus size={14} /> Ajouter
        </Button>
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <Button variant={showGrid ? 'primary' : 'outline'} size="sm" onClick={() => setShowGrid(!showGrid)}>
          <Grid size={14} /> Grille
        </Button>
        <Button variant={testMode ? 'accent' : 'outline'} size="sm" onClick={() => setTestMode(!testMode)}>
          <Eye size={14} /> Aperçu
        </Button>
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1" />
        <input ref={templateInputRef} type="file" accept="image/*" className="hidden" onChange={handleTemplateUpload} />
        <Button variant="outline" size="sm" onClick={() => templateInputRef.current?.click()}>
          <Image size={14} /> Modele
        </Button>
        <Button variant="ghost" size="sm" onClick={resetTemplateImage} title="Reinitialiser l'image">
          <RotateCcw size={14} />
        </Button>
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <Button variant="outline" size="sm" onClick={exportTemplateConfig}>
          <FileDown size={14} />
        </Button>
        <Button variant="outline" size="sm" onClick={importTemplateConfig}>
          <FileUp size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(true)}>
          <RotateCcw size={14} />
        </Button>
        <span className="hidden text-xs text-muted lg:block">
          {frames.filter((frame) => frame.enabled).length}/{frames.length} champs actifs
        </span>
        {isDev && (
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Scale {Math.round(canvasScale * 100)}%
          </span>
        )}
      </div>

      <div className="designer-canvas-scroll flex-1 overflow-auto">
        <img src={templateImage} onLoad={handleTemplateLoad} style={{ display: 'none' }} alt="" />

        {imageDimensions.width > 0 ? (
          <ResponsivePreviewWrapper width={imageDimensions.width} height={imageDimensions.height} onScaleChange={setCanvasScale}>
            <div
              ref={canvasRef}
              className="designer-canvas"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setSelectedFrame(null)}
              style={{
                width: `${imageDimensions.width}px`,
                height: `${imageDimensions.height}px`,
                backgroundImage: showGrid
                  ? 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 10px)'
                  : 'none',
              }}
            >
              <img src={templateImage} alt="Template" style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }} />

              {frames.map((frame) => (
                <div
                  key={frame.id}
                  className={`designer-frame ${selectedFrame?.id === frame.id ? 'selected' : ''} ${!frame.enabled ? 'disabled opacity-50' : ''}`}
                  style={{
                    left: `${frame.x}px`,
                    top: `${frame.y}px`,
                    width: `${frame.width}px`,
                    height: `${frame.height}px`,
                  }}
                  onMouseDown={(event) => handleMouseDown(event, frame)}
                  onClick={(event) => event.stopPropagation()}
                >
                  {!testMode && <span className="designer-frame-label">{frame.label}</span>}
                  {testMode && (
                    <span
                      style={{
                        fontSize: `${frame.font_size}px`,
                        fontFamily: frame.font_family || 'Arial',
                        fontWeight: frame.font_weight || 'bold',
                        fontStyle: frame.font_style || 'normal',
                        color: frame.color || '#000000',
                        textAlign: frame.text_align,
                        width: '100%',
                        display: 'block',
                        overflow: frame.wrap_enabled ? 'hidden' : 'visible',
                        whiteSpace: frame.wrap_enabled ? 'normal' : 'nowrap',
                        wordWrap: frame.wrap_enabled ? 'break-word' : 'normal',
                        lineHeight: 1.2,
                      }}
                    >
                      {testData[frame.frame_type] || 'ABC...'}
                    </span>
                  )}
                  {selectedFrame?.id === frame.id && (
                    <>
                      <div className="designer-frame-handle nw" onMouseDown={(event) => handleMouseDown(event, frame, 'nw')} />
                      <div className="designer-frame-handle n" onMouseDown={(event) => handleMouseDown(event, frame, 'n')} />
                      <div className="designer-frame-handle ne" onMouseDown={(event) => handleMouseDown(event, frame, 'ne')} />
                      <div className="designer-frame-handle e" onMouseDown={(event) => handleMouseDown(event, frame, 'e')} />
                      <div className="designer-frame-handle se" onMouseDown={(event) => handleMouseDown(event, frame, 'se')} />
                      <div className="designer-frame-handle s" onMouseDown={(event) => handleMouseDown(event, frame, 's')} />
                      <div className="designer-frame-handle sw" onMouseDown={(event) => handleMouseDown(event, frame, 'sw')} />
                      <div className="designer-frame-handle w" onMouseDown={(event) => handleMouseDown(event, frame, 'w')} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </ResponsivePreviewWrapper>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">Chargement du modele...</div>
        )}
      </div>

      {selectedFrame && (
        <div className="mt-3 flex items-center gap-4 px-2 text-xs text-muted">
          <span>
            <Move size={12} className="mr-1 inline" />X: {selectedFrame.x}, Y: {selectedFrame.y}
          </span>
          <span>
            W: {selectedFrame.width} x H: {selectedFrame.height}
          </span>
        </div>
      )}
    </div>
  )
}
