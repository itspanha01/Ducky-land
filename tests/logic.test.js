// tests/logic.test.js — run with: node tests/logic.test.js
'use strict';

const assert = require('assert');
const { calcTotalDays, calcMonths, calcLeftoverDays, getDuckCount, calcDaysUntilNextDuck } = require('../logic.js');

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
  // Build exactly: 1 month + 5 days ago
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setDate(d.getDate() - 5);
  const dateStr = d.toISOString().split('T')[0];
  assert.strictEqual(calcLeftoverDays(dateStr), 5);
});

test('handles month-end start date without overflow (e.g. Jan 31)', () => {
  // A start date of Jan 31 + 1 month should give Feb 28/29, not Mar 3
  // We can't hardcode a date here, so we construct one
  // Find a month-end date that would overflow: pick a date 31 days back
  // then verify leftoverDays is less than 31 (not overflowed into next month)
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  d.setDate(1); // first of that month
  // Set to last day of that month
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(lastDay);
  const dateStr = d.toISOString().split('T')[0];
  const result = calcLeftoverDays(dateStr);
  // Result should be days since end of that month — must be < 31 and >= 0
  assert.ok(result >= 0, 'leftover days should not be negative');
  assert.ok(result < 31, 'leftover days should not overflow into next month (got ' + result + ')');
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

// ── Results ───────────────────────────────────────────────────────────────────

console.log('\n' + passed + ' passed, ' + failed + ' failed\n');
if (failed > 0) process.exit(1);
