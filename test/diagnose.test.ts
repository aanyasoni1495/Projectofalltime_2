// Checks that the diagnose bin always produces valid, well-formed prompts.
import { describe, it, expect } from 'vitest'
import { dataset } from '../src/data/dataset'
import { makeRng } from '../src/domain/rng'
import { diagnose } from '../src/domain/bins/diagnose'
import type { GenContext } from '../src/domain/types'

function ctx(seed: number): GenContext {
  return { data: dataset, rng: makeRng(seed) }
}

describe('diagnose bin', () => {
  it('text ends with "Where do you look?"', () => {
    const p = diagnose.generate(ctx(5))
    expect(p.bin).toBe('diagnose')
    expect(p.hint).toBe('Internal vs. External')
    expect(p.text.endsWith('Where do you look?')).toBe(true)
  })

  it('X is between 5 and 30 inclusive', () => {
    for (let seed = 0; seed < 300; seed++) {
      const p = diagnose.generate(ctx(seed))
      const match = p.text.match(/(\d+)%/)
      expect(match).not.toBeNull()
      const x = Number(match?.[1])
      expect(x).toBeGreaterThanOrEqual(5)
      expect(x).toBeLessThanOrEqual(30)
    }
  })

  it('uses a direction word and references a company', () => {
    const names = new Set(dataset.companies.map((c) => c.company_name))
    for (let seed = 0; seed < 50; seed++) {
      const p = diagnose.generate(ctx(seed))
      expect(names.has(p.subject)).toBe(true)
      expect(/DROPPED|SPIKED/.test(p.text)).toBe(true)
    }
  })
})
