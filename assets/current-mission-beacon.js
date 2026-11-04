/* Active mission beacon on the illustrated overworld.
 * Purely visual: no GPS, saved progress, quest gating, or fog geometry changes.
 * Coordinates are storybook illustration anchors, NOT geographic waypoints. */
(()=>{
 "use strict";
 const artwork=document.querySelector("#portrait-overworld");
 const stage=artwork?.closest(".map-canvas");
 if(!stage||!Array.isArray(chapters)||typeof updateSceneArtwork!=="function")return;

 /* Venue anchors checked against the actual 1024 x 1536 illustrated
  * painting, rather than guessed from chapter order or real-world geography.
  * Position each glow on a recognizable storefront roof / landmark, without
  * covering its sign. Bangkok Haus is an OFF-MAP detour with no pentacle. */
 const anchors=Object.freeze({
  ruby:[660,1220],
  wonderland:[293,1046],
  candle:[652,1013],
  glass:[729,465],
  zuzu:[650,321],
  river:[355,786],
  sweet:[335,317],
  park:[790,190]
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
  ["0%","#fff9d7","1"],
  ["20%","#ffe79e","0.98"],
  ["42%","#ffcb67","0.76"],
  ["66%","#f4a846","0.43"],
  ["83%","#e58b3b","0.17"],
  ["100%","#e58b3b","0"]
 ])glow.append(make("stop",{offset,"stop-color":color,"stop-opacity":opacity}));
 defs.append(glow);
 layer.append(defs);

 const beacon=make("g",{"data-role":"current-mission"});
 const bloom=make("circle",{r:155,fill:"url(#quest-active-mission-glow)",class:"quest-beacon-bloom"});
 const inner=make("circle",{r:82,fill:"url(#quest-active-mission-glow)",class:"quest-beacon-inner"});
 const orbit=make("circle",{r:47,fill:"none",stroke:"#ffe29d","stroke-width":3.2,"stroke-opacity":".97",class:"quest-beacon-orbit"});
 const jewel=make("circle",{r:34,fill:"#44241f","fill-opacity":".94",stroke:"#ffe8a8","stroke-width":3.4,class:"quest-beacon-jewel"});
 // An upright pentacle: one continuous five-point star enclosed by its circle.
 const pentacleCircle=make("circle",{r:28.5,fill:"none",stroke:"#ffe3a0","stroke-width":2.4,class:"quest-beacon-pentacle"});
 const pentagram=make("path",{
  d:"M 0 -24 L 14.11 19.42 L -22.83 -7.42 L 22.83 -7.42 L -14.11 19.42 Z",
  fill:"none",stroke:"#fff6d1","stroke-width":3,"stroke-linecap":"round",
  "stroke-linejoin":"round",class:"quest-beacon-pentacle"
 });
 beacon.append(bloom,inner,orbit,jewel,pentacleCircle,pentagram);
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
 #quest-active-mission-beacon .quest-beacon-pentacle{
  filter:drop-shadow(0 0 4px #fff0ba) drop-shadow(0 0 9px #ffbf52);
 }
 #quest-active-mission-beacon .quest-beacon-jewel{
  filter:drop-shadow(0 0 10px #ffc75d);
 }
 @keyframes quest-mission-aura{
  0%,100%{opacity:.68}
  50%{opacity:1}
 }
 @keyframes quest-mission-ring{
  0%,100%{stroke-opacity:.62}
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
 /* Never retain the previous chapter's marker. A dinner detour has no anchor. */
 window.syncCurrentMissionBeacon=syncBeacon;
 const previousSceneUpdate=updateSceneArtwork;
 updateSceneArtwork=function(){
  previousSceneUpdate();
  syncBeacon();
 };
 const previousRenderProgress=renderProgress;
 renderProgress=function(){
  previousRenderProgress();
  syncBeacon();
 };
 syncBeacon();
})();