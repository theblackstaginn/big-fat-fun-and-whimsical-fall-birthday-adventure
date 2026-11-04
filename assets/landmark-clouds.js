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
 gradient("linearGradient","quest-cloud-sky",[["0%","#f7fcff"],["44%","#e2f1fc"],["78%","#eaf7ff"],["100%","#daeefc"]],{x1:"0",y1:"0",x2:"0",y2:"1"});
 gradient("radialGradient","quest-cloud-top",[["0%","#ffffff",".96"],["38%","#ffffff",".89"],["64%","#f9fdff",".66"],["84%","#f3faff",".28"],["100%","#ecf7ff","0"]]);
 gradient("radialGradient","quest-cloud-bottom",[["0%","#9bc4e5",".39"],["50%","#b8d9f0",".24"],["78%","#e0f2ff",".09"],["100%","#e9f6ff","0"]]);
 /* Color lives in individual drifting cloud forms, never in contour strokes. */
 gradient("radialGradient","quest-bank-light",[["0%","#ffffff",".97"],["52%","#ffffff",".78"],["78%","#f7fcff",".25"],["100%","#f7fcff","0"]]);
 gradient("radialGradient","quest-bank-shade",[["0%","#9dc3df",".34"],["55%","#bfdcee",".18"],["100%","#e6f5ff","0"]]);
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

 /* Only the reveal MASK has a soft grayscale feather. Its strokes do
  * not draw colored rings on the painting. Light, low-contrast steps are
  * deliberately used rather than a heavy iPhone Safari SVG blur. */
 const painted=new Map();
 let previousCount=-1;
 const parkIndex=chapters.findIndex(chapter=>chapter.id==="park");
 if(parkIndex!==8)throw Error("Unexpected chapter order for landmark cloud reveal");
 const featherSteps=[
  [142,.045],[108,.07],[79,.11],[52,.17],[28,.27]
 ];

 /* Hand-placed frontier guides follow the EXISTING reveal territories;
  * their varied spacing breaks the old repeating concentric-wave pattern.
  * These decorate the fog only; they never change its discovery geometry. */
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
 function makeCloudBank(region,opacity){
  const front=node("g",{opacity,"data-cloud-front":region.id});
  const anchors=cloudAnchors[region.id]||[];
  const random=randomFor(region.id);
  anchors.forEach(([x,y],i)=>{
   if(random()<.14)return; // natural breaks, not an unbroken white outline
   const prior=anchors[Math.max(0,i-1)],next=anchors[Math.min(anchors.length-1,i+1)];
   const dx=next[0]-prior[0],dy=next[1]-prior[1],length=Math.hypot(dx,dy)||1;
   const tx=dx/length,ty=dy/length;
   const ox=ty,oy=-tx; // fog-facing side of these clockwise territories
   const along=(random()-.5)*40,outward=9+random()*38;
   const cx=x+tx*along+ox*outward,cy=y+ty*along+oy*outward;
   const rx=44+random()*51,ry=22+random()*27;
   const twist=(random()-.5)*38;
   const angle="rotate("+twist.toFixed(1)+" "+cx.toFixed(1)+" "+cy.toFixed(1)+")";
   front.append(node("ellipse",{
    cx:cx-3,cy:cy+ry*.38,rx:rx*1.25,ry:ry*1.23,
    fill:"url(#quest-bank-shade)",
    opacity:(.50+random()*.22).toFixed(2),transform:angle
   }));
   front.append(node("ellipse",{
    cx,cy:cy-ry*.15,rx,ry,fill:"url(#quest-bank-light)",
    opacity:(.54+random()*.30).toFixed(2),transform:angle
   }));
   /* A few separated wisps remove the solid scalloped-border look. */
   if(random()<.38){
    const wx=cx+ox*(40+random()*50)+tx*(random()-.5)*42;
    const wy=cy+oy*(40+random()*50)+ty*(random()-.5)*42;
    front.append(node("ellipse",{
     cx:wx,cy:wy,rx:20+random()*38,ry:12+random()*22,
     fill:"url(#quest-bank-light)",opacity:(.21+random()*.23).toFixed(2)
    }));
   }
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
  mask.append(clearingGroup);

  const cloudFront=makeCloudBank(region,opacity);
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