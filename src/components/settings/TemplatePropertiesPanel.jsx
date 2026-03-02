import { Copy, Eye, EyeOff, Trash2, Type } from 'lucide-react'
import { Accordion, AccordionItem } from '../ui/Accordion'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { fontFamilies, frameTypes } from '../../hooks/useTemplateDesigner'

export function TemplatePropertiesPanel({
  selectedFrame,
  frames,
  filteredFrames,
  frameSearch,
  setFrameSearch,
  setSelectedFrame,
  updateFrame,
  duplicateFrame,
  deleteFrame,
}) {
  return (
    <div className="designer-properties">
      <div className="properties-header">
        <h4 className="properties-title">Proprietes</h4>
      </div>
      <div className="properties-body">
        {selectedFrame ? (
          <div className="flex h-full flex-col">
            <Accordion type="multiple" defaultValue={['identity', 'position', 'appearance']} className="w-full flex-1 overflow-y-auto">
              <AccordionItem value="identity" title="Identite">
                <div className="space-y-4">
                  <Input label="Nom du champ" value={selectedFrame.label} onChange={(event) => updateFrame(selectedFrame.id, { label: event.target.value })} />
                  <div className="form-group">
                    <label className="form-label">Type de donnee</label>
                    <select className="form-select" value={selectedFrame.frame_type} onChange={(event) => updateFrame(selectedFrame.id, { frame_type: event.target.value })}>
                      {frameTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Afficher ce champ</span>
                    <button
                      onClick={() => updateFrame(selectedFrame.id, { enabled: !selectedFrame.enabled })}
                      className={`rounded-lg p-1.5 transition-colors ${
                        selectedFrame.enabled
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {selectedFrame.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem value="position" title="Position & Taille">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" label="X (px)" value={selectedFrame.x} onChange={(event) => updateFrame(selectedFrame.id, { x: parseInt(event.target.value, 10) || 0 })} />
                    <Input type="number" label="Y (px)" value={selectedFrame.y} onChange={(event) => updateFrame(selectedFrame.id, { y: parseInt(event.target.value, 10) || 0 })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" label="Largeur" value={selectedFrame.width} onChange={(event) => updateFrame(selectedFrame.id, { width: parseInt(event.target.value, 10) || 50 })} />
                    <Input type="number" label="Hauteur" value={selectedFrame.height} onChange={(event) => updateFrame(selectedFrame.id, { height: parseInt(event.target.value, 10) || 20 })} />
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem value="appearance" title="Apparence">
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Police</label>
                    <select className="form-select" value={selectedFrame.font_family || 'Arial'} onChange={(event) => updateFrame(selectedFrame.id, { font_family: event.target.value })}>
                      {fontFamilies.map((family) => (
                        <option key={family.value} value={family.value}>{family.label}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    type="number"
                    label="Taille Police (px)"
                    value={selectedFrame.font_size}
                    onChange={(event) => updateFrame(selectedFrame.id, { font_size: parseInt(event.target.value, 10) || 12 })}
                  />
                </div>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => duplicateFrame(selectedFrame)}>
                <Copy size={16} /> Dupliquer le champ
              </Button>
              <Button variant="danger" size="sm" className="w-full gap-2" onClick={() => deleteFrame(selectedFrame.id)}>
                <Trash2 size={16} /> Supprimer le champ
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <p className="mb-2 text-sm font-semibold text-slate-500">Tous les champs ({frames.length})</p>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Rechercher un champ..."
                value={frameSearch}
                onChange={(event) => setFrameSearch(event.target.value)}
                className="form-input text-sm !py-1.5"
              />
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {filteredFrames.map((frame) => (
                <div
                  key={frame.id}
                  className={`group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                    frame.enabled
                      ? 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'
                      : 'border-slate-200 bg-slate-50 opacity-60 hover:border-blue-400 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedFrame(frame)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Type size={14} className="shrink-0 text-slate-400" />
                    <div className="overflow-hidden">
                      <span className="block truncate text-sm font-medium">{frame.label}</span>
                      <span className="block truncate text-[10px] text-slate-400">
                        {frameTypes.find((type) => type.value === frame.frame_type)?.label || frame.frame_type}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`rounded-md p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 ${frame.enabled ? 'text-green-600' : 'text-slate-400'}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      updateFrame(frame.id, { enabled: !frame.enabled })
                    }}
                  >
                    {frame.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              ))}
              {filteredFrames.length === 0 && frameSearch && <p className="py-4 text-center text-sm text-muted">Aucun champ trouve</p>}
            </div>
            <p className="mt-4 text-center text-xs text-muted">Selectionnez un champ pour le modifier.</p>
          </div>
        )}
      </div>
    </div>
  )
}
