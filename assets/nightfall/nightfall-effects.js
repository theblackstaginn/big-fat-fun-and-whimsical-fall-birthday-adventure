/* Jess's original-canvas nightfall: layered graded copies of the exact 1024x1536 map. The daytime sky is unaltered, with no added clouds. Existing fog, GPS, quest state and reveals remain untouched. */
(()=>{
  'use strict';
  const art=document.querySelector('#portrait-overworld');
  const stage=art?.closest('.map-canvas');
  if(!art||!stage||typeof completed==='undefined'||typeof renderProgress!=='function')return;
  const PATH='assets/nightfall/';
  const phases=[
    {name:'dusk',first:3,file:'helen-overworld-dusk.webp'},
    {name:'blue',first:5,file:'helen-overworld-blue-hour.webp'},
    {name:'moonlit',first:7,file:'helen-overworld-moonlit.webp'}
  ];
  const layers=[];
  let cursor=art;
  phases.forEach((phase,index)=>{
    const img=document.createElement('img');
    img.className='nightfall-painted-layer';
    img.dataset.nightfallLayer=phase.name;
    img.alt='';
    img.setAttribute('aria-hidden','true');
    img.decoding='async';
    img.draggable=false;
    img.addEventListener('load',sync);
    img.addEventListener('error',()=>{
      img.dataset.loadError='true';
      // Keep the previous valid painting visible on a failed request.
      sync();
    });
    cursor.insertAdjacentElement('afterend',img);
    cursor=img;
    layers.push(img);
  });
  const overlay=document.createElement('div');
  overlay.id='nightfall-atmosphere';
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=`
    <img class="nightfall-windowglow nightfall-windowglow-a" alt="" decoding="async" src="${PATH}windows-flicker-a.webp">
    <img class="nightfall-windowglow nightfall-windowglow-b" alt="" decoding="async" src="${PATH}windows-flicker-b.webp">
    <img class="nightfall-windowglow nightfall-windowglow-c" alt="" decoding="async" src="${PATH}windows-flicker-c.webp">
    <svg class="nightfall-sky" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid slice" focusable="false">
      <g id="nightfall-twinkles"></g>
    </svg>
    <svg class="nightfall-river" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs><clipPath id="nightfall-water-only">
        <path d="M178 347 C148 385 102 423 99 476 C87 534 98 606 148 678 C166 723 208 770 274 798 L310 788 C235 748 204 704 180 660 C144 595 137 551 160 490 C181 436 207 397 239 361 Z" />
        <path d="M220 850 C250 878 300 902 333 927 L341 966 C291 947 256 926 214 890 Z" />
        <path d="M625 1111 C665 1097 700 1115 750 1143 C795 1160 850 1170 913 1150 C962 1135 1001 1126 1024 1156 L1024 1217 C972 1200 939 1209 900 1228 C818 1250 751 1213 694 1191 C660 1182 635 1189 613 1182 Z" />
      </clipPath></defs>
      <g clip-path="url(#nightfall-water-only)" id="nightfall-water-shimmer"></g>
    </svg>`;
  cursor.insertAdjacentElement('afterend',overlay);

  // Fixed-seed stars remain only in the reduced nighttime sky, never over the unchanged daytime art.
  let seed=16112026;
  const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
  const ns='http://www.w3.org/2000/svg';
  const starGroup=overlay.querySelector('#nightfall-twinkles');
  for(let i=0;i<54;i++){
    const x=498+random()*305;
    const y=7+random()*101;
    if(Math.hypot(x-707,y-68)<85)continue;
    const circle=document.createElementNS(ns,'circle');
    circle.setAttribute('cx',x.toFixed(1));
    circle.setAttribute('cy',y.toFixed(1));
    circle.setAttribute('r',(0.5+random()*1.2).toFixed(1));
    circle.setAttribute('fill',random()>.43?'#fff3df':'#d2d7ff');
    circle.classList.add('nightfall-star');
    circle.style.setProperty('--star-delay',(-random()*8).toFixed(2)+'s');
    circle.style.setProperty('--star-period',(3.2+random()*5.8).toFixed(2)+'s');
    starGroup.append(circle);
  }
  // River glints follow the actual water channels on the original canvas,
  // with the extra sky offset removed. They never cover roads or shops.
  const water=overlay.querySelector('#nightfall-water-shimmer');
  overlay.querySelectorAll('#nightfall-water-only path').forEach(path=>{
    path.setAttribute('transform','translate(0 -174)');
  });
  water.setAttribute('transform','translate(0 -174)');
  const bands=[
    [178,372,64,18],[145,456,75,17],[126,536,86,16],
    [158,625,95,16],[206,715,82,15],[268,791,74,17],
    [295,912,58,11],
    [682,1145,78,21],[778,1175,93,21],[886,1180,83,19],[966,1169,76,18]
  ];
  bands.forEach(([x,y,spread,depth],bi)=>{
    const count=bi>6?7:6;
    for(let i=0;i<count;i++){
      const glint=document.createElementNS(ns,'path');
      const dx=(random()-.5)*spread;
      const dy=(random()-.5)*depth;
      const len=4+random()*18;
      const yy=y+dy,xx=x+dx;
      glint.setAttribute('d',`M${(xx-len*.5).toFixed(1)} ${yy.toFixed(1)} Q${xx.toFixed(1)} ${(yy-1.3-random()*2).toFixed(1)} ${(xx+len*.5).toFixed(1)} ${yy.toFixed(1)}`);
      glint.setAttribute('fill','none');
      glint.setAttribute('stroke',i%3===0?'#edb75f':(i%2?'#d5dfff':'#a9c7f1'));
      glint.setAttribute('stroke-width',(0.65+random()*1.4).toFixed(2));
      glint.setAttribute('stroke-linecap','round');
      glint.classList.add('nightfall-water-glint');
      glint.style.setProperty('--flow-delay',(-random()*8).toFixed(2)+'s');
      glint.style.setProperty('--flow-period',(3.4+random()*4.4).toFixed(2)+'s');
      water.append(glint);
    }
  });

  const loaded=new Set();
  let currentStage=-1;
  function unlock(i){
    if(!loaded.has(i)){
      loaded.add(i);
      layers[i].src=new URL(PATH+phases[i].file,document.baseURI).href;
    }
  }
  function sync(){
    const done=Math.min(completed.length,chapters.length);
    const level=done>=7?3:done>=5?2:done>=3?1:0;
    for(let i=0;i<level;i++)unlock(i);
    const active=stage.classList.contains('portrait-loaded')&&!art.hidden;
    if(level!==currentStage){
      currentStage=level;
      stage.dataset.nightfallStage=String(level);
    }
    layers.forEach((layer,i)=>{
      const ready=layer.complete&&layer.naturalWidth>0;
      layer.classList.toggle('nightfall-visible',active&&ready&&i<level);
    });
    overlay.hidden=!active;
    overlay.dataset.nightfallLevel=String(level);
  }
  const previous=renderProgress;
  renderProgress=function(){previous();sync();};
  art.addEventListener('load',sync);
  art.addEventListener('error',sync);
  // A completed chapter updates the stage; progress is not changed here.
  sync();
})();
