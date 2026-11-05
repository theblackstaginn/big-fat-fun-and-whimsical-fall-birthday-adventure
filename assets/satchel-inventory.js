/* Display-only Treasure Haul preview: the nine slots sit behind the approved transparent frame.
   No fabricated photo uploads or changes to quest progress. */
(()=>{"use strict";
const sheet=document.querySelector(".rpg-sheet"),body=document.getElementById("rpg-sheet-body");
if(!sheet||!body)return;
const root="assets/satchel/inventory/";
function mount(){
 const stage=body.querySelector(".satchel-rotunda");
 if(!stage||stage.parentElement.querySelector(":scope > .satchel-treasure-inventory"))return;
 const panel=document.createElement("section");panel.className="satchel-treasure-inventory";
 panel.setAttribute("aria-label","Treasure Haul inventory, nine empty slots");
 for(let i=0;i<9;i++){
  const slot=document.createElement("button");slot.type="button";slot.className="satchel-treasure-slot";
  slot.setAttribute("aria-label","Empty treasure slot "+(i+1));
  const img=document.createElement("img");img.src=root+"treasure_haul_empty_slot.png";img.alt="";img.draggable=false;
  slot.append(img);slot.addEventListener("click",()=>{});
  panel.append(slot);
 }
 const frame=document.createElement("img");frame.className="satchel-treasure-grid";
 frame.src=root+"treasure_haul_inventory_grid.png";frame.alt="";frame.draggable=false;
 panel.append(frame);stage.parentElement.append(panel);
}
new MutationObserver(mount).observe(body,{childList:true,subtree:true});
mount();
})();