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
    <svg class="nightfall-warm-glows" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <radialGradient id="nightfall-lamp-glow">
          <stop offset="0" stop-color="#fff3c0" stop-opacity=".72"></stop>
          <stop offset=".28" stop-color="#ffc56e" stop-opacity=".24"></stop>
          <stop offset="1" stop-color="#ffad55" stop-opacity="0"></stop>
        </radialGradient>
        <radialGradient id="nightfall-window-glow">
          <stop offset="0" stop-color="#ffe7a0" stop-opacity=".32"></stop>
          <stop offset=".42" stop-color="#f5aa53" stop-opacity=".13"></stop>
          <stop offset="1" stop-color="#f5aa53" stop-opacity="0"></stop>
        </radialGradient>
      </defs>
      <g id="nightfall-warm-light-points"></g>
    </svg>
    <svg class="nightfall-sky" viewBox="0 0 1024 1536" preserveAspectRatio="xMidYMid slice" focusable="false">
      <g id="nightfall-twinkles"></g>
    </svg>
    <img class="river-whitewater-layer river-whitewater-left" alt="" aria-hidden="true" decoding="async" src="${PATH}river-foam-highlights.webp">
    <img class="river-whitewater-layer river-whitewater-right" alt="" aria-hidden="true" decoding="async" src="${PATH}river-foam-highlights.webp">`;
  cursor.insertAdjacentElement('afterend',overlay);

  // Fixed-seed stars remain only in the reduced nighttime sky, never over the unchanged daytime art.
  let seed=16112026;
  const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
  const ns='http://www.w3.org/2000/svg';
  // The old glow WebPs were 512x855 (not the map's 2:3 aspect ratio)
  // and were all stacked at nearly full opacity. Use aligned SVG hotspots
  // exclusively on EXISTING lantern flames and illuminated windows.
  // Coordinate system matches the unchanged 1024x1536 painted map.
  const lightPoints=overlay.querySelector('#nightfall-warm-light-points');
  const families=Array.from({length:4},(_,i)=>{
    const group=document.createElementNS(ns,'g');
    group.classList.add('nightfall-glow-family','nightfall-glow-family-'+i);
    lightPoints.append(group);
    return group;
  });
  const streetLanterns=[
    [466,308],[460,350],[453,401],[443,446],[429,515],
    [420,565],[414,615],[401,666],[395,749],[387,789],
    [378,964],[371,1018],[380,1124],[372,1188],[354,1259],[342,1308],
    [506,326],[514,369],[523,440],[531,509],[535,575],
    [531,649],[541,668],[543,748],[558,800],[586,888],
    [570,950],[525,1042],[518,1135],[494,1192],[493,1356],
    [821,230],[987,210],[176,401],[201,915],[965,942]
  ];
  const windowLights=[
    [262,347],[314,348],[270,448],[297,461],[338,455],[369,454],
    [568,428],[608,430],[691,422],[784,422],
    [624,526],[670,532],[707,532],
    [710,671],[711,733],[868,733],
    [690,790],[730,792],[772,791],[808,794],[854,790],
    [729,869],[777,868],[811,869],
    [171,857],[211,858],[250,857],
    [237,1116],[241,1161],[560,1142],[603,1140],[658,1140],
    [605,1374],[652,1376],[710,1378],[851,1377],[910,1378]
  ];
  const addLight=(points,type)=>{
    points.forEach(([x,y],i)=>{
      const circle=document.createElementNS(ns,'circle');
      circle.setAttribute('cx',String(x));
      circle.setAttribute('cy',String(y));
      circle.setAttribute('r',String(type==='lamp'?12:16));
      circle.setAttribute('fill',type==='lamp'?'url(#nightfall-lamp-glow)':'url(#nightfall-window-glow)');
      families[(i+(type==='lamp'?0:2))%families.length].append(circle);
    });
  };
  addLight(streetLanterns,'lamp');
  addLight(windowLights,'window');
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
  // Natural whitewater extracted from the painted rapids stays aligned with
  // rocks while separate slow foam layers animate with each river channel.

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
