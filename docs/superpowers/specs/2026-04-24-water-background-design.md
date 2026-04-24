# Water Background — Realistic Overhaul

**Date:** 2026-04-24

## Goal

Replace the current dark teal gradient + scanline shimmer with a more realistic water surface: lighter natural blue tones and animated SVG wave layers.

## Color Palette

Update the CSS variables in `style.css`:

| Variable        | Old value  | New value  | Purpose                  |
|-----------------|------------|------------|--------------------------|
| `--water`       | `#1a6b7a`  | `#5bbfd4`  | Surface (sky reflection) |
| `--water-mid`   | `#0d5566`  | `#2e9bb5`  | Mid depth                |
| `--water-deep`  | `#0a3f4d`  | `#1a6b85`  | Deep water               |

A semi-transparent white highlight band (`rgba(255,255,255,0.12)`) is added at the top 0–15% of the pond gradient to simulate sky glare on the water surface.

## Pond Background

Remove from `.pond`:
- `repeating-linear-gradient` scanlines
- `animation: shimmer`
- `@keyframes shimmer`

Replace with a clean `linear-gradient` using the new palette plus the highlight band.

## SVG Wave Layers

Three SVG wave paths added inside `.pond` in `index.html`, absolutely positioned to fill the full width. Each uses a tiling sine-wave path in a `2×` viewBox so it can scroll seamlessly.

| Wave | Amplitude | Speed | Opacity | Phase offset |
|------|-----------|-------|---------|--------------|
| 1    | 18px      | 8s    | 20%     | 0            |
| 2    | 12px      | 13s   | 12%     | 1/3 period   |
| 3    | 7px       | 18s   | 8%      | 2/3 period   |

All three are colored white (`fill: rgba(255,255,255,<opacity>)`). A single `@keyframes wave-scroll` translates each SVG from `translateX(0)` to `translateX(-50%)`, looping seamlessly. Each wave has a different `animation-duration` for natural layering.

The SVG container sits at `z-index: 1`; lily pads and reeds remain above at higher z-indices.

## What Does Not Change

- Lily pads, reeds, duck zone — untouched
- All glass-morphism UI (counter, modal, dashboard) — color variables update automatically
- `prefers-reduced-motion` — wave animations added to the existing `reduce` block (`animation: none`)
