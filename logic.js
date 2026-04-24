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
  var y = start.getFullYear();
  var m = start.getMonth() + months;
  // Advance year if months overflows 12
  y += Math.floor(m / 12);
  m = m % 12;
  // Clamp day to last day of target month to prevent setMonth overflow
  var maxDay = new Date(y, m + 1, 0).getDate();
  var day = Math.min(start.getDate(), maxDay);
  var afterMonths = new Date(y, m, day);
  afterMonths.setHours(0, 0, 0, 0);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today - afterMonths) / (1000 * 60 * 60 * 24)));
}

function getDuckCount(startDateStr) {
  var months = calcMonths(startDateStr);
  return Math.min(30, 1 + months);
}

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

// CommonJS export for Node.js tests — ignored in browser
if (typeof module !== 'undefined') {
  module.exports = { calcTotalDays, calcMonths, calcLeftoverDays, getDuckCount, calcDaysUntilNextDuck };
}
