import { useState, createContext, useContext, useRef, useEffect, useId } from 'react'
import { ChevronDown } from 'lucide-react'

const AccordionContext = createContext({})

export function Accordion({ children, value, onValueChange, defaultValue, type = "single", className = "" }) {
    const [internalValue, setInternalValue] = useState(defaultValue || (type === "single" ? "" : []))

    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue

    const handleValueChange = (itemValue) => {
        const nextValue = (() => {
            if (type === "single") {
                return currentValue === itemValue ? "" : itemValue
            }

            const values = Array.isArray(currentValue) ? currentValue : []
            if (values.includes(itemValue)) {
                return values.filter(v => v !== itemValue)
            }
            return [...values, itemValue]
        })()

        if (isControlled) {
            onValueChange?.(nextValue)
        } else {
            setInternalValue(nextValue)
        }
    }

    return (
        <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, type }}>
            <div className={`space-y-2 ${className}`}>
                {children}
            </div>
        </AccordionContext.Provider>
    )
}

export function AccordionItem({ value: itemValue, title, children, className = "" }) {
    const { value, onValueChange, type } = useContext(AccordionContext)
    const isOpen = type === "single" ? value === itemValue : Array.isArray(value) && value.includes(itemValue)
    const contentRef = useRef(null)
    const triggerId = useId()
    const contentId = useId()
    const [height, setHeight] = useState(0)
    const [overflow, setOverflow] = useState('hidden')

    useEffect(() => {
        if (isOpen && contentRef.current) {
            const contentEl = contentRef.current
            setHeight(contentEl.scrollHeight)
            const timer = setTimeout(() => setOverflow('visible'), 300)

            const observer = typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => {
                    setHeight(contentEl.scrollHeight)
                })
                : null

            observer?.observe(contentEl)

            return () => {
                clearTimeout(timer)
                observer?.disconnect()
            }
        } else {
            setOverflow('hidden')
            setHeight(0)
        }
    }, [isOpen])

    return (
        <div className={`bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/70 transition-all duration-200 ${isOpen ? 'ring-2 ring-blue-500/15 border-blue-200 dark:border-blue-800/50 shadow-sm' : 'hover:border-slate-300 dark:hover:border-slate-600'} ${className}`}>
            <button
                type="button"
                onClick={() => onValueChange(itemValue)}
                id={triggerId}
                aria-controls={contentId}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors rounded-xl cursor-pointer group"
            >
                <span className={`font-semibold text-sm transition-colors ${isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{title}</span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`}
                />
            </button>
            <div
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                style={{ height, overflow }}
                className="transition-[height] duration-300 ease-in-out"
            >
                <div ref={contentRef} className="p-4 pt-0 border-t border-transparent">
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
