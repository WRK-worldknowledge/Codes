
let allData=[], gameData=[], i=0, score=0, time=60, timer;
let mode='train', gameType='code-to-city';
let tiltState='neutral';
let countdownActive = false;

fetch('iata.json').then(r=>r.json()).then(d=>{
  allData=d;
  const mods=[...new Set(d.map(x=>x.module))];
  const c=document.getElementById('modules');
  c.innerHTML="";
  mods.forEach(m=>{
    c.innerHTML+=`<label><input type="checkbox" value="${m}" checked> ${m}</label>`;
  });
});

function setMode(m){
  mode=m;
  document.getElementById('modules').style.display = m==='exam' ? 'none':'block';
}

function setGameType(t){
  gameType=t;
}

function startGame(){
  const checked=[...document.querySelectorAll('#modules input:checked')].map(x=>x.value);

  gameData = mode==='exam'
    ? allData.slice()
    : allData.filter(x=>checked.includes(x.module));

  if(gameData.length===0) gameData = allData.slice();

  gameData.sort(()=>Math.random()-0.5);

  document.getElementById('start').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');

  score=0; 
  i=0; 
  time=60;

  timer=setInterval(tick,1000);

  initTilt();  
  show();      
}

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


}
