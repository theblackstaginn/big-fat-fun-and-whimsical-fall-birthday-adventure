/* Discovery mist for the approved illustrated overworld.
 * Separate decorative layer; never modify the map image or street map.
 * The currently published image remains a fallback until the new WebP is uploaded. */
(()=>{
 "use strict";
 const artwork=document.querySelector("#portrait-overworld");
 const stage=artwork?.closest(".map-canvas");
 if(!artwork||!stage)return;
 const fog=document.createElement("div");
 fog.id="overworld-fog";
 fog.className="overworld-fog";
 fog.setAttribute("aria-hidden","true");
 fog.hidden=true;
 artwork.insertAdjacentElement("afterend",fog);
 const fronts=[76,69,61,50,43,32,26,16,0];
 const existingImage=artwork.dataset.sceneSrc||"assets/helen-overworld.webp?v=portrait2";
 const nextImage="assets/helen-enchanted-overworld.webp?v=20261104-questveil1";
 let fallbackAttempted=false;
 /* The app's existing progress and location logic remain untouched.
  * Replacing the illustration controller only affects the Enchanted Atlas. */
 updateSceneArtwork=function(){
  const count=Math.min(completed.length,chapters.length);
  artwork.hidden=!portraitReady;
  stage.classList.toggle("portrait-loaded",portraitReady);
  fog.style.setProperty("--fog-front",fronts[count]+"%");
  fog.hidden=!portraitReady||count===chapters.length;
  fog.dataset.unlocked=String(count);
 };
 artwork.addEventListener("error",()=>{
  if(fallbackAttempted)return;
  fallbackAttempted=true;
  artwork.src=existingImage;
 });
 portraitRequested=true;
 portraitReady=false;
 artwork.hidden=true;
 artwork.src=nextImage;
 updateSceneArtwork();
})();
