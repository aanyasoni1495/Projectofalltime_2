// A quick four-step rundown of how the app works.
export function HowToPlayPanel() {
  return (
    <div className="panel">
      <div className="panel-title">How to Play</div>
      <ul className="how-list">
        <li>Pick a category and hit Deal.</li>
        <li>Answer out loud before the timer runs out.</li>
        <li>Tap Hint if you need a nudge.</li>
      </ul>
    </div>
  )
}
