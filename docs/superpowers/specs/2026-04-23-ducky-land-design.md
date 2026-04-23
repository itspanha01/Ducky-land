# Ducky Land — Design Spec
**Date:** 2026-04-23
**Status:** Approved

## Overview

A personal web app that visually represents the duration of one relationship or friendship by growing the number of pixel ducks swimming across a pond. The longer the relationship, the more ducks appear. The start date is saved in localStorage so the page remembers it between visits.

---

## File Structure

```
Ducky-land/
├── index.html   — shell, modal, counter widget, duck container
├── style.css    — pixel pond background, swim animation, glass cards, modal
├── app.js       — date logic, duck spawning, localStorage, counter toggle
└── image.png    — pixel duck asset (already present, used as-is)
```

No build tools, no framework. Opened directly in the browser via `file://` or a static server.

---

## UI Zones

### 1. Pond Background (full viewport)

- CSS pixel-art water effect using `repeating-linear-gradient` — teal grid matching the duck asset's water (#3d8fa0 / #2e7a8f)
- Subtle animated shimmer via `background-position` CSS keyframe
- `image-rendering: pixelated` applied globally to preserve pixel aesthetic

### 2. Counter Widget (top-right, always visible)

- Frosted glass card: `background: rgba(255,255,255,0.18)`, `backdrop-filter: blur(8px)`, white border
- Content: label "Together", large number, unit (months or days), toggle pill (Days ↔ Months)
- Small ✏ Edit button that reopens the date modal
- Updates every 60 seconds via `setInterval`

### 3. Duck Zone (full pond area)

- Ducks are `<img src="image.png">` elements, 64×64px, `image-rendering: pixelated`
- Positioned absolutely within the pond container
- Each duck has a randomised Y position (15–75% of viewport height) and swim duration (8–14s)
- Animation: `translateX` from `110vw` to `-110vw` (right to left), `linear`, `infinite`
- Animation delays are staggered so ducks don't march in unison
- Duck count capped at 30 to avoid performance issues

### 4. Date Modal (first visit / edit)

- Dark semi-transparent full-screen overlay: `background: rgba(15,23,42,0.70)`
- Centered pixel-style card with:
  - Heading: "When did your story begin? 🐥"
  - Native `<input type="date">` styled to match the theme
  - "Start our story" button that saves to localStorage and dismisses the modal
- Appears automatically on load if no date is found in localStorage
- Cannot be dismissed without saving a valid date (on first visit)
- Re-opened via the ✏ Edit button on the counter widget

---

## Duck Logic

```
duckCount = 1 + Math.floor(monthsElapsed)
```

- `monthsElapsed` = full calendar months between `startDate` and today
- Minimum: 1 duck (even on day 0)
- Maximum: 30 ducks (cap)
- On date change: clear all existing ducks, recalculate, respawn

---

## Counter Logic

**Months mode (default):**
- Display: `X months, Y days` where X = full months, Y = leftover days
- Special case: if total days = 0, display "Day 1" in both modes

**Days mode (toggle):**
- Display: `Z days total` (minimum: "1 day")

Toggle state is in-memory only (resets to months on page reload).

---

## localStorage Schema

```js
localStorage.setItem('ducky-start-date', '2025-02-14') // ISO date string YYYY-MM-DD
```

Single key. No other data is persisted.

---

## Visual Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--water` | `#3d8fa0` | Pond background base |
| `--water-deep` | `#2e7a8f` | Pond gradient dark tone |
| `--water-ripple` | `#6ab5c4` | Ripple line accents |
| `--glass-bg` | `rgba(255,255,255,0.18)` | Counter + modal card |
| `--glass-border` | `rgba(255,255,255,0.30)` | Card borders |
| `--modal-overlay` | `rgba(15,23,42,0.70)` | Date modal backdrop |
| `--text-white` | `#ffffff` | All overlay text |

**Typography:** Fredoka (headings, counter number) + Nunito (body, labels) — both via Google Fonts with `font-display: swap`.

**Duck size:** 64×64px at 1x. `image-rendering: pixelated` preserves pixel look at all scales.

---

## Animation Spec

| Element | Property | Value |
|---|---|---|
| Duck swim | `transform: translateX` | `110vw → -110vw`, linear, 8–14s random, infinite |
| Duck bob | `transform: translateY` | ±4px, ease-in-out, 2s, infinite, offset per duck |
| Pond shimmer | `background-position` | Shifts 16px over 4s, ease-in-out, infinite |
| Toggle pill | `transform: scale` | 0.95 on press, spring back 200ms |
| Modal | `opacity` + `transform: scale` | Fade+scale in (300ms ease-out), out (200ms ease-in) |

`@media (prefers-reduced-motion: reduce)`: all animations paused, shimmer disabled. Ducks remain visible at fixed positions.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| No date saved | Modal shown automatically on load |
| Future date entered | 1 duck shown, counter displays "0 months, 0 days" |
| Start date = today | 1 duck, counter shows "Day 1" |
| 24+ months elapsed | Ducks spawn up to the 30-duck cap |
| `prefers-reduced-motion` | Animations paused; ducks frozen in place |
| Very small screen (< 375px) | Counter widget shrinks, ducks scale to 48px |

---

## Out of Scope (MVP)

- Multiple relationships
- Sharing / export
- Sound effects
- Duck customisation
- Dark mode toggle (pond is always "dark" — teal water)
