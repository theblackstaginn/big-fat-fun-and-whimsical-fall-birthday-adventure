/* Pull-to-refresh for the fullscreen adventure. Trigger only from the top edge,
   never while a modal is open or when interacting with the map controls. */
(()=>{"use strict";
const THRESHOLD=92;let startY=null,armed=false,indicator=null;
const isPanelOpen=()=>{const sheet=document.querySelector(".rpg-sheet");return !!(sheet&&!sheet.hidden&&getComputedStyle(sheet).display!=="none")};
function show(){if(indicator)return;indicator=document.createElement("div");indicator.id="rpg-pull-refresh";indicator.setAttribute("role","status");indicator.setAttribute("aria-live","polite");indicator.textContent="↓ Pull to refresh";document.body.append(indicator)}
function hide(){indicator?.remove();indicator=null;startY=null;armed=false}
document.addEventListener("touchstart",e=>{
 if(e.touches.length!==1||!document.body.classList.contains("rpg-fullscreen")||isPanelOpen())return;
 const t=e.touches[0],target=e.target;
 if(t.clientY>85||target.closest("button,a,input,textarea,select,.map-mode-switch,.rpg-toolbar,.leaflet-container,.maplibregl-map"))return;
 startY=t.clientY;armed=false;
},{passive:true});
document.addEventListener("touchmove",e=>{
 if(startY===null||e.touches.length!==1)return;
 const delta=e.touches[0].clientY-startY;
 if(delta<15){if(indicator)hide();return}
 show();armed=delta>=THRESHOLD;
 indicator.textContent=armed?"↻ Release to refresh":"↓ Pull to refresh";
 indicator.style.transform="translate(-50%,"+Math.min(delta*.38,65)+"px)";
},{passive:true});
document.addEventListener("touchend",()=>{
 if(startY===null)return;
 const refresh=armed;hide();
 if(!refresh)return;
 const url=new URL(location.href);
 url.searchParams.set("refresh",Date.now().toString(36));
 location.replace(url.toString());
},{passive:true});
document.addEventListener("touchcancel",hide,{passive:true});
})();
