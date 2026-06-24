// The main card that shows the question you're supposed to answer.
import { useRef, useLayoutEffect } from 'react'
import type { Prompt } from '../../domain/types'

interface PromptCardProps {
  prompt: Prompt | null
}

const HOW_TO_PLAY = [
  'Pick a category and hit Deal.',
  'Answer out loud before the timer runs out.',
  'Tap Hint if you need a nudge.',
]

export function PromptCard({ prompt }: PromptCardProps) {
  const textRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    el.style.fontSize = ''
    const savedOverflow = el.style.overflow
    el.style.overflow = 'hidden'
    let size = parseFloat(getComputedStyle(el).fontSize)
    while (size > 14 && el.scrollWidth > el.clientWidth) {
      size -= 0.5
      el.style.fontSize = `${size}px`
    }
    el.style.overflow = savedOverflow
  }, [prompt?.text])

  return (
    <article className="prompt-card">
      <div className="prompt-pills">
        <span className="pill pill-deck">{prompt?.label ?? 'Shuffle Sense'}</span>
        {prompt && <span className="pill pill-arch">{prompt.archetype}</span>}
      </div>

      {prompt ? (
        <p className="prompt-text" ref={textRef}>{prompt.text}</p>
      ) : (
        <div className="prompt-how">
          <p className="prompt-how-title">How to play</p>
          <ol className="prompt-how-steps">
            {HOW_TO_PLAY.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      )}

      <div className="prompt-foot">
        <span className="prompt-brand">Shuffle Sense</span>
      </div>
    </article>
  )
}
