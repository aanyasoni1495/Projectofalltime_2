// Makes sure the dataset query helpers return the right rows.
import { describe, it, expect } from 'vitest'
import { dataset } from '../src/data/dataset'
import {
  archetypeCompanies,
  archetypeFeatures,
  archetypeSegments,
  growableMetrics,
} from '../src/domain/selectors'

const ARCH = 'A01'

describe('selectors', () => {
  it('archetypeCompanies returns only companies for that archetype', () => {
    const result = archetypeCompanies(dataset, ARCH)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((c) => c.archetype_id === ARCH)).toBe(true)
  })

  it('archetypeFeatures returns features matching the archetype', () => {
    const result = archetypeFeatures(dataset, ARCH)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((f) => f.archetype_id === ARCH)).toBe(true)
  })

  it('archetypeSegments returns universal + archetype-locked matching segments', () => {
    const result = archetypeSegments(dataset, ARCH)
    expect(result.length).toBeGreaterThan(0)
    expect(
      result.every(
        (s) => s.scope === 'universal' || s.archetype_id === ARCH,
      ),
    ).toBe(true)
    expect(result.some((s) => s.scope === 'universal')).toBe(true)
  })

  it('growableMetrics returns only growable=Y metrics at the given level', () => {
    const result = growableMetrics(dataset, ARCH, 'product')
    expect(result.length).toBeGreaterThan(0)
    expect(
      result.every((m) => m.growable === 'Y' && m.level === 'product'),
    ).toBe(true)
  })
})
