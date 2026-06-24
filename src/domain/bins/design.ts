// Generates "design X for Y" prompts using products, features, and segments.
import type { GenContext, Prompt } from '../types'
import {
  archetypeCompanies,
  archetypeGenericProducts,
  archetypeSegments,
  compatibleFeatureForCompany,
} from '../selectors'
import { pickArchetype, capFirst, type Bin } from './bin'

const LABEL = 'Design'
const HINT = [
  'Comprehend the situation.',
  'Identify the user.',
  'Report their needs.',
  'Cut through prioritization.',
  'List solutions.',
  'Evaluate trade-offs.',
  'Summarise.',
]

function variantA(ctx: GenContext, archetypeId: string, archetypeName: string): Prompt {
  const product = ctx.rng.pick(archetypeGenericProducts(ctx.data, archetypeId))
  const segment = ctx.rng.pick(archetypeSegments(ctx.data, archetypeId))
  return {
    bin: 'design',
    label: LABEL,
    archetype: archetypeName,
    text: capFirst(`design ${product.generic_product.toLowerCase()} for ${segment.segment_name.toLowerCase()}.`),
    subject: product.generic_product,
    hint: HINT,
  }
}

function variantB(ctx: GenContext, archetypeId: string, archetypeName: string): Prompt {
  const company = ctx.rng.pick(archetypeCompanies(ctx.data, archetypeId))
  const feature = ctx.rng.pick(compatibleFeatureForCompany(ctx.data, company))
  const segment = ctx.rng.pick(archetypeSegments(ctx.data, archetypeId))
  return {
    bin: 'design',
    label: LABEL,
    archetype: archetypeName,
    text: capFirst(`design ${company.company_name.toLowerCase()}'s ${feature.feature_name.toLowerCase()} for ${segment.segment_name.toLowerCase()}.`),
    subject: company.company_name,
    hint: HINT,
  }
}

export const design: Bin = {
  id: 'design',
  label: LABEL,
  hint: HINT,
  generate(ctx) {
    const { id: archetypeId, name: archetypeName } = pickArchetype(ctx)
    return ctx.rng.next() < 0.5
      ? variantA(ctx, archetypeId, archetypeName)
      : variantB(ctx, archetypeId, archetypeName)
  },
}
