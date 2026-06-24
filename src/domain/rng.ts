// A seedable random number generator so prompt picks are reproducible.

export type Rng = {
  next(): number
  nextInt(min: number, max: number): number
  pick<T>(arr: readonly T[]): T
}

export function makeRng(seed: number): Rng {
  let state = seed >>> 0

  // Returns a float in [0, 1).
  function next(): number {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  // Returns an integer in [min, max] inclusive.
  function nextInt(min: number, max: number): number {
    return min + Math.floor(next() * (max - min + 1))
  }

  function pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('Rng.pick called on empty array')
    return arr[nextInt(0, arr.length - 1)] as T
  }

  return { next, nextInt, pick }
}
