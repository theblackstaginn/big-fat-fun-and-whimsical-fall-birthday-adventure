/* Isolated click-through tour. Does not write progress, notes, photos or GPS data. */
(()=>{
 "use strict";
 const satchelButton=document.querySelector('.rpg-toolbar [data-panel="settings"]');
 if(!satchelButton)return;
 let previewInstalled=false;
 function installPreview(){
 const settings=document.querySelector(".rpg-settings");
 const achievement=document.querySelector(".quest-achievement");
 const completeButton=document.querySelector("#complete-button");
 const noteButton=document.querySelector("#witch-memory-save");
 const photoInput=document.querySelector("#curios-photo-input");
 if(!settings||!achievement||!completeButton||!Array.isArray(chapters))return;
 if(previewInstalled)return;
 previewInstalled=true;
 const launch=document.createElement("button");
 launch.type="button";
 launch.id="preview-adventure-launch";
 launch.textContent="✧ Preview the Adventure";
 launch.setAttribute("aria-label","Preview all locations without changing saved birthday progress");
 settings.insertBefore(launch,settings.querySelector("#rpg-reset"));
 const explanation=document.createElement("p");
 explanation.className="adventure-preview-help";
 explanation.textContent="Walk through the fog and achievements without saving test photos, notes or location data.";
 launch.insertAdjacentElement("afterend",explanation);
 const bar=document.createElement("div");
 bar.id="adventure-preview-bar";
 bar.className="adventure-preview-bar";
 bar.hidden=true;
 bar.innerHTML='<div class="preview-drag-handle" tabindex="0" aria-label="Preview controls. Press and hold here to move. With a keyboard, use arrow keys."><span class="preview-kicker">✧ PREVIEW MODE · HOLD TO MOVE</span><strong id="preview-quest-title"></strong><small id="preview-quest-count"></small></div><div class="preview-buttons"><button id="preview-achieve" type="button">Play Achievement</button><button id="preview-exit" type="button">Exit Preview</button></div><button id="preview-final-letter" type="button">✧ Preview the Final Letter</button>';
 document.body.append(bar);
 const style=document.createElement("style");
 style.textContent=[
 '.adventure-preview-help{margin:0 0 10px;color:#d9bca5;font:.75rem/1.5 system-ui,sans-serif}',
 '.adventure-preview-bar{position:fixed;z-index:80;bottom:calc(env(safe-area-inset-bottom,0px) + 113px);left:50%;transform:translate(calc(-50% + var(--preview-shift-x,0px)),var(--preview-shift-y,0px));box-sizing:border-box;width:min(92vw,355px);display:grid;gap:5px;padding:12px 14px;border:1px solid #e2a87c;border-radius:15px;background:linear-gradient(145deg,#56374dea,#2b2135f5);color:#ffead0;box-shadow:0 9px 32px #110b17ae;text-align:center}',
 '.adventure-preview-bar[hidden]{display:none!important}',
 '.preview-drag-handle{display:grid;gap:5px;padding:2px 4px 4px;margin:-2px -4px 0;cursor:grab;touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;border-radius:8px}',
 '.preview-drag-handle:focus-visible{outline:2px solid #ffe5bb;outline-offset:2px}',
 '.adventure-preview-bar.is-being-dragged .preview-drag-handle{cursor:grabbing;background:#f4c59114}',
 '.preview-kicker{color:#efb993;font:700 .62rem/1.3 system-ui,sans-serif;letter-spacing:.18em}',
 '#preview-quest-title{font:700 1.1rem/1.23 Georgia,serif}',
 '#preview-quest-count{color:#e7c6a8;font:.7rem/1.4 system-ui,sans-serif}',
 '.preview-buttons{display:flex;gap:7px;margin-top:4px}',
 '.preview-buttons button{flex:1;min-height:40px;padding:8px;border:1px solid #deb18a;border-radius:9px;background:#a16765;color:#fff4de;font:700 .75rem/1.25 Georgia,serif}',
 '.preview-buttons #preview-exit{background:#322636;color:#f4d5b6}',
  '#preview-final-letter{min-height:42px;width:100%;margin-top:5px;padding:9px;border:1px solid #e4bd95;border-radius:9px;background:linear-gradient(140deg,#795366,#52364e);color:#fff1da;font:700 .84rem/1.3 Georgia,serif}',
 '.quest-preview-active #rpg-reset,.quest-preview-active #reset-progress,.quest-preview-active .quest-arrival-card{display:none!important}',
 '.quest-preview-active .quest-memory-card #witch-memory-save,.quest-preview-active .quest-memory-card #curios-photo-input{opacity:.45;pointer-events:none}'
 ].join("\n");
 document.head.append(style);
 let preview=false,snapshot=null,oldNoteDisabled=false,oldPhotoDisabled=false;
 const name=bar.querySelector("#preview-quest-title");
 const count=bar.querySelector("#preview-quest-count");
 const achieve=bar.querySelector("#preview-achieve");
 const reveal=achievement.querySelector("#achievement-reveal");
 const dragHandle=bar.querySelector(".preview-drag-handle");
 let shiftX=0,shiftY=0,press=null,holdTimer=null;
 const setPosition=()=>{
  bar.style.setProperty("--preview-shift-x",shiftX+"px");
  bar.style.setProperty("--preview-shift-y",shiftY+"px");
 };
 // Limit movements to the visible phone viewport so controls cannot get lost.
 function visibleBounds(){
  const viewport=window.visualViewport;
  const left=viewport?.offsetLeft||0,top=viewport?.offsetTop||0;
  return {left:left+10,top:top+10,
   right:left+(viewport?.width||window.innerWidth)-10,
   bottom:top+(viewport?.height||window.innerHeight)-10};
 }
 function fitShift(deltaX,deltaY,rect){
  const bounds=visibleBounds();
  shiftX=press.baseX+Math.max(bounds.left-rect.left,Math.min(bounds.right-rect.right,deltaX));
  shiftY=press.baseY+Math.max(bounds.top-rect.top,Math.min(bounds.bottom-rect.bottom,deltaY));
  setPosition();
 }
 function stopPress(){
  if(holdTimer!==null){clearTimeout(holdTimer);holdTimer=null}
  if(press){
   try{if(dragHandle.hasPointerCapture(press.id))dragHandle.releasePointerCapture(press.id)}catch{}
  }
  press=null;
  bar.classList.remove("is-being-dragged");
 }
 dragHandle.addEventListener("pointerdown",event=>{
  if(!preview||press||event.isPrimary===false||event.button!==0)return;
  press={id:event.pointerId,x:event.clientX,y:event.clientY,
   baseX:shiftX,baseY:shiftY,rect:bar.getBoundingClientRect(),ready:false};
  holdTimer=window.setTimeout(()=>{
   holdTimer=null;
   if(!press||!preview)return;
   press.ready=true;
   bar.classList.add("is-being-dragged");
   try{dragHandle.setPointerCapture(press.id)}catch{}
  },420);
 });
 window.addEventListener("pointermove",event=>{
  if(!press||event.pointerId!==press.id||!preview)return;
  const dx=event.clientX-press.x,dy=event.clientY-press.y;
  if(!press.ready){
   if(Math.hypot(dx,dy)>12)stopPress();
   return;
  }
  if(event.cancelable)event.preventDefault();
  fitShift(dx,dy,press.rect);
 },{passive:false});
 window.addEventListener("pointerup",event=>{
  if(press&&event.pointerId===press.id)stopPress();
 });
 window.addEventListener("pointercancel",event=>{
  if(press&&event.pointerId===press.id)stopPress();
 });
 window.addEventListener("blur",stopPress);
 dragHandle.addEventListener("contextmenu",event=>{if(preview)event.preventDefault()});
 dragHandle.addEventListener("keydown",event=>{
  if(!preview||!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key))return;
  event.preventDefault();
  const step=event.shiftKey?40:18,rect=bar.getBoundingClientRect(),bounds=visibleBounds();
  const dx=event.key==="ArrowLeft"?-step:event.key==="ArrowRight"?step:0;
  const dy=event.key==="ArrowUp"?-step:event.key==="ArrowDown"?step:0;
  shiftX+=Math.max(bounds.left-rect.left,Math.min(bounds.right-rect.right,dx));
  shiftY+=Math.max(bounds.top-rect.top,Math.min(bounds.bottom-rect.bottom,dy));
  setPosition();
 });
 function paint(){
  if(!preview)return;
  const done=completed.length===chapters.length;
  const stop=chapters[Math.min(completed.length,chapters.length-1)];
  name.textContent=done?"The Adventure Is Complete":stop.title;
  count.textContent=done?"All "+chapters.length+" locations revealed · actual progress is unchanged":
    "Stop "+(completed.length+1)+" of "+chapters.length+" · simulated progress";
  achieve.disabled=done;
  achieve.textContent=done?"All Locations Revealed":"Play Achievement ✦";
  completeButton.disabled=true;
  completeButton.textContent="Preview Mode · use the preview controls";
 }
 function begin(){
  if(preview)return;
  snapshot={ids:completed.slice(),selectedId:selected.id};
  stopPress();
  shiftX=0;shiftY=0;setPosition();
  preview=true;
  window.__birthdayPreview=true;
  if(typeof stopLivePlayerTracking==="function")stopLivePlayerTracking();
  oldNoteDisabled=!!noteButton?.disabled;
  oldPhotoDisabled=!!photoInput?.disabled;
  if(noteButton)noteButton.disabled=true;
  if(photoInput)photoInput.disabled=true;
  completed=[];
  selected=chapters[0];
  document.body.classList.add("quest-preview-active");
  bar.hidden=false;
  document.querySelector("#rpg-close")?.click();
  setMapMode("overview");
  renderProgress();
  paint();
 }
 function finish(){
  if(!preview)return;
  stopPress();
  preview=false;
  window.__birthdayPreview=false;
  achievement.hidden=true;
  achievement.classList.remove("is-revealing");
  bar.hidden=true;
  document.body.classList.remove("quest-preview-active");
  if(noteButton)noteButton.disabled=oldNoteDisabled;
  if(photoInput)photoInput.disabled=oldPhotoDisabled;
  completed=snapshot.ids.slice();
  selected=chapters.find(ch=>ch.id===snapshot.selectedId)||chapters[Math.min(completed.length,chapters.length-1)];
  snapshot=null;
  renderProgress();
 }
 function celebration(){
  if(!preview||completed.length===chapters.length)return;
  const stop=chapters[completed.length];
  /* Preview renders the SAME quirky system broadcast as the real unlock,
   * without inventing a fake saved photo or changing actual quest data. */
  if(typeof window.renderBirthdayAchievement==="function"){
   window.renderBirthdayAchievement(stop,true);
  }else{
   achievement.querySelector("#achievement-place").textContent=stop.title;
   const header=achievement.querySelector(".achievement-kicker");
   if(header)header.textContent="✧ PREVIEW ACHIEVEMENT";
  }
  const photo=achievement.querySelector("#achievement-photo");
  if(photo){photo.hidden=true;photo.removeAttribute("src")}
  achievement.hidden=false;
  reveal.focus();
 }
 reveal.addEventListener("click",event=>{
  if(!preview)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if(completed.length>=chapters.length){finish();return}
  const finalGift=completed.length===chapters.length-1&&chapters[completed.length]?.id==="park";
  completed.push(chapters[completed.length].id);
  selected=chapters[Math.min(completed.length,chapters.length-1)];
  achievement.hidden=true;
  renderProgress();
  paint();
  /* The isolated tour opens the same gift without altering real progress. */
  if(finalGift)window.openMoonlitLetter?.();
 },true);
 /* Isolated artwork test: no chapter flags, saved memories or reveal state are changed. */
  bar.querySelector("#preview-final-letter").addEventListener("click",()=>{
   if(typeof window.openMoonlitLetter==="function")window.openMoonlitLetter();
   else bar.querySelector("#preview-final-letter").textContent="Letter loader unavailable · refresh";
  });
  launch.addEventListener("click",begin);
 achieve.addEventListener("click",celebration);
 bar.querySelector("#preview-exit").addEventListener("click",finish);
 window.addEventListener("pagehide",()=>{if(preview)window.__birthdayPreview=false});
 }
 satchelButton.addEventListener("click",installPreview);
 if(document.querySelector(".rpg-settings"))installPreview();
})();