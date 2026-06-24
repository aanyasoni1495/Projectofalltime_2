import { useRef, useEffect, useState, type CSSProperties, type RefObject } from 'react'

const SHORTCUTS = [
  { label: 'Deal card', key: 'Space' },
  { label: 'Show hint', key: 'H' },
  { label: 'Start timer', key: 'P' },
  { label: 'Stop', key: 'S' },
]

interface ShortcutsPanelProps {
  open: boolean
  onToggle: () => void
  topAnchorRef: RefObject<HTMLElement | null>
  bottomAnchorRef: RefObject<HTMLElement | null>
}

export function ShortcutsPanel({ open, onToggle, topAnchorRef, bottomAnchorRef }: ShortcutsPanelProps) {
  const [style, setStyle] = useState<CSSProperties>({})
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open || !btnRef.current || !topAnchorRef.current || !bottomAnchorRef.current) return
    const top = topAnchorRef.current.getBoundingClientRect().top
    const bottomAnchor = bottomAnchorRef.current.getBoundingClientRect().bottom
    const left = btnRef.current.getBoundingClientRect().right + 12
    setStyle({ top, bottom: window.innerHeight - bottomAnchor, left })
  }, [open, topAnchorRef, bottomAnchorRef])

  return (
    <div className="popup-anchor">
      <button
        ref={btnRef}
        type="button"
        className="panel popup-trigger-btn"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div className="popup-trigger-row">
          <div>
            <div className="panel-title">Keyboard Shortcuts</div>
          </div>
          <span className={`popup-chevron${open ? ' open' : ''}`} aria-hidden="true">›</span>
        </div>
      </button>
      {open && (
        <div className="popup-pane" style={style} role="dialog" aria-label="Keyboard shortcuts">
          <div className="panel-title">Keyboard Shortcuts</div>
          <div className="shortcuts-list">
            {SHORTCUTS.map(({ label, key }) => (
              <div key={key} className="shortcut-row">
                <span className="shortcut-label">{label}</span>
                <kbd className="shortcut-key">{key}</kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
