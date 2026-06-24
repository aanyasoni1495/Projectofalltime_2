// Checks that the design bin always produces valid, well-formed prompts.
import { describe, it, expect } from 'vitest'
import { dataset } from '../src/data/dataset'
import { makeRng } from '../src/domain/rng'
import { design } from '../src/domain/bins/design'
import type { GenContext } from '../src/domain/types'

function ctx(seed: number): GenContext {
  return { data: dataset, rng: makeRng(seed) }
}

const companyNames = new Set(dataset.companies.map((c) => c.company_name))
const genericNames = new Set(dataset.genericProducts.map((g) => g.generic_product))
const segmentNames = new Set(dataset.segments.map((s) => s.segment_name))

describe('design bin', () => {
  it('generates a valid Prompt with bin=design and CIRCLES hint', () => {
    const p = design.generate(ctx(3))
    expect(p.bin).toBe('design')
    expect(p.hint).toBe('CIRCLES')
    expect(p.text.startsWith('Design ')).toBe(true)
  })

  it('T2a: generic_product exists and segment is compatible', () => {
    for (let seed = 0; seed < 200; seed++) {
      const p = design.generate(ctx(seed))
      if (p.text.includes("'s ")) continue
      const tail = p.text.replace(/^Design /, '').replace(/\.$/, '')
      const [product, segName] = tail.split(' for ')
      expect(genericNames.has(product)).toBe(true)
      expect(p.subject).toBe(product)
      const seg = dataset.segments.find((s) => s.segment_name === segName)
      expect(seg).toBeDefined()
    }
  })

  it("T2b: feature.archetype_id === company.archetype_id", () => {
    for (let seed = 0; seed < 200; seed++) {
      const p = design.generate(ctx(seed))
      if (!p.text.includes("'s ")) continue
      expect(companyNames.has(p.subject)).toBe(true)
      const tail = p.text.replace(/^Design /, '').replace(/\.$/, '')
      const [ownerPart, segName] = tail.split(' for ')
      const featureName = ownerPart.replace(`${p.subject}'s `, '')
      const company = dataset.companies.find((c) => c.company_name === p.subject)
      const feature = dataset.features.find((f) => f.feature_name === featureName)
      expect(feature?.archetype_id).toBe(company?.archetype_id)
      expect(segmentNames.has(segName)).toBe(true)
    }
  })
})
