import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { ResponsivePreviewWrapper } from '../ResponsivePreviewWrapper'

export function PreviewPanel({
  imageDimensions,
  templateImage,
  frames,
  getFrameValue,
  handleImageLoad,
  previewScale,
  setPreviewScale,
  isFullscreen,
  onToggleFullscreen,
}) {
  const isDev = import.meta.env.DEV

  return (
    <div className={`filling-preview sticky top-0 ${isFullscreen ? 'fullscreen-preview' : 'h-[calc(100vh-130px)]'}`}>
      <div className="preview-header">
        <div className="flex items-center gap-2">
          <span className="preview-title">Apercu</span>
          <span className="badge badge-primary">BMCI</span>
          {isDev && (
            <span className="badge border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Scale {Math.round(previewScale * 100)}%
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onToggleFullscreen}>
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </Button>
      </div>

      <div className="preview-canvas bg-slate-200/50 dark:bg-slate-900/50">
        <img src={templateImage} onLoad={handleImageLoad} style={{ display: 'none' }} alt="" />

        {imageDimensions.width > 0 ? (
          <ResponsivePreviewWrapper
            width={imageDimensions.width}
            height={imageDimensions.height}
            onScaleChange={setPreviewScale}
          >
            <div
              id="preview-container"
              className="preview-image-container"
              style={{ width: `${imageDimensions.width}px`, height: `${imageDimensions.height}px` }}
            >
              <img
                src={templateImage}
                alt="Template"
                className="preview-image"
                style={{ width: '100%', height: '100%', maxWidth: 'none' }}
              />
              {frames
                .filter((frame) => frame.enabled)
                .map((frame) => (
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
                      justifyContent: frame.center_enabled ? 'center' : 'flex-start',
                      alignItems: frame.center_enabled ? 'center' : 'flex-start',
                      color: frame.color || '#000',
                      zIndex: 10,
                    }}
                  >
                    <span
                      className="preview-frame-text"
                      style={{
                        wordWrap: frame.wrap_enabled ? 'break-word' : 'normal',
                        whiteSpace: frame.wrap_enabled ? 'normal' : 'nowrap',
                        overflow: frame.wrap_enabled ? 'hidden' : 'visible',
                      }}
                    >
                      {getFrameValue(frame.frame_type || frame.id)}
                    </span>
                  </div>
                ))}
            </div>
          </ResponsivePreviewWrapper>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-current" />
            <span className="text-sm">Chargement du modele...</span>
          </div>
        )}
      </div>
    </div>
  )
}
