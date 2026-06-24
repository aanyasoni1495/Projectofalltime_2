// Generates "grow metric X for product/feature Y" prompts.
import type { GenContext, Prompt } from '../types'
import type { Metric } from '../../data/schema'
import {
  archetypeCompanies,
  compatibleFeatureForCompany,
  growableMetrics,
} from '../selectors'
import { pickArchetype, capFirst, type Bin } from './bin'

const LABEL = 'Grow'
const HINT = [
  'Define what the stage means for this product.',
  "Find the leak - why aren't users converting at this stage today?",
  'Brainstorm fixes for that stage.',
  'Pick the highest-impact fix.',
  "Name the specific metric you'd move.",
]

function preferAarrr(metrics: Metric[]): Metric[] {
  const aarrr = metrics.filter((m) => m.aarrr === 'Y')
  return aarrr.length > 0 ? aarrr : metrics
}

function variantA(ctx: GenContext, archetypeId: string, archetypeName: string): Prompt {
  const company = ctx.rng.pick(archetypeCompanies(ctx.data, archetypeId))
  const pool = preferAarrr(growableMetrics(ctx.data, archetypeId, 'product'))
  const metric = ctx.rng.pick(pool)
  return {
    bin: 'grow',
    label: LABEL,
    archetype: archetypeName,
    text: capFirst(`grow ${metric.metric_name.toLowerCase()} for ${company.company_name.toLowerCase()}.`),
    subject: company.company_name,
    hint: HINT,
  }
}

function variantB(ctx: GenContext, archetypeId: string, archetypeName: string): Prompt {
  const company = ctx.rng.pick(archetypeCompanies(ctx.data, archetypeId))
  const feature = ctx.rng.pick(compatibleFeatureForCompany(ctx.data, company))
  const metric = ctx.rng.pick(growableMetrics(ctx.data, archetypeId, 'feature'))
  return {
    bin: 'grow',
    label: LABEL,
    archetype: archetypeName,
    text: capFirst(`grow ${metric.metric_name.toLowerCase()} for ${company.company_name.toLowerCase()}'s ${feature.feature_name.toLowerCase()}.`),
    subject: company.company_name,
    hint: HINT,
  }
}

export const grow: Bin = {
  id: 'grow',
  label: LABEL,
  hint: HINT,
  generate(ctx) {
    const { id: archetypeId, name: archetypeName } = pickArchetype(ctx)
    return ctx.rng.next() < 0.5
      ? variantA(ctx, archetypeId, archetypeName)
      : variantB(ctx, archetypeId, archetypeName)
  },
}
