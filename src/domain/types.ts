// The core types used across the whole app: BinId, Prompt, and GenContext.
import type { Dataset } from '../data/schema'
import type { Rng } from './rng'

export type BinId = 'improve' | 'design' | 'measure' | 'grow' | 'diagnose'

export interface Prompt {
  bin: BinId
  label: string
  archetype: string
  text: string
  subject: string
  hint: string[]
}

export interface GenContext {
  data: Dataset
  rng: Rng
  lastSubject?: string
}
