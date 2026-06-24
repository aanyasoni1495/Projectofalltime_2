// Hooks the timer state machine up to React so it ticks on an interval.
import { useCallback, useEffect, useState } from 'react'
import {
  makeTimer,
  pause,
  resume,
  setDuration,
  start,
  stop,
  tick,
  type TimerState,
} from '../../domain/timerMachine'

export interface TimerApi {
  state: TimerState
  minutes: number
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  step: (delta: number) => void
}

const MIN = 5
const MAX = 60
const STEP = 5

// React wiring around the pure timer machine; owns the one-second interval.
export function useTimer(initialMinutes = 15): TimerApi {
  const [state, setState] = useState<TimerState>(() => makeTimer(initialMinutes))

  useEffect(() => {
    if (state.phase !== 'live') return
    const id = setInterval(() => setState((s) => tick(s)), 1000)
    return () => clearInterval(id)
  }, [state.phase])

  const step = useCallback((delta: number) => {
    setState((s) => {
      const next = Math.min(MAX, Math.max(MIN, s.totalSeconds / 60 + delta * STEP))
      return setDuration(s, next)
    })
  }, [])

  return {
    state,
    minutes: Math.round(state.totalSeconds / 60),
    start: useCallback(() => setState((s) => start(s)), []),
    pause: useCallback(() => setState((s) => pause(s)), []),
    resume: useCallback(() => setState((s) => resume(s)), []),
    stop: useCallback(() => setState((s) => stop(s)), []),
    step,
  }
}
