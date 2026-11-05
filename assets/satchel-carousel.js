/* Portrait Satchel oddities carousel. Original scene images, nine separate jars.
   Only the existing Satchel panel is modified. No jar labels or new modal. */
(()=>{
"use strict";
const sheet=document.querySelector(".rpg-sheet"),body=document.getElementById("rpg-sheet-body"),title=document.getElementById("rpg-sheet-title");
if(!sheet||!body||!title||sheet.dataset.susanInstalled)return;
sheet.dataset.susanInstalled="1";
const items=[
["ruby",0],["wonderland",1],["candle",2],["glass",3],["zuzu",3],
["river",4],["dinner",5],["sweet",6],["park",7]
],T=Math.PI*2,STEP=T/9;
let stage,viewer,fallback,ring,buttons=[],angle=Math.PI,selected=0,active=false,modelReady=false;
let animation=0,drag=null,moved=false,pending=false;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v)),wrap=n=>(n%9+9)%9;
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
function count(){
 if(typeof completed!=="undefined"&&Array.isArray(completed))return completed.length;
 try{const x=JSON.parse(localStorage.getItem("jess-birthday-quest-progress-v3")||"[]");return Array.isArray(x)?x.length:0}catch{return 0}
}
function unlock(){
 const n=count();
 items.forEach(([id,threshold],i)=>{
  const b=buttons[i];if(!b)return;
  const slot=b.querySelector(".satchel-window"),img=slot.querySelector("img");
  if(n>=threshold&&!img){const pic=document.createElement("img");pic.src="assets/scenes/"+id+".webp";pic.alt="";pic.loading="lazy";slot.append(pic)}
  if(n<threshold&&img)img.remove();
  b.setAttribute("aria-label",n>=threshold?"Collected jar "+(i+1):"Undiscovered jar "+(i+1));
 });
}
function paint(){
 if(!stage||!active)return;
 const rect=stage.getBoundingClientRect();if(!rect.width||!rect.height)return;
 const h=rect.height,vh=h*.74,cy=h*.19+vh/2,cx=rect.width/2,focal=vh/(2*Math.tan(Math.PI/12));
 const norm=(angle%T+T)%T;
 if(modelReady){try{viewer.currentTime=12*norm/T}catch{}}
 items.forEach(([id],i)=>{
  const a=-Math.PI/2+i*STEP,x=2.08*Math.cos(a),z=2.08*Math.sin(a);
  const xx=x*Math.cos(angle)-z*Math.sin(angle),zz=x*Math.sin(angle)+z*Math.cos(angle);
  const sinP=Math.sin(62*Math.PI/180),cosP=Math.cos(62*Math.PI/180),yy=.42;
  const scale=focal/(11-(yy*cosP+zz*sinP));
  const b=buttons[i];if(!b)return;
  b.style.left=(cx+xx*scale).toFixed(1)+"px";
  b.style.top=(cy-(yy*sinP-zz*cosP)*scale).toFixed(1)+"px";
  b.style.width=clamp(scale*1.62,50,164).toFixed(1)+"px";
  b.style.zIndex=String(Math.round((zz+3)*100));
  b.classList.toggle("is-front",i===selected);
  b.setAttribute("aria-pressed",String(i===selected));
 });
}
function settle(target){
 cancelAnimationFrame(animation);
 if(reduce.matches){angle=target;paint();return}
 const start=performance.now(),from=angle;
 const tick=now=>{
  if(!active)return;
  const k=clamp((now-start)/550,0,1),ease=1-Math.pow(1-k,3);
  angle=from+(target-from)*ease;paint();
  if(k<1)animation=requestAnimationFrame(tick);
 };
 animation=requestAnimationFrame(tick);
}
function turn(delta){selected=wrap(selected+delta);settle(angle-delta*STEP)}
function choose(i){
 if(i===selected)return;
 let delta=i-selected;if(delta>4)delta-=9;if(delta< -4)delta+=9;
 selected=i;settle(angle-delta*STEP);
}
function build(){
 if(stage)return;
 stage=document.createElement("div");stage.className="satchel-rotunda";
 fallback=document.createElement("img");fallback.className="satchel-platter-fallback";
 fallback.src="assets/satchel/lazy_susan_isolated.webp";fallback.alt="";fallback.draggable=false;
 viewer=document.createElement("model-viewer");viewer.className="satchel-model";
 const attrs={src:"assets/satchel/oddities_lazy_susan_spinning.glb",
  "animation-name":"One Gentle Full Turn - 12 Seconds",
  "camera-orbit":"0deg 62deg 11m","camera-target":"0m 0.55m 0m",
  "field-of-view":"30deg",exposure:"1.35","environment-image":"neutral",
  "shadow-intensity":"0","interaction-prompt":"none",loading:"eager","aria-hidden":"true"};
 Object.entries(attrs).forEach(([key,value])=>viewer.setAttribute(key,value));
 viewer.addEventListener("load",()=>{modelReady=true;viewer.pause();viewer.classList.add("model-ready");fallback.hidden=true;paint()});
 viewer.addEventListener("error",()=>{modelReady=false;viewer.classList.remove("model-ready");fallback.hidden=false});
 ring=document.createElement("div");ring.className="satchel-jar-ring";
 items.forEach(([id],i)=>{
  const b=document.createElement("button");b.type="button";b.className="satchel-jar";
  b.setAttribute("aria-label","Jar "+(i+1));b.setAttribute("aria-pressed","false");
  const scene=document.createElement("span");scene.className="satchel-window";
  const art=document.createElement("img");art.className="satchel-jar-overlay";
  art.src="assets/satchel/jars/jar_"+String(i+1).padStart(2,"0")+"_"+id+".webp";
  art.alt="";art.draggable=false;
  b.append(scene,art);b.addEventListener("click",()=>{if(!moved)choose(i)});
  buttons.push(b);ring.append(b);
 });
 const nav=document.createElement("div");nav.className="satchel-nav";
 for(const [delta,symbol,label] of [[-1,"‹","Previous jar"],[1,"›","Next jar"]]){
  const btn=document.createElement("button");btn.type="button";btn.className="satchel-arrow";
  btn.textContent=symbol;btn.setAttribute("aria-label",label);
  btn.addEventListener("click",()=>turn(delta));nav.append(btn);
 }
 stage.append(fallback,viewer,ring,nav);
 stage.addEventListener("pointerdown",e=>{
  if(e.button!==0||e.target.closest(".satchel-nav"))return;
  cancelAnimationFrame(animation);drag={id:e.pointerId,x:e.clientX,y:e.clientY,angle,moving:false};moved=false;
 });
 stage.addEventListener("pointermove",e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moving&&Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)){
   drag.moving=true;stage.setPointerCapture(e.pointerId);
  }
  if(!drag.moving)return;
  e.preventDefault();moved=true;angle=drag.angle+dx*STEP/78;paint();
 });
 const finish=e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const moving=drag.moving;drag=null;
  if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);
  if(!moving)return;
  const steps=Math.round((Math.PI-angle)/STEP);selected=wrap(steps);settle(Math.PI-steps*STEP);
  setTimeout(()=>{moved=false},80);
 };
 stage.addEventListener("pointerup",finish);stage.addEventListener("pointercancel",finish);
 if(!customElements.get("model-viewer")&&!document.querySelector("script[data-satchel-viewer]")){
  const script=document.createElement("script");script.type="module";
  script.src="https://unpkg.com/@google/model-viewer@4.2.0/dist/model-viewer.min.js";
  script.dataset.satchelViewer="1";document.head.append(script);
 }
}
function sync(){
 pending=false;
 const host=body.querySelector(":scope > .rpg-satchel");
 active=!sheet.hidden&&!!host&&title.textContent.includes("Satchel");
 sheet.classList.toggle("is-satchel-susan",active);
 if(!active){cancelAnimationFrame(animation);return}
 build();host.classList.add("satchel-immersive");
 if(host.firstElementChild!==stage||host.childElementCount!==1)host.replaceChildren(stage);
 unlock();requestAnimationFrame(paint);
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(sync)}}
new MutationObserver(schedule).observe(body,{childList:true});
new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
new MutationObserver(schedule).observe(sheet,{attributes:true,attributeFilter:["hidden"]});
window.addEventListener("resize",()=>{if(active)requestAnimationFrame(paint)},{passive:true});
schedule();
})();