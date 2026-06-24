// Describes the shape of every entity in the dataset so bad data gets caught early.
import { z } from 'zod'

// Each schema mirrors a sheet's columns from the source xlsx exactly.

const YN = z.enum(['Y', 'N'])

export const ArchetypeSchema = z.object({
  archetype_id: z.string(),
  archetype_name: z.string(),
  meta_tags: z.string().nullable(),
  notes: z.string().nullable(),
})

export const CompanySchema = z.object({
  company_id: z.string(),
  company_name: z.string(),
  archetype_id: z.string(),
  use_as_named_brand: YN.nullable(),
  notes: z.string().nullable(),
})

export const FeatureSchema = z.object({
  feature_id: z.string(),
  feature_name: z.string(),
  archetype_id: z.string(),
  company_id: z.string().nullable(),
  scope: z.string().nullable(),
  notes: z.string().nullable(),
})

export const MetricSchema = z.object({
  metric_id: z.string(),
  metric_name: z.string(),
  archetype_id: z.string(),
  level: z.string(),
  direction_bad: z.string(),
  notes: z.string().nullable(),
  growable: YN,
  aarrr: YN,
})

export const SegmentSchema = z.object({
  segment_id: z.string(),
  segment_name: z.string(),
  scope: z.string(),
  archetype_id: z.string().nullable(),
  notes: z.string().nullable(),
})

export const GenericProductSchema = z.object({
  generic_id: z.string(),
  generic_product: z.string(),
  archetype_id: z.string(),
  notes: z.string().nullable(),
})

export const BinTemplateSchema = z.object({
  bin: z.string(),
  bin_name: z.string(),
  template_id: z.string(),
  template_string: z.string(),
  variables_used: z.string().nullable(),
  compatibility_rules: z.string().nullable(),
})

export const DatasetSchema = z.object({
  archetypes: z.array(ArchetypeSchema),
  companies: z.array(CompanySchema),
  features: z.array(FeatureSchema),
  metrics: z.array(MetricSchema),
  segments: z.array(SegmentSchema),
  genericProducts: z.array(GenericProductSchema),
  binTemplates: z.array(BinTemplateSchema),
})

export type Archetype = z.infer<typeof ArchetypeSchema>
export type Company = z.infer<typeof CompanySchema>
export type Feature = z.infer<typeof FeatureSchema>
export type Metric = z.infer<typeof MetricSchema>
export type Segment = z.infer<typeof SegmentSchema>
export type GenericProduct = z.infer<typeof GenericProductSchema>
export type BinTemplate = z.infer<typeof BinTemplateSchema>
export type Dataset = z.infer<typeof DatasetSchema>
