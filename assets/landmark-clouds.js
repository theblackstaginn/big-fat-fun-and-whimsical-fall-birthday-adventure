/* Soft storybook cloud banks over Jess's 1024x1536 Helen illustration.
 * Only FUTURE destinations are veiled. Each has a slowly moving scalloped silhouette.
 * Every solid-white puff enters ONE shared mask/feather pass: touching clouds
 * merge without visible overlap rings. Quest data and location logic are untouched. */
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
 /* Hand-fitted to the approved 1024x1536 painting. Only distinctive
  * unrevealed storefronts/signs are veiled, never the open night sky.
  * Separate lobes conceal Wonderland's tower and both park landmarks,
  * without the huge oval previously covering the waxing Moon.
  * Bangkok Haus is off-map and needs no cloud footprint. */
 const lockedLandmarks=[
  {id:"wonderland",parts:[
   {cx:218,cy:1117,rx:181,ry:122},  // Shop, Alice display, and sign
   {cx:231,cy:984,rx:82,ry:76}    // The clock tower above the shop
  ]},
  {id:"candle",parts:[{cx:660,cy:1090,rx:139,ry:131}]},
  {id:"glass",parts:[{cx:706,cy:512,rx:163,ry:111}]},
  {id:"zuzu",parts:[{cx:676,cy:353,rx:146,ry:101}]},
  {id:"river",parts:[{cx:341,cy:794,rx:126,ry:81}]},
  {id:"sweet",parts:[{cx:317,cy:375,rx:149,ry:133}]},
  {id:"park",parts:[
   {cx:743,cy:194,rx:98,ry:65},  // Park sign below the night sky
   {cx:895,cy:184,rx:109,ry:93} // Gazebo without covering the Moon
  ]}
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

 /* The locked map is covered by continuous, irregular atmospheric cloud
  * volume. A pair of low-resolution procedural textures is created ONCE,
  * then moved gently by CSS: no stamped shapes, per-frame canvas rendering,
  * external requests, or drifting unlock geometry. */
 gradient("linearGradient","quest-cloud-sky",[
  ["0%","#c6d6e0"],["50%","#c2d3dd"],["100%","#d9e3ea"]
 ],{x1:"0",y1:"0",x2:"0",y2:"1"});
 /* One feather pass AFTER compositing all opaque puff silhouettes.
  * Nearby clouds fuse seamlessly: no separate oval opacity boundaries. */
 const feather=node("filter",{
  id:"quest-locked-cloud-union-feather",filterUnits:"userSpaceOnUse",
  x:-50,y:-50,width:1124,height:1636
 });
 feather.append(node("feGaussianBlur",{in:"SourceGraphic",stdDeviation:9}));
 defs.append(feather);
 const mask=node("mask",{
  id:"quest-unique-landmark-mask",x:0,y:0,width:1024,height:1536,
  maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse",style:"mask-type:luminance"
 });
 mask.append(node("rect",{x:0,y:0,width:1024,height:1536,fill:"#000000"}));
 /* All currently locked shapes share this ONE blurred, seamless union. */
 const bankUnion=node("g",{
  id:"quest-locked-cloud-union",filter:"url(#quest-locked-cloud-union-feather)"
 });
 mask.append(bankUnion);
 defs.append(mask);
 svg.append(defs);
 const cloudGroup=node("g",{mask:"url(#quest-unique-landmark-mask)"});
 cloudGroup.append(node("rect",{
  x:0,y:0,width:1024,height:1536,fill:"url(#quest-cloud-sky)"
 }));
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const smooth=(a,b,v)=>{
  const t=clamp((v-a)/(b-a),0,1);
  return t*t*(3-2*t);
 };
 function makeCloudTexture(seed,foreground=false){
  const width=540,height=810;
  const canvas=document.createElement("canvas");
  canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext("2d");
  if(!ctx)return null;
  let state=seed>>>0;
  const random=()=>{
   state=(Math.imul(state,1664525)+1013904223)>>>0;
   return state/4294967296;
  };
  /* Interpolated noise at five independent scales makes asymmetric cloud
   * masses with small filaments, never repeated rows of puff-shaped icons. */
  function noise(cell){
   const cols=Math.ceil(width/cell)+6,rows=Math.ceil(height/cell)+6;
   const values=new Float32Array(cols*rows);
   for(let i=0;i<values.length;i++)values[i]=random();
   return (x,y)=>{
    const gx=clamp(x/cell+2,0,cols-1.001);
    const gy=clamp(y/cell+2,0,rows-1.001);
    const ix=Math.floor(gx),iy=Math.floor(gy);
    const tx=smooth(0,1,gx-ix),ty=smooth(0,1,gy-iy);
    const top=iy*cols+ix,bottom=top+cols;
    const upper=values[top]*(1-tx)+values[top+1]*tx;
    const lower=values[bottom]*(1-tx)+values[bottom+1]*tx;
    return upper*(1-ty)+lower*ty;
   };
  }
  const large=noise(215),medium=noise(107),small=noise(49);
  const fine=noise(24),grain=noise(11);
  const warpX=noise(144),warpY=noise(119);
  const image=ctx.createImageData(width,height),data=image.data;
  for(let y=0;y<height;y++){
   for(let x=0;x<width;x++){
    const wx=x+(warpX(x,y)-.5)*64;
    const wy=y+(warpY(x,y)-.5)*53;
    const big=large(wx,wy),mid=medium(wx,wy),soft=small(wx,wy);
    let density=.36*big+.31*mid+.20*soft
       +.095*fine(wx,wy)+.035*grain(wx,wy);
    // Broad bent fronts, rather than a perfectly evenly spaced blanket.
    density+=.048*Math.sin(wy/113+Math.sin(wx/159)*1.2);
    const mass=smooth(.32,.65,density);
    const contour=smooth(.32,.51,density)*(1-smooth(.54,.70,density));
    const topLight=smooth(.51,.72,density);
    const detail=(fine(wx,wy)-.5)*5+(grain(wx,wy)-.5)*2.2;
    const i=(y*width+x)*4;
    if(foreground){
     // Sparse translucent wisps at a different speed than the main bank.
     const alpha=Math.round(118*smooth(.47,.70,density));
     data[i]=clamp(211+mass*39+detail,0,255);
     data[i+1]=clamp(226+mass*27+detail,0,255);
     data[i+2]=clamp(235+mass*16+detail,0,255);
     data[i+3]=alpha;
    }else{
     data[i]=clamp(190+mass*61-contour*25+topLight*6+detail,0,255);
     data[i+1]=clamp(207+mass*44-contour*19+topLight*4+detail,0,255);
     data[i+2]=clamp(218+mass*33-contour*12+topLight*2+detail,0,255);
     data[i+3]=255;
    }
   }
  }
  ctx.putImageData(image,0,0);
  try{return canvas.toDataURL("image/png")}catch{return null}
 }
 function movingImage(seed,foreground,cls){
  const image=node("image",{
   x:-96,y:-145,width:1216,height:1826,
   preserveAspectRatio:"none",class:cls,
   opacity:foreground?".75":"1"
  });
  const png=makeCloudTexture(seed,foreground);
  if(!png)return;
  image.setAttribute("href",png);
  image.setAttributeNS("http://www.w3.org/1999/xlink","href",png);
  cloudGroup.append(image);
 }
 // Enlarged beyond the viewport so the very slow drift never leaves gaps.
 movingImage(79041,false,"quest-cloud-drift-back");
 movingImage(12709,true,"quest-cloud-drift-front");
 const driftStyle=document.createElement("style");
 driftStyle.textContent=[
  ".landmark-clouds .quest-cloud-drift-back{transform-box:view-box;animation:quest-atmosphere-drift-back 54s ease-in-out infinite alternate}",
  ".landmark-clouds .quest-cloud-drift-front{transform-box:view-box;animation:quest-atmosphere-drift-front 71s ease-in-out infinite alternate}",
  "@keyframes quest-atmosphere-drift-back{from{transform:translate(-13px,-5px)}to{transform:translate(15px,8px)}}",
  "@keyframes quest-atmosphere-drift-front{from{transform:translate(17px,-9px)}to{transform:translate(-14px,10px)}}",
  ".landmark-clouds [data-locked-destination]{transform-box:fill-box;transform-origin:center;animation:quest-cloud-bank-sway 31s ease-in-out infinite alternate}",
  "@keyframes quest-cloud-bank-sway{from{transform:translate(-6px,3px)}to{transform:translate(6px,-4px)}}",
  "@media(prefers-reduced-motion:reduce){.landmark-clouds .quest-cloud-drift-back,.landmark-clouds .quest-cloud-drift-front,.landmark-clouds [data-locked-destination]{animation:none!important}}"
 ].join("\n");
 document.head.append(driftStyle);
 svg.append(cloudGroup);
 /* Bangkok Haus is an off-map destination, not a painted storefront.
    Anchor its enlarged cue to the viewport-sized hero, not the map SVG,
    so camera panning and aspect ratios cannot push it off the screen. */
 const dinnerIndex=chapters.findIndex(chapter=>chapter.id==="dinner");
 const detour=document.createElement("button");
 detour.type="button";
 detour.id="quest-bangkok-side-trip";
 detour.hidden=true;
 detour.setAttribute("aria-label","Open Bangkok Haus dinner destination in the Journal");
 detour.title="Bangkok Haus · your next destination";
 const signImage=document.createElement("img");
 signImage.src="assets/bangkok-haus-direction-sign.webp";
 signImage.alt="";
 signImage.draggable=false;
 signImage.decoding="async";
 detour.append(signImage);
 const detourHost=mist.closest(".hero-art");
 detourHost?.append(detour);
 detour.addEventListener("click",()=>{
  if(completed.length!==dinnerIndex)return;
  selected=chapters[dinnerIndex];
  renderProgress();
  document.querySelector('.rpg-hud [data-panel="quest"]')?.click();
 });
 mist.classList.add("landmark-clouds");
 mist.append(svg);


 /* Conceal ONLY destinations Jess has not yet unlocked.
  * The river, streets, scenery, and visited shops are otherwise fully visible.
  * This avoids the former full-screen blanket and its cloud-octopus edges. */
 const banks=new Map();
 let previousCount=-1;
 const parkIndex=chapters.findIndex(chapter=>chapter.id==="park");
 if(parkIndex<0)throw Error("Final park quest is missing");
 function ensureBank(site){
  let entry=banks.get(site.id);
  if(entry){
   if(entry.fading){
    entry.token++;
    entry.fading=false;
    entry.group.setAttribute("opacity","1");
   }
   return;
  }
  const index=lockedLandmarks.indexOf(site);
  const group=node("g",{"data-locked-destination":site.id,opacity:1});
  /* The whole location is one reveal, even when it has two separate
   * fitted lobes. All lobes still share the original seamless union mask. */
  const billows=[
   [-.64,-.08,.33,.52],[-.49,-.38,.31,.46],
   [-.17,-.53,.35,.45],[.21,-.50,.37,.48],
   [.49,-.29,.37,.49],[.70,.04,.31,.45],
   [.53,.33,.36,.40],[.13,.43,.47,.38],
   [-.30,.42,.41,.38],[-.62,.22,.35,.40]
  ];
  for(const [partIndex,part] of site.parts.entries()){
   group.append(node("ellipse",{
    cx:part.cx,cy:part.cy+part.ry*.04,
    rx:part.rx*.77,ry:part.ry*.67,fill:"#ffffff"
   }));
   for(let i=0;i<billows.length;i++){
    const [x,y,w,h]=billows[i];
    const variation=Math.sin((index+1)*9.73+(partIndex+1)*1.13+i*2.47);
    group.append(node("ellipse",{
     cx:part.cx+(x+variation*.028)*part.rx,
     cy:part.cy+(y+variation*.040)*part.ry,
     rx:part.rx*w*(1+variation*.07),
     ry:part.ry*h*(1-variation*.055),
     fill:"#ffffff"
    }));
   }
  }
  // Gently drift each bank independently, only a handful of map pixels.
  group.style.animationDuration=(25+(index*7)%16)+"s";
  group.style.animationDelay=(-index*4.7)+"s";
  bankUnion.append(group);
  banks.set(site.id,{group,token:0,fading:false});
 }
 function clearBank(id,animated){
  const entry=banks.get(id);
  if(!entry||entry.fading)return;
  if(!animated||!window.requestAnimationFrame){
   entry.group.remove();
   banks.delete(id);
   return;
  }
  entry.fading=true;
  const token=++entry.token;
  const started=performance.now();
  function fade(now){
   if(entry.token!==token||!entry.group.isConnected)return;
   const t=Math.min(1,Math.max(0,(now-started)/950));
   const ease=t*t*(3-2*t);
   entry.group.setAttribute("opacity",String(1-ease));
   if(t<1){requestAnimationFrame(fade);return}
   entry.group.remove();
   if(banks.get(id)===entry)banks.delete(id);
  }
  requestAnimationFrame(fade);
 }
 function refresh(){
  const count=Math.min(completed.length,chapters.length);
  const parkUnlocked=count>=parkIndex;
  mist.hidden=!portraitReady||parkUnlocked;
  // Dinner is the ONLY active sign; remove it on adjacent chapters or Streets.
  // Keeping it separate from the fog allows a luminous aura without
  // altering the original clouds or world painting.
  const overview=document.querySelector("#overview-view");
  detour.hidden=!(count===dinnerIndex&&portraitReady&&!painting.hidden&&
   overview&&!overview.hidden&&document.body.classList.contains("rpg-fullscreen"));
  if(parkUnlocked){previousCount=count;return}
  // The current destination is already revealed; only FUTURE stops stay hidden.
  const lockedIds=new Set(chapters.slice(count+1).map(ch=>ch.id));
  for(const site of lockedLandmarks){
   if(lockedIds.has(site.id))ensureBank(site);
  }
  const advancing=previousCount>=0&&count===previousCount+1;
  const reduceMotion=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  for(const [id] of banks){
   if(!lockedIds.has(id))clearBank(id,advancing&&!reduceMotion);
  }
  previousCount=count;
 }
 // The map-mode toggle does not call updateSceneArtwork, so recheck after
 // the existing click handlers switch between the Overworld and Streets.
 document.querySelector("#mode-overview")?.addEventListener("click",refresh);
 document.querySelector("#mode-nearby")?.addEventListener("click",refresh);
 const original=updateSceneArtwork;
 updateSceneArtwork=function(){original();refresh()};
 refresh();
})();
