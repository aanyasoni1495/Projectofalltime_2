// Makes sure the timer moves through all its phases correctly.
import { describe, it, expect } from 'vitest'
import {
  makeTimer,
  start,
  pause,
  resume,
  stop,
  tick,
  setDuration,
} from '../src/domain/timerMachine'

describe('timerMachine', () => {
  it('start: standby -> live', () => {
    const t = start(makeTimer(15))
    expect(t.phase).toBe('live')
    expect(t.remainingSeconds).toBe(15 * 60)
  })

  it('pause: live -> paused', () => {
    const t = pause(start(makeTimer(15)))
    expect(t.phase).toBe('paused')
  })

  it('resume: paused -> live', () => {
    const t = resume(pause(start(makeTimer(15))))
    expect(t.phase).toBe('live')
  })

  it('stop: live -> standby', () => {
    const t = stop(start(makeTimer(15)))
    expect(t.phase).toBe('standby')
    expect(t.remainingSeconds).toBe(15 * 60)
  })

  it('stop: paused -> standby', () => {
    const t = stop(pause(start(makeTimer(15))))
    expect(t.phase).toBe('standby')
  })

  it('tick decrements remainingSeconds', () => {
    const t = tick(start(makeTimer(15)))
    expect(t.remainingSeconds).toBe(15 * 60 - 1)
    expect(t.phase).toBe('live')
  })

  it('tick at 1 reaching 0 transitions to time', () => {
    let t = makeTimer(15)
    t = start(t)
    t = { ...t, remainingSeconds: 1 }
    t = tick(t)
    expect(t.remainingSeconds).toBe(0)
    expect(t.phase).toBe('time')
  })

  it('tick does nothing when not live', () => {
    const t = tick(makeTimer(15))
    expect(t.phase).toBe('standby')
    expect(t.remainingSeconds).toBe(15 * 60)
  })

  it('setDuration updates total and remaining when standby', () => {
    const t = setDuration(makeTimer(15), 30)
    expect(t.totalSeconds).toBe(30 * 60)
    expect(t.remainingSeconds).toBe(30 * 60)
  })
})
