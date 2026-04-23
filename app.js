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

function startApp(startDateStr) {
  // Placeholder — implemented in Tasks 9 and 10
  console.log('startApp called with', startDateStr);
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
