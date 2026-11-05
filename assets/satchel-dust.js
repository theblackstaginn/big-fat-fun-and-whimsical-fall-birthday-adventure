/* Ambient enchanted dust inside the Satchel only. No changes to carousel or quest state. */
(()=>{"use strict";
const sheet=document.querySelector(".rpg-sheet"),body=document.getElementById("rpg-sheet-body");
if(!sheet||!body)return;
const canvas=document.createElement("canvas");
canvas.className="satchel-dust";canvas.setAttribute("aria-hidden","true");
const ctx=canvas.getContext("2d",{alpha:true});if(!ctx)return;
let particles=[],w=0,h=0,dpr=1,raf=0,last=0;
const rand=(a,b)=>a+Math.random()*(b-a);
function reset(p,initial=false){p.x=rand(0,w);p.y=initial?rand(0,h):h+rand(2,45);p.r=rand(.45,1.8);p.v=rand(3,12);p.drift=rand(-4,4);p.phase=rand(0,6.283);p.twinkle=rand(.25,1);p.depth=rand(.5,1.3);return p}
function resize(){const rect=canvas.getBoundingClientRect();const nw=Math.round(rect.width),nh=Math.round(rect.height);if(nw<1||nh<1)return;if(nw===w&&nh===h)return;w=nw;h=nh;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:Math.min(65,Math.max(24,Math.round(w*h/6500)))},()=>reset({},true))}
function tick(time){raf=0;if(!canvas.isConnected||!sheet.classList.contains("is-satchel-susan")){last=0;return}resize();const dt=Math.min((time-(last||time))/1000,.05);last=time;ctx.clearRect(0,0,w,h);
for(const p of particles){p.y-=p.v*p.depth*dt;p.x+=(p.drift+Math.sin(time*.0004+p.phase)*2)*dt;if(p.y< -10||p.x< -12||p.x>w+12)reset(p);const alpha=(.14+.3*(.5+.5*Math.sin(time*.0011+p.phase)))*p.twinkle;const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);glow.addColorStop(0,`rgba(255,233,178,${alpha})`);glow.addColorStop(.28,`rgba(240,199,133,${alpha*.38})`);glow.addColorStop(1,"rgba(240,199,133,0)");ctx.fillStyle=glow;ctx.beginPath();ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);ctx.fill()}
raf=requestAnimationFrame(tick)}
function sync(){const host=body.querySelector(".satchel-immersive");if(host&&sheet.classList.contains("is-satchel-susan")){if(canvas.parentElement!==host)host.append(canvas);resize();if(!raf&& !matchMedia("(prefers-reduced-motion: reduce)").matches)raf=requestAnimationFrame(tick)}else{canvas.remove();if(raf)cancelAnimationFrame(raf);raf=0;last=0}}
new MutationObserver(sync).observe(sheet,{attributes:true,attributeFilter:["class"]});
new MutationObserver(sync).observe(body,{childList:true,subtree:false});sync();
})();