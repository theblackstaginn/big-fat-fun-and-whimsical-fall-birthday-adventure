/* Active mission beacon on the illustrated overworld.
 * Purely visual: no GPS, saved progress, quest gating, or fog geometry changes.
 * Coordinates are storybook illustration anchors, NOT geographic waypoints. */
(()=>{
 "use strict";
 const artwork=document.querySelector("#portrait-overworld");
 const stage=artwork?.closest(".map-canvas");
 if(!stage||!Array.isArray(chapters)||typeof updateSceneArtwork!=="function")return;

 // Match the 1024x1536 painting and cloud-mask coordinate system.
 const anchors=Object.freeze({
  ruby:[625,1410],
  wonderland:[315,1165],
  candle:[725,1080],
  glass:[810,805],
  zuzu:[735,390],
  river:[344,849],
  dinner:[280,732],
  sweet:[790,680],
  park:[520,188]
 });
 const NS="http://www.w3.org/2000/svg";
 const make=(tag,attrs={})=>{
  const element=document.createElementNS(NS,tag);
  for(const [name,value] of Object.entries(attrs))element.setAttribute(name,String(value));
  return element;
 };
 const layer=make("svg",{
  id:"quest-active-mission-beacon",
  viewBox:"0 0 1024 1536",
  preserveAspectRatio:"xMidYMid slice",
  "aria-hidden":"true"
 });
 layer.hidden=true;
 const defs=make("defs");
 const glow=make("radialGradient",{id:"quest-active-mission-glow"});
 for(const [offset,color,opacity] of [
  ["0%","#fff6c8","0.91"],
  ["25%","#ffcf6e","0.67"],
  ["54%","#f7ae51","0.31"],
  ["78%","#e58b3b","0.08"],
  ["100%","#e58b3b","0"]
 ])glow.append(make("stop",{offset,"stop-color":color,"stop-opacity":opacity}));
 defs.append(glow);
 layer.append(defs);

 const beacon=make("g",{"data-role":"current-mission"});
 const bloom=make("circle",{r:100,fill:"url(#quest-active-mission-glow)",class:"quest-beacon-bloom"});
 const inner=make("circle",{r:57,fill:"url(#quest-active-mission-glow)",class:"quest-beacon-inner"});
 const orbit=make("circle",{r:38,fill:"none",stroke:"#ffe2a0","stroke-width":2.5,"stroke-opacity":".86",class:"quest-beacon-orbit"});
 const jewel=make("circle",{r:27,fill:"#513123","fill-opacity":".83",stroke:"#fff1bf","stroke-width":3});
 const star=make("path",{d:"M 0 -24 L 6.5 -7 L 24 0 L 6.5 7 L 0 24 L -6.5 7 L -24 0 L -6.5 -7 Z",
  fill:"#fff3be",stroke:"#f6c268","stroke-width":1.3,class:"quest-beacon-star"});
 const smallStar=make("circle",{cx:0,cy:0,r:4.5,fill:"#ffffff"});
 beacon.append(bloom,inner,orbit,jewel,star,smallStar);
 layer.append(beacon);
 stage.append(layer);

 const style=document.createElement("style");
 style.id="quest-active-mission-beacon-style";
 style.textContent=`
 .rpg-fullscreen .map-canvas #quest-active-mission-beacon{
  position:absolute;inset:0;z-index:7;display:block;width:100%;height:100%;
  overflow:hidden;pointer-events:none;
 }
 .rpg-fullscreen .map-canvas #quest-active-mission-beacon[hidden]{display:none!important}
 #quest-active-mission-beacon .quest-beacon-bloom{
  animation:quest-mission-aura 3.4s ease-in-out infinite;
 }
 #quest-active-mission-beacon .quest-beacon-inner{
  animation:quest-mission-aura 3.4s ease-in-out -1.25s infinite;
 }
 #quest-active-mission-beacon .quest-beacon-orbit{
  animation:quest-mission-ring 3.4s ease-in-out infinite;
 }
 #quest-active-mission-beacon .quest-beacon-star{
  filter:drop-shadow(0 0 9px #ffd779);
 }
 @keyframes quest-mission-aura{
  0%,100%{opacity:.57}
  50%{opacity:1}
 }
 @keyframes quest-mission-ring{
  0%,100%{stroke-opacity:.45}
  50%{stroke-opacity:1}
 }
 @media(prefers-reduced-motion:reduce){
  #quest-active-mission-beacon .quest-beacon-bloom,
  #quest-active-mission-beacon .quest-beacon-inner,
  #quest-active-mission-beacon .quest-beacon-orbit{animation:none!important;opacity:1}
 }
 @media print{#quest-active-mission-beacon{display:none!important}}
 `;
 document.head.append(style);

 function syncBeacon(){
  // Only the next incomplete chapter is active, even if an earlier chapter is selected.
  const chapter=completed.length<chapters.length?chapters[completed.length]:null;
  const point=chapter&&anchors[chapter.id];
  const visible=!!point&&stage.classList.contains("portrait-loaded")&&!artwork.hidden;
  layer.hidden=!visible;
  if(!visible)return;
  beacon.setAttribute("transform","translate("+point[0]+" "+point[1]+")");
  beacon.setAttribute("data-chapter",chapter.id);
 }
 const previousSceneUpdate=updateSceneArtwork;
 updateSceneArtwork=function(){
  previousSceneUpdate();
  syncBeacon();
 };
 syncBeacon();
})();