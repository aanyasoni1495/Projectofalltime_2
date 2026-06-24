import { useRef, useEffect, useState, type CSSProperties, type RefObject } from 'react'

interface SessionPanelProps {
  dealtCount: number
  elapsed: number
  binLabel: string
  open: boolean
  onToggle: () => void
  topAnchorRef: RefObject<HTMLElement | null>
  bottomAnchorRef: RefObject<HTMLElement | null>
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  return `${m}m`
}

export function SessionPanel({ dealtCount, elapsed, binLabel, open, onToggle, topAnchorRef, bottomAnchorRef }: SessionPanelProps) {
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
            <div className="panel-title">Session</div>
          </div>
          <span className={`popup-chevron${open ? ' open' : ''}`} aria-hidden="true">›</span>
        </div>
      </button>
      {open && (
        <div className="popup-pane" style={style} role="dialog" aria-label="Session stats">
          <div className="panel-title">Session</div>
          <div className="session-stats">
            <div className="session-stats-row">
              <div className="session-stat">
                <div className="stat-label">Dealt</div>
                <div className="stat-value">{dealtCount}</div>
              </div>
              <div className="session-stat">
                <div className="stat-label">Elapsed</div>
                <div className="stat-value">{formatElapsed(elapsed)}</div>
              </div>
            </div>
            <div className="session-stat">
              <div className="stat-label">Category</div>
              <div className="stat-value stat-value--sm">{binLabel}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
