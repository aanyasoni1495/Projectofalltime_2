// The bottom bar with the deal button, timer display, and play/pause/stop controls.
import type { TimerState } from '../../domain/timerMachine'

interface ConsoleProps {
  timer: TimerState
  minutes: number
  onDeal: () => void
  onStep: (delta: number) => void
  onPlay: () => void
  onPause: () => void
  onStop: () => void
}

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const RUNNING = new Set<TimerState['phase']>(['live', 'paused', 'time'])

function PlayIcon() {
  return (
    <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor" aria-hidden="true">
      <path d="M1 0.5 L8.5 5.5 L1 10.5 Z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor" aria-hidden="true">
      <rect x="1" y="0.5" width="3" height="10" rx="1" />
      <rect x="6" y="0.5" width="3" height="10" rx="1" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="10" height="10" rx="1" />
    </svg>
  )
}

export function Console({ timer, minutes, onDeal, onStep, onPlay, onPause, onStop }: ConsoleProps) {
  const running = RUNNING.has(timer.phase)
  const danger = timer.phase === 'live' && timer.remainingSeconds <= 60
  const numDisplay = running ? clock(timer.remainingSeconds) : String(minutes)
  const playing = timer.phase === 'live'

  return (
    <div className="console">
      <button type="button" className="btn btn-deal" onClick={onDeal}>
        Deal
      </button>

      <div className="console-timer">
        <div className="stepper">
          <button
            type="button"
            className="step"
            aria-label="Decrease minutes"
            onClick={() => onStep(-1)}
            disabled={running}
          >
            −
          </button>
          <span className={`step-value${danger ? ' danger' : ''}`} aria-live="polite">
            <span key={numDisplay} className="step-num">{numDisplay}</span>
            {!running && <span className="step-suffix">mins</span>}
          </span>
          <button
            type="button"
            className="step"
            aria-label="Increase minutes"
            onClick={() => onStep(1)}
            disabled={running}
          >
            +
          </button>
        </div>

        <div className="transport">
          <button
            type="button"
            className={`btn-icon${playing ? ' active' : ''}`}
            aria-label="Play"
            onClick={onPlay}
          >
            <PlayIcon />
          </button>
          <button type="button" className="btn-icon" aria-label="Pause" onClick={onPause}>
            <PauseIcon />
          </button>
          <button type="button" className="btn-icon" aria-label="Stop" onClick={onStop}>
            <StopIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
