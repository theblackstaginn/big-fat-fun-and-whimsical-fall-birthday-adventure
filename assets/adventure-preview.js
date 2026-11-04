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
 bar.innerHTML='<span class="preview-kicker">✧ PREVIEW MODE</span><strong id="preview-quest-title"></strong><small id="preview-quest-count"></small><div class="preview-buttons"><button id="preview-achieve" type="button">Play Achievement</button><button id="preview-exit" type="button">Exit Preview</button></div>';
 document.body.append(bar);
 const style=document.createElement("style");
 style.textContent=[
 '.adventure-preview-help{margin:0 0 10px;color:#d9bca5;font:.75rem/1.5 system-ui,sans-serif}',
 '.adventure-preview-bar{position:fixed;z-index:80;bottom:calc(env(safe-area-inset-bottom,0px) + 113px);left:50%;transform:translateX(-50%);box-sizing:border-box;width:min(92vw,355px);display:grid;gap:5px;padding:12px 14px;border:1px solid #e2a87c;border-radius:15px;background:linear-gradient(145deg,#56374dea,#2b2135f5);color:#ffead0;box-shadow:0 9px 32px #110b17ae;text-align:center}',
 '.adventure-preview-bar[hidden]{display:none!important}',
 '.preview-kicker{color:#efb993;font:700 .62rem/1.3 system-ui,sans-serif;letter-spacing:.18em}',
 '#preview-quest-title{font:700 1.1rem/1.23 Georgia,serif}',
 '#preview-quest-count{color:#e7c6a8;font:.7rem/1.4 system-ui,sans-serif}',
 '.preview-buttons{display:flex;gap:7px;margin-top:4px}',
 '.preview-buttons button{flex:1;min-height:40px;padding:8px;border:1px solid #deb18a;border-radius:9px;background:#a16765;color:#fff4de;font:700 .75rem/1.25 Georgia,serif}',
 '.preview-buttons #preview-exit{background:#322636;color:#f4d5b6}',
 '.quest-preview-active #rpg-reset,.quest-preview-active #reset-progress,.quest-preview-active .quest-arrival-card{display:none!important}',
 '.quest-preview-active .quest-memory-card #witch-memory-save,.quest-preview-active .quest-memory-card #curios-photo-input{opacity:.45;pointer-events:none}'
 ].join("\n");
 document.head.append(style);
 let preview=false,snapshot=null,oldNoteDisabled=false,oldPhotoDisabled=false;
 const name=bar.querySelector("#preview-quest-title");
 const count=bar.querySelector("#preview-quest-count");
 const achieve=bar.querySelector("#preview-achieve");
 const reveal=achievement.querySelector("#achievement-reveal");
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
  completed.push(chapters[completed.length].id);
  selected=chapters[Math.min(completed.length,chapters.length-1)];
  achievement.hidden=true;
  renderProgress();
  paint();
 },true);
 launch.addEventListener("click",begin);
 achieve.addEventListener("click",celebration);
 bar.querySelector("#preview-exit").addEventListener("click",finish);
 window.addEventListener("pagehide",()=>{if(preview)window.__birthdayPreview=false});
 }
 satchelButton.addEventListener("click",installPreview);
 if(document.querySelector(".rpg-settings"))installPreview();
})();