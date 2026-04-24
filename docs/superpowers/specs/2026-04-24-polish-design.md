# Ducky Land — Polish Design

**Date:** 2026-04-24
**Goal:** Polish the existing Ducky Land app across pond visuals, duck behavior, counter widget, modal, and animations.

---

## Direction: Lush & Alive

The pond becomes a richer, deeper world. Darker water, lily pads, ripple rings, and better duck behavior make it feel alive rather than flat.

---

## Pond

- Darker gradient: `#1a6b7a` → `#0a3f4d` → `#1a6b7a`
- Replace the pixel grid with soft horizontal ripple lines (`repeating-linear-gradient` at ~20px intervals, very low opacity)
- 4–5 CSS-drawn lily pads at fixed positions (absolute, ellipse shapes with a small flower dot)
- Lily pads have a very slow sway animation (2–3° rotation, 4s cycle)
- Subtle animated ripple rings on 2–3 lily pads

## Ducks

- Flip horizontally (`scaleX(-1)` on the img) when swimming left so they always face forward
- Since animation uses `alternate`, apply `scaleX(-1)` on the `to` keyframe via a wrapper trick or JS class toggle — simplest: set `transform: scaleX(-1)` on the img in the `swim` `to` state using a second animation on the img
- Each duck fades in on spawn (staggered 100ms apart per duck)
- Small CSS ripple ring beneath each duck, pulsing slowly (3s, fades at edge)
- Keep opacity at 0.75

## Counter Widget

- Background: `rgba(6, 40, 48, 0.75)`
- Border: `rgba(100, 200, 220, 0.3)`
- Number color: `#7dd3e8`
- Toggle button: teal accent, label reads "Show days" or "Show months" depending on current mode
- Number does a subtle scale-pop (keyframe) when the value changes
- Edit button teal-tinted

## Modal

- Matches deep water card style (same dark background + teal border as counter)
- Save button: richer teal with hover shimmer
- Entry: smooth scale from 0.92 → 1 (already exists, keep)

## Animations

- Duck spawn: staggered fade-in, each duck 100ms later than previous
- Duck ripple ring: 3s pulse, opacity fades outward
- Lily pad sway: 2–3° rotation, 4s ease-in-out infinite alternate
- Reduced-motion: all decorative animations disabled

## Files Changed

- `style.css` — pond, lily pads, duck ripple, counter widget, modal
- `app.js` — duck spawn stagger, number pop on counter update, toggle label
- `index.html` — add lily pad markup
