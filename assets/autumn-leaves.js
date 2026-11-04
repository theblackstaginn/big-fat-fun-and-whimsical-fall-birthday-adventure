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
   /* Mostly falling leaves, with smaller crosswind gusts sweeping in from either side. */
   const roll=rand();
   const route=roll<.60?"fall":roll<.80?"east":"west";
   const startX=route==="east"?-12:route==="west"?112:-5+rand()*110;
   const startY=route==="fall"?-12:-8+rand()*76;
   const endX=route==="east"?120+rand()*24:route==="west"?-(120+rand()*24):(rand()-.5)*105;
   const endY=route==="fall"?120+rand()*26:40+rand()*58;
   const gust=route==="fall"?24:19;
   const duration=surface==="world"?11+rand()*16:10+rand()*14;
   const size=surface==="world"?10+rand()*13:12+rand()*17;
   track.className="rpg-autumn-leaf-track";
   track.style.setProperty("--leaf-x",startX.toFixed(1)+"%");
   track.style.setProperty("--leaf-y",startY.toFixed(1)+"%");
   track.style.setProperty("--leaf-duration",duration.toFixed(2)+"s");
   track.style.setProperty("--leaf-delay",(-rand()*duration).toFixed(2)+"s");
   track.style.setProperty("--leaf-size",size.toFixed(1)+"px");
   track.style.setProperty("--leaf-opacity",(.88+rand()*.12).toFixed(2));
   track.style.setProperty("--leaf-turn",(2.3+rand()*3.8).toFixed(2)+"s");
   for(const [point,part] of [[1,.23],[2,.49],[3,.75],[4,1]]){
    const crosswind=point===4?0:(rand()-.5)*gust*2;
    const flutter=point===4?0:(rand()-.5)*6;
    track.style.setProperty("--leaf-x"+point,(endX*part+crosswind).toFixed(1)+"%");
    track.style.setProperty("--leaf-y"+point,(endY*part+flutter).toFixed(1)+"dvh");
   }
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
 position:absolute;left:var(--leaf-x);top:var(--leaf-y);
 width:100%;height:0;opacity:var(--leaf-opacity);will-change:transform;
 animation:rpg-autumn-windfall var(--leaf-duration) linear var(--leaf-delay) infinite;
}
.rpg-autumn-leaf-track svg{
 position:absolute;left:0;top:0;width:var(--leaf-size);height:var(--leaf-size);
 overflow:visible;filter:drop-shadow(0 1px 2px rgba(67,35,23,.28));
 transform-origin:50% 42%;
 animation:rpg-autumn-tumble var(--leaf-turn) ease-in-out infinite alternate;
}
.rpg-autumn-leaf-track:nth-child(3n) svg{animation-direction:alternate-reverse}
@keyframes rpg-autumn-windfall{
 0%{transform:translate3d(0,0,0)}
 23%{transform:translate3d(var(--leaf-x1),var(--leaf-y1),0)}
 49%{transform:translate3d(var(--leaf-x2),var(--leaf-y2),0)}
 75%{transform:translate3d(var(--leaf-x3),var(--leaf-y3),0)}
 100%{transform:translate3d(var(--leaf-x4),var(--leaf-y4),0)}
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