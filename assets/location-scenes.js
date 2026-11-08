/* Jess's unlocked location paintings. No changes to saved progress or fog. */
(()=>{
 "use strict";
 if(!Array.isArray(chapters)||!document.querySelector("#achievement-reveal"))return;
 const sceneNames={ruby:"ruby",wonderland:"wonderland",candle:"candle",glass:"glass",zuzu:"zuzu",river:"river",dinner:"dinner",sweet:"sweet",park:"park"};
 const sceneUrl=id=>sceneNames[id]?"assets/scenes/"+sceneNames[id]+".webp":null;
 const shell=document.createElement("div");
 shell.id="quest-scene-reveal";
 shell.hidden=true;
 shell.setAttribute("role","dialog");
 shell.setAttribute("aria-modal","true");
 shell.setAttribute("aria-label","Unlocked quest destination illustration");
 shell.innerHTML='<div class="quest-scene-frame"><img id="quest-scene-image" decoding="async" alt=""><div class="quest-scene-shade"></div><div class="quest-scene-top"><span>✧ DESTINATION DISCOVERED</span><button type="button" id="quest-scene-close" aria-label="Close scene">×</button></div><div class="quest-scene-bottom"><small id="quest-scene-number"></small><h2 id="quest-scene-title"></h2><p id="quest-scene-missing" hidden>The location painting is not available yet. The map and quests are still ready.</p><button type="button" id="quest-scene-continue">Continue to the Atlas ✧</button></div></div>';
 document.body.append(shell);
 const image=shell.querySelector("#quest-scene-image");
 const heading=shell.querySelector("#quest-scene-title");
 const counter=shell.querySelector("#quest-scene-number");
 const missing=shell.querySelector("#quest-scene-missing");
 const next=shell.querySelector("#quest-scene-continue");
 const style=document.createElement("style");
 style.id="quest-scenes-styles";
 style.textContent=[
 '#quest-scene-reveal[hidden]{display:none!important}',
 '#quest-scene-reveal{position:fixed;inset:0;z-index:205;display:flex;align-items:center;justify-content:center;padding:4px;box-sizing:border-box;overflow:hidden;background:radial-gradient(ellipse at center,#5d4150,#100a14 80%)}',
 '#quest-scene-reveal .quest-scene-frame{position:relative;width:min(100%,640px);height:100%;max-height:1000px;overflow:hidden;border:1px solid #a87a5c;border-radius:12px;background:#28202e;box-shadow:0 12px 42px #07040ba8}',
 '#quest-scene-reveal #quest-scene-image{display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain}',
 '#quest-scene-reveal #quest-scene-image[hidden]{display:none!important}',
 '#quest-scene-reveal .quest-scene-shade{position:absolute;pointer-events:none;inset:0;background:linear-gradient(to bottom,#160d18cf,transparent 19%,transparent 62%,#150b17bc 81%,#160a19f0)}',
 '#quest-scene-reveal .quest-scene-top{position:absolute;inset:0 0 auto;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px;color:#ffe4c3;font:800 .7rem/1.2 system-ui,sans-serif;letter-spacing:.13em;text-shadow:0 2px 5px #080509}',
 '#quest-scene-reveal #quest-scene-close{flex:none;width:41px;height:41px;border:1px solid #e7b990;border-radius:50%;background:#3a283be0;color:#ffe6c3;font:700 26px/1 system-ui,sans-serif;cursor:pointer}',
 '#quest-scene-reveal .quest-scene-bottom{position:absolute;bottom:0;left:0;right:0;padding:13px 17px max(18px,env(safe-area-inset-bottom,0px));text-align:center;color:#fff0dc;text-shadow:0 2px 5px #060408}',
 '#quest-scene-reveal #quest-scene-number{display:block;color:#f6c5a3;font:700 .72rem/1.2 system-ui,sans-serif;letter-spacing:.13em;text-transform:uppercase}',
 '#quest-scene-reveal #quest-scene-title{margin:5px 0 12px;font:700 clamp(1.4rem,5vw,2rem)/1.15 Georgia,serif;color:#ffe9cb}',
 '#quest-scene-reveal #quest-scene-missing{margin:7px auto;color:#ffe9cb;font:.83rem/1.4 system-ui,sans-serif}',
 '#quest-scene-reveal #quest-scene-missing[hidden]{display:none!important}',
 '#quest-scene-reveal #quest-scene-continue{min-height:45px;width:min(100%,320px);border:1px solid #efc69f;border-radius:10px;background:linear-gradient(120deg,#e0b08d,#ac7271);color:#241621;font:700 .91rem/1.2 Georgia,serif;cursor:pointer}',
 '#quest-location-revisit{display:block;width:100%;min-height:43px;margin-top:9px;border:1px solid #c48f70;border-radius:10px;background:#6f4452;color:#fff0da;font:700 .86rem/1.2 Georgia,serif}',
 '@media(max-height:680px){#quest-scene-reveal .quest-scene-bottom{padding-bottom:8px}#quest-scene-reveal #quest-scene-title{font-size:1.22rem;margin-bottom:6px}}',
 '@media(prefers-reduced-motion:reduce){#quest-scene-reveal *{animation:none!important;transition:none!important}}'
 ].join("\n");
 document.head.append(style);
 let previousFocus=null,previousOverflow="",requestId=0;
 function close(){
  requestId++;
  if(shell.hidden)return;
  shell.hidden=true;
  document.body.style.overflow=previousOverflow;
  previousFocus?.focus?.({preventScroll:true});
 }
 shell.querySelector("#quest-scene-close").addEventListener("click",close);
 next.addEventListener("click",close);
 shell.addEventListener("click",event=>{if(event.target===shell)close()});
 document.addEventListener("keydown",event=>{
  if(shell.hidden)return;
  if(event.key==="Escape"){event.preventDefault();close()}
  else if(event.key==="Tab"){event.preventDefault();next.focus({preventScroll:true})}
 });
 function open(chapter){
  const index=chapters.findIndex(c=>c.id===chapter?.id);
  if(index<0||index>completed.length||!sceneUrl(chapter.id))return;
  const version=++requestId;
  previousFocus=document.activeElement;
  previousOverflow=document.body.style.overflow;
  heading.textContent=chapter.title;
  counter.textContent="Chapter "+String(index+1).padStart(2,"0")+" of "+chapters.length;
  missing.hidden=true;image.hidden=false;
  image.alt="Illustrated destination: "+chapter.title;
  image.onerror=()=>{
   if(version!==requestId)return;
   image.hidden=true;missing.hidden=false;
  };
  shell.hidden=false;
  document.body.style.overflow="hidden";
  image.src=sceneUrl(chapter.id);
  next.focus({preventScroll:true});
 }
 const detail=document.querySelector(".chapter-detail");
 if(detail){
  const view=document.createElement("button");
  view.type="button";view.id="quest-location-revisit";
  view.textContent="✧ View This Location’s Painting";
  detail.append(view);
  view.addEventListener("click",()=>open(selected));
 }
 document.addEventListener("click",event=>{
  const button=event.target?.closest?.("#achievement-reveal");
  const visible=button?.closest?.(".quest-achievement");
  if(!button||!visible||visible.hidden)return;
  const previous=completed.length;
  if(previous>=chapters.length-1)return; // Park finale opens the personal letter.
  if(selected.id!==chapters[previous]?.id)return;
  const upcoming=chapters[previous+1];
  window.setTimeout(()=>{
   if(completed.length!==previous+1||chapters[previous+1]?.id!==upcoming?.id)return;
   open(upcoming);
  },window.__birthdayPreview?155:1160);
 },true);
})();
