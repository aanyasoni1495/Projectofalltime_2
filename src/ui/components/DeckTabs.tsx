// The row of tabs for switching between the five question bins (multi-select).
import type { BinId } from '../../domain/types'
import { bins } from '../../domain/bins'

interface DeckTabsProps {
  order: BinId[]
  activeBins: BinId[]
  onToggle: (bin: BinId) => void
}

export function DeckTabs({ order, activeBins, onToggle }: DeckTabsProps) {
  return (
    <div className="deck-tabs" role="toolbar" aria-label="Question decks">
      {order.map((id) => {
        const isActive = activeBins.includes(id)
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            className={`tab${isActive ? ' tab-active' : ''}`}
            onClick={() => onToggle(id)}
          >
            {bins[id].label}
          </button>
        )
      })}
    </div>
  )
}
