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

 /* Unexplored land is covered by a proper bank of illustrated cumulus,
  * not a white rectangle with a blurry cut-out. Blue channels between
  * individual lobes make each cloud silhouette readable on small screens. */
 gradient("linearGradient","quest-cloud-sky",[
  ["0%","#cddfeb"],["42%","#bfd5e4"],["100%","#dae8f0"]
 ],{x1:"0",y1:"0",x2:"0",y2:"1"});
 gradient("linearGradient","quest-cloud-shadow",[
  ["0%","#a7c3d6",".3"],["48%","#9abacf",".75"],["100%","#b6cfe0","0"]
 ],{x1:"0",y1:"0",x2:"0",y2:"1"});
 gradient("linearGradient","quest-cloud-body",[
  ["0%","#ffffff"],["48%","#f3faff"],["84%","#e4f0f8"],["100%","#cbddea"]
 ],{x1:"0",y1:"0",x2:"0",y2:"1"});
 gradient("linearGradient","quest-cloud-underbelly",[
  ["0%","#dcecf5"],["65%","#b9d1e1"],["100%","#a9c5d7"]
 ],{x1:"0",y1:"0",x2:"0",y2:"1"});
 const mask=node("mask",{id:"quest-unique-landmark-mask",x:0,y:0,width:1024,height:1536,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse",style:"mask-type:luminance"});
 mask.append(node("rect",{x:0,y:0,width:1024,height:1536,fill:"#ffffff"}));
 defs.append(mask);
 svg.append(defs);
 const cloudGroup=node("g",{mask:"url(#quest-unique-landmark-mask)"});
 cloudGroup.append(node("rect",{x:0,y:0,width:1024,height:1536,fill:"url(#quest-cloud-sky)"}));

 /* A recognizable cloud: four asymmetric rounded towers, a broad luminous
  * body, and a soft blue underside. No giant blurry radial ovals or repeated
  * frontier-following contour strokes. All shapes stay vector crisp. */
 function drawCumulus(parent,x,y,scale,variation,opacity=1){
  const g=node("g",{
   transform:"translate("+x.toFixed(1)+" "+y.toFixed(1)+") scale("+scale.toFixed(3)+")",
   opacity:opacity.toFixed(2)
  });
  const shift=(variation%7-3)*4;
  g.append(node("ellipse",{cx:5,cy:35,rx:121,ry:47,fill:"url(#quest-cloud-shadow)",opacity:".71"}));
  g.append(node("ellipse",{cx:0,cy:14,rx:116,ry:42,fill:"url(#quest-cloud-underbelly)"}));
  g.append(node("ellipse",{cx:-76,cy:-6,rx:41,ry:36,fill:"url(#quest-cloud-body)"}));
  g.append(node("ellipse",{cx:-43,cy:-32,rx:48,ry:55,fill:"url(#quest-cloud-body)"}));
  g.append(node("ellipse",{cx:shift+15,cy:-46,rx:55,ry:66,fill:"url(#quest-cloud-body)"}));
  g.append(node("ellipse",{cx:69,cy:-20,rx:43,ry:49,fill:"url(#quest-cloud-body)"}));
  g.append(node("ellipse",{cx:98,cy:2,rx:26,ry:29,fill:"url(#quest-cloud-body)"}));
  // A sweeping lower cloud pillow joins the separate lobes naturally.
  g.append(node("ellipse",{cx:0,cy:17,rx:116,ry:33,fill:"url(#quest-cloud-body)"}));
  g.append(node("ellipse",{cx:shift-26,cy:-57,rx:30,ry:16,fill:"#ffffff",opacity:".36"}));
  g.append(node("ellipse",{cx:52,cy:-34,rx:25,ry:11,fill:"#ffffff",opacity:".32"}));
  g.append(node("path",{
   d:"M -93 38 Q -37 55 10 49 T 102 35",
   fill:"none",stroke:"#adc9db","stroke-width":3,"stroke-opacity":".44","stroke-linecap":"round"
  }));
  parent.append(g);
 }
 const distant=node("g",{"aria-hidden":"true"});
 // Staggered, unequal clouds leave gentle sky-colored valleys between forms.
 for(let row=0;row<9;row++){
  for(let col=0;col<5;col++){
   const n=row*13+col*7;
   const x=-95+col*271+(row%2?122:0)+((n*17)%47)-24;
   const y=108+row*183+((n*23)%65)-32;
   const scale=.67+((n*19)%31)/100;
   drawCumulus(distant,x,y,scale,n,.73+((n*11)%19)/100);
  }
 }
 cloudGroup.append(distant);
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


 /* Keep the original territory-clearing geometry. A narrow mask feather
  * keeps the art sharp; rounded cloud heads interrupt the boundary itself. */
 const painted=new Map();
 let previousCount=-1;
 const parkIndex=chapters.findIndex(chapter=>chapter.id==="park");
 if(parkIndex!==8)throw Error("Unexpected chapter order for landmark cloud reveal");
 const featherSteps=[[34,.18],[16,.30]];
 const cloudAnchors={
  ruby:[[344,1474],[419,1418],[480,1348],[520,1243],[600,1198],[691,1194],[786,1217],[865,1214],[953,1190]],
  wonderland:[[68,1136],[122,1066],[185,1022],[264,1022],[331,1070],[387,1165],[435,1262],[471,1360],[420,1457]],
  candle:[[386,1459],[436,1380],[489,1302],[526,1194],[573,1086],[654,1006],[752,996],[861,983],[960,967]],
  glass:[[610,1114],[665,1021],[716,935],[743,835],[727,735],[689,637],[689,529],[760,475],[856,473],[960,498]],
  zuzu:[[585,553],[568,461],[582,359],[650,278],[740,270],[825,281],[916,297],[986,283]],
  river:[[57,1115],[139,1001],[206,898],[244,783],[294,702],[380,714],[477,722],[560,766],[571,857],[505,990]],
  dinner:[[54,962],[122,829],[171,715],[220,600],[301,578],[387,646],[483,651],[580,614],[675,671],[704,773],[621,873],[536,984]],
  sweet:[[523,57],[569,150],[652,226],[744,271],[782,364],[826,453],[918,528],[991,594]]
 };
 function randomFor(id){
  let seed=2166136261;
  for(const char of id)seed=Math.imul(seed^char.charCodeAt(0),16777619)>>>0;
  return ()=>{
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;
   return seed/4294967296;
  };
 }

 function frontierCloudHeads(region){
  const anchors=cloudAnchors[region.id]||[];
  const random=randomFor(region.id);
  const heads=[];
  anchors.forEach(([x,y],i)=>{
   // Avoid the repetitive bead-on-a-string look.
   if(i%2===1&&random()>.46)return;
   const a=anchors[Math.max(0,i-1)],b=anchors[Math.min(anchors.length-1,i+1)];
   const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;
   const tx=dx/length,ty=dy/length;
   const nx=ty,ny=-tx;
   const drift=(random()-.5)*29;
   const offset=17+random()*20;
   heads.push({
    x:x+tx*drift+nx*offset,
    y:y+ty*drift+ny*offset,
    nx,ny,tx,ty,
    scale:.67+random()*.23,
    variation:i+Math.floor(random()*13)
   });
  });
  return heads;
 }
 function makeCloudBank(region,opacity,heads){
  const front=node("g",{opacity,"data-cloud-front":region.id});
  heads.forEach((h,i)=>{
   const x=h.x+h.nx*16,y=h.y+h.ny*16;
   drawCumulus(front,x,y,h.scale,i+h.variation,.96);
  });
  return front;
 }
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
  const heads=frontierCloudHeads(region);
  /* Small solid cloud lobes lean over the uncovered land: the frontier
   * has a fluffy silhouette instead of looking like cut paper or paint. */
  for(const h of heads){
   clearingGroup.append(node("ellipse",{
    cx:h.x,cy:h.y,rx:52*h.scale,ry:38*h.scale,
    fill:"#ffffff","fill-opacity":".98"
   }));
   clearingGroup.append(node("ellipse",{
    cx:h.x+h.tx*22+h.nx*8,cy:h.y+h.ty*22+h.ny*8,
    rx:33*h.scale,ry:34*h.scale,fill:"#ffffff","fill-opacity":".96"
   }));
  }
  mask.append(clearingGroup);

  const cloudFront=makeCloudBank(region,opacity,heads);
  cloudGroup.append(cloudFront);
  painted.set(region.id,{clearingGroup,cloudFront});

  if(!animated||!window.requestAnimationFrame)return;
  const started=performance.now();
  const frame=now=>{
   if(!clearingGroup.isConnected)return;
   const t=Math.min(1,Math.max(0,(now-started)/1200));
   const amount=String(1-Math.pow(1-t,3));
   clearingGroup.setAttribute("opacity",amount);
   cloudFront.setAttribute("opacity",amount);
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
  detour.style.display=count>=6&&!parkUnlocked?"":"none";
  if(parkUnlocked){previousCount=count;return}
  const wanted=territories.slice(0,count+1);
  const ids=new Set(wanted.map(region=>region.id));
  /* Preview exit/reset restores the earlier cloud coverage exactly. */
  for(const [id,entry] of painted){
   if(!ids.has(id)){
    entry.clearingGroup.remove();
    entry.cloudFront.remove();
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