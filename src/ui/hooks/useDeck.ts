// Manages which bins are active, deals prompts, and keeps track of recent history.
import { useCallback, useEffect, useRef, useState } from 'react'
import { dataset } from '../../data/dataset'
import { makeRng, type Rng } from '../../domain/rng'
import { generate } from '../../domain/generate'
import { binOrder } from '../../domain/bins'
import type { BinId, Prompt } from '../../domain/types'

export interface DeckApi {
  activeBins: BinId[]
  prompt: Prompt | null
  nextPrompt: Prompt | null
  order: BinId[]
  dealtCount: number
  recentPrompts: Prompt[]
  toggleBin: (bin: BinId) => void
  deal: () => void
}

export function useDeck(seed?: number): DeckApi {
  const [rng] = useState<Rng>(() => makeRng(seed ?? Date.now()))
  const lastSubjectRef = useRef<string | undefined>(undefined)
  const nextPromptRef = useRef<Prompt | null>(null)

  const [activeBins, setActiveBins] = useState<BinId[]>(['improve'])
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [nextPrompt, setNextPrompt] = useState<Prompt | null>(null)
  const [dealtCount, setDealtCount] = useState(0)
  const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([])

  useEffect(() => {
    const first = generate({ data: dataset, rng, lastSubject: undefined }, 'improve')
    nextPromptRef.current = first
    setNextPrompt(first)
  }, [rng])

  const advance = useCallback(
    (bins: BinId[]) => {
      const pre = nextPromptRef.current
      const targetBin = rng.pick(bins)
      const current =
        pre && bins.includes(pre.bin)
          ? pre
          : generate({ data: dataset, rng, lastSubject: lastSubjectRef.current }, targetBin)

      lastSubjectRef.current = current.subject
      const nextBin = rng.pick(bins)
      const upcoming = generate({ data: dataset, rng, lastSubject: current.subject }, nextBin)

      nextPromptRef.current = upcoming
      setPrompt(current)
      setNextPrompt(upcoming)
      setDealtCount((c) => c + 1)
      setRecentPrompts((prev) => [current, ...prev].slice(0, 50))
    },
    [rng],
  )

  const toggleBin = useCallback(
    (id: BinId) => {
      setActiveBins((prev) => {
        if (prev.includes(id) && prev.length === 1) return prev
        return prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
      })
    },
    [],
  )

  const deal = useCallback(() => advance(activeBins), [activeBins, advance])

  return { activeBins, prompt, nextPrompt, order: binOrder, dealtCount, recentPrompts, toggleBin, deal }
}
