/* Farmer's approved handfasting parchment: exact illustrated artwork,
   full viewport, no scrolling or fake CSS re-creation. */
(()=>{
 "use strict";
 const file="assets/rogue-witch-handfasting-letter.webp?v=approved1";
 const paragraphs=[["greeting","My love,"],["","We’ve spent today chasing little wonders, gathering treasures, and making memories. But there’s one last thing I’ve been carrying with me, something that means more to me than anything we could find in a shop."],["","You are already my wife, my companion, and my favorite person to share this strange and beautiful world with."],["","And still, I want to choose you again."],["","Not because the promises we’ve already made are somehow incomplete, but because I believe love is something we keep choosing. Through every season, every change, every ordinary morning and extraordinary night."],["","I want to stand with you beneath the open sky, surrounded by the living world we both hold sacred. I want to take your hands in mine, bind them together, and speak the promises of my heart to you once more."],["","So I have one last question for my beautiful witch."],["question","Will you join me in a handfasting ceremony?"],["","I want to offer you two gifts."],["","A bracelet, for the bond we choose to share."],["","And a blade, for the strength and freedom that will always be yours."],["","One to honor our connection. The other to honor the remarkable woman who stands beside me."],["","Neither is meant to bind you to anything you do not freely choose. They are simply offerings from my heart to yours."],["","Whatever adventures wait beyond tonight, there is no one I’d rather walk beside."],["","Happy birthday, my love."],["vow","In this season, and in every season to come, I choose you."],["farewell","Forever yours,"],["signature","Farmer"]];
 const modal=document.createElement("div");
 modal.id="moonlit-letter-dialog";
 modal.hidden=true;
 modal.setAttribute("role","dialog");
 modal.setAttribute("aria-modal","true");
 modal.setAttribute("aria-label","A letter from Farmer to Jess");
 const art=document.createElement("img");
 art.className="moonlit-letter-artwork";
 art.src=file;art.width=1122;art.height=1402;art.decoding="async";
 art.alt="To My Rogue Witch, a handfasting letter signed Farmer, decorated with oak leaves, triple moons and a red stag wax seal.";
 const accessible=document.createElement("div");
 accessible.className="moonlit-letter-a11y";
 accessible.textContent="To My Rogue Witch,\n"+paragraphs.map(item=>item[1]).join("\n");
 const error=document.createElement("div");error.className="moonlit-letter-error";error.hidden=true;
 error.textContent="The illustrated letter could not load. Please refresh the page.";
 art.addEventListener("error",()=>{art.hidden=true;error.hidden=false});
 const close=document.createElement("button");close.type="button";close.className="moonlit-letter-close";
 close.textContent="×";close.setAttribute("aria-label","Close Farmer's letter");
 modal.append(art,error,accessible,close);
 document.body.append(modal);
 const style=document.createElement("style");style.textContent="\n#moonlit-letter-dialog[hidden]{display:none!important}\n#moonlit-letter-dialog{position:fixed;inset:0;z-index:250;display:flex;align-items:center;justify-content:center;\n box-sizing:border-box;overflow:hidden;padding:4px;background:radial-gradient(ellipse at center,#4d3032,#110b15 85%)}\n#moonlit-letter-dialog .moonlit-letter-artwork{display:block;max-width:100%;max-height:100%;width:100%;height:100%;\n object-fit:contain;object-position:center center;filter:drop-shadow(0 10px 25px #07040aab)}\n#moonlit-letter-dialog .moonlit-letter-artwork[hidden]{display:none!important}\n#moonlit-letter-dialog .moonlit-letter-close{position:absolute;z-index:2;top:max(9px,env(safe-area-inset-top,0px));right:max(9px,env(safe-area-inset-right,0px));\n width:42px;height:42px;display:grid;place-items:center;border:2px solid #d3a46c;border-radius:50%;\n background:#4b2c3bea;color:#ffe9cd;box-shadow:0 3px 9px #10060acc;font:700 27px/1 system-ui,sans-serif;cursor:pointer}\n#moonlit-letter-dialog .moonlit-letter-close:focus-visible{outline:3px solid #fae3b9;outline-offset:3px}\n#moonlit-letter-dialog .moonlit-letter-a11y{position:absolute!important;width:1px!important;height:1px!important;\n padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:pre-wrap!important;border:0!important}\n#moonlit-letter-dialog .moonlit-letter-error{max-width:310px;margin:auto;padding:20px;color:#ffe8cc;border:1px solid #d3a46c;\n border-radius:10px;background:#30202b;text-align:center;font:1rem/1.5 Georgia,serif}\n#moonlit-letter-dialog .moonlit-letter-error[hidden]{display:none!important}\n@media print{#moonlit-letter-dialog{display:none!important}}\n";document.head.append(style);
 let previousFocus=null,previousOverflow="";
 function open(){
  if(!modal.hidden)return;
  previousFocus=document.activeElement;
  previousOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  modal.hidden=false;
  close.focus({preventScroll:true});
 }
 function dismiss(){
  if(modal.hidden)return;
  modal.hidden=true;
  document.body.style.overflow=previousOverflow;
  previousFocus?.focus?.({preventScroll:true});
 }
 close.addEventListener("click",dismiss);
 modal.addEventListener("click",event=>{if(event.target===modal)dismiss()});
 document.addEventListener("keydown",event=>{
  if(modal.hidden)return;
  if(event.key==="Escape"){event.preventDefault();dismiss()}
  else if(event.key==="Tab"){event.preventDefault();close.focus({preventScroll:true})}
 });
 window.openMoonlitLetter=open;
 /* Defensive link to Claim, preserving the existing completion gating. */
 document.addEventListener("click",event=>{
  const trigger=event.target?.closest?.("#achievement-reveal");
  if(!trigger||!modal.hidden)return;
  const finalScreen=trigger.closest(".quest-achievement.is-finale");
  const finalChapter=typeof selected!=="undefined"&&selected?.id==="park";
  const finalProgress=typeof completed!=="undefined"&&Array.isArray(chapters)&&completed.length===chapters.length-1;
  if(!finalScreen||finalScreen.hidden||!finalChapter||!finalProgress)return;
  window.setTimeout(()=>{if(completed.length===chapters.length)open()},window.__birthdayPreview?60:1120);
 },true);
 document.documentElement.setAttribute("data-moonlit-letter-ready","true");
})();