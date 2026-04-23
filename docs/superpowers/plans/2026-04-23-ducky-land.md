# Ducky Land Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal web app where animated pixel ducks swim across a pond, with the duck count growing every month since a saved start date.

**Architecture:** Three files — `index.html` (structure), `style.css` (pond visuals + animations), `app.js` (logic + DOM wiring) — plus `logic.js` for pure date functions that can be unit-tested with Node.js. No build tools. Works via `file://` or any static server.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES5-compatible), Google Fonts (Fredoka + Nunito), Node.js for unit tests only.

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | HTML shell, Google Fonts link, semantic structure for all UI zones |
| `style.css` | CSS variables, pixel pond background, swim/bob animations, glass cards, modal, responsive, reduced-motion |
| `logic.js` | Pure functions: `calcTotalDays`, `calcMonths`, `calcLeftoverDays`, `getDuckCount`. No DOM. Exports via CommonJS for tests. |
| `app.js` | DOM wiring, localStorage, `spawnDucks`, `clearDucks`, `updateCounter`, `toggleMode`, `showModal`, `hideModal`, `init` |
| `tests/logic.test.js` | Node.js unit tests for all four functions in `logic.js` |
| `image.png` | Already present — pixel duck asset, used as-is |

---

## Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `style.css` (empty shell)
- Create: `app.js` (empty shell)
- Create: `logic.js` (empty shell)
- Modify: `.gitignore`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ducky Land</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Pond: full-viewport pixel water -->
  <div class="pond" id="pond">
    <div class="duck-zone" id="duckZone"></div>
  </div>

  <!-- Counter widget: top-right overlay -->
  <div class="counter" id="counter">
    <div class="counter__label">Together</div>
    <div class="counter__number" id="counterNumber">—</div>
    <div class="counter__unit" id="counterUnit"></div>
    <button class="counter__toggle" id="toggleBtn">Days ↔ Months</button>
    <button class="counter__edit" id="editBtn">✏ Edit</button>
  </div>

  <!-- Date modal: first-visit overlay -->
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal-card">
      <h2 class="modal-card__heading">When did your story begin? 🐥</h2>
      <input type="date" class="modal-card__input" id="dateInput">
      <button class="modal-card__btn" id="saveBtn">Start our story</button>
    </div>
  </div>

  <script src="logic.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create style.css (empty with comment)**

```css
/* Ducky Land styles */
```

- [ ] **Step 3: Create logic.js (empty with comment)**

```js
// Ducky Land — pure date/duck logic
```

- [ ] **Step 4: Create app.js (empty with comment)**

```js
// Ducky Land — app logic and DOM wiring
```

- [ ] **Step 5: Add .superpowers/ to .gitignore**

Open `.gitignore` (create it if it doesn't exist) and add:

```
.superpowers/
```

- [ ] **Step 6: Open index.html in browser and verify**

Open `index.html` in Chrome/Edge. Expected: blank page with correct title "Ducky Land" in the tab. No console errors except possibly Google Fonts 404s if offline (acceptable).

- [ ] **Step 7: Commit**

```bash
git add index.html style.css logic.js app.js .gitignore
git commit -m "feat: scaffold project files"
```

---

## Task 2: CSS — Pond Background

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add CSS variables, reset, and pond background to style.css**

```css
/* Ducky Land styles */

/* ── Variables ────────────────────────────── */
:root {
  --water:         #3d8fa0;
  --water-deep:    #2e7a8f;
  --water-ripple:  #6ab5c4;
  --glass-bg:      rgba(255, 255, 255, 0.18);
  --glass-border:  rgba(255, 255, 255, 0.30);
  --modal-overlay: rgba(15, 23, 42, 0.70);
  --text-white:    #ffffff;
}

/* ── Reset ────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Nunito', sans-serif;
}

img {
  image-rendering: pixelated;
  display: block;
}

/* ── Pond ─────────────────────────────────── */
.pond {
  position: fixed;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 7px,
      rgba(0, 0, 0, 0.08) 8px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 7px,
      rgba(0, 0, 0, 0.08) 8px
    ),
    linear-gradient(
      180deg,
      var(--water) 0%,
      var(--water-deep) 50%,
      var(--water) 100%
    );
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0 0, 0 0, 0 0; }
  50%       { background-position: 0 16px, 16px 0, 0 0; }
}

/* ── Duck zone ────────────────────────────── */
.duck-zone {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ── Reduced motion ───────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .pond { animation: none; }
}
```

- [ ] **Step 2: Verify in browser**

Refresh `index.html`. Expected: full-viewport teal pixel-grid pond with a gentle shimmer animation. No horizontal scrollbar.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add pixel pond background"
```

---

## Task 3: CSS — Counter Widget

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Append counter styles to style.css**

Add after the `@media (prefers-reduced-motion)` block:

```css
/* ── Counter widget ───────────────────────── */
.counter {
  position: fixed;
  top: 16px;
  right: 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 2px solid var(--glass-border);
  border-radius: 12px;
  padding: 14px 18px;
  color: var(--text-white);
  text-align: center;
  min-width: 150px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  z-index: 10;
}

.counter__label {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 4px;
}

.counter__number {
  font-family: 'Fredoka', sans-serif;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.counter__unit {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 10px;
  min-height: 18px;
}

.counter__toggle {
  display: block;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  color: white;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  margin-bottom: 8px;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.counter__toggle:active {
  transform: scale(0.95);
}

.counter__edit {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.65);
  font-size: 11px;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  padding: 2px 4px;
}

.counter__edit:hover {
  color: var(--text-white);
}
```

Also add inside the existing `@media (prefers-reduced-motion: reduce)` block:

```css
  .counter__toggle { transition: none; }
```

- [ ] **Step 2: Verify in browser**

Refresh. Expected: frosted-glass card top-right with "—" number, toggle button, and ✏ Edit button visible over the pond. The toggle should have a spring bounce when clicked (purely visual — no logic yet).

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add counter widget styles"
```

---

## Task 4: CSS — Date Modal

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Append modal styles to style.css**

```css
/* ── Modal ────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--modal-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease-in;
}

.modal-overlay.is-visible {
  opacity: 1;
  pointer-events: all;
  transition: opacity 300ms ease-out;
}

.modal-card {
  background: rgba(15, 23, 42, 0.92);
  border: 2px solid var(--glass-border);
  border-radius: 16px;
  padding: 32px 28px;
  text-align: center;
  color: var(--text-white);
  max-width: 320px;
  width: 90%;
  transform: scale(0.92);
  transition: transform 200ms ease-in;
}

.modal-overlay.is-visible .modal-card {
  transform: scale(1);
  transition: transform 300ms ease-out;
}

.modal-card__heading {
  font-family: 'Fredoka', sans-serif;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.3;
}

.modal-card__input {
  width: 100%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  font-size: 15px;
  font-family: 'Nunito', sans-serif;
  margin-bottom: 16px;
  text-align: center;
  cursor: pointer;
}

.modal-card__input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.modal-card__btn {
  width: 100%;
  background: var(--water);
  border: none;
  border-radius: 10px;
  padding: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Fredoka', sans-serif;
  cursor: pointer;
  transition: background 150ms;
}

.modal-card__btn:hover {
  background: var(--water-deep);
}
```

Also add inside the existing `@media (prefers-reduced-motion: reduce)` block:

```css
  .modal-overlay,
  .modal-card { transition: none; }
```

- [ ] **Step 2: Temporarily make modal visible to check it**

In `index.html`, temporarily add `is-visible` to the modal div:

```html
<div class="modal-overlay is-visible" id="modalOverlay">
```

Refresh. Expected: dark overlay with centered card, heading "When did your story begin? 🐥", date picker, and teal button.

- [ ] **Step 3: Remove the temporary is-visible class**

Revert `index.html` back to:

```html
<div class="modal-overlay" id="modalOverlay">
```

- [ ] **Step 4: Commit**

```bash
git add style.css index.html
git commit -m "feat: add date modal styles"
```

---

## Task 5: CSS — Duck Animation

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add duck wrapper and duck animation styles**

Add after the duck-zone rule:

```css
/* ── Duck ─────────────────────────────────── */
.duck-wrapper {
  position: absolute;
  animation: swim linear infinite;
}

.duck {
  width: 64px;
  height: 64px;
  animation: bob ease-in-out 2s infinite;
}

@keyframes swim {
  from { transform: translateX(110vw); }
  to   { transform: translateX(-110vw); }
}

@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
}
```

Also add inside the `@media (prefers-reduced-motion: reduce)` block:

```css
  .duck-wrapper { animation: none; }
  .duck         { animation: none; }
```

- [ ] **Step 2: Manually test the animation in browser**

Temporarily add one duck to `index.html` inside `#duckZone`:

```html
<div class="duck-wrapper" style="top: 40%; animation-duration: 10s;">
  <img class="duck" src="image.png" alt="duck">
</div>
```

Refresh. Expected: pixel duck swimming smoothly right-to-left across the pond with a gentle bob.

- [ ] **Step 3: Remove the temporary duck markup**

Delete the `<div class="duck-wrapper">` added in Step 2 from `index.html`.

- [ ] **Step 4: Commit**

```bash
git add style.css index.html
git commit -m "feat: add duck swim and bob animations"
```

---

## Task 6: Responsive + Small Screen

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add responsive breakpoint at bottom of style.css**

```css
/* ── Responsive: small screens ────────────── */
@media (max-width: 374px) {
  .counter {
    min-width: 120px;
    padding: 10px 12px;
    top: 8px;
    right: 8px;
  }

  .counter__number {
    font-size: 28px;
  }

  .duck {
    width: 48px;
    height: 48px;
  }
}
```

- [ ] **Step 2: Verify using browser DevTools**

Open DevTools → toggle device toolbar → select iPhone SE (375px wide). Expected: counter widget fits without clipping. Then narrow to 360px — counter should shrink and ducks should be 48px.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add responsive breakpoint for small screens"
```

---

## Task 7: logic.js — Pure Functions (TDD)

**Files:**
- Create: `tests/logic.test.js`
- Modify: `logic.js`

- [ ] **Step 1: Create tests/logic.test.js with failing tests**

```bash
mkdir -p tests
```

```js
// tests/logic.test.js — run with: node tests/logic.test.js
'use strict';

const assert = require('assert');
const { calcTotalDays, calcMonths, calcLeftoverDays, getDuckCount } = require('../logic.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log('  ✓ ' + name);
    passed++;
  } catch (e) {
    console.error('  ✗ ' + name);
    console.error('    ' + e.message);
    failed++;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

// Returns date string for exactly N full months ago (same day-of-month)
function exactMonthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().split('T')[0];
}

// ── calcTotalDays ─────────────────────────────────────────────────────────────

console.log('\ncalcTotalDays');

test('returns 0 for today', () => {
  assert.strictEqual(calcTotalDays(daysAgo(0)), 0);
});

test('returns 1 for yesterday', () => {
  assert.strictEqual(calcTotalDays(daysAgo(1)), 1);
});

test('returns 30 for 30 days ago', () => {
  assert.strictEqual(calcTotalDays(daysAgo(30)), 30);
});

test('returns negative number for a future date', () => {
  assert.ok(calcTotalDays(daysAgo(-5)) < 0);
});

// ── calcMonths ────────────────────────────────────────────────────────────────

console.log('\ncalcMonths');

test('returns 0 for today', () => {
  assert.strictEqual(calcMonths(daysAgo(0)), 0);
});

test('returns 0 for 20 days ago', () => {
  assert.strictEqual(calcMonths(daysAgo(20)), 0);
});

test('returns 1 for exactly 1 month ago', () => {
  assert.strictEqual(calcMonths(exactMonthsAgo(1)), 1);
});

test('returns 6 for exactly 6 months ago', () => {
  assert.strictEqual(calcMonths(exactMonthsAgo(6)), 6);
});

test('never returns negative', () => {
  assert.ok(calcMonths(daysAgo(-30)) >= 0);
});

// ── calcLeftoverDays ──────────────────────────────────────────────────────────

console.log('\ncalcLeftoverDays');

test('returns 0 for an exact month boundary', () => {
  assert.strictEqual(calcLeftoverDays(exactMonthsAgo(1)), 0);
});

test('returns 0 for today', () => {
  assert.strictEqual(calcLeftoverDays(daysAgo(0)), 0);
});

test('returns 5 for 5 days past the 1-month mark', () => {
  // exactMonthsAgo(1) gives today minus 1 month exactly,
  // so daysAgo(35) is ~5 days past the 1-month mark (assumes ~30-day month)
  // We construct it precisely:
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setDate(d.getDate() - 5);
  const dateStr = d.toISOString().split('T')[0];
  assert.strictEqual(calcLeftoverDays(dateStr), 5);
});

// ── getDuckCount ──────────────────────────────────────────────────────────────

console.log('\ngetDuckCount');

test('returns 1 for today (0 months)', () => {
  assert.strictEqual(getDuckCount(daysAgo(0)), 1);
});

test('returns 2 for exactly 1 month ago', () => {
  assert.strictEqual(getDuckCount(exactMonthsAgo(1)), 2);
});

test('returns 13 for exactly 12 months ago', () => {
  assert.strictEqual(getDuckCount(exactMonthsAgo(12)), 13);
});

test('caps at 30 for 35 months ago', () => {
  assert.strictEqual(getDuckCount(exactMonthsAgo(35)), 30);
});

test('returns 1 for a future date', () => {
  assert.strictEqual(getDuckCount(daysAgo(-10)), 1);
});

// ── Results ───────────────────────────────────────────────────────────────────

console.log('\n' + passed + ' passed, ' + failed + ' failed\n');
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run tests to confirm they all fail**

```bash
node tests/logic.test.js
```

Expected: errors about `calcTotalDays` not being a function (module exports nothing yet).

- [ ] **Step 3: Implement all four functions in logic.js**

```js
// Ducky Land — pure date/duck logic

function calcTotalDays(startDateStr) {
  var start = new Date(startDateStr);
  var today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

function calcMonths(startDateStr) {
  var start = new Date(startDateStr);
  var today = new Date();
  var months = (today.getFullYear() - start.getFullYear()) * 12
             + (today.getMonth() - start.getMonth());
  if (today.getDate() < start.getDate()) {
    months--;
  }
  return Math.max(0, months);
}

function calcLeftoverDays(startDateStr) {
  var start = new Date(startDateStr);
  var months = calcMonths(startDateStr);
  var afterMonths = new Date(start);
  afterMonths.setMonth(afterMonths.getMonth() + months);
  afterMonths.setHours(0, 0, 0, 0);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today - afterMonths) / (1000 * 60 * 60 * 24)));
}

function getDuckCount(startDateStr) {
  var months = calcMonths(startDateStr);
  return Math.min(30, 1 + months);
}

// CommonJS export for Node.js tests — ignored in browser
if (typeof module !== 'undefined') {
  module.exports = { calcTotalDays, calcMonths, calcLeftoverDays, getDuckCount };
}
```

- [ ] **Step 4: Run tests again to confirm they all pass**

```bash
node tests/logic.test.js
```

Expected output ends with: `17 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add logic.js tests/logic.test.js
git commit -m "feat: implement pure date logic with unit tests"
```

---

## Task 8: app.js — localStorage + Modal Wiring

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write localStorage helpers and modal show/hide in app.js**

```js
// Ducky Land — app logic and DOM wiring
'use strict';

var STORAGE_KEY = 'ducky-start-date';

function loadStartDate() {
  return localStorage.getItem(STORAGE_KEY);
}

function saveStartDate(dateStr) {
  localStorage.setItem(STORAGE_KEY, dateStr);
}

function showModal() {
  var overlay = document.getElementById('modalOverlay');
  var saved = loadStartDate();
  if (saved) {
    document.getElementById('dateInput').value = saved;
  }
  overlay.classList.add('is-visible');
}

function hideModal() {
  document.getElementById('modalOverlay').classList.remove('is-visible');
}
```

- [ ] **Step 2: Wire the save button (stub startApp for now)**

Append to app.js:

```js
function startApp(startDateStr) {
  // Placeholder — implemented in later tasks
  console.log('startApp called with', startDateStr);
}

function init() {
  document.getElementById('saveBtn').addEventListener('click', function () {
    var val = document.getElementById('dateInput').value;
    if (!val) return;
    saveStartDate(val);
    hideModal();
    startApp(val);
  });

  document.getElementById('editBtn').addEventListener('click', showModal);

  var startDateStr = loadStartDate();
  if (startDateStr) {
    startApp(startDateStr);
  } else {
    showModal();
  }
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Expected:
- Modal appears automatically (no date in localStorage yet)
- Pick any date and click "Start our story" — modal fades out, console logs `startApp called with YYYY-MM-DD`
- Refresh page — modal does NOT appear (date is saved), console logs `startApp called with YYYY-MM-DD`
- Click ✏ Edit — modal reappears with the saved date pre-filled

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "feat: wire localStorage and modal open/close"
```

---

## Task 9: app.js — Duck Spawning

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add clearDucks and spawnDucks functions**

Add these before the `startApp` stub:

```js
function clearDucks() {
  document.getElementById('duckZone').innerHTML = '';
}

function spawnDucks(startDateStr) {
  clearDucks();
  var count = getDuckCount(startDateStr);
  var zone = document.getElementById('duckZone');

  for (var i = 0; i < count; i++) {
    var wrapper = document.createElement('div');
    wrapper.className = 'duck-wrapper';

    var topPct = 15 + Math.random() * 60;          // 15–75% from top
    var duration = 8 + Math.random() * 6;           // 8–14s per crossing
    var swimDelay = -(Math.random() * duration);    // negative = mid-swim on load
    var bobDelay = -(Math.random() * 2);            // stagger the bob too

    wrapper.style.top = topPct + '%';
    wrapper.style.animationDuration = duration + 's';
    wrapper.style.animationDelay = swimDelay + 's';

    var img = document.createElement('img');
    img.src = 'image.png';
    img.alt = 'duck';
    img.className = 'duck';
    img.style.animationDelay = bobDelay + 's';

    wrapper.appendChild(img);
    zone.appendChild(wrapper);
  }
}
```

- [ ] **Step 2: Replace the startApp stub to call spawnDucks**

Replace the existing `startApp` function with:

```js
function startApp(startDateStr) {
  spawnDucks(startDateStr);
}
```

- [ ] **Step 3: Verify in browser**

Refresh. Expected: ducks appear immediately swimming right-to-left, starting at different positions (negative delay puts them mid-swim). Each duck bobs gently. Count should match `1 + full months since saved date`.

- [ ] **Step 4: Test duck cap**

Temporarily set a date 35+ months ago in the browser console:
```js
localStorage.setItem('ducky-start-date', '2023-01-01'); location.reload();
```
Expected: exactly 30 ducks visible (cap in effect).

Restore your real date afterward.

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat: implement duck spawning"
```

---

## Task 10: app.js — Counter Display + Toggle

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add mode state and updateCounter function**

Add after the `STORAGE_KEY` declaration:

```js
var mode = 'months'; // 'months' | 'days'
var counterInterval = null;
```

Add a new `updateCounter` function before `startApp`:

```js
function updateCounter(startDateStr) {
  var numEl  = document.getElementById('counterNumber');
  var unitEl = document.getElementById('counterUnit');
  var totalDays = calcTotalDays(startDateStr);

  if (totalDays <= 0) {
    numEl.textContent  = 'Day 1';
    unitEl.textContent = '';
    return;
  }

  if (mode === 'days') {
    numEl.textContent  = totalDays;
    unitEl.textContent = totalDays === 1 ? 'day' : 'days';
    return;
  }

  // months mode (default)
  var months   = calcMonths(startDateStr);
  var leftover = calcLeftoverDays(startDateStr);

  if (months === 0) {
    numEl.textContent  = totalDays;
    unitEl.textContent = totalDays === 1 ? 'day' : 'days';
  } else {
    numEl.textContent  = months;
    unitEl.textContent = (months === 1 ? 'month' : 'months') +
                         ', ' + leftover + ' ' + (leftover === 1 ? 'day' : 'days');
  }
}
```

- [ ] **Step 2: Update startApp to call updateCounter + setInterval**

Replace the current `startApp` function:

```js
function startApp(startDateStr) {
  spawnDucks(startDateStr);
  updateCounter(startDateStr);
  if (counterInterval) clearInterval(counterInterval);
  counterInterval = setInterval(function () {
    updateCounter(loadStartDate());
  }, 60000);
}
```

- [ ] **Step 3: Wire the toggle button inside init()**

Add this inside `init()`, after the `editBtn` listener:

```js
  document.getElementById('toggleBtn').addEventListener('click', function () {
    mode = mode === 'months' ? 'days' : 'months';
    var saved = loadStartDate();
    if (saved) updateCounter(saved);
  });
```

- [ ] **Step 4: Verify counter in browser**

Refresh. Expected:
- Counter shows correct months + leftover days (e.g., "3 months, 12 days")
- Clicking "Days ↔ Months" switches to total days and back
- Toggle switch has spring-bounce press animation

- [ ] **Step 5: Test edge case — today as start date**

In console: `localStorage.setItem('ducky-start-date', new Date().toISOString().split('T')[0]); location.reload();`

Expected: counter shows "Day 1", 1 duck visible.

Restore real date afterward.

- [ ] **Step 6: Test edge case — future date**

In console: `localStorage.setItem('ducky-start-date', '2030-01-01'); location.reload();`

Expected: counter shows "Day 1", 1 duck visible.

Restore real date.

- [ ] **Step 7: Commit**

```bash
git add app.js
git commit -m "feat: implement counter display and days/months toggle"
```

---

## Task 11: Final Verification + .gitignore Cleanup

**Files:**
- Verify: all files
- Modify: `.gitignore` (if tests/ not excluded)

- [ ] **Step 1: Run unit tests one final time**

```bash
node tests/logic.test.js
```

Expected: `17 passed, 0 failed`

- [ ] **Step 2: Full browser walkthrough — first visit flow**

Clear localStorage: open DevTools → Application → Local Storage → clear all. Refresh.

Check:
- [ ] Modal appears with correct heading and empty date picker
- [ ] Cannot dismiss modal by clicking outside (overlay blocks, no close button)
- [ ] Saving a date dismisses modal and shows ducks + counter

- [ ] **Step 3: Full browser walkthrough — returning visit flow**

Without clearing localStorage, refresh the page.

Check:
- [ ] Modal does NOT appear
- [ ] Ducks are immediately swimming
- [ ] Counter shows correct duration
- [ ] ✏ Edit opens modal with saved date pre-filled
- [ ] Changing the date updates ducks and counter

- [ ] **Step 4: Check reduced-motion**

In DevTools → Rendering → Emulate CSS media: prefers-reduced-motion. Refresh.

Expected: ducks are frozen in place, pond shimmer is static, modal transitions are instant.

- [ ] **Step 5: Check small screen**

DevTools → device toolbar → iPhone SE (375px). Verify counter widget fits. Narrow to 360px — counter and ducks shrink.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: ducky land complete"
```

---

## Summary

| Task | Deliverable |
|---|---|
| 1 | index.html scaffold, empty CSS/JS, .gitignore |
| 2 | Pixel pond background with shimmer |
| 3 | Glass counter widget styles |
| 4 | Date modal styles |
| 5 | Duck swim + bob animation CSS |
| 6 | Responsive small-screen breakpoint |
| 7 | logic.js pure functions with unit tests (17 tests, all green) |
| 8 | localStorage + modal open/close wiring |
| 9 | Duck spawning (random Y, staggered, capped at 30) |
| 10 | Counter display + Days↔Months toggle + setInterval |
| 11 | Full verification across all edge cases |
