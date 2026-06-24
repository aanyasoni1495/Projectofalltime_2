import { useRef, useEffect } from 'react'
import type { BinId } from '../../domain/types'

interface HintCardProps {
  hint: string[]
  bin?: BinId
  open: boolean
  onToggle: () => void
}

function drawCardBack(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = canvas.offsetWidth
  const h = canvas.offsetHeight
  if (w === 0 || h === 0) return

  canvas.width = w
  canvas.height = h

  // White background (original hint card colour)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  // Seeded PRNG for consistent layout
  let seed = 7919
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff
    return seed / 0x7fffffff
  }

  // 12 letters of "ShuffleSense" spread across a 3×4 grid
  const letters = 'ShuffleSense'.split('')
  const cols = 3
  const rows = 4
  const cellW = w / cols
  const cellH = h / rows
  // Letter size fills ~80–95% of the smaller cell dimension
  const baseSize = Math.min(cellW, cellH)
  ctx.fillStyle = '#0A0A0A'

  letters.forEach((ch, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const size = baseSize * (1.1 + rng() * 0.2)
    // Pull f, e, n toward the left side
    const leftPull = 'fen'.includes(ch.toLowerCase()) ? -cellW * 0.3 : 0
    const x = cellW * (col + 0.5) + (rng() - 0.5) * cellW * 0.35 + leftPull
    const y = cellH * (row + 0.65) + (rng() - 0.5) * cellH * 0.3
    const angle = (-18 + rng() * 36) * (Math.PI / 180)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.font = `900 ${size}px "Arial Black", "Helvetica Neue", Arial, sans-serif`
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
}

export function HintCard({ hint, bin, open, onToggle }: HintCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const showCircles = bin === 'improve' || bin === 'design'

  useEffect(() => {
    if (canvasRef.current) drawCardBack(canvasRef.current)
  }, [])

  return (
    <div className="hint-card-wrap" onClick={onToggle}>
      <div className={`hint-card-inner${open ? ' flipped' : ''}`}>

        {/* Front face: canvas-based CAH card back */}
        <div className="hint-card-face hint-card-front">
          <canvas ref={canvasRef} className="hint-card-canvas" />
        </div>

        {/* Back face: hint content */}
        <div className="hint-card-face hint-card-back">
          <div className="hint-body">
            {hint.length === 0 ? (
              <p className="hint-empty">no hints here :)</p>
            ) : (
              <>
                {showCircles && <p className="hint-framework-label">CIRCLES:</p>}
                <ol className="hint-steps">
                  {hint.map((step, i) => (
                    <li key={i} className="hint-step">
                      <span className="hint-num">{i + 1}</span>
                      <span className="hint-step-text">
                        {showCircles ? (
                          <><strong>{step[0]}</strong>{step.slice(1)}</>
                        ) : step}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
