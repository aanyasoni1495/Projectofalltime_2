// Helper functions for pulling the right companies, features, and metrics out of the dataset.
import type {
  Company,
  Dataset,
  Feature,
  GenericProduct,
  Metric,
  Segment,
} from '../data/schema'

// Pure dataset queries. No randomness, no side effects.

export function archetypeCompanies(data: Dataset, archetypeId: string): Company[] {
  return data.companies.filter((c) => c.archetype_id === archetypeId)
}

// Features for an archetype (all rows are scope 'feature').
export function archetypeFeatures(data: Dataset, archetypeId: string): Feature[] {
  return data.features.filter((f) => f.archetype_id === archetypeId)
}

// Metrics matching the archetype plus universal 'ALL' metrics.
export function archetypeMetrics(data: Dataset, archetypeId: string): Metric[] {
  return data.metrics.filter(
    (m) => m.archetype_id === archetypeId || m.archetype_id === 'ALL',
  )
}

// Universal segments plus segments locked to this archetype.
export function archetypeSegments(data: Dataset, archetypeId: string): Segment[] {
  return data.segments.filter(
    (s) => s.scope === 'universal' || s.archetype_id === archetypeId,
  )
}

export function archetypeGenericProducts(
  data: Dataset,
  archetypeId: string,
): GenericProduct[] {
  return data.genericProducts.filter((g) => g.archetype_id === archetypeId)
}

// Growable metrics for an archetype, filtered to a level ('product' | 'feature').
export function growableMetrics(
  data: Dataset,
  archetypeId: string,
  level: string,
): Metric[] {
  return archetypeMetrics(data, archetypeId).filter(
    (m) => m.growable === 'Y' && m.level === level,
  )
}

// Features valid for a company: same archetype as the company.
export function compatibleFeatureForCompany(
  data: Dataset,
  company: Company,
): Feature[] {
  return data.features.filter((f) => f.archetype_id === company.archetype_id)
}
