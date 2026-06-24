// Checks that the improve bin always produces valid, well-formed prompts.
import { describe, it, expect } from 'vitest'
import { dataset } from '../src/data/dataset'
import { makeRng } from '../src/domain/rng'
import { improve } from '../src/domain/bins/improve'
import type { GenContext } from '../src/domain/types'

function ctx(seed: number): GenContext {
  return { data: dataset, rng: makeRng(seed) }
}

const companyNames = new Set(dataset.companies.map((c) => c.company_name))
const featureNames = new Set(dataset.features.map((f) => f.feature_name))
const segmentNames = new Set(dataset.segments.map((s) => s.segment_name))

// Splits "Improve X for Y." on the LAST " for " so feature names that
// themselves contain " for " stay intact.
function splitImprove(text: string): [string, string] {
  const body = text.replace(/^Improve /, '').replace(/\.$/, '')
  const idx = body.lastIndexOf(' for ')
  return [body.slice(0, idx), body.slice(idx + ' for '.length)]
}

describe('improve bin', () => {
  it('generates a valid Prompt with bin=improve', () => {
    const p = improve.generate(ctx(1))
    expect(p.bin).toBe('improve')
    expect(p.hint).toBe('CIRCLES')
    expect(p.text.startsWith('Improve ')).toBe(true)
    expect(companyNames.has(p.subject)).toBe(true)
  })

  it('every generated prompt references real entities (both variants)', () => {
    for (let seed = 0; seed < 200; seed++) {
      const p = improve.generate(ctx(seed))
      expect(companyNames.has(p.subject)).toBe(true)
      const [head, after] = splitImprove(p.text)
      expect(after).toBeTruthy()
      if (head === p.subject) {
        expect(segmentNames.has(after)).toBe(true)
      } else {
        expect(featureNames.has(head)).toBe(true)
        expect(after).toBe(p.subject)
      }
    }
  })

  it('T1a: chosen feature shares the company archetype', () => {
    for (let seed = 0; seed < 200; seed++) {
      const p = improve.generate(ctx(seed))
      const [head, after] = splitImprove(p.text)
      if (after !== p.subject) continue
      const company = dataset.companies.find((c) => c.company_name === p.subject)
      const feature = dataset.features.find((f) => f.feature_name === head)
      expect(feature?.archetype_id).toBe(company?.archetype_id)
    }
  })

  it('T1b: segment is compatible with the company archetype', () => {
    for (let seed = 0; seed < 200; seed++) {
      const p = improve.generate(ctx(seed))
      const [head, after] = splitImprove(p.text)
      if (head !== p.subject) continue
      const company = dataset.companies.find((c) => c.company_name === p.subject)
      const segment = dataset.segments.find((s) => s.segment_name === after)
      expect(segment).toBeDefined()
      const ok =
        segment?.scope === 'universal' ||
        segment?.archetype_id === company?.archetype_id
      expect(ok).toBe(true)
    }
  })
})
