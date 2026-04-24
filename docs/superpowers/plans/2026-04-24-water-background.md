# Water Background — Realistic Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark teal gradient + scanline shimmer with a lighter, natural water palette and three animated SVG sine-wave layers.

**Architecture:** Two files change — `style.css` gets updated color variables, a new pond background, wave animation keyframes, and reduced-motion entries; `index.html` gets three SVG elements inserted inside `.pond` before the duck zone. No JS changes needed.

**Tech Stack:** Pure CSS animations, inline SVG, no external dependencies.

---

## File Map

| File | Change |
|------|--------|
| `style.css` | Update `--water`, `--water-mid`, `--water-deep` variables; replace `.pond` background; remove `@keyframes shimmer`; add `.pond-waves` + `.wave--*` rules + `@keyframes wave-scroll`; add wave animations to reduced-motion block |
| `index.html` | Insert three `<svg class="pond-waves wave--N">` elements inside `#pond`, before `#duckZone` |

---

## Task 1: Update CSS — Colors and Pond Background

**Files:**
- Modify: `style.css`

No unit-testable logic here — verification is visual (open in browser, confirm colors look like natural water).

- [ ] **Step 1: Update color variables**

In `style.css`, replace the three water variables at the top of `:root`:

```css
--water:         #5bbfd4;
--water-mid:     #2e9bb5;
--water-deep:    #1a6b85;
```

- [ ] **Step 2: Replace the `.pond` background and remove shimmer**

Replace the entire `.pond` rule (lines 36–54) with:

```css
.pond {
  position: fixed;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 15%),
    linear-gradient(
      180deg,
      var(--water)      0%,
      var(--water-mid)  40%,
      var(--water-deep) 70%,
      var(--water-mid)  100%
    );
}
```

The first layer is the sky-glare highlight band (fades out by 15%). The `animation: shimmer` line is intentionally removed.

- [ ] **Step 3: Delete `@keyframes shimmer`**

Remove these lines entirely from `style.css`:

```css
@keyframes shimmer {
  0%, 100% { background-position: 0 0, 0 0; }
  50%       { background-position: 0 20px, 0 0; }
}
```

- [ ] **Step 4: Add wave layer CSS and `@keyframes wave-scroll`**

Add this block immediately after the `.pond` rule:

```css
/* ── SVG wave layers ──────────────────────── */
.pond-waves {
  position: absolute;
  width: 200%;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

.wave--1 {
  top: 20%;
  height: 80px;
  animation: wave-scroll 8s linear infinite;
}
.wave--2 {
  top: 45%;
  height: 60px;
  animation: wave-scroll 13s linear infinite;
}
.wave--3 {
  top: 68%;
  height: 50px;
  animation: wave-scroll 18s linear infinite;
}

@keyframes wave-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

- [ ] **Step 5: Add wave animations to the reduced-motion block**

Find the `@media (prefers-reduced-motion: reduce)` block and add `.wave--1, .wave--2, .wave--3` to the `animation: none` lines:

```css
@media (prefers-reduced-motion: reduce) {
  .pond         { animation: none; }
  .lily-pad     { animation: none; }
  .pond-leaf    { animation: none; }
  .wave--1,
  .wave--2,
  .wave--3      { animation: none; }
  .duck-wrapper { animation: none; }
  /* ... rest unchanged ... */
}
```

- [ ] **Step 6: Commit**

```bash
git add style.css
git commit -m "feat: update water palette and pond background for realism"
```

---

## Task 2: Add SVG Wave Elements to HTML

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Insert three SVG wave elements inside `#pond`**

In `index.html`, find the line `<div class="duck-zone" id="duckZone"></div>` and insert the following three SVG elements **directly before it**:

```html
    <!-- Wave layer 1: foreground, fastest -->
    <svg class="pond-waves wave--1" viewBox="0 0 2880 80" preserveAspectRatio="none" aria-hidden="true">
      <path fill="none" stroke="rgba(255,255,255,0.20)" stroke-width="2"
        d="M0,40 C45,22 135,22 180,40 C225,58 315,58 360,40
           C405,22 495,22 540,40 C585,58 675,58 720,40
           C765,22 855,22 900,40 C945,58 1035,58 1080,40
           C1125,22 1215,22 1260,40 C1305,58 1395,58 1440,40
           C1485,22 1575,22 1620,40 C1665,58 1755,58 1800,40
           C1845,22 1935,22 1980,40 C2025,58 2115,58 2160,40
           C2205,22 2295,22 2340,40 C2385,58 2475,58 2520,40
           C2565,22 2655,22 2700,40 C2745,58 2835,58 2880,40"/>
    </svg>

    <!-- Wave layer 2: mid, medium speed -->
    <svg class="pond-waves wave--2" viewBox="0 0 2880 60" preserveAspectRatio="none" aria-hidden="true">
      <path fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"
        d="M0,30 C60,18 180,18 240,30 C300,42 420,42 480,30
           C540,18 660,18 720,30 C780,42 900,42 960,30
           C1020,18 1140,18 1200,30 C1260,42 1380,42 1440,30
           C1500,18 1620,18 1680,30 C1740,42 1860,42 1920,30
           C1980,18 2100,18 2160,30 C2220,42 2340,42 2400,30
           C2460,18 2580,18 2640,30 C2700,42 2820,42 2880,30"/>
    </svg>

    <!-- Wave layer 3: background, slowest -->
    <svg class="pond-waves wave--3" viewBox="0 0 2880 50" preserveAspectRatio="none" aria-hidden="true">
      <path fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"
        d="M0,25 C90,18 270,18 360,25 C450,32 630,32 720,25
           C810,18 990,18 1080,25 C1170,32 1350,32 1440,25
           C1530,18 1710,18 1800,25 C1890,32 2070,32 2160,25
           C2250,18 2430,18 2520,25 C2610,32 2790,32 2880,25"/>
    </svg>

```

The paths tile seamlessly: each path is exactly 2× wide (2880 = 2 × 1440), the value at x=0 equals the value at x=1440, so `translateX(-50%)` loops perfectly.

- [ ] **Step 2: Verify in browser**

Open `index.html` in a browser. Confirm:
- Background is a lighter, more natural blue (not dark teal)
- A faint white highlight glows at the very top of the pond
- Three visible wave lines roll horizontally at different speeds and depths
- Lily pads, reeds, and ducks render on top of the waves
- Ducks still swim, quack, and respond to clicks normally

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add SVG wave layers to pond for realistic water surface"
```
