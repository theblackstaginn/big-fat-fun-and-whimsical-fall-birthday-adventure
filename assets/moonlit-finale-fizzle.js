/* The Moonlit Finale: white bloom, button sparks and a gentle card fade.
 * Presentation only. The existing quest gate, ninth save and letter remain authoritative.
 * Shared with isolated Preview Mode; no new quest or storage writes.
 */
(()=>{
 "use strict";
 const NORMAL_MS=980;
 const REDUCED_MS=160;
 const style=document.createElement("style");
 style.id="moonlit-finale-fizzle-styles";
 style.textContent=[
  "#moonlit-fizzle{position:fixed;inset:0;z-index:205;pointer-events:none;overflow:hidden;isolation:isolate}",
  "#moonlit-fizzle::before{content:'';position:absolute;left:var(--fizzle-x);top:var(--fizzle-y);width:200vmax;height:200vmax;border-radius:50%;background:radial-gradient(circle,rgba(255,253,249,.98) 0%,rgba(255,249,248,.88) 24%,rgba(226,203,244,.40) 48%,transparent 72%);transform:translate(-50%,-50%) scale(.015);animation:moonlit-soft-bloom .96s ease-out both}",
  "#moonlit-fizzle .moonlit-fizzle-spark{position:absolute;left:var(--fizzle-x);top:var(--fizzle-y);width:6px;height:6px;border-radius:50%;background:#f9d9a5;box-shadow:0 0 9px 4px #e2bbf1aa;transform:translate(-50%,-50%) scale(.2);animation:moonlit-spark-drift .8s cubic-bezier(.13,.61,.41,1) both;animation-delay:var(--spark-delay)}",
  "#moonlit-fizzle .moonlit-fizzle-spark:nth-child(2n){background:#f3e5ff;box-shadow:0 0 9px 3px #c7a6e5bb;width:4px;height:4px}",
  "body.is-moonlit-fizzling .quest-achievement.is-finale .quest-achievement-inner{animation:moonlit-finale-fade .92s ease-out both}",
  "body.is-moonlit-fizzling .quest-achievement.is-finale #achievement-reveal{box-shadow:0 0 10px #f6dbaf,0 0 28px #d3aceb;filter:brightness(1.18)}",
  "body.is-moonlit-fizzling .quest-achievement.is-finale #achievement-reveal:disabled{opacity:1;cursor:default}",
  "@keyframes moonlit-soft-bloom{0%{opacity:0;transform:translate(-50%,-50%) scale(.015)}20%{opacity:.55}55%{opacity:1;transform:translate(-50%,-50%) scale(.57)}80%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.1)}}",
  "@keyframes moonlit-spark-drift{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}19%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}100%{opacity:0;transform:translate(calc(-50% + var(--spark-dx)),calc(-50% + var(--spark-dy))) scale(.5)}}",
  "@keyframes moonlit-finale-fade{0%{opacity:1;transform:scale(1);filter:brightness(1)}42%{opacity:.94;transform:scale(1.015);filter:brightness(1.12)}100%{opacity:0;transform:scale(1.03);filter:brightness(1.2)}}",
  "@media(prefers-reduced-motion:reduce){#moonlit-fizzle::before{animation:moonlit-reduced-glow .16s ease-out both}#moonlit-fizzle .moonlit-fizzle-spark{display:none}body.is-moonlit-fizzling .quest-achievement.is-finale .quest-achievement-inner{animation:none}@keyframes moonlit-reduced-glow{0%{opacity:0;transform:translate(-50%,-50%) scale(.7)}45%{opacity:.5}100%{opacity:0;transform:translate(-50%,-50%) scale(.85)}}}"
 ].join("\n");
 document.head.append(style);

 let active=false;
 function playMoonlitFizzle(button){
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration=reduced?REDUCED_MS:NORMAL_MS;
  if(active)return duration;
  active=true;
  const effect=document.createElement("div");
  effect.id="moonlit-fizzle";
  effect.setAttribute("aria-hidden","true");
  const rect=button?.getBoundingClientRect?.();
  const x=rect?rect.left+rect.width/2:window.innerWidth/2;
  const y=rect?rect.top+rect.height/2:window.innerHeight/2;
  effect.style.setProperty("--fizzle-x",x+"px");
  effect.style.setProperty("--fizzle-y",y+"px");
  if(!reduced){
   for(let i=0;i<16;i++){
    const star=document.createElement("span");
    const angle=i*Math.PI/8+(Math.random()-.5)*.3;
    const distance=65+Math.random()*145;
    star.className="moonlit-fizzle-spark";
    star.style.setProperty("--spark-dx",(Math.cos(angle)*distance).toFixed(1)+"px");
    star.style.setProperty("--spark-dy",(Math.sin(angle)*distance).toFixed(1)+"px");
    star.style.setProperty("--spark-delay",Math.floor(Math.random()*125)+"ms");
    effect.append(star);
   }
  }
  document.body.append(effect);
  document.body.classList.add("is-moonlit-fizzling");
  if(button){
   button.setAttribute("aria-busy","true");
   // Let the original click handler advance the quest before disabling.
   Promise.resolve().then(()=>{if(button.isConnected)button.disabled=true});
  }
  window.setTimeout(()=>{
   effect.remove();
   document.body.classList.remove("is-moonlit-fizzling");
   if(button?.isConnected){button.disabled=false;button.removeAttribute("aria-busy")}
   active=false;
  },duration);
  return duration;
 }
 window.playMoonlitFizzle=playMoonlitFizzle;

 // Only the genuinely unlocked park achievement may play the real finale.
 // The preview has its own capture handler and deliberately uses this effect.
 document.addEventListener("click",event=>{
  if(window.__birthdayPreview)return;
  const trigger=event.target?.closest?.("#achievement-reveal");
  const achievement=trigger?.closest?.(".quest-achievement.is-finale");
  if(!trigger||!achievement||achievement.hidden)return;
  if(typeof selected==="undefined"||selected?.id!=="park")return;
  if(typeof completed==="undefined"||!Array.isArray(chapters)||completed.length!==chapters.length-1)return;
  playMoonlitFizzle(trigger);
 },true);
})();