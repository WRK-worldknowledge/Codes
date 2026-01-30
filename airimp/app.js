let allData = [];
let gameData = [];
let i = 0;
let score = 0;
let time = 60;
let timer;
let mode = 'train';
let gameType = 'code-to-city';
let tiltState = 'neutral';

// Load data
fetch('iata.json')
  .then(r => r.json())
  .then(d => {
    allData = d;

    const mods = [...new Set(d.map(x => x.module))];
    const c = document.getElementById('modules');
    if (!c) return;

    c.innerHTML = "";
    mods.forEach(m => {
      c.innerHTML += `<label><input type="checkbox" value="${m}" checked> ${m}</label>`;
    });
  });

// Mode
function setMode(m) {
  mode = m;
  const modules = document.getElementById('modules');
  if (modules) modules.style.display = m === 'exam' ? 'none' : 'block';
}

// Game type
function setGameType(t) {
  gameType = t;
}

// Start game
function startGame() {
  if (!allData || allData.length === 0) {
    alert("Loading data, try again");
    return;
  }

  const checked = [...document.querySelectorAll('#modules input:checked')].map(x => x.value);

  gameData = mode === 'exam'
    ? allData.slice()
    : allData.filter(x => checked.includes(x.module));

  if (gameData.length === 0) gameData = allData.slice();

  gameData.sort(() => Math.random() - 0.5);

  document.getElementById('start').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');

  score = 0;
  i = 0;
  time = 60;

  timer = setInterval(tick, 1000);

  initTilt();
  show();
}

// Timer
function tick() {
  time--;
  document.getElementById('timer').innerText = `Time: ${time}s | Score: ${score}`;
  if (time <= 0) end();
}

// Show current card
function show() {
  if (!gameData || gameData.length === 0) return;

  if (i >= gameData.length) i = 0;

  const item = gameData[i];
  const text = (gameType === 'city-to-code')
    ? item.code
    : item.city;

  document.getElementById('code').innerText = text;
}

// Correct
function good() {
  score++;
  i++;
  show();
}

// Wrong
function skip() {
  i++;
  show();
}

// End game
function end() {
  clearInterval(timer);
  document.getElementById('game').classList.add('hidden');
  document.getElementById('end').classList.remove('hidden');
  document.getElementById('score').innerText = `Final score: ${score}`;
}

// STABLE TILT — OPEN DAY SAFE
function initTilt() {
  let lastTrigger = 0;

  window.addEventListener('deviceorientation', e => {
    const gamma = e.gamma;
    const now = Date.now();

    if (now - lastTrigger < 700) return;

    if (gamma > 35 && tiltState !== 'right') {
      tiltState = 'right';
      lastTrigger = now;
      good();
    }

    if (gamma < -35 && tiltState !== 'left') {
      tiltState = 'left';
      lastTrigger = now;
      skip();
    }

    if (gamma > -15 && gamma < 15) {
      tiltState = 'neutral';
    }
  });
}
