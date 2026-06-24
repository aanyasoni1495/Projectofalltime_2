// The question card and hint card sit side by side. Clicking the hint card flips it.
import { PromptCard } from './PromptCard'
import { HintCard } from './HintCard'
import type { Prompt } from '../../domain/types'

interface StageGroupProps {
  prompt: Prompt | null
  dealKey: number
  hintOpen: boolean
  onToggleHint: () => void
}

export function StageGroup({ prompt, dealKey, hintOpen, onToggleHint }: StageGroupProps) {
  return (
    <div key={dealKey} className="stage-group">
      <PromptCard prompt={prompt} />
      <HintCard hint={prompt?.hint ?? []} open={hintOpen} onToggle={onToggleHint} bin={prompt?.bin} />
    </div>
  )
}
