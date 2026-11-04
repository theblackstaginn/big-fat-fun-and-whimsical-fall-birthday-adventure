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

 /* Each discovery leaves a soft, layered bank of cloud rather than a
  * crisp cut-out. Concentric translucent strokes feather the luminance mask
  * over about 85 painting pixels, without a large SVG blur on iPhone Safari.
  * The colored front remains INSIDE the same cloud mask, so overlapping
  * discoveries never leave seams across previously explored terrain. */
 const painted=new Map();
 let previousCount=-1;
 const parkIndex=chapters.findIndex(chapter=>chapter.id==="park");
 if(parkIndex!==8)throw Error("Unexpected chapter order for landmark cloud reveal");
 const featherSteps=[
  [176,.04],[150,.06],[126,.09],[104,.12],[82,.16],
  [64,.21],[46,.27],[30,.35],[16,.60]
 ];
 const cloudBanks=[
  [168,"#f7fcff",.09],[116,"#a7cbe2",.12],
  [88,"#ffffff",.15],[53,"#d1e8f7",.16],[26,"#ffffff",.22]
 ];
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

  const cloudFront=node("g",{opacity,"data-cloud-front":region.id});
  for(const [width,color,alpha] of cloudBanks){
   cloudFront.append(node("path",{
    d:region.d,fill:"none",stroke:color,
    "stroke-opacity":alpha,"stroke-width":width,
    "stroke-linecap":"round","stroke-linejoin":"round"
   }));
  }
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