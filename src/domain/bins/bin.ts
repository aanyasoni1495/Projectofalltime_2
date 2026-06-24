// The shared Bin interface and a couple of small helpers all five bins use.
import type { BinId, GenContext, Prompt } from '../types'

export interface Bin {
  id: BinId
  label: string
  hint: string[]
  generate(ctx: GenContext): Prompt
}

export function pickArchetypeId(ctx: GenContext): string {
  return ctx.rng.pick(ctx.data.archetypes).archetype_id
}

export function pickArchetype(ctx: GenContext): { id: string; name: string } {
  const a = ctx.rng.pick(ctx.data.archetypes)
  return { id: a.archetype_id, name: a.archetype_name }
}

export function capFirst(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
