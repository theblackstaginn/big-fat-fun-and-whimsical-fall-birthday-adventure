/* One phone represents Jess and her party. The existing GPS watcher drives arrival hints. */
(()=>{
 "use strict";
 const journal=document.querySelector(".quest-memory-card");
 if(!journal||typeof syncLivePlayerMarkers!=="function")return;
 const key="rogue-witch-quest-arrivals-v1";
 let saved=[];
 try{const x=JSON.parse(localStorage.getItem(key)||"[]");if(Array.isArray(x))saved=x}catch{}
 const arrived=new Set(saved);
 const card=document.createElement("div");
 card.className="quest-arrival-card";
 card.innerHTML='<strong>⌖ Our Party’s Location</strong><p role="status" id="quest-arrival-status">Turn on the phone GPS to recognize each stop.</p><div class="quest-arrival-actions"><button type="button" id="quest-start-gps">Use Phone GPS</button><button type="button" id="quest-confirm-arrival">We’re here</button></div><small>GPS confirms our arrival. A journal note and Curios photo secure the achievement. Manual arrival works if reception is poor.</small>';
 journal.parentElement.insertBefore(card,journal);
 const status=card.querySelector("#quest-arrival-status"),start=card.querySelector("#quest-start-gps"),manual=card.querySelector("#quest-confirm-arrival");
 const toast=document.createElement("div");
 toast.className="quest-arrival-toast";
 toast.hidden=true;
 toast.innerHTML='<strong>✦ Location discovered!</strong><p></p><button type="button">Open Journal</button>';
 document.body.append(toast);
 toast.querySelector("button").addEventListener("click",()=>{toast.hidden=true;document.querySelector('[data-panel="quest"]')?.click()});
 const style=document.createElement("style");style.textContent=
 '.quest-arrival-card{display:grid;gap:9px;margin:12px 0;padding:14px;border:1px solid #bd8b6d;border-radius:12px;background:#342738;color:#f7dfbf}.quest-arrival-card strong{font:700 1.07rem Georgia,serif;color:#ffe0b7}.quest-arrival-card p,.quest-arrival-card small{margin:0;color:#ebd0b9;font:.82rem/1.45 system-ui,sans-serif}.quest-arrival-actions{display:flex;flex-wrap:wrap;gap:8px}.quest-arrival-actions button,.quest-arrival-toast button{min-height:43px;border:1px solid #e2ad87;border-radius:9px;background:#965d63;color:#fff2db;padding:9px 13px;font:700 .8rem Georgia,serif}.quest-arrival-actions button[hidden]{display:none}.quest-arrival-toast{position:fixed;bottom:calc(env(safe-area-inset-bottom,0px) + 106px);left:50%;transform:translateX(-50%);width:min(92vw,350px);box-sizing:border-box;padding:14px;text-align:center;border:1px solid #ddb68a;border-radius:15px;background:#342238f7;color:#fff2db;z-index:85;box-shadow:0 10px 25px #100919aa}.quest-arrival-toast[hidden]{display:none}.quest-arrival-toast p{margin:8px 0;font:italic 1rem Georgia,serif}';
 document.head.append(style);
 const targets=new Map();let lastPoint=null,sequence=0;
 function current(){return chapters[Math.min(completed.length,chapters.length-1)]}
 function update(){
  const ch=current(),done=completed.length===chapters.length;
  start.hidden=done||arrived.has(ch.id)||playerWatchId!==null;
  manual.hidden=done||arrived.has(ch.id);
  if(done)status.textContent="Every destination has been discovered.";
  else if(arrived.has(ch.id))status.textContent="✓ Arrived at "+ch.title+". Save a note and treasure photo to reveal the next location.";
  else if(playerWatchId!==null)status.textContent="⌖ Our phone GPS is finding "+ch.title+"…";
  else status.textContent="Turn on GPS to recognize "+ch.title+" automatically, or tap We’re here.";
 }
 function mark(id,fromGps){
  if(window.__birthdayPreview||!id||arrived.has(id)||current().id!==id)return;
  arrived.add(id);try{localStorage.setItem(key,JSON.stringify([...arrived]))}catch{}
  update();
  if(fromGps){toast.querySelector("p").textContent=current().title;toast.hidden=false}
 }
 start.addEventListener("click",()=>{startLivePlayerTracking();update()});
 manual.addEventListener("click",()=>mark(current().id,false));
 function meters(a,b){
  const rad=Math.PI/180,dy=(b[0]-a[0])*rad,dx=(b[1]-a[1])*rad;
  const z=Math.sin(dy/2)**2+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*Math.sin(dx/2)**2;
  return 12742000*Math.atan2(Math.sqrt(z),Math.sqrt(Math.max(0,1-z)));
 }
 async function check(point){
  if(window.__birthdayPreview||!point||completed.length>=chapters.length)return;
  lastPoint=point.slice();
  const chapter=current(),id=chapter.id,turn=++sequence;
  if(arrived.has(id))return;
  if(!targets.has(id))targets.set(id,coordinatesFor(chapter));
  let target;
  try{target=await targets.get(id)}
  catch{targets.delete(id);if(turn===sequence)status.textContent="Map location unavailable. Tap We’re here when you arrive.";return}
  if(turn!==sequence||current().id!==id||!Array.isArray(target))return;
  const dist=meters(point,target);
  if(dist<=145)mark(id,true);
  else status.textContent="⌖ Our party is about "+Math.round(dist)+" meters from "+chapter.title+".";
 }
 const priorSync=syncLivePlayerMarkers;
 syncLivePlayerMarkers=function(){priorSync();if(livePlayerPoint)check(livePlayerPoint).catch(()=>{})};
 const priorProgress=renderProgress;
 renderProgress=function(){priorProgress();toast.hidden=true;update();if(lastPoint)check(lastPoint).catch(()=>{})};
 update();
})();