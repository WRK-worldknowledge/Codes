console.log("ALL DATA LENGTH:", allData.length);
let dataLoaded = false;
let allData=[], gameData=[], i=0, score=0, time=60, timer;
let mode='train', gameType='code-to-city';
let tiltState='neutral';

fetch('iata.json')
  .then(r => r.json())
  .then(d => {
    allData = d;
    dataLoaded = true;

    const mods = [...new Set(d.map(x => x.module))];
    const c = document.getElementById('modules');
    c.innerHTML = "";

    mods.forEach(m => {
      c.innerHTML += `<label><input type="checkbox" value="${m}" checked> ${m}</label>`;
    });
  })
  .catch(err => {
    console.error("Failed to load iata.json", err);
  });


function setMode(m){
  mode=m;
  document.getElementById('modules').style.display = m==='exam' ? 'none':'block';
}

function setGameType(t){
  gameType=t;
}

function show(){
  if (!gameData || gameData.length === 0) return;

  if (i >= gameData.length) i = 0;

  const item = gameData[i];

  const text = (gameType === 'city-to-code')
    ? item.code
    : item.city;

  document.getElementById('code').innerText = text;
}

function tick(){
  time--;
  document.getElementById('timer').innerText=`Time: ${time}s | Score: ${score}`;
  if(time<=0){ end(); }
}

function show(){
  if(!gameData.length) return;
  if(i>=gameData.length) i=0;
  const item=gameData[i];
  const text=(gameType==='city-to-code') ? item.code : item.city;
  document.getElementById('code').innerText=text;
}

function good(){
  score++;
  i++;
  show();
}

function skip(){
  i++;
  show();
}

function end(){
  clearInterval(timer);
  document.getElementById('game').classList.add('hidden');
  document.getElementById('end').classList.remove('hidden');
  document.getElementById('score').innerText=`Final score: ${score}`;
}
