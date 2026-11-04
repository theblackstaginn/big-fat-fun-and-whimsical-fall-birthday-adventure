/* Progressive storybook cloudscape over the original 1024x1536 painting.
 * All reveals form ONE growing explored landscape, not detached circular holes.
 * Each locked shop stays hidden until its chapter unlocks.
 * When Hansel & Gretel is completed, the park opens and all clouds part. */
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
 const territories=[
  {id:"ruby",d:"M 315 1536 C 326 1490 389 1440 455 1398 C 463 1347 480 1263 537 1232 C 597 1190 654 1178 729 1193 C 797 1217 856 1225 913 1203 C 969 1185 1002 1177 1024 1159 L 1024 1536 Z"},
  {id:"wonderland",d:"M 0 1536 L 0 1171 C 55 1155 77 1108 103 1075 C 143 1029 197 1004 252 1018 C 320 1017 342 1054 363 1090 C 381 1125 391 1170 430 1212 C 460 1242 464 1320 509 1371 C 455 1421 420 1462 397 1536 Z"},
  {id:"candle",d:"M 351 1536 C 369 1486 400 1406 474 1346 C 492 1291 501 1224 529 1150 C 551 1091 579 1024 648 998 C 721 987 786 1009 841 994 C 916 970 976 967 1024 969 L 1024 1536 Z"},
  {id:"glass",d:"M 580 1169 C 609 1085 653 1027 713 950 C 733 886 745 830 743 765 C 715 703 694 664 674 597 C 663 554 681 513 730 486 C 782 453 831 457 876 471 C 931 497 973 515 1024 481 L 1024 1230 C 910 1252 773 1206 580 1169 Z"},
  {id:"zuzu",d:"M 606 618 C 594 574 574 502 568 446 C 556 385 564 319 624 281 C 698 247 765 279 825 281 C 905 287 967 300 1024 279 L 1024 751 C 953 730 886 663 815 626 C 754 600 678 604 606 618 Z"},
  {id:"river",d:"M 0 1189 C 37 1136 104 1060 159 987 C 187 923 223 854 241 782 C 260 724 311 694 358 701 C 398 719 442 743 488 721 C 526 709 550 717 572 753 C 605 808 594 874 556 926 C 505 993 483 1099 465 1210 L 0 1455 Z"},
  {id:"dinner",d:"M 0 1059 C 43 989 92 899 142 814 C 168 739 181 667 207 615 C 249 566 287 574 340 603 C 375 642 451 659 512 628 C 583 606 655 633 703 688 C 723 766 687 828 607 879 C 550 950 506 1033 459 1117 L 0 1304 Z"},
  {id:"sweet",d:"M 0 0 L 504 0 C 533 80 572 140 604 193 C 646 222 697 227 730 254 C 768 277 791 323 779 382 C 785 435 846 495 913 521 C 975 561 996 586 1024 628 L 1024 1536 L 0 1536 Z"}
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
 const mask=node("mask",{
  id:"quest-unique-landmark-mask",x:0,y:0,width:1024,height:1536,
  maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse",style:"mask-type:luminance"
 });
 mask.append(node("rect",{x:0,y:0,width:1024,height:1536,fill:"#ffffff"}));
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


 /* Fixed chapter discovery shapes retain their smooth continuous feather.
  * No detached cutouts, scallops, or perforations along the boundary.
  * The two cloud textures drift independently INSIDE the fixed mask. */
 const painted=new Map();
 let previousCount=-1;
 const parkIndex=chapters.findIndex(chapter=>chapter.id==="park");
 if(parkIndex!==8)throw Error("Unexpected chapter order for landmark cloud reveal");
 const featherSteps=[[45,.10],[26,.19],[12,.28]];
 function addTerritory(region,animated){
  const opacity=animated?0:1;
  const clearingGroup=node("g",{opacity,"data-discovered":region.id});
  for(const [width,alpha] of featherSteps){
   clearingGroup.append(node("path",{
    d:region.d,fill:"none",stroke:"#000000",
    "stroke-opacity":alpha,"stroke-width":width,
    "stroke-linecap":"round","stroke-linejoin":"round"
   }));
  }
  clearingGroup.append(node("path",{d:region.d,fill:"#000000"}));
  mask.append(clearingGroup);
  painted.set(region.id,{clearingGroup});
  if(!animated||!window.requestAnimationFrame)return;
  const started=performance.now();
  const frame=now=>{
   if(!clearingGroup.isConnected)return;
   const t=Math.min(1,Math.max(0,(now-started)/1200));
   clearingGroup.setAttribute("opacity",String(1-Math.pow(1-t,3)));
   if(t<1)requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
 }
 function refresh(){
  const count=Math.min(completed.length,chapters.length);
  /* The park unlocks after chapter 8 (Hansel & Gretel).
   * It does NOT require park completion to lift the final clouds. */
  const parkUnlocked=count>=parkIndex;
  mist.hidden=!portraitReady||parkUnlocked;
  // The off-map Bangkok Haus card appears AS SOON AS dinner is the active quest.
  detour.style.display=count>=chapters.findIndex(ch=>ch.id==="dinner")&&!parkUnlocked?"":"none";
  if(parkUnlocked){previousCount=count;return}
  const wanted=territories.slice(0,count+1);
  const ids=new Set(wanted.map(region=>region.id));
  /* Preview exit/reset restores the earlier cloud coverage exactly. */
  for(const [id,entry] of painted){
   if(!ids.has(id)){
    entry.clearingGroup.remove();
    painted.delete(id);
   }
  }
  const freshStep=previousCount>=0&&count===previousCount+1;
  const reduceMotion=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  for(const region of wanted){
   if(!painted.has(region.id))addTerritory(region,freshStep&&!reduceMotion&&region.id===wanted[wanted.length-1].id);
  }
  previousCount=count;
 }

 const original=updateSceneArtwork;
 updateSceneArtwork=function(){original();refresh()};
 refresh();
})();