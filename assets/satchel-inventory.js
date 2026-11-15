/* Treasure Haul: nine existing slots, with an accessible enlarged keepsake viewer.
 * Quest completion is read-only. Never invents or uploads a photograph. */
(()=>{
 "use strict";
 const sheet=document.querySelector(".rpg-sheet"),body=document.getElementById("rpg-sheet-body");
 if(!sheet||!body)return;
 const root="assets/satchel/inventory/";
 const ids=["ruby","wonderland","candle","glass","zuzu","river","dinner","sweet","park"];
 const names=["Ruby Mae’s","Wonderland Antiques & Curiosities","Crafty Mountain Candle Co.","The Glassblowing Shop","ZuZu’s Petals Rock Shop","The Chattahoochee Pause","Bangkok Haus","The Sweet Interlude","The Moonlit Finale"];
 const progressKey="jess-birthday-quest-progress-v3";
 const emptyArt=root+"treasure_haul_empty_slot.png";
 const artwork=id=>"assets/scenes/"+id+".webp";
 let panel=null,slots=[],lastFocus=null,previousOverflow="";
 const viewer=document.createElement("div");
 viewer.className="satchel-keepsake-viewer";
 viewer.hidden=true;viewer.setAttribute("role","dialog");viewer.setAttribute("aria-modal","true");
 viewer.setAttribute("aria-label","Enlarged satchel keepsake");
 const inner=document.createElement("div");inner.className="satchel-keepsake-inner";
 const heading=document.createElement("h2");heading.className="satchel-keepsake-heading";
 const picture=document.createElement("img");picture.className="satchel-keepsake-picture";picture.alt="";picture.draggable=false;
 const description=document.createElement("p");description.className="satchel-keepsake-description";
 const close=document.createElement("button");close.type="button";close.className="satchel-keepsake-close";
 close.textContent="×";close.setAttribute("aria-label","Close enlarged keepsake");
 inner.append(heading,picture,description,close);viewer.append(inner);document.body.append(viewer);
 function collected(){
  try{
   const saved=JSON.parse(localStorage.getItem(progressKey)||"[]");
   if(!Array.isArray(saved))return new Set();
   return new Set(saved.flatMap(id=>id==="town"?["glass","zuzu"]:[id]));
  }catch{return new Set()}
 }
 function refresh(){
  const found=collected();
  slots.forEach((slot,i)=>{
   const unlocked=found.has(ids[i]),img=slot.querySelector("img");
   const url=unlocked?artwork(ids[i]):emptyArt;
   if(img.dataset.expected!==url){img.dataset.expected=url;img.src=url;}
   slot.classList.toggle("is-collected",unlocked);
   slot.setAttribute("aria-label",unlocked?"Enlarge keepsake from "+names[i]:"View undiscovered treasure slot "+(i+1));
  });
 }
 function open(i){
  if(!viewer.hidden)return;
  refresh();
  const slot=slots[i];if(!slot)return;
  lastFocus=document.activeElement;previousOverflow=document.body.style.overflow;
  const unlocked=slot.classList.contains("is-collected");
  heading.textContent=unlocked?names[i]:"Undiscovered Treasure "+(i+1);
  description.textContent=unlocked?"A memory from chapter "+(i+1)+" of Jess’s birthday adventure.":"Complete this chapter to reveal its illustrated keepsake.";
  picture.src=unlocked?artwork(ids[i]):emptyArt;
  picture.alt=unlocked?"Illustrated keepsake for "+names[i]:"Empty treasure slot";
  picture.onerror=()=>{
   if(picture.src.endsWith(emptyArt))return;
   picture.onerror=null;picture.src=emptyArt;
   description.textContent="This keepsake illustration is temporarily unavailable.";
  };
  viewer.hidden=false;document.body.style.overflow="hidden";
  close.focus({preventScroll:true});
 }
 function dismiss(){
  if(viewer.hidden)return;
  viewer.hidden=true;document.body.style.overflow=previousOverflow;
  picture.removeAttribute("src");picture.onerror=null;
  if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
 }
 close.addEventListener("click",dismiss);
 viewer.addEventListener("click",event=>{if(event.target===viewer)dismiss()});
 document.addEventListener("keydown",event=>{
  if(viewer.hidden)return;
  if(event.key==="Escape"){event.preventDefault();dismiss();}
  else if(event.key==="Tab"){event.preventDefault();close.focus({preventScroll:true});}
 });
 function mount(){
  const stage=body.querySelector(".satchel-rotunda");
  if(!stage)return;
  if(panel&&!panel.isConnected){panel=null;slots=[];}
  if(!panel){
   panel=document.createElement("section");panel.className="satchel-treasure-inventory";
   panel.setAttribute("aria-label","Treasure Haul inventory, nine keepsake slots");
   for(let i=0;i<9;i++){
    const slot=document.createElement("button");slot.type="button";slot.className="satchel-treasure-slot";
    const img=document.createElement("img");img.src=emptyArt;img.alt="";img.draggable=false;
    img.addEventListener("error",()=>{
     if(img.src.endsWith(emptyArt))return;
     img.dataset.expected=emptyArt;img.src=emptyArt;
    });
    slot.append(img);slot.addEventListener("click",()=>open(i));
    slots.push(slot);panel.append(slot);
   }
   const frame=document.createElement("img");frame.className="satchel-treasure-grid";
   frame.src=root+"treasure_haul_inventory_grid.png";frame.alt="";frame.draggable=false;
   panel.append(frame);
  }
  if(panel.parentElement!==stage.parentElement)stage.parentElement.append(panel);
  refresh();
 }
 let pending=false;
 function schedule(){
  if(pending)return;pending=true;
  requestAnimationFrame(()=>{pending=false;mount()});
 }
 new MutationObserver(schedule).observe(body,{childList:true,subtree:true});
 new MutationObserver(schedule).observe(sheet,{attributes:true,attributeFilter:["hidden"]});
 window.addEventListener("birthday:progress-saved",schedule);
 window.addEventListener("pageshow",schedule);
 schedule();
})();
