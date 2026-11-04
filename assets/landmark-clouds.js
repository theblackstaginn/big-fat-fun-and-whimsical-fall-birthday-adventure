/* Destination-only cloudscape over Jess's 1024x1536 Helen illustration.
 * The map is readable; only locked story locations remain beneath soft fog.
 * Each unlock releases its destination cloud, and the final park clears all.
 * Existing quest progress, memories, achievements, and GPS are untouched. */
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
 /* Each bank covers an unrevealed illustration landmark, not empty scenery.
  * Bangkok Haus is an off-map detour and needs no cloud footprint. */
 const lockedLandmarks=[
  {id:"wonderland",cx:185,cy:1076,rx:258,ry:183},
  {id:"candle",cx:662,cy:1075,rx:225,ry:162},
  {id:"glass",cx:709,cy:514,rx:214,ry:138},
  {id:"zuzu",cx:668,cy:351,rx:225,ry:137},
  {id:"river",cx:352,cy:791,rx:216,ry:132},
  {id:"sweet",cx:319,cy:374,rx:242,ry:171},
  {id:"park",cx:865,cy:169,rx:235,ry:159}
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
 /* Broad, feathered fog banks. No detached puffs, lobes, or long tails. */
 gradient("radialGradient","quest-locked-landmark-veil",[
  ["0%","#ffffff","1"],["68%","#ffffff","1"],
  ["81%","#ffffff",".98"],["91%","#ffffff",".70"],
  ["100%","#000000","0"]
 ]);
 const mask=node("mask",{
  id:"quest-unique-landmark-mask",x:0,y:0,width:1024,height:1536,
  maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse",style:"mask-type:luminance"
 });
 mask.append(node("rect",{x:0,y:0,width:1024,height:1536,fill:"#000000"}));
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
  "@media(prefers-reduced-motion:reduce){.landmark-clouds .quest-cloud-drift-back,.landmark-clouds .quest-cloud-drift-front{animation:none!important}}"
 ].join("\n");
 document.head.append(driftStyle);
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
  const group=node("g",{"data-locked-destination":site.id,opacity:1});
  group.append(node("ellipse",{
   cx:site.cx,cy:site.cy,rx:site.rx,ry:site.ry,
   fill:"url(#quest-locked-landmark-veil)"
  }));
  mask.append(group);
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
  // Dinner remains a side trip, not a fictional on-map storefront or beacon.
  detour.style.display=count>=chapters.findIndex(ch=>ch.id==="dinner")&&!parkUnlocked?"":"none";
  if(parkUnlocked){previousCount=count;return}
  const lockedIds=new Set(chapters.slice(count).map(ch=>ch.id));
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
 const original=updateSceneArtwork;
 updateSceneArtwork=function(){original();refresh()};
 refresh();
})();
