# Shuffle Sense

## About the Project

Shuffle Sense is a product management interview trainer for the browser. It deals you random PM prompts across five practice bins, optionally reveals a structured hint framework, and times your response with a configurable countdown. Deal a card, talk through it under the clock, and reps add up fast.

The five bins are:

- **Improve**: improve a feature for a company, or a company for a segment
- **Design**: design a product for a segment or archetype
- **Measure**: define the metrics for a product or feature
- **Grow**: build a growth strategy for a product
- **Diagnose**: diagnose a metric problem

Keyboard shortcuts keep you hands-on-keyboard: **Space** deals, **H** toggles the hint, **P** plays the timer, **S** stops it.

### Built With

[![React][React-shield]][React-url]
[![TypeScript][TypeScript-shield]][TypeScript-url]
[![Vite][Vite-shield]][Vite-url]
[![Tailwind CSS][Tailwind-shield]][Tailwind-url]
[![Zod][Zod-shield]][Zod-url]
[![Vitest][Vitest-shield]][Vitest-url]

## How It Works

Shuffle Sense runs a four-stage pipeline every time you deal a card.

1. **Select**

   a) You pick a bin from the deck tabs, or let the active bin stand. The deck hook (`useDeck`) holds the current bin selection as the single source of truth.

   b) Each bin is registered in a typed `bins` registry with a fixed `binOrder`, so selection is always one known `BinId` rather than a free string.

   c) The selected bin exposes a generator that knows which dataset entities it needs, which keeps prompt logic colocated with the bin that owns it.

2. **Generate**

   a) On deal, the bin generator runs against a `GenContext` built from the validated dataset and a seeded RNG, so a given seed reproduces the same prompt.

   b) Pure selectors (`archetypeCompanies`, `archetypeMetrics`, and friends) query the dataset for the subjects a bin template needs, then the generator fills the template into a finished `Prompt`.

   c) The generator avoids repeating the last subject for that bin, so consecutive deals feel fresh instead of cycling the same company or feature.

3. **Deal**

   a) The new prompt becomes the active card and is pushed onto a bounded list of recent prompts kept in the deck hook.

   b) The prompt card renders the question; the hint card stays collapsed until you ask for it.

   c) Revealing the hint shows the bin's structured framework or checklist for that prompt type, so practice can be guided or blind on demand.

4. **Time**

   a) Starting the timer drives a pure state machine (`timerMachine`) through its phases: `standby`, `live`, `paused`, and `time`.

   b) The timer hook (`useTimer`) ticks the machine on an interval and surfaces the current phase and remaining time to the UI.

   c) Because the machine is pure, every transition is deterministic and unit-testable without touching the DOM or wall-clock timing.

## Architecture

**Deal flow:**

1. A keypress or tab click enters the UI layer. `App.tsx` wires the deck hook, the timer hook, and the global keyboard shortcuts together.
2. `useDeck` resolves the active `BinId` against the `bins` registry and asks the selected bin to generate.
3. The bin generator runs over a `GenContext` and a seeded RNG, calling pure selectors to pull the subjects its template needs from the validated dataset.
4. The generator returns a typed `Prompt`, avoiding the last subject it used for that bin.
5. `useDeck` sets the prompt as the active card and records it in the recent-prompts list. Components render the prompt and, on request, the hint.
6. `useTimer` drives `timerMachine` to count the response down, independent of which card is shown.

**Dataset pipeline (runs offline, ahead of the app):**

- `scripts/build-dataset.ts` reads the source `.xlsx`, validates every entity against the Zod schemas, and writes `src/data/dataset.json`.
- At app startup `src/data/dataset.ts` imports that JSON and validates it again, so a malformed dataset fails loudly at load instead of midway through a deal.

## Why This Stack?

**React:** The app is a small set of interactive panels that re-render on a handful of state changes: the active card, the hint toggle, and the timer phase. React's component model maps cleanly onto that surface, and the ecosystem makes the keyboard-driven, stateful UI straightforward to build.

**TypeScript:** Prompts flow through several layers, from dataset entities to selectors to bin generators to the rendered card. Typing `BinId`, `Prompt`, and `GenContext` means a bad shape is caught at compile time, so a generator can never hand the UI a prompt it does not understand.

**Vite:** Practice is iterative, so fast feedback matters during development. Vite's instant dev server and hot module replacement keep the loop tight, and its build step ships a lean static bundle with no runtime server to operate.

**Tailwind CSS v4:** The UI is many small panels and cards that need to stay visually consistent. Utility classes layered on top of CSS design tokens keep styling colocated with markup, and v4's zero-config Vite plugin removes the build wiring entirely.

**Zod:** The dataset is the source of truth for every prompt, so it is validated twice: once when the build script compiles it and once when the app loads it. Zod schemas define each entity's shape in one place, so a malformed dataset fails loudly instead of silently generating broken prompts.

**Vitest:** The bin generators and the timer state machine are pure functions, which makes them ideal to test directly. Vitest shares Vite's config and transform pipeline, so the tests run against the same module resolution as the app with no separate toolchain to maintain.

## Project Structure

The codebase maps onto the pipeline stages.

`src/App.tsx` is the root component. It owns wiring the deck and timer hooks together and registering the global keyboard shortcuts.

`src/data` is the dataset layer. `schema.ts` holds the Zod schemas for every dataset entity, `dataset.ts` imports and validates `dataset.json`, and `dataset.json` is the compiled output of the build script.

`src/domain` is the generation core. `types.ts` defines `BinId`, `Prompt`, and `GenContext`. `rng.ts` is the seeded RNG. `selectors.ts` holds the pure dataset queries. `generate.ts` generates a prompt for a bin while avoiding the last subject used. `bins/` holds one generator per bin (`improve.ts`, `design.ts`, `measure.ts`, `grow.ts`, `diagnose.ts`), a shared `bin.ts` interface, and an `index.ts` registry that exposes `bins` and `binOrder`.

`src/session/timerMachine.ts` is the pure timer state machine, cycling through `standby`, `live`, `paused`, and `time`.

`src/ui` is the presentation layer. `components/` holds the React components (BrandMark, DeckTabs, StageGroup, Console, SessionPanel, RecentPromptsPanel, HowToPlayPanel, ShortcutsPanel, NextUpPanel, PromptCard, HintCard, Footer). `hooks/useDeck.ts` owns deck state: bin selection, prompt generation, deal, and recent prompts. `hooks/useTimer.ts` drives the timer machine. `styles/tokens.css` holds the CSS design tokens.

`scripts/build-dataset.ts` is the offline data build. It reads the source `.xlsx`, validates it with Zod, and writes `dataset.json`.

`test/` holds the Vitest suites: one per bin (`improve`, `design`, `measure`, `grow`, `diagnose`), `selectors.test.ts` for the pure dataset queries, `timerMachine.test.ts` for the state machine, and `setup.ts` for shared test setup.

## Getting Started

### Prerequisites

- Node 18+
- npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/aalurkar/Shuffle Sense.git
   cd Shuffle Sense
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Build the dataset
   ```sh
   npm run build:data
   ```

4. Run locally
   ```sh
   npm run dev
   ```

5. Run the tests
   ```sh
   npm test
   ```

## Deployment

Shuffle Sense is a static site, so deployment is a build and a serve.

1. Build the production bundle
   ```sh
   npm run build
   ```

2. Serve the `dist/` folder from any static host (Netlify, Vercel, GitHub Pages, or any CDN). There is no runtime server to operate.

To preview the production build locally:

```sh
npm run preview
```

## Contact

Akshat Alurkar - aalurkar05@gmail.com - [LinkedIn](https://linkedin.com/in/akshatalurkar)

---

[React-shield]: https://img.shields.io/badge/React-1a1a1a?style=for-the-badge&logo=react&logoColor=white
[React-url]: https://react.dev
[TypeScript-shield]: https://img.shields.io/badge/TypeScript-1a1a1a?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://typescriptlang.org
[Vite-shield]: https://img.shields.io/badge/Vite-1a1a1a?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev
[Tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-1a1a1a?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com
[Zod-shield]: https://img.shields.io/badge/Zod-1a1a1a?style=for-the-badge&logo=zod&logoColor=white
[Zod-url]: https://zod.dev
[Vitest-shield]: https://img.shields.io/badge/Vitest-1a1a1a?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev
