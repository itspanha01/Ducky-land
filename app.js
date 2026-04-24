// Ducky Land — app logic and DOM wiring
'use strict';

var STORAGE_KEY      = 'ducky-start-date';
var NAMES_KEY        = 'ducky-names';
var mode             = 'months'; // 'months' | 'days'
var counterInterval  = null;
var flipIntervals    = [];
var openEditor       = null;

var QUACK_SOUNDS = ['Duck 1.mp3', 'Duck 2.mp3', 'Duck 3.mp3', 'Duck 4.mp3'].map(function (src) {
  var a = new Audio(src);
  a.volume = 0.6;
  return a;
});

function loadStartDate() {
  return localStorage.getItem(STORAGE_KEY);
}

function saveStartDate(dateStr) {
  localStorage.setItem(STORAGE_KEY, dateStr);
}

function loadNames() {
  try { return JSON.parse(localStorage.getItem(NAMES_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveName(index, name) {
  var names = loadNames();
  names[index] = name;
  localStorage.setItem(NAMES_KEY, JSON.stringify(names));
}

function showModal() {
  var overlay = document.getElementById('modalOverlay');
  var saved = loadStartDate();
  if (saved) document.getElementById('dateInput').value = saved;
  overlay.classList.add('is-visible');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(function () { document.getElementById('dateInput').focus(); }, 50);
}

function hideModal() {
  var overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('is-visible');
  overlay.setAttribute('aria-hidden', 'true');
}

function clearDucks() {
  flipIntervals.forEach(clearInterval);
  flipIntervals = [];
  openEditor = null;
  document.getElementById('duckZone').innerHTML = '';
}

function showQuack(wrapper) {
  var existing = wrapper.querySelector('.quack-bubble');
  if (existing) existing.remove();
  var bubble = document.createElement('div');
  bubble.className = 'quack-bubble';
  bubble.textContent = 'Quack!';
  wrapper.appendChild(bubble);
  bubble.addEventListener('animationend', function () { bubble.remove(); });
}

function closeOpenEditor() {
  if (openEditor) {
    openEditor.classList.remove('open');
    openEditor = null;
  }
}

function spawnDucks(startDateStr) {
  clearDucks();
  var count = getDuckCount(startDateStr);
  var names = loadNames();
  var zone  = document.getElementById('duckZone');

  for (var i = 0; i < count; i++) {
    (function (index) {
      var wrapper = document.createElement('div');
      wrapper.className = 'duck-wrapper';

      var topPct    = 15 + Math.random() * 60;
      var duration  = 20 + Math.random() * 12;
      var swimDelay = -(Math.random() * duration);
      var bobDelay  = -(Math.random() * 2.5);

      wrapper.style.top               = topPct + '%';
      wrapper.style.animationDuration = duration + 's';
      wrapper.style.animationDelay    = swimDelay + 's';
      wrapper.style.opacity           = '0';

      // Layer 1: flip (scaleX only)
      var flipDiv = document.createElement('div');
      flipDiv.className = 'duck-flip';

      var ripple = document.createElement('div');
      ripple.className = 'duck-ripple';

      // Layer 2: bob (translateY only)
      var img = document.createElement('img');
      img.src = 'image.png';
      img.alt = 'duck';
      img.className = 'duck';
      img.style.animationDelay = bobDelay + 's';

      flipDiv.appendChild(ripple);
      flipDiv.appendChild(img);
      wrapper.appendChild(flipDiv);

      // Name badge — visible when named, click opens editor
      var currentName = names[index] || '';
      var badge = document.createElement('div');
      badge.className = 'duck-name-badge';
      badge.textContent = currentName;
      badge.style.display = currentName ? 'block' : 'none';
      wrapper.appendChild(badge);

      // Name editor popup
      var editor = document.createElement('div');
      editor.className = 'duck-editor';

      var editorLabel = document.createElement('label');
      editorLabel.textContent = "Duck's name";

      var editorInput = document.createElement('input');
      editorInput.type = 'text';
      editorInput.maxLength = 20;
      editorInput.placeholder = 'Give me a name…';
      editorInput.value = currentName;

      editor.appendChild(editorLabel);
      editor.appendChild(editorInput);
      wrapper.appendChild(editor);
      zone.appendChild(wrapper);

      // ── Open / close editor ──────────────────────
      function openNameEditor(e) {
        if (e) e.stopPropagation();
        if (editor.classList.contains('open')) return;
        closeOpenEditor();
        editor.classList.add('open');
        openEditor = editor;
        setTimeout(function () { editorInput.focus(); editorInput.select(); }, 50);
      }

      function commitName() {
        var val = editorInput.value.trim();
        saveName(index, val);
        currentName = val;
        badge.textContent = val;
        badge.style.display = val ? 'block' : 'none';
        editor.classList.remove('open');
        if (openEditor === editor) openEditor = null;
      }

      editorInput.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.key === 'Enter')  commitName();
        if (e.key === 'Escape') { editor.classList.remove('open'); openEditor = null; }
      });
      editorInput.addEventListener('blur', function () {
        setTimeout(commitName, 150);
      });

      // ── Duck single click: quack + pause ──────────
      var clickTimer = null;
      img.addEventListener('click', function (e) {
        e.stopPropagation();
        clearTimeout(clickTimer);
        clickTimer = setTimeout(function () {
          showQuack(wrapper);
          var snd = QUACK_SOUNDS[Math.floor(Math.random() * QUACK_SOUNDS.length)];
          snd.currentTime = 0;
          snd.play();
          wrapper.style.animationPlayState = 'paused';
          img.style.animationPlayState = 'paused';
          setTimeout(function () {
            wrapper.style.animationPlayState = '';
            img.style.animationPlayState = '';
          }, 1200);
        }, 220);
      });

      // ── Duck double click: open name editor ────────
      img.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        clearTimeout(clickTimer);
        openNameEditor(e);
      });

      // ── Badge click: always opens editor ──────────
      badge.addEventListener('click', function (e) {
        e.stopPropagation();
        openNameEditor(e);
      });

      // ── Staggered fade-in ──────────────────────────
      setTimeout(function () {
        wrapper.style.transition = 'opacity 600ms ease';
        wrapper.style.opacity = '1';
      }, index * 100);

      // ── Direction flip: measure actual movement ────
      // Comparing real screen position every 200ms is simpler and
      // always correct regardless of animation timing math.
      var lastX = null;
      function updateFlip() {
        var currentX = wrapper.getBoundingClientRect().left;
        if (lastX !== null) {
          var delta = currentX - lastX;
          if (delta < -0.5) {
            flipDiv.classList.add('flipped');
          } else if (delta > 0.5) {
            flipDiv.classList.remove('flipped');
          }
        }
        lastX = currentX;
      }
      var id = setInterval(updateFlip, 200);
      flipIntervals.push(id);

    })(i);
  }
}

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
  if (!loadStartDate()) return;
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

var lastCounterNum = null;

function popCounter() {
  var numEl = document.getElementById('counterNumber');
  numEl.classList.remove('pop');
  void numEl.offsetWidth;
  numEl.classList.add('pop');
}

function updateCounter(startDateStr) {
  var numEl     = document.getElementById('counterNumber');
  var unitEl    = document.getElementById('counterUnit');
  var btnEl     = document.getElementById('toggleBtn');
  var totalDays = calcTotalDays(startDateStr);
  var newNum, newUnit;

  if (totalDays <= 0) {
    newNum  = 'Day 1';
    newUnit = '';
    btnEl.textContent = mode === 'months' ? 'Show days' : 'Show months';
  } else if (mode === 'days') {
    newNum  = totalDays;
    newUnit = totalDays === 1 ? 'day' : 'days';
    btnEl.textContent = 'Show months';
  } else {
    var months   = calcMonths(startDateStr);
    var leftover = calcLeftoverDays(startDateStr);
    btnEl.textContent = 'Show days';
    if (months === 0) {
      newNum  = totalDays;
      newUnit = totalDays === 1 ? 'day' : 'days';
    } else {
      newNum  = months;
      newUnit = (months === 1 ? 'month' : 'months') +
                ', ' + leftover + ' ' + (leftover === 1 ? 'day' : 'days');
    }
  }

  if (String(newNum) !== String(lastCounterNum)) {
    numEl.textContent  = newNum;
    unitEl.textContent = newUnit;
    popCounter();
    lastCounterNum = newNum;
  }
}

function startApp(startDateStr) {
  spawnDucks(startDateStr);
  lastCounterNum = null;
  updateCounter(startDateStr);
  if (counterInterval) clearInterval(counterInterval);
  counterInterval = setInterval(function () {
    updateCounter(loadStartDate());
  }, 60000);
}

function init() {
  var counter = document.getElementById('counter');
  counter.setAttribute('role', 'status');
  counter.setAttribute('aria-live', 'polite');

  var overlay = document.getElementById('modalOverlay');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modalHeading');
  overlay.setAttribute('aria-hidden', 'true');

  document.getElementById('saveBtn').addEventListener('click', function () {
    var val = document.getElementById('dateInput').value;
    if (!val) return;
    saveStartDate(val);
    hideModal();
    startApp(val);
  });

  document.getElementById('editBtn').addEventListener('click', showModal);

  document.getElementById('toggleBtn').addEventListener('click', function () {
    mode = mode === 'months' ? 'days' : 'months';
    var saved = loadStartDate();
    if (saved) { lastCounterNum = null; updateCounter(saved); }
  });

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

  var startDateStr = loadStartDate();
  if (startDateStr) {
    startApp(startDateStr);
  } else {
    showModal();
  }
}

document.addEventListener('DOMContentLoaded', init);

// ── Day / Night + leaves / fireflies ──────────────────────────────────────
(function () {
  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var isNight       = localStorage.getItem('ducky-night') === 'true';
  var leafContainer = document.getElementById('leavesContainer');
  var ffContainer   = document.getElementById('firefliesContainer');
  var btn           = document.getElementById('nightModeBtn');

  var LEAF_COLORS = ['#c8a030', '#d4672a', '#b03a1a', '#e8c048', '#8c9a30', '#c05828'];

  // ── Leaves ─────────────────────────────────────
  function spawnLeaf() {
    if (isNight) return;
    var leaf = document.createElement('div');
    leaf.className = 'leaf';
    var size = 10 + Math.random() * 14;
    leaf.style.width           = size + 'px';
    leaf.style.height          = (size * 0.65) + 'px';
    leaf.style.left            = (Math.random() * 100) + 'vw';
    leaf.style.backgroundColor = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
    leaf.style.animation       = 'leaf-fall ' + (12 + Math.random() * 8) + 's linear forwards';
    leafContainer.appendChild(leaf);
    leaf.addEventListener('animationend', function () { leaf.remove(); });
  }

  function scheduleLeaf() {
    if (isNight) return;
    setTimeout(function () { spawnLeaf(); scheduleLeaf(); }, 600 + Math.random() * 1000);
  }

  // ── Fireflies ───────────────────────────────────
  function spawnFirefly() {
    if (!isNight) return;
    var f = document.createElement('div');
    f.className    = 'firefly';
    var size       = 3 + Math.random() * 4;
    f.style.width  = size + 'px';
    f.style.height = size + 'px';
    f.style.left   = (5 + Math.random() * 90) + 'vw';
    f.style.top    = (10 + Math.random() * 78) + 'vh';
    var floatDur   = (5 + Math.random() * 6) + 's';
    var glowDur    = (1 + Math.random() * 1.5) + 's';
    f.style.animation = 'firefly-float ' + floatDur + ' ease-in-out forwards, '
                      + 'firefly-glow '  + glowDur  + ' ease-in-out infinite';
    ffContainer.appendChild(f);
    f.addEventListener('animationend', function (e) {
      if (e.animationName === 'firefly-float') f.remove();
    });
  }

  function scheduleFirefly() {
    if (!isNight) return;
    setTimeout(function () { spawnFirefly(); scheduleFirefly(); }, 300 + Math.random() * 700);
  }

  // ── Apply mode ──────────────────────────────────
  function applyMode() {
    document.body.classList.toggle('night-mode', isNight);
    btn.textContent = isNight ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isNight ? 'Switch to day mode' : 'Switch to night mode');

    leafContainer.innerHTML = '';
    ffContainer.innerHTML   = '';

    if (noMotion) return;

    if (isNight) {
      for (var i = 0; i < 10; i++) (function (j) { setTimeout(spawnFirefly, j * 180); })(i);
      scheduleFirefly();
    } else {
      for (var i = 0; i < 6; i++) (function (j) { setTimeout(spawnLeaf, j * 400); })(i);
      scheduleLeaf();
    }
  }

  btn.addEventListener('click', function () {
    isNight = !isNight;
    localStorage.setItem('ducky-night', isNight);
    applyMode();
  });

  applyMode();
}());

// ── Fish bubbles ───────────────────────────────────────────────────────────
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var container = document.getElementById('bubblesContainer');

  function spawnBubble() {
    var b = document.createElement('div');
    b.className = 'bubble';

    var size = 4 + Math.random() * 9;
    b.style.width    = size + 'px';
    b.style.height   = size + 'px';
    b.style.left     = (2 + Math.random() * 96) + 'vw';
    b.style.bottom   = (Math.random() * 15) + 'vh';
    b.style.animationName           = 'bubble-rise';
    b.style.animationDuration       = (9 + Math.random() * 9) + 's';
    b.style.animationTimingFunction = 'linear';
    b.style.animationFillMode       = 'forwards';

    container.appendChild(b);
    b.addEventListener('animationend', function () { b.remove(); });
  }

  function scheduleNext() {
    setTimeout(function () { spawnBubble(); scheduleNext(); }, 1000 + Math.random() * 1800);
  }

  for (var i = 0; i < 5; i++) setTimeout(spawnBubble, i * 700);
  scheduleNext();
}());

// ── Background music ───────────────────────────────────────────────────────
(function () {
  var audio   = document.getElementById('bgMusic');
  var btn     = document.getElementById('musicBtn');
  var playing = false;

  audio.volume = 0.4;

  btn.addEventListener('click', function () {
    if (playing) {
      audio.pause();
      btn.textContent = '🔇';
      btn.setAttribute('aria-label', 'Play music');
    } else {
      audio.play();
      btn.textContent = '🔊';
      btn.setAttribute('aria-label', 'Mute music');
    }
    playing = !playing;
  });
}());
