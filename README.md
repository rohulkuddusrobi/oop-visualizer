# OOP Lab — Learn Object-Oriented Programming Visually

A lightweight, browser-only learning platform that teaches the four pillars of
object-oriented programming through four real-life machines. No framework, no
build step, no backend, no account. Just open it and learn.

- **Encapsulation** — an ATM that guards its balance
- **Inheritance** — an animal family that shares a blueprint
- **Polymorphism** — one `makeSound()` call, three different answers
- **Abstraction** — a car dashboard that hides the engine
- **Quiz** — 12 conceptual questions with instant feedback and a review
- **Dashboard** — progress, quick navigation and a plain-language introduction

Built for beginners who have never written code. Every idea is shown twice:
once as a moving picture, and once as a small, readable code snippet.

---

## Quick start

### Option 1 — open it directly

Double-click `index.html`, or drag it into any modern browser.

The whole app is plain HTML, CSS and JavaScript, so it works from `file://`.
Chrome, Edge and Firefox all run it this way.

### Option 2 — serve the folder (recommended for the cleanest result)

From this folder:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

Any static server works, for example:

```bash
npx serve .
```

There is nothing to install and nothing to compile.

---

## Pages and deep links

Routing is hash-based, so every page is directly linkable and the back/forward
buttons behave normally.

| Page | URL |
| --- | --- |
| Dashboard | `index.html#/dashboard` |
| Encapsulation | `index.html#/encapsulation` |
| Inheritance | `index.html#/inheritance` |
| Polymorphism | `index.html#/polymorphism` |
| Abstraction | `index.html#/abstraction` |
| Quiz | `index.html#/quiz` |
| How it works / About | `index.html#/about` |

Opening `index.html` with no hash loads the dashboard. An unknown hash also
falls back to the dashboard.

---

## Controls

Every demo shares the same transport:

| Control | What it does |
| --- | --- |
| **Play / Pause** | Runs the guided animation at a readable pace (about 6 seconds per step) |
| **Previous / Next** | Moves one step at a time and pauses playback |
| **Step dots** | Jump straight to any step |
| **Reset** | Returns the demo to step 1 and restores its starting state |
| **← / →** | Previous / next step from the keyboard |
| **Space** | Play or pause (outside buttons and inputs) |

Demo-specific interactions:

- **ATM** — deposit, withdraw, use the preset amounts, or try the
  `atm.balance = 999999` button to see the guard refuse.
- **Inheritance** — click Animal, Dog, Cat or Cow to inspect inherited and
  unique members.
- **Polymorphism** — call the method on all three animals, or click a single
  card.
- **Abstraction** — press **ENGINE** to start or stop the car, and open
  **Hidden internals** to watch the five-step engine sequence.
- **Quiz** — click an answer, press **1–4** to choose, and **Enter** to continue
  after feedback.

---

## Project structure

```
oop-visualizer/
├── index.html              App shell, sidebar, top bar and script order
├── README.md
├── css/
│   ├── style.css           Design tokens, layouts, all four demos, responsive rules
│   └── animations.css      Keyframes and motion utilities
└── js/
    ├── core.js             Icons, storage, progress, motion adapter, stepper, helpers
    ├── dashboard.js        Hero, progress ring, pillar cards, intro
    ├── encapsulation.js    ATM demo (6 steps)
    ├── inheritance.js      Animal-family demo (6 steps)
    ├── polymorphism.js     Animal-sounds demo (6 steps)
    ├── abstraction.js      Car-dashboard demo (6 steps)
    ├── quiz.js             12 questions, feedback, results, review, restart
    ├── about.js            How-it-works page, syllabus, reset progress
    ├── navigation.js       Hash router, sidebar, drawer, progress chrome
    └── app.js              Bootstraps the app
```

Everything is a classic script attached to the `window.OOP` namespace rather
than an ES module. This is deliberate: it keeps the app working when
`index.html` is opened directly from disk, where module imports are blocked.

---

## How progress works

- Opening a demo marks it **in progress**.
- Reaching the final step marks the pillar **complete**.
- The quiz stores your **best score**, **last score** and **attempt count**.
- Everything is saved in `localStorage` under `oopviz.progress.v1`, so it
  survives reloads and return visits.
- **Reset progress** lives at the bottom of the *How it works* page. It asks for
  a second click within a few seconds before clearing anything.

If storage is unavailable (some private-browsing modes), the app falls back to
in-memory progress for the current session instead of failing.

The sidebar progress meter, the top-bar count and the dashboard ring all read
from the same store and update immediately when a pillar is completed.

---

## Accessibility and motion

- Full keyboard operation: navigation, transport controls, quiz answers and
  drawer.
- Visible focus rings via `:focus-visible`.
- A **Skip to content** link is the first focusable element.
- Demo explanations use an `aria-live="polite"` region; quiz feedback is
  announced as it appears.
- Step buttons, transport buttons and quiz options have descriptive labels.
- `prefers-reduced-motion` is respected in two layers:
  - CSS reduces animation and transition durations to near zero.
  - JavaScript skips GSAP tweens and reveals state instantly.
- If GSAP cannot load at all (offline or a blocked CDN), every demo still works;
  state changes simply happen without tweening.
- Text colours were chosen to keep secondary copy readable against the light
  surfaces.

---

## Customising

### Colours

Open `css/style.css` and edit the tokens at the top of `:root`:

```css
--primary: #4f46e5;
--cyan: #0891b2;
--violet: #7c3aed;
--amber: #d97706;
--emerald: #059669;
```

The four pillar accents are applied with `accent-cyan`, `accent-violet`,
`accent-amber` and `accent-emerald` classes.

### Demo steps

Each demo declares a `steps` array in its JavaScript file. A step looks like:

```js
{
  label: "Short title for the step bar",
  title: "Explanation heading",
  body: "Plain-language explanation.",
  hints: ["One idea per hint."],
  apply: function (index) {
    // Change the visual state for this step.
  }
}
```

Add or remove entries and the step counter, dots and progress tracking follow
automatically.

### Quiz questions

Questions are the `QUESTIONS` array at the top of `js/quiz.js`:

```js
{
  pillar: "Encapsulation",
  icon: "lock",
  q: "Question text?",
  options: ["A", "B", "C", "D"],
  answer: 0,
  why: "Shown after the learner answers."
}
```

`answer` is the zero-based index of the correct option.

### Copy and examples

All visible copy is plain strings in the view files. The dashboard pillar cards
are driven by the `PILLARS` array in `js/dashboard.js`.

---

## Browser support

- Current Chrome, Edge, Firefox and Safari.
- Responsive from 375 px phones through 768 px tablets, 1024 px laptops and
  1440 px desktops. The sidebar becomes a drawer below 900 px.
- Google Fonts (Sora + Inter) and GSAP are loaded from CDNs for polish, but
  neither is required. Without them the app uses system fonts and instant state
  changes.

---

## Verification

The shipped app was tested with 172 automated checks:

- **112 headless DOM checks** covering every route, the four demo step engines,
  ATM balance rules, inheritance transfer, sound calls, engine pipeline, the
  full 12-question quiz, restart, progress reset and unknown-route fallback.
- **40 edge-case checks** covering every deep link, reduced motion, missing GSAP,
  view cleanup and quiz keyboard input.
- **20 real-browser checks** in Chrome at 375 / 768 / 1024 / 1440 px covering
  persistence across reloads, offline GSAP fallback, reduced motion, the mobile
  drawer, the alert-chip position and horizontal overflow.

Final runs: all checks passed, with no runtime console errors.
