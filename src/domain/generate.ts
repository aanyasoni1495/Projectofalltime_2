// Generates a prompt for the active bin, trying not to repeat the last one.
import type { BinId, GenContext, Prompt } from './types'
import { bins } from './bins'

const MAX_REROLLS = 10

// Generates a prompt for a bin, avoiding repeating the last subject when possible.
export function generate(ctx: GenContext, binId: BinId): Prompt {
  const bin = bins[binId]
  let prompt = bin.generate(ctx)
  let attempts = 0
  while (
    ctx.lastSubject !== undefined &&
    prompt.subject === ctx.lastSubject &&
    attempts < MAX_REROLLS
  ) {
    prompt = bin.generate(ctx)
    attempts++
  }
  return prompt
}
