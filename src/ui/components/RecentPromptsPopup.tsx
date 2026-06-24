import { useState, useRef, useEffect, type CSSProperties, type RefObject } from 'react'
import type { Prompt } from '../../domain/types'

interface RecentPromptsPopupProps {
  prompts: Prompt[]
  open: boolean
  onToggle: () => void
  topAnchorRef: RefObject<HTMLElement | null>
  bottomAnchorRef: RefObject<HTMLElement | null>
}

export function RecentPromptsPopup({ prompts, open, onToggle, topAnchorRef, bottomAnchorRef }: RecentPromptsPopupProps) {
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
            <div className="panel-title">Recent Prompts</div>
          </div>
          <span className={`popup-chevron${open ? ' open' : ''}`} aria-hidden="true">›</span>
        </div>
      </button>
      {open && (
        <div className="popup-pane" style={style} role="dialog" aria-label="Recent prompts">
          <div className="panel-title">Recent Prompts</div>
          {prompts.length === 0 ? (
            <p className="panel-empty">No prompts yet — deal a card!</p>
          ) : (
            <ul className="recent-list">
              {prompts.map((p, i) => (
                <li key={i} className="recent-item">{p.text}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
