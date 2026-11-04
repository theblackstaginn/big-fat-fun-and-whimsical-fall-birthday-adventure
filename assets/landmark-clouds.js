/* Landmark clearings for the approved 1024x1536 Helen overworld.
 * No pixels in the original artwork are changed. Each newly unlocked stop
 * opens its own cloud pocket; park completion clears the entire sky. */
(()=>{
 "use strict";
 const mist=document.querySelector("#overworld-fog");
 const painting=document.querySelector("#portrait-overworld");
 if(!mist||!painting||typeof updateSceneArtwork!=="function")return;

 const NS="http://www.w3.org/2000/svg";
 function node(tag,attrs={}){
  const el=document.createElementNS(NS,tag);
  for(const [key,val] of Object.entries(attrs))el.setAttribute(key,String(val));
  return el;
 }
 const stops=[
  {id:"ruby",x:685,y:1336,rx:246,ry:193},
  {id:"wonderland",x:217,y:1084,rx:226,ry:177},
  {id:"candle",x:649,y:1096,rx:210,ry:162},
  {id:"glass",x:738,y:522,rx:212,ry:151},
  {id:"zuzu",x:662,y:368,rx:214,ry:161},
  {id:"river",x:429,y:801,rx:281,ry:226},
  /* Bangkok Haus is not painted onto Main Street. Its reveal is a
     clearly marked detour on Edelweiss Strasse, not a fabricated shop. */
  {id:"dinner",detour:true},
  {id:"sweet",x:266,y:365,rx:225,ry:179},
  {id:"park",x:865,y:159,rx:192,ry:156}
 ];
 const svg=node("svg",{viewBox:"0 0 1024 1536",preserveAspectRatio:"xMidYMid slice","aria-hidden":"true"});
 const defs=node("defs");
 function gradient(tag,id,points,more={}){
  const g=node(tag,{id,...more});
  for(const [offset,color,opacity] of points){
   const attrs={offset,"stop-color":color};
   if(opacity!==undefined)attrs["stop-opacity"]=opacity;
   g.append(node("stop",attrs));
  }
  defs.append(g);
 }
 gradient("linearGradient","quest-cloud-sky",[["0%","#f7fcff"],["44%","#e2f1fc"],["78%","#eaf7ff"],["100%","#daeefc"]],{x1:"0",y1:"0",x2:"0",y2:"1"});
 gradient("radialGradient","quest-cloud-top",[["0%","#ffffff",".98"],["55%","#ffffff",".96"],["80%","#f9fdff",".65"],["100%","#ecf7ff","0"]]);
 gradient("radialGradient","quest-cloud-bottom",[["0%","#9bc4e5",".48"],["57%","#b8d9f0",".28"],["100%","#e9f6ff","0"]]);
 gradient("radialGradient","quest-cloud-hole",[["0%","#000000"],["65%","#000000"],["86%","#b4b4b4"],["100%","#ffffff"]]);
 const mask=node("mask",{id:"quest-unique-landmark-mask",x:0,y:0,width:1024,height:1536,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse",style:"mask-type:luminance"});
 mask.append(node("rect",{x:0,y:0,width:1024,height:1536,fill:"#ffffff"}));
 defs.append(mask);
 svg.append(defs);
 const cloudGroup=node("g",{mask:"url(#quest-unique-landmark-mask)"});
 cloudGroup.append(node("rect",{x:0,y:0,width:1024,height:1536,fill:"url(#quest-cloud-sky)"}));
 /* Overlapping scalloped white cloudheads with faint painted blue undersides. */
 for(let row=0;row<10;row++){
  const y=65+row*168;
  for(let col=0;col<6;col++){
   const x=-122+col*232+(row%2?105:0);
   const r=170+(row+col)%3*17;
   cloudGroup.append(node("ellipse",{cx:x+20,cy:y+48,rx:r+18,ry:112,fill:"url(#quest-cloud-bottom)",opacity:".83"}));
   cloudGroup.append(node("ellipse",{cx:x,cy:y,rx:r,ry:108+(row+col)%2*17,fill:"url(#quest-cloud-top)",opacity:".93"}));
  }
 }
 svg.append(cloudGroup);
 /* Draw the off-map dinner destination as a proper side-trip compass card.
    It appears when the dinner chapter unlocks, and is not a false storefront. */
 const detour=node("g",{id:"quest-bangkok-side-trip",style:"display:none"});
 detour.append(node("rect",{x:729,y:861,width:283,height:99,rx:19,fill:"#584252","fill-opacity":".96",stroke:"#eac59b","stroke-width":"2"}));
 const heading=node("text",{x:870,y:899,"text-anchor":"middle",fill:"#fff0d7","font-family":"Georgia,serif","font-size":"27","font-weight":"bold"});
 heading.textContent="↗ Bangkok Haus";
 const foot=node("text",{x:870,y:928,"text-anchor":"middle",fill:"#f7d9bf","font-family":"Georgia,serif","font-size":"18"});
 foot.textContent="Edelweiss Strasse · detour";
 detour.append(heading,foot);
 svg.append(detour);
 mist.classList.add("landmark-clouds");
 mist.append(svg);

 const opened=new Map();
 let previous=-1;
 function openHole(stop,animate){
  const hole=node("ellipse",{cx:stop.x,cy:stop.y,rx:animate?1:stop.rx,ry:animate?1:stop.ry,fill:"url(#quest-cloud-hole)"});
  mask.append(hole);
  opened.set(stop.id,hole);
  if(!animate)return;
  const started=performance.now();
  function frame(time){
   if(!hole.isConnected)return;
   const t=Math.min(1,Math.max(0,(time-started)/1100));
   const ease=1-Math.pow(1-t,3);
   hole.setAttribute("rx",String(Math.max(1,ease*stop.rx)));
   hole.setAttribute("ry",String(Math.max(1,ease*stop.ry)));
   if(t<1)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
 }
 function refresh(){
  const count=Math.min(completed.length,chapters.length);
  const finished=count>=chapters.length;
  mist.hidden=!portraitReady||finished;
  detour.style.display=count>=6&&!finished?"":"none";
  if(finished){previous=count;return}
  /* Visited + currently unlocked chapters stay open; future chapters remain
     hidden, regardless of which previously visited chapter is selected. */
  const visible=stops.slice(0,count+1).filter(s=>!s.detour);
  const wanted=new Set(visible.map(s=>s.id));
  for(const [id,shape] of opened)if(!wanted.has(id)){shape.remove();opened.delete(id)}
  const animate=previous>=0&&count===previous+1&&!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  for(const stop of visible)if(!opened.has(stop.id))openHole(stop,animate&&stop.id===visible[visible.length-1].id);
  previous=count;
 }
 const original=updateSceneArtwork;
 updateSceneArtwork=function(){original();refresh()};
 refresh();
})();