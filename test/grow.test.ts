// Checks that the grow bin always produces valid, well-formed prompts.
import { describe, it, expect } from 'vitest'
import { dataset } from '../src/data/dataset'
import { makeRng } from '../src/domain/rng'
import { grow } from '../src/domain/bins/grow'
import type { GenContext } from '../src/domain/types'

function ctx(seed: number): GenContext {
  return { data: dataset, rng: makeRng(seed) }
}

const metricByName = new Map(dataset.metrics.map((m) => [m.metric_name, m]))

describe('grow bin', () => {
  it('generates a valid Prompt with AARRR hint', () => {
    const p = grow.generate(ctx(2))
    expect(p.bin).toBe('grow')
    expect(p.hint).toBe('AARRR')
    expect(p.text.startsWith('Grow ')).toBe(true)
  })

  it('T4a: product-level growable metric', () => {
    for (let seed = 0; seed < 300; seed++) {
      const p = grow.generate(ctx(seed))
      if (p.text.includes("'s ")) continue
      const tail = p.text.replace(/^Grow /, '').replace(/\.$/, '')
      const [metricName] = tail.split(' for ')
      const m = metricByName.get(metricName)
      expect(m?.level).toBe('product')
      expect(m?.growable).toBe('Y')
    }
  })

  it('T4b: feature-level growable metric', () => {
    for (let seed = 0; seed < 300; seed++) {
      const p = grow.generate(ctx(seed))
      if (!p.text.includes("'s ")) continue
      const tail = p.text.replace(/^Grow /, '').replace(/\.$/, '')
      const [metricName] = tail.split(' for ')
      const m = metricByName.get(metricName)
      expect(m?.level).toBe('feature')
      expect(m?.growable).toBe('Y')
    }
  })
})
