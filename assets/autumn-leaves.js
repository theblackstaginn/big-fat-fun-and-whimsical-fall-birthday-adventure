/* Jess's autumn breeze: decorative SVG foliage over the overworld and
 * unlocked location paintings. Map < leaves (z3) < discovery clouds (z4).
 * No map rendering, quest progression, GPS, or scene unlock logic is changed. */
(()=>{
 "use strict";
 const NS="http://www.w3.org/2000/svg";
 const make=(name,attributes={})=>{
  const el=document.createElementNS(NS,name);
  for(const [key,value] of Object.entries(attributes))el.setAttribute(key,String(value));
  return el;
 };
 const shapes=[
  { // maple
   outline:"M23 4 27 13 35 8 33 18 43 18 36 25 41 32 28 30 24 39 22 39 18 30 5 32 10 25 3 18 13 18 11 8 19 13 Z",
   vein:"M23 37 23 15 M23 27 13 20 M23 27 34 20 M23 30 14 29 M23 30 32 29"
  },
  { // oak
   outline:"M23 4 C17 8 17 13 19 16 C11 11 5 16 10 23 C3 25 6 32 14 31 C13 39 19 40 23 35 C27 40 33 39 32 31 C40 32 43 25 36 23 C41 16 35 11 27 16 C29 12 29 8 23 4 Z",
   vein:"M23 35 23 12 M23 27 13 24 M23 27 34 24 M23 31 14 31 M23 31 32 31"
  },
  { // birch
   outline:"M22 3 C9 11 6 22 14 32 Q18 39 22 41 C28 34 37 22 32 12 C29 6 26 4 22 3 Z",
   vein:"M22 40 22 12 M22 20 14 17 M22 27 30 20 M22 31 16 27"
  }
 ];
 const palettes=[
  ["#e4a53d","#ac481f","#7e3021"],
  ["#de6f24","#ba3d20","#762819"],
  ["#d3a238","#a87520","#70501f"],
  ["#b7422c","#92272b","#68212a"],
  ["#c87935","#924b22","#65381e"],
  ["#d28f4b","#b45b30","#823424"]
 ];
 const rand=()=>Math.random();
 function leaf(surface,index){
  const svg=make("svg",{viewBox:"0 0 46 47","aria-hidden":"true",focusable:"false"});
  const {outline,vein}=shapes[Math.floor(rand()*shapes.length)];
  const colors=palettes[Math.floor(rand()*palettes.length)];
  const gradId="quest-autumn-leaf-"+surface+"-"+index;
  const defs=make("defs");
  const gradient=make("linearGradient",{id:gradId,x1:"0%",y1:"0%",x2:"95%",y2:"100%"});
  for(const [offset,color] of [["0%",colors[0]],["58%",colors[1]],["100%",colors[2]]]){
   gradient.append(make("stop",{offset,"stop-color":color}));
  }
  defs.append(gradient);
  svg.append(defs);
  svg.append(make("path",{d:outline,fill:"url(#"+gradId+")",stroke:colors[2],"stroke-width":".7","stroke-linejoin":"round"}));
  svg.append(make("path",{d:vein,fill:"none",stroke:"#ffe0a0","stroke-opacity":".39","stroke-width":".85","stroke-linecap":"round"}));
  svg.append(make("path",{d:"M23 37 Q24 41 21 46",stroke:"#755027","stroke-width":"1.7",fill:"none","stroke-linecap":"round"}));
  return svg;
 }
 function makeLayer(target,surface,count){
  if(!target||target.querySelector('.rpg-autumn-leaves--'+surface))return;
  const layer=document.createElement("div");
  layer.className="rpg-autumn-leaves rpg-autumn-leaves--"+surface;
  layer.setAttribute("aria-hidden","true");
  for(let i=0;i<count;i++){
   const track=document.createElement("span");
   const east=i%2===0;
   const duration=surface==="world"?12+rand()*14:10+rand()*12;
   const size=surface==="world"?10+rand()*13:12+rand()*17;
   track.className="rpg-autumn-leaf-track "+(east?"rpg-autumn-east":"rpg-autumn-west");
   track.style.setProperty("--leaf-y",(6+rand()*86).toFixed(1)+"%");
   track.style.setProperty("--leaf-duration",duration.toFixed(2)+"s");
   track.style.setProperty("--leaf-delay",(-rand()*duration).toFixed(2)+"s");
   track.style.setProperty("--leaf-size",size.toFixed(1)+"px");
   track.style.setProperty("--leaf-opacity",(.50+rand()*.32).toFixed(2));
   track.style.setProperty("--leaf-fall",(-11+rand()*38).toFixed(1)+"px");
   track.style.setProperty("--leaf-turn",(2.7+rand()*3.3).toFixed(2)+"s");
   track.append(leaf(surface,i));
   layer.append(track);
  }
  target.append(layer);
 }
 const style=document.createElement("style");
 style.id="rpg-autumn-leaves-style";
 style.textContent=String.raw`
/* World canvas / clouds retain their existing stack positions. */
.map-canvas>.rpg-autumn-leaves--world{z-index:3}
.rpg-fullscreen .map-canvas>.rpg-autumn-leaves--world{z-index:3}
.map-canvas>.overworld-fog{z-index:4}
.rpg-autumn-leaves{
 position:absolute;inset:0;overflow:hidden;pointer-events:none!important;
 user-select:none;-webkit-user-select:none;contain:paint;
}
.rpg-autumn-leaf-track{
 position:absolute;top:var(--leaf-y);width:calc(100% + 128px);
 height:0;opacity:var(--leaf-opacity);will-change:transform;
 animation-duration:var(--leaf-duration);
 animation-delay:var(--leaf-delay);
 animation-timing-function:linear;
 animation-iteration-count:infinite;
}
.rpg-autumn-east{left:-64px;animation-name:rpg-autumn-cross-east}
.rpg-autumn-west{right:-64px;animation-name:rpg-autumn-cross-west}
.rpg-autumn-leaf-track svg{
 position:absolute;top:0;width:var(--leaf-size);height:var(--leaf-size);
 overflow:visible;filter:drop-shadow(0 1px 2px rgba(67,35,23,.28));
 transform-origin:50% 42%;
 animation:rpg-autumn-tumble var(--leaf-turn) ease-in-out infinite alternate;
}
.rpg-autumn-east svg{left:0}
.rpg-autumn-west svg{right:0;animation-direction:alternate-reverse}
@keyframes rpg-autumn-cross-east{
 0%{transform:translate3d(0,-8px,0)}
 24%{transform:translate3d(24%,9px,0)}
 51%{transform:translate3d(51%,-13px,0)}
 77%{transform:translate3d(77%,12px,0)}
 100%{transform:translate3d(100%,var(--leaf-fall),0)}
}
@keyframes rpg-autumn-cross-west{
 0%{transform:translate3d(0,11px,0)}
 23%{transform:translate3d(-23%,-10px,0)}
 49%{transform:translate3d(-49%,12px,0)}
 75%{transform:translate3d(-75%,-12px,0)}
 100%{transform:translate3d(-100%,var(--leaf-fall),0)}
}
@keyframes rpg-autumn-tumble{
 0%{transform:rotate(-34deg) rotateY(-25deg) scale(.87)}
 35%{transform:rotate(51deg) rotateY(65deg) scale(1.07)}
 70%{transform:rotate(132deg) rotateY(-40deg) scale(.85)}
 100%{transform:rotate(205deg) rotateY(55deg) scale(1)}
}
/* Painted location reveal: leaves over the art, below readable UI. */
#quest-scene-reveal .quest-scene-frame>.rpg-autumn-leaves--scene{z-index:2}
#quest-scene-reveal .quest-scene-shade{z-index:1}
#quest-scene-reveal .quest-scene-top,
#quest-scene-reveal .quest-scene-bottom{z-index:3}
@media(prefers-reduced-motion:reduce){
 .rpg-autumn-leaves{display:none!important}
}
@media print{.rpg-autumn-leaves{display:none!important}}
body.rpg-autumn-backgrounded .rpg-autumn-leaf-track,
body.rpg-autumn-backgrounded .rpg-autumn-leaf-track svg{
 animation-play-state:paused!important
}
`;
 document.head.append(style);
 makeLayer(document.querySelector("#overview-view .map-canvas"),"world",20);
 makeLayer(document.querySelector("#quest-scene-reveal .quest-scene-frame"),"scene",13);
 document.addEventListener("visibilitychange",()=>{
  document.body.classList.toggle("rpg-autumn-backgrounded",document.hidden);
 });
})();