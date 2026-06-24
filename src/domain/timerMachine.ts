// All the timer logic as plain functions with no side effects.

export interface TimerState {
  phase: 'standby' | 'live' | 'paused' | 'time'
  totalSeconds: number
  remainingSeconds: number
}

export function makeTimer(minutes: number): TimerState {
  const total = minutes * 60
  return { phase: 'standby', totalSeconds: total, remainingSeconds: total }
}

export function start(state: TimerState): TimerState {
  return { ...state, phase: 'live', remainingSeconds: state.totalSeconds }
}

export function pause(state: TimerState): TimerState {
  return state.phase === 'live' ? { ...state, phase: 'paused' } : state
}

export function resume(state: TimerState): TimerState {
  return state.phase === 'paused' ? { ...state, phase: 'live' } : state
}

export function stop(state: TimerState): TimerState {
  return { ...state, phase: 'standby', remainingSeconds: state.totalSeconds }
}

// Advances one second while live; reaching zero flips to 'time'.
export function tick(state: TimerState): TimerState {
  if (state.phase !== 'live') return state
  const remaining = Math.max(0, state.remainingSeconds - 1)
  const phase = remaining === 0 ? 'time' : 'live'
  return { ...state, phase, remainingSeconds: remaining }
}

// Changes duration only while standby; keeps remaining synced to total.
export function setDuration(state: TimerState, minutes: number): TimerState {
  if (state.phase !== 'standby') return state
  const total = minutes * 60
  return { ...state, totalSeconds: total, remainingSeconds: total }
}
