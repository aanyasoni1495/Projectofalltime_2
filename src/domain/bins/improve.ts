// Generates "improve X for Y" prompts using real companies and features.
import type { GenContext, Prompt } from '../types'
import {
  archetypeCompanies,
  archetypeSegments,
  compatibleFeatureForCompany,
} from '../selectors'
import { pickArchetype, capFirst, type Bin } from './bin'

const LABEL = 'Improve'
const HINT = [
  'Comprehend the situation.',
  'Identify the user.',
  'Report their needs.',
  'Cut through prioritization.',
  'List solutions.',
  'Evaluate trade-offs.',
  'Summarize.',
]

function variantA(ctx: GenContext, archetypeId: string, archetypeName: string): Prompt {
  const company = ctx.rng.pick(archetypeCompanies(ctx.data, archetypeId))
  const candidates = compatibleFeatureForCompany(ctx.data, company).filter(
    (f) => f.company_id === null || f.company_id === company.company_id,
  )
  const feature = ctx.rng.pick(candidates)
  return {
    bin: 'improve',
    label: LABEL,
    archetype: archetypeName,
    text: capFirst(`improve ${feature.feature_name.toLowerCase()} for ${company.company_name.toLowerCase()}.`),
    subject: company.company_name,
    hint: HINT,
  }
}

function variantB(ctx: GenContext, archetypeId: string, archetypeName: string): Prompt {
  const company = ctx.rng.pick(archetypeCompanies(ctx.data, archetypeId))
  const segment = ctx.rng.pick(archetypeSegments(ctx.data, archetypeId))
  return {
    bin: 'improve',
    label: LABEL,
    archetype: archetypeName,
    text: capFirst(`improve ${company.company_name.toLowerCase()} for ${segment.segment_name.toLowerCase()}.`),
    subject: company.company_name,
    hint: HINT,
  }
}

export const improve: Bin = {
  id: 'improve',
  label: LABEL,
  hint: HINT,
  generate(ctx) {
    const { id: archetypeId, name: archetypeName } = pickArchetype(ctx)
    return ctx.rng.next() < 0.5
      ? variantA(ctx, archetypeId, archetypeName)
      : variantB(ctx, archetypeId, archetypeName)
  },
}
