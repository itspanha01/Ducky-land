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
