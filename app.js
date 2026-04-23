// Ducky Land — app logic and DOM wiring
'use strict';

var STORAGE_KEY = 'ducky-start-date';
var mode = 'months'; // 'months' | 'days'
var counterInterval = null;

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
  overlay.setAttribute('aria-hidden', 'false');
  // Move focus to date input for accessibility
  setTimeout(function () {
    document.getElementById('dateInput').focus();
  }, 50);
}

function hideModal() {
  var overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('is-visible');
  overlay.setAttribute('aria-hidden', 'true');
}

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

    var topPct = 15 + Math.random() * 60;        // 15–75% from top
    var duration = 8 + Math.random() * 6;         // 8–14s per crossing
    var swimDelay = -(Math.random() * duration);  // negative = mid-swim on load
    var bobDelay = -(Math.random() * 2);          // stagger the bob

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

function startApp(startDateStr) {
  spawnDucks(startDateStr);
  updateCounter(startDateStr);
  if (counterInterval) clearInterval(counterInterval);
  counterInterval = setInterval(function () {
    updateCounter(loadStartDate());
  }, 60000);
}

function init() {
  // Accessibility: counter live region
  var counter = document.getElementById('counter');
  counter.setAttribute('role', 'status');
  counter.setAttribute('aria-live', 'polite');

  // Accessibility: modal attributes
  var overlay = document.getElementById('modalOverlay');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modalHeading');
  overlay.setAttribute('aria-hidden', 'true');

  // Save button
  document.getElementById('saveBtn').addEventListener('click', function () {
    var val = document.getElementById('dateInput').value;
    if (!val) return;
    saveStartDate(val);
    hideModal();
    startApp(val);
  });

  // Edit button
  document.getElementById('editBtn').addEventListener('click', showModal);

  // Toggle button
  document.getElementById('toggleBtn').addEventListener('click', function () {
    mode = mode === 'months' ? 'days' : 'months';
    var saved = loadStartDate();
    if (saved) updateCounter(saved);
  });

  // Start or show modal
  var startDateStr = loadStartDate();
  if (startDateStr) {
    startApp(startDateStr);
  } else {
    showModal();
  }
}

document.addEventListener('DOMContentLoaded', init);
