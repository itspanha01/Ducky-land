# Dashboard Design — Ducky Land

**Date:** 2026-04-24

## Overview

Add a stats dashboard to Ducky Land. It slides up from the bottom of the screen when a floating duck button (center-bottom) is tapped. Shows relationship stats and duck info derived from existing localStorage data and logic functions.

---

## Trigger

- A round floating button `🦆` fixed at `bottom: 24px; left: 50%; transform: translateX(-50%)`
- Subtle bounce CSS animation (keyframes, `infinite alternate`)
- Clicking opens the dashboard panel; clicking again (or the backdrop, or a close button) closes it

---

## Panel

### Layout

- Fixed position, bottom of viewport, full width
- Height: `50vh`, scrollable content inside
- Slides in: `transform: translateY(100%)` → `translateY(0)`, `300ms ease` transition
- Rounded top corners (`border-radius: 20px 20px 0 0`)
- Background: semi-transparent dark teal (`rgba`) with `backdrop-filter: blur(10px)`)
- Close `×` button top-right of panel header

### Dismissal

- Close button click
- Clicking the pond/backdrop while panel is open
- `Escape` key

---

## Stats Content

All values computed fresh on each open from `loadStartDate()` and existing logic functions.

### Row 1 — 2-column grid (numeric stats)

| Stat | Source | Label |
|------|--------|-------|
| Total days | `calcTotalDays(startDate)` | "Days Together" |
| Full months + leftover days | `calcMonths()` + `calcLeftoverDays()` | "Months Together" |
| Duck count | `getDuckCount(startDate)` | "Ducks Swimming" |

### Row 2 — Next duck countdown (full width)

- Days until the next monthly milestone: find the next occurrence of the start day in future months
- Label: "Next duck in X days" (or "Max ducks reached! 🎉" if count is already 30)
- Logic: advance start date by `(months + 1)` months, diff from today

### Row 3 — Named ducks list (full width, scrollable)

- Header: "X of Y ducks named"
- Scrollable list, one duck per row
- Named duck: shows assigned name
- Unnamed duck: shows "Duck #N" in muted style
- Max 30 rows

---

## New Logic Function

`calcDaysUntilNextDuck(startDateStr)` added to `logic.js`:
- Returns `0` if duck count is already 30
- Otherwise: compute the date when `months + 1` full months from start is reached, diff from today

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Add `#dashboard` panel div + `#dashboardBtn` floating button |
| `style.css` | Panel styles, floating button styles, slide animation |
| `app.js` | `openDashboard()`, `closeDashboard()`, `renderDashboard()` functions + event wiring |
| `logic.js` | Add `calcDaysUntilNextDuck(startDateStr)` |

---

## Out of Scope

- Editing data from within the dashboard (use existing Edit button for date)
- Animations on individual stat numbers
- Sharing / exporting stats
