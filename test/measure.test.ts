// Checks that the measure bin always produces valid, well-formed prompts.
import { describe, it, expect } from 'vitest'
import { dataset } from '../src/data/dataset'
import { makeRng } from '../src/domain/rng'
import { measure } from '../src/domain/bins/measure'
import type { GenContext } from '../src/domain/types'

function ctx(seed: number): GenContext {
  return { data: dataset, rng: makeRng(seed) }
}

describe('measure bin', () => {
  it('text includes "Define the success metrics"', () => {
    const p = measure.generate(ctx(7))
    expect(p.bin).toBe('measure')
    expect(p.hint).toBe('Goal → Signal → Metric')
    expect(p.text.includes('Define the success metrics')).toBe(true)
  })

  it('feature.archetype_id === company.archetype_id', () => {
    for (let seed = 0; seed < 200; seed++) {
      const p = measure.generate(ctx(seed))
      const tail = p.text
        .replace('Define the success metrics for ', '')
        .replace(/\.$/, '')
      const [featureName, companyName] = tail.split(' on ')
      expect(p.subject).toBe(companyName)
      const company = dataset.companies.find((c) => c.company_name === companyName)
      const feature = dataset.features.find((f) => f.feature_name === featureName)
      expect(feature?.archetype_id).toBe(company?.archetype_id)
    }
  })
})
