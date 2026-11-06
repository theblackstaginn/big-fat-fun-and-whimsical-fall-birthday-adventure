/* One-time standalone birthday cold open. No quest or keepsake writes. */
(()=>{"use strict";
const standalone=window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const params=new URLSearchParams(location.search);
const test=params.get("birthdayIntro")==="preview";
const key="rogue-witch-first-launch-cinematic-v1";
let seen=false;try{seen=localStorage.getItem(key)==="done"}catch{}
if((!standalone&&!test)||(seen&&!test))return;
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const overlay=document.createElement("div");overlay.className="birthday-boot";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label","Birthday system initialization");
overlay.innerHTML='<canvas class="birthday-boot-canvas" aria-hidden="true"></canvas><div class="birthday-boot-terminal"><div class="birthday-boot-head"><span>PS C:\\ROGUE_WITCH\\BIRTHDAY&gt; ./initialize.ps1</span><span class="birthday-boot-led">●</span></div><div class="birthday-boot-log" role="log" aria-live="off"></div><div class="birthday-boot-progress"><div></div></div><div class="birthday-boot-percent">0%</div><button type="button" class="birthday-boot-skip">Skip intro</button></div><div class="birthday-boot-finale" hidden><div class="birthday-boot-boom">HAPPY BIRTHDAY, JESS!</div><p>MAGIC CONTAINMENT: COMPLETELY DESTROYED</p></div>';
document.body.append(overlay);document.documentElement.classList.add("birthday-boot-active");
const canvas=overlay.querySelector("canvas"),ctx=canvas.getContext("2d"),log=overlay.querySelector(".birthday-boot-log"),bar=overlay.querySelector(".birthday-boot-progress div"),percent=overlay.querySelector(".birthday-boot-percent"),terminal=overlay.querySelector(".birthday-boot-terminal"),finale=overlay.querySelector(".birthday-boot-finale");
const script=[
["INITIALIZING ROGUE WITCH PROTOCOL...","normal"],
["Locating birthday girl... FOUND.","normal"],
["Scanning emotional stability... concerning.","normal"],
["WARNING: Excessive affection detected.","warning"],
["Attempting to contain husband's enthusiasm...","warning"],
["ERROR 418: THE HUSBAND IS A WIZARD.","error"],
["OH, FOR THE LOVE OF... WHO GAVE HIM ACCESS TO THE PARTICLE CANNONS?!","error"],
["CRITICAL FAILURE. BRACE YOURSELF, MEATBAG.","error"],
["...well, shit.","error"]
];
let timers=[],raf=0,done=false,particles=[],start=0;
function later(fn,ms){const id=setTimeout(fn,ms);timers.push(id)}
function markDone(){if(test)return;try{localStorage.setItem(key,"done")}catch{}}
function finish(){if(done)return;done=true;markDone();timers.forEach(clearTimeout);cancelAnimationFrame(raf);overlay.remove();document.documentElement.classList.remove("birthday-boot-active");}
overlay.querySelector(".birthday-boot-skip").addEventListener("click",finish);
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*d);canvas.height=Math.round(innerHeight*d);ctx.setTransform(d,0,0,d,0,0)}
resize();window.addEventListener("resize",resize,{passive:true});
function emit(){
 const w=innerWidth,h=innerHeight,colors=["#ffdf79","#f8b84f","#bd82ed","#fff6d0","#b64d6b","#e66b32","#a7b45a","#f5e3a9"];
 const n=reduced?100:Math.min(950,Math.round(w*h/360));
 particles=Array.from({length:n},(_,i)=>{const a=Math.random()*Math.PI*2,s=4+Math.random()*16;return{x:w*.5,y:h*.43,vx:Math.cos(a)*s,vy:Math.sin(a)*s-4,gravity:.12+Math.random()*.16,rotation:Math.random()*6.28,spin:(Math.random()-.5)*.25,size:3+Math.random()*9,color:colors[i%colors.length],kind:i%5,life:1}});
 // Purple and black helium balloons burst outward, then float upward with dangling strings.
 const balloons=Array.from({length:reduced?5:22},(_,i)=>{const a=Math.random()*Math.PI*2,s=3+Math.random()*8;return{x:w*.5,y:h*.43,vx:Math.cos(a)*s,vy:Math.sin(a)*s-5,size:28+Math.random()*20,color:i%2?"#18121f":"#7b35b6",phase:Math.random()*6.28,spin:(Math.random()-.5)*.03}});
 start=performance.now();
 function frame(now){ctx.clearRect(0,0,innerWidth,innerHeight);const dt=Math.min((now-(frame.last||now))/16.67,2);frame.last=now;for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gravity*dt;p.vx*=Math.pow(.994,dt);p.rotation+=p.spin*dt;p.life=Math.max(0,1-(now-start)/6800);if(p.y>innerHeight+30||p.life===0)continue;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.globalAlpha=Math.min(1,p.life*1.5);ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=p.kind===0?17:5;if(p.kind===0){ctx.beginPath();for(let j=0;j<8;j++){let a=j*Math.PI/4,r=j%2?p.size*.3:p.size;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill()}else if(p.kind===1){ctx.beginPath();ctx.ellipse(0,0,p.size*.7,p.size*.3,0,0,Math.PI*2);ctx.fill()}else ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.65);ctx.restore()}for(const b of balloons){b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.pow(.975,dt);b.vy=Math.max(-2.8,b.vy-.045*dt);b.phase+=.035*dt;if(b.y < -90)continue;ctx.save();ctx.translate(b.x+Math.sin(b.phase)*3,b.y);ctx.rotate(b.spin*12);ctx.strokeStyle="#c4a3cc";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,b.size*1.28);ctx.bezierCurveTo(-7,b.size*2.2,8,b.size*2.9,0,b.size*3.7);ctx.stroke();ctx.fillStyle=b.color;ctx.shadowColor=b.color==="#18121f"?"#aa72d2":"#bd7cff";ctx.shadowBlur=15;ctx.beginPath();ctx.ellipse(0,0,b.size*.78,b.size,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=b.color;ctx.beginPath();ctx.moveTo(-4,b.size*.94);ctx.lineTo(4,b.size*.94);ctx.lineTo(0,b.size*1.23);ctx.closePath();ctx.fill();ctx.fillStyle=b.color==="#18121f"?"#72607c":"#d5b4ef";ctx.globalAlpha=.55;ctx.beginPath();ctx.ellipse(-b.size*.27,-b.size*.35,b.size*.14,b.size*.35,-.3,0,Math.PI*2);ctx.fill();ctx.restore()}if(now-start<7100)raf=requestAnimationFrame(frame)}
 raf=requestAnimationFrame(frame);
}
function explosion(){terminal.hidden=true;finale.hidden=false;overlay.classList.add("is-exploding");emit();later(finish,reduced?1900:7200)}
if(reduced){log.textContent="SYSTEM ERROR: THE HUSBAND IS A WIZARD. HAPPY BIRTHDAY, JESS!";later(explosion,650);return}
let cursor=0;
function typeLine(index){
 if(done)return;
 if(index>=script.length){overlay.classList.add("signal-lost");later(explosion,950);return}
 const [message,level]=script[index];const line=document.createElement("div");line.className="birthday-boot-line "+level;log.append(line);
 const prefix="PS> ";let pos=0;
 function tick(){if(done)return;pos=Math.min(message.length,pos+1);line.textContent=prefix+message.slice(0,pos)+(pos<message.length?"▌":"");log.scrollTop=log.scrollHeight;if(pos<message.length)later(tick,48+Math.random()*38);else{cursor++;let pct=index===4?99:index===5?12:Math.min(97,Math.round((index+1)*12));bar.style.width=pct+"%";percent.textContent=pct+"%";later(()=>typeLine(index+1),index===5?390:230)}}
 tick();
}
later(()=>typeLine(0),420);
})();
