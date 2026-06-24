// Generates "metric X dropped Y%, where do you look?" prompts.
import { pickArchetype, capFirst, type Bin } from './bin'
import { archetypeCompanies, archetypeMetrics } from '../selectors'

const LABEL = 'Diagnose'
const HINT = [
  'Check internal causes - did we change something?',
  'Check external causes - did the world change?',
  "Narrow it down - slice the metric by platform, region, or new vs. existing users to see where it's concentrated.",
  "Form your hypotheses, and say what data you'd pull to test each.",
]

export const diagnose: Bin = {
  id: 'diagnose',
  label: LABEL,
  hint: HINT,
  generate(ctx) {
    const { id: archetypeId, name: archetypeName } = pickArchetype(ctx)
    const company = ctx.rng.pick(archetypeCompanies(ctx.data, archetypeId))
    const metric = ctx.rng.pick(archetypeMetrics(ctx.data, archetypeId))
    const pct = ctx.rng.nextInt(5, 30)
    return {
      bin: 'diagnose',
      label: LABEL,
      archetype: archetypeName,
      text: capFirst(`${company.company_name.toLowerCase()}'s ${metric.metric_name.toLowerCase()} ${metric.direction_bad} ${pct}%. Where do you look?`),
      subject: company.company_name,
      hint: HINT,
    }
  },
}
