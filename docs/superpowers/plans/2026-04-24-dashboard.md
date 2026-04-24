# Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bottom slide-up stats dashboard to Ducky Land, triggered by a floating 🦆 button center-bottom.

**Architecture:** New logic function in `logic.js`, new HTML panel + button in `index.html`, new CSS rules in `style.css`, three new JS functions (`renderDashboard`, `openDashboard`, `closeDashboard`) wired into the existing `init()` in `app.js`.

**Tech Stack:** Vanilla JS, HTML, CSS — no new dependencies. Tests via `node tests/logic.test.js`.

---

## File Map

| File | Change |
|------|--------|
| `logic.js` | Add `calcDaysUntilNextDuck(startDateStr)` + export it |
| `tests/logic.test.js` | Add 3 tests for `calcDaysUntilNextDuck` |
| `index.html` | Add `#dashboard` panel + `#dashboardBtn` before `</body>` |
| `style.css` | Add dashboard panel, floating button, and animation styles |
| `app.js` | Add `renderDashboard`, `openDashboard`, `closeDashboard`; update `init()` |

---

## Task 1: Add `calcDaysUntilNextDuck` to `logic.js` (TDD)

**Files:**
- Modify: `tests/logic.test.js`
- Modify: `logic.js`

- [ ] **Step 1: Write the failing tests**

Open `tests/logic.test.js`. Import the new function by changing line 5:

```js
const { calcTotalDays, calcMonths, calcLeftoverDays, getDuckCount, calcDaysUntilNextDuck } = require('../logic.js');
```

Append these tests at the bottom, before the `// ── Results` block:

```js
// ── calcDaysUntilNextDuck ─────────────────────────────────────────────────────

console.log('\ncalcDaysUntilNextDuck');

test('returns 0 when duck count is at max (30 ducks)', () => {
  assert.strictEqual(calcDaysUntilNextDuck(exactMonthsAgo(35)), 0);
});

test('returns positive integer when not at max', () => {
  const result = calcDaysUntilNextDuck(exactMonthsAgo(1));
  assert.ok(result > 0, 'expected positive days, got ' + result);
});

test('returns at most 31 (never more than one month away)', () => {
  const result = calcDaysUntilNextDuck(daysAgo(0));
  assert.ok(result <= 31, 'expected <= 31 days, got ' + result);
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
node tests/logic.test.js
```

Expected: last 3 tests fail with `calcDaysUntilNextDuck is not a function`.

- [ ] **Step 3: Implement `calcDaysUntilNextDuck` in `logic.js`**

Add this function after `getDuckCount`, before the CommonJS export block:

```js
function calcDaysUntilNextDuck(startDateStr) {
  if (getDuckCount(startDateStr) >= 30) return 0;
  var months = calcMonths(startDateStr);
  var start  = new Date(startDateStr);
  var nextMonthCount = months + 1;
  var y = start.getFullYear();
  var m = start.getMonth() + nextMonthCount;
  y += Math.floor(m / 12);
  m  = m % 12;
  var maxDay   = new Date(y, m + 1, 0).getDate();
  var day      = Math.min(start.getDate(), maxDay);
  var nextDate = new Date(y, m, day);
  nextDate.setHours(0, 0, 0, 0);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((nextDate - today) / (1000 * 60 * 60 * 24)));
}
```

Update the CommonJS export at the bottom of `logic.js` (line 47):

```js
if (typeof module !== 'undefined') {
  module.exports = { calcTotalDays, calcMonths, calcLeftoverDays, getDuckCount, calcDaysUntilNextDuck };
}
```

- [ ] **Step 4: Run tests to confirm all pass**

```bash
node tests/logic.test.js
```

Expected: all tests pass, `0 failed`.

- [ ] **Step 5: Commit**

```bash
git add logic.js tests/logic.test.js
git commit -m "feat: add calcDaysUntilNextDuck logic"
```

---

## Task 2: Add HTML for dashboard panel and floating button

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the dashboard panel and button**

In `index.html`, insert the following immediately before `<script src="logic.js"></script>` (currently line 71):

```html
  <!-- Dashboard panel -->
  <div class="dashboard" id="dashboard" role="dialog" aria-label="Stats dashboard" aria-hidden="true">
    <div class="dashboard__header">
      <span class="dashboard__title">Our Story 🐥</span>
      <button class="dashboard__close" id="dashboardClose" aria-label="Close dashboard">×</button>
    </div>
    <div class="dashboard__content">
      <div class="dashboard__stats-grid">
        <div class="dashboard__stat">
          <div class="dashboard__stat-label">Days Together</div>
          <div class="dashboard__stat-value" id="dashStat-days">—</div>
        </div>
        <div class="dashboard__stat">
          <div class="dashboard__stat-label">Months Together</div>
          <div class="dashboard__stat-value dashboard__stat-value--sm" id="dashStat-months">—</div>
        </div>
        <div class="dashboard__stat">
          <div class="dashboard__stat-label">Ducks Swimming</div>
          <div class="dashboard__stat-value" id="dashStat-ducks">—</div>
        </div>
        <div class="dashboard__stat">
          <div class="dashboard__stat-label">Next Duck</div>
          <div class="dashboard__stat-value dashboard__stat-value--sm" id="dashStat-next">—</div>
        </div>
      </div>
      <div class="dashboard__duck-section">
        <div class="dashboard__duck-header" id="dashStat-named-header">— ducks named</div>
        <div class="dashboard__duck-list" id="dashStat-duck-list"></div>
      </div>
    </div>
  </div>

  <!-- Floating dashboard trigger -->
  <button class="dashboard-btn" id="dashboardBtn" aria-label="Open stats dashboard">🦆</button>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add dashboard panel and floating button HTML"
```

---

## Task 3: Add CSS for dashboard panel and floating button

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Append dashboard styles to the end of `style.css`**

```css
/* ── Dashboard floating button ───────────────── */
.dashboard-btn {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: dashBtnBounce 1.2s ease-in-out infinite alternate;
}

@keyframes dashBtnBounce {
  from { transform: translateX(-50%) translateY(0);   }
  to   { transform: translateX(-50%) translateY(-6px); }
}

/* ── Dashboard panel ─────────────────────────── */
.dashboard {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background: rgba(6, 40, 48, 0.93);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--glass-border);
  border-radius: 20px 20px 0 0;
  transform: translateY(100%);
  transition: transform 300ms ease;
  z-index: 200;
  display: flex;
  flex-direction: column;
}

.dashboard.is-open {
  transform: translateY(0);
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--glass-border);
  flex-shrink: 0;
}

.dashboard__title {
  font-family: 'Fredoka', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--teal-accent);
  letter-spacing: 0.5px;
}

.dashboard__close {
  background: none;
  border: none;
  color: var(--teal-accent);
  font-size: 22px;
  cursor: pointer;
  padding: 4px 8px;
  opacity: 0.7;
  transition: opacity 150ms;
  line-height: 1;
}

.dashboard__close:hover { opacity: 1; }

.dashboard__content {
  overflow-y: auto;
  padding: 16px 20px 24px;
  flex: 1;
}

.dashboard__stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.dashboard__stat {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 12px 14px;
}

.dashboard__stat-label {
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--teal-accent);
  opacity: 0.75;
  margin-bottom: 6px;
}

.dashboard__stat-value {
  font-family: 'Fredoka', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-white);
  line-height: 1.1;
}

.dashboard__stat-value--sm {
  font-size: 15px;
}

.dashboard__duck-section {
  border-top: 1px solid var(--glass-border);
  padding-top: 14px;
}

.dashboard__duck-header {
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--teal-accent);
  opacity: 0.75;
  margin-bottom: 10px;
}

.dashboard__duck-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dashboard__duck-item {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: var(--text-white);
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.dashboard__duck-item--unnamed {
  color: var(--teal-accent);
  opacity: 0.45;
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "feat: add dashboard CSS styles"
```

---

## Task 4: Add dashboard JS logic and wire events in `app.js`

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add `renderDashboard`, `openDashboard`, `closeDashboard` functions**

In `app.js`, add these three functions immediately before the `var lastCounterNum = null;` line (currently line 221):

```js
function renderDashboard() {
  var startDateStr = loadStartDate();
  if (!startDateStr) return;

  var totalDays     = calcTotalDays(startDateStr);
  var months        = calcMonths(startDateStr);
  var leftover      = calcLeftoverDays(startDateStr);
  var duckCount     = getDuckCount(startDateStr);
  var daysUntilNext = calcDaysUntilNextDuck(startDateStr);
  var names         = loadNames();

  document.getElementById('dashStat-days').textContent = totalDays;

  var monthsText;
  if (months === 0) {
    monthsText = totalDays + (totalDays === 1 ? ' day' : ' days');
  } else {
    monthsText = months + (months === 1 ? ' month' : ' months') +
                 ', ' + leftover + (leftover === 1 ? ' day' : ' days');
  }
  document.getElementById('dashStat-months').textContent = monthsText;

  document.getElementById('dashStat-ducks').textContent = duckCount;

  var nextEl = document.getElementById('dashStat-next');
  if (duckCount >= 30) {
    nextEl.textContent = 'Max ducks! 🎉';
  } else {
    nextEl.textContent = daysUntilNext + (daysUntilNext === 1 ? ' day' : ' days');
  }

  var namedCount = 0;
  var listEl = document.getElementById('dashStat-duck-list');
  listEl.innerHTML = '';
  for (var i = 0; i < duckCount; i++) {
    var name = names[i] || '';
    if (name) namedCount++;
    var item = document.createElement('div');
    item.className = 'dashboard__duck-item' + (name ? '' : ' dashboard__duck-item--unnamed');
    item.textContent = name || ('Duck #' + (i + 1));
    listEl.appendChild(item);
  }
  document.getElementById('dashStat-named-header').textContent =
    namedCount + ' of ' + duckCount + ' ducks named';
}

function openDashboard() {
  renderDashboard();
  var panel = document.getElementById('dashboard');
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
}

function closeDashboard() {
  var panel = document.getElementById('dashboard');
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
}
```

- [ ] **Step 2: Update event listeners in `init()`**

In `init()`, replace the two existing event listener lines for the pond click and keydown (currently lines 304-307):

**Old:**
```js
  document.getElementById('pond').addEventListener('click', closeOpenEditor);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOpenEditor();
  });
```

**New:**
```js
  document.getElementById('pond').addEventListener('click', function () {
    closeOpenEditor();
    closeDashboard();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeOpenEditor();
      closeDashboard();
    }
  });

  document.getElementById('dashboardBtn').addEventListener('click', function () {
    var panel = document.getElementById('dashboard');
    if (panel.classList.contains('is-open')) {
      closeDashboard();
    } else {
      openDashboard();
    }
  });
  document.getElementById('dashboardClose').addEventListener('click', closeDashboard);
```

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add dashboard open/close/render logic"
```

---

## Task 5: Manual smoke test

- [ ] **Step 1: Open `index.html` in a browser**

Verify:
- The 🦆 floating button is visible center-bottom, gently bouncing
- Clicking it slides up the dashboard panel
- All 4 stat cards show real values (days, months, ducks, next duck)
- The duck list shows named ducks by name, unnamed as "Duck #N" in muted style
- The named count header is accurate (e.g. "2 of 5 ducks named")
- The × close button dismisses the panel
- Clicking the pond (above the panel) dismisses it
- Pressing Escape dismisses it
- Clicking 🦆 again while open dismisses it
- No console errors
