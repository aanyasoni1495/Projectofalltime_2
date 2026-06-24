// Peeks at what the next prompt will be before you deal it.
import type { Prompt } from '../../domain/types'

interface NextUpPanelProps {
  prompt: Prompt | null
}

export function NextUpPanel({ prompt }: NextUpPanelProps) {
  return (
    <div className="panel">
      <div className="panel-title">Next Up</div>
      <p className="next-up-text">{prompt?.text ?? ''}</p>
    </div>
  )
}
