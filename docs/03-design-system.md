# Design system

The rules your interface follows, written down, so that screen four looks like
screen one.

**Part of this is a visual document**, submitted as a PDF or images. Swatches,
type samples and component states, not paragraphs describing them.

## What to record

Color swatches below are real rendered images (via shields.io), not just
hex text. 

## Colour tokens

| Swatch | Token | Hex | Role |
|---|---|---|---|
| ![#FF6F91](https://img.shields.io/badge/-FF6F91?style=for-the-badge&labelColor=FF6F91&color=FF6F91) | `--color-primary` | `#FF6F91` | buttons, active tab, links |
| ![#F2B705](https://img.shields.io/badge/-F2B705?style=for-the-badge&labelColor=F2B705&color=F2B705) | `--color-accent` | `#F2B705` | rare/legendary highlight moments |
| ![#1B1023](https://img.shields.io/badge/-1B1023?style=for-the-badge&labelColor=1B1023&color=1B1023) | `--color-bg` | `#1B1023` | page background |
| ![#2A1734](https://img.shields.io/badge/-2A1734?style=for-the-badge&labelColor=2A1734&color=2A1734) | `--color-surface` | `#2A1734` | cards, panels |
| ![#F5EDE3](https://img.shields.io/badge/-F5EDE3?style=for-the-badge&labelColor=F5EDE3&color=F5EDE3) | `--color-text` | `#F5EDE3` | body text |

**Rarity colors** (the app's core information system, not decoration):

| Swatch | Tier | Hex |
|---|---|---|
| ![#8C97A8](https://img.shields.io/badge/-8C97A8?style=for-the-badge&labelColor=8C97A8&color=8C97A8) | common | `#8C97A8` |
| ![#4CAF7D](https://img.shields.io/badge/-4CAF7D?style=for-the-badge&labelColor=4CAF7D&color=4CAF7D) | uncommon | `#4CAF7D` |
| ![#4A90D9](https://img.shields.io/badge/-4A90D9?style=for-the-badge&labelColor=4A90D9&color=4A90D9) | rare | `#4A90D9` |
| ![#B166E0](https://img.shields.io/badge/-B166E0?style=for-the-badge&labelColor=B166E0&color=B166E0) | epic | `#B166E0` |
| ![#F2B705](https://img.shields.io/badge/-F2B705?style=for-the-badge&labelColor=F2B705&color=F2B705) | legendary | `#F2B705` |
| ![#FF6F91](https://img.shields.io/badge/-FF6F91?style=for-the-badge&labelColor=FF6F91&color=FF6F91) | unique (user-added) | `#FF6F91` |

Contrast checked via the WCAG relative-luminance formula (the same method
the WebAIM checker uses) for every text/background pair actually in use:

- Text on background: ~15.8:1
- Muted text on background: ~8.1:1
- Muted text on surface: ~7.3:1
- Dark text on the primary/accent buttons and rarity badges: ~6.2–10.1:1
  depending on the specific color

All comfortably clear the 4.5:1 AA minimum.

## Type scale

| Style | Sample | Size | Weight | Used for |
|---|---|---|---|---|
| Heading | **Spin for a quest** | 28px (1.75rem), Baloo 2 | Bold (700) | screen/section titles |
| Body | Bored? Pull the lever and see what you get. | 16px (1rem), Inter | Regular (400) | paragraphs, quest text |
| Small | common · added 2 minutes ago | 14px (0.875rem), Inter | Regular (400) | captions, labels, footer, timestamps |

## Spacing rule

Base unit: **8px** — every value below is a multiple of it.

| Token | Value | Used for |
|---|---|---|
| `--space-1` (tight) | 8px | between related items (e.g. a label and its input) |
| `--space-4` (standard) | 32px | between sections/cards |
| Screen edge padding | 32px desktop / 16px phone | outer page margin |

## Reusable components

| Component | Level | Appears on | Props it takes |
|---|---|---|---|
| `Button` | atom | every screen | `children`, `onClick`, `disabled` |
| `RarityBadge` | atom | Spin, Add Quest, History | `rarity` |
| `Capsule` | molecule | Spin | `rarity`, `spinning`, `landed` |
| `Card` | organism | every screen | `children` |
| `TabNav` | organism | every screen (shared header) | `activeTab`, `onChange` |

No UI library is used — everything above is built from scratch in plain
CSS/JSX.

## Responsive plan

| Breakpoint | What changes |
|---|---|
| Below 480px (phone) | Tighter padding, smaller heading/tab text, Spin button goes full-width, quest text + rarity badge stack vertically instead of one row |
| Below 340px | 3-tab bar wraps into a 2×2 grid |
| Above 480px (desktop) | Same single-column layout, just more side margin — content never goes multi-column |

No horizontal scroll at 375px width — confirmed in DevTools' device toolbar.

## Accessibility check

- [x] Every text-on-background pair passes 4.5:1 contrast (see Colour
      tokens above)
- [ ] Real semantic elements throughout — **gap identified**: `<header>`
      and `<nav>` are used correctly, but the active screen's content is
      not yet wrapped in a `<main>` element. Fix planned before final
      submission.
- [x] Every form input has a matching `<label>` (`htmlFor` + `id`) — true
      in `AddQuestScreen.jsx`
- [x] Every button/link is reachable via Tab and shows a visible focus
      state — native `<button>` elements are used throughout, so default
      browser focus styling is intact (not manually removed)
- [ ] Alt text on meaningful images — **not yet applicable**; the app
      currently has no `<img>` elements (all visuals are CSS shapes/colors,
      e.g. the capsule and rarity badges), so this will be revisited if any
      images are added later

## In code

Plain CSS, using `:root` custom properties. Tokens live in
`client/src/styles.css` — this is the template's default approach, and it's
the one that made sense to keep: the project has no build-time styling
framework (no Tailwind, no styled-components, no UI library), so plain CSS
variables are the lightest option that still gives every component a single
source of truth for color, type, and spacing. Changing a token in one place
(e.g. `--color-primary`) updates every button, active tab, and link at
once, without touching component code.