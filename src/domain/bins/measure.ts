// Generates "define success metrics for X on Y" prompts.
import { pickArchetype, capFirst, type Bin } from './bin'
import { archetypeCompanies, compatibleFeatureForCompany } from '../selectors'

const LABEL = 'Measure'
const HINT = [
  "Identify the feature's goal - what outcome does it exist to drive?",
  'Trace the user journey and pick a metric at each stage - discovery, adoption, engagement, retention.',
  'Choose one north star metric from those.',
  "Add guardrail metrics so the north star can't be gamed.",
]

export const measure: Bin = {
  id: 'measure',
  label: LABEL,
  hint: HINT,
  generate(ctx) {
    const { id: archetypeId, name: archetypeName } = pickArchetype(ctx)
    const company = ctx.rng.pick(archetypeCompanies(ctx.data, archetypeId))
    const feature = ctx.rng.pick(compatibleFeatureForCompany(ctx.data, company))
    return {
      bin: 'measure',
      label: LABEL,
      archetype: archetypeName,
      text: capFirst(`define the success metrics for ${feature.feature_name.toLowerCase()} on ${company.company_name.toLowerCase()}.`),
      subject: company.company_name,
      hint: HINT,
    }
  },
}
