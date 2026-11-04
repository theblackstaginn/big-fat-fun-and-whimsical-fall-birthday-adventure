/* Jess's private final letter: real selectable text, no page turns or scrolling.
   Font size is fitted to the active mobile viewport; the wording is exact. */
(()=>{
 "use strict";
 const lines=[["greeting","My love,"],["","We’ve spent today chasing little wonders, gathering treasures, and making memories. But there’s one last thing I’ve been carrying with me, something that means more to me than anything we could find in a shop."],["","You are already my wife, my companion, and my favorite person to share this strange and beautiful world with."],["","And still, I want to choose you again."],["","Not because the promises we’ve already made are somehow incomplete, but because I believe love is something we keep choosing. Through every season, every change, every ordinary morning and extraordinary night."],["","I want to stand with you beneath the open sky, surrounded by the living world we both hold sacred. I want to take your hands in mine, bind them together, and speak the promises of my heart to you once more."],["","So I have one last question for my beautiful witch."],["question","Will you join me in a handfasting ceremony?"],["","I want to offer you two gifts."],["","A bracelet, for the bond we choose to share."],["","And a blade, for the strength and freedom that will always be yours."],["","One to honor our connection. The other to honor the remarkable woman who stands beside me."],["","Neither is meant to bind you to anything you do not freely choose. They are simply offerings from my heart to yours."],["","Whatever adventures wait beyond tonight, there is no one I’d rather walk beside."],["","Happy birthday, my love."],["vow","In this season, and in every season to come, I choose you."],["farewell","Forever yours,"],["signature","Farmer"]];
 const modal=document.createElement("div");
 modal.id="moonlit-letter-dialog";
 modal.hidden=true;
 modal.setAttribute("role","dialog");
 modal.setAttribute("aria-modal","true");
 modal.setAttribute("aria-label","A handfasting letter from Farmer to Jess");
 const sheet=document.createElement("div");
 sheet.className="moonlit-letter-paper";
 const content=document.createElement("article");
 content.className="moonlit-letter-content";
 const title=document.createElement("h2");title.textContent="To My Rogue Witch,";
 content.append(title);
 for(const [kind,wording] of lines){
  const p=document.createElement("p");
  p.className=kind||"letter-line";
  p.textContent=wording;
  content.append(p);
 }
 const moon=document.createElement("span");
 moon.className="moonlit-letter-ornament north";
 moon.setAttribute("aria-hidden","true");
 moon.textContent="☾ ● ☽";
 const leaves=document.createElement("span");
 leaves.className="moonlit-letter-ornament south";
 leaves.setAttribute("aria-hidden","true");
 leaves.textContent="❧";
 const seal=document.createElement("span");
 seal.className="moonlit-letter-seal";
 seal.setAttribute("aria-hidden","true");
 seal.textContent="✧";
 const close=document.createElement("button");
 close.className="moonlit-letter-close";
 close.type="button";
 close.textContent="×";
 close.setAttribute("aria-label","Close the handfasting letter");
 sheet.append(moon,leaves,content,seal,close);
 modal.append(sheet);
 document.body.append(modal);
 const style=document.createElement("style");
 style.textContent="\n/* The final gift fills the viewport, without scrolling or page breaks. */\n#moonlit-letter-dialog[hidden]{display:none!important}\n#moonlit-letter-dialog{position:fixed;inset:0;z-index:220;display:grid;place-items:center;\n padding:max(6px,env(safe-area-inset-top,0px)) max(5px,env(safe-area-inset-right,0px)) max(6px,env(safe-area-inset-bottom,0px)) max(5px,env(safe-area-inset-left,0px));\n box-sizing:border-box;background:radial-gradient(ellipse at 50% 45%,#654251e3,#110c17fa 78%);overflow:hidden}\n#moonlit-letter-dialog .moonlit-letter-paper{position:relative;width:min(96vw,690px);height:calc(100dvh - max(12px,env(safe-area-inset-top,0px)) - max(12px,env(safe-area-inset-bottom,0px)));max-height:1090px;\n isolation:isolate;overflow:hidden;box-sizing:border-box;color:#2d2019;\n background:\n  radial-gradient(ellipse at 13% 13%,#fff6d69e,transparent 57%),\n  radial-gradient(ellipse at 81% 91%,#8a5b3452,transparent 32%),\n  radial-gradient(ellipse at 94% 11%,#96623b54,transparent 37%),\n  radial-gradient(ellipse at 3% 75%,#ae865444,transparent 38%),\n  radial-gradient(ellipse at 49% 48%,#f9e7be,#e9d09f 87%);\n box-shadow:inset 0 0 12px #9e6939,inset 0 0 0 2px #b47e4a80,inset 0 0 44px #9a663f86,0 22px 60px #050408e0;\n border:3px solid #b77e4d;\n border-radius:15px 12px 16px 13px;\n}\n#moonlit-letter-dialog .moonlit-letter-paper::before{content:\"\";position:absolute;inset:6px;z-index:0;pointer-events:none;\n border:1px solid #78532d45;border-radius:12px;\n background:\n  repeating-linear-gradient(100deg,transparent 0 9px,#d8b88612 9px 10px,transparent 10px 21px),\n  repeating-linear-gradient(18deg,transparent 0 21px,#6e4d2610 22px 23px,transparent 23px 37px);\n opacity:.54}\n#moonlit-letter-dialog .moonlit-letter-ornament{position:absolute;z-index:0;pointer-events:none;color:#6b512f85;line-height:1}\n#moonlit-letter-dialog .moonlit-letter-ornament.north{top:5px;left:50%;transform:translateX(-50%);font:20px Georgia,serif;letter-spacing:.3em}\n#moonlit-letter-dialog .moonlit-letter-ornament.south{bottom:5px;left:13px;font:22px Georgia,serif}\n#moonlit-letter-dialog .moonlit-letter-seal{position:absolute;right:12px;bottom:10px;z-index:1;pointer-events:none;width:43px;height:43px;border-radius:50%;\n border:3px ridge #7b2627;background:radial-gradient(circle at 34% 27%,#a64a3f,#5f1721 78%);\n box-shadow:0 3px 8px #32171785,inset 0 0 0 2px #c68a4d;\n display:grid;place-items:center;color:#d8b987;font:22px Georgia,serif;opacity:.9}\n#moonlit-letter-dialog .moonlit-letter-content{position:relative;z-index:1;height:100%;overflow:hidden;\n box-sizing:border-box;padding:clamp(22px,3.6vh,41px) clamp(14px,4.25vw,43px) clamp(31px,4.5vh,48px);\n display:flex;flex-direction:column;font-family:Georgia,\"Palatino Linotype\",serif;\n font-size:16px;line-height:1.15;letter-spacing:-.014em;\n text-shadow:0 1px 0 #fff6d14a}\n#moonlit-letter-dialog .moonlit-letter-content h2{font-family:\"Snell Roundhand\",\"Apple Chancery\",\"URW Chancery L\",Georgia,serif;\n font-size:2.05em;line-height:1.04;letter-spacing:-.025em;margin:0 1.1em .13em 0;text-align:center;font-weight:500;color:#39261f}\n#moonlit-letter-dialog .moonlit-letter-content p{margin:0 0 .27em;overflow-wrap:normal}\n#moonlit-letter-dialog .moonlit-letter-content p.greeting{font-style:italic;font-size:1.09em;margin-bottom:.38em}\n#moonlit-letter-dialog .moonlit-letter-content p.question{font-style:italic;font-weight:bold;font-size:1.12em;line-height:1.12;margin:.22em 0 .42em;text-align:center;color:#60352a}\n#moonlit-letter-dialog .moonlit-letter-content p.vow{font-style:italic;font-weight:600}\n#moonlit-letter-dialog .moonlit-letter-content p.farewell{font-style:italic;margin-top:.26em;margin-bottom:0}\n#moonlit-letter-dialog .moonlit-letter-content p.signature{font-family:\"Snell Roundhand\",\"Apple Chancery\",Georgia,cursive;\n font-size:2.03em;line-height:1.04;margin:0;color:#40261f}\n#moonlit-letter-dialog .moonlit-letter-close{position:absolute;top:7px;right:7px;z-index:3;width:34px;height:34px;border-radius:50%;cursor:pointer;\n border:1px solid #ad7147;background:#f2d9afeb;box-shadow:0 2px 6px #59382050;\n color:#46291f;font:700 22px/1 system-ui,sans-serif}\n#moonlit-letter-dialog .moonlit-letter-close:focus-visible{outline:2px solid #6c3928;outline-offset:3px}\n@media(max-width:400px){\n #moonlit-letter-dialog .moonlit-letter-paper{width:calc(100vw - 8px)}\n #moonlit-letter-dialog .moonlit-letter-content{padding-left:13px;padding-right:13px}\n #moonlit-letter-dialog .moonlit-letter-seal{width:33px;height:33px;right:7px;bottom:6px;font-size:17px}\n}\n@media(prefers-reduced-motion:reduce){\n #moonlit-letter-dialog *{animation:none!important;transition:none!important}\n}\n@media print{#moonlit-letter-dialog{display:none!important}}\n";
 document.head.append(style);
 let priorFocus=null,priorBodyOverflow="",sizeCheck=null;
 function fit(){
  if(modal.hidden)return;
  let size=21;
  content.style.fontSize=size+"px";
  /* Complete page fits in the iPhone viewport. Never introduce scrolling. */
  while(content.scrollHeight>content.clientHeight+1&&size>10){
   size=Math.max(10,size-.25);
   content.style.fontSize=size+"px";
  }
  /* If a viewport is unusually short, tighten inter-paragraph gaps first.
     The text always stays intact and accessible, rather than being cut off. */
  if(content.scrollHeight>content.clientHeight+1){
   content.style.lineHeight="1.11";
   const gaps=content.querySelectorAll("p");
   for(const p of gaps)p.style.marginBottom=".15em";
   while(content.scrollHeight>content.clientHeight+1&&size>9){
    size=Math.max(9,size-.25);
    content.style.fontSize=size+"px";
   }
  }
 }
 function open(){
  if(!modal.hidden)return;
  priorFocus=document.activeElement;
  priorBodyOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  modal.hidden=false;
  content.style.lineHeight="";
  for(const p of content.querySelectorAll("p"))p.style.marginBottom="";
  fit();
  close.focus({preventScroll:true});
 }
 function dismiss(){
  if(modal.hidden)return;
  modal.hidden=true;
  document.body.style.overflow=priorBodyOverflow;
  if(priorFocus&&typeof priorFocus.focus==="function")priorFocus.focus({preventScroll:true});
 }
 close.addEventListener("click",dismiss);
 modal.addEventListener("click",e=>{if(e.target===modal)dismiss()});
 document.addEventListener("keydown",e=>{
  if(modal.hidden)return;
  if(e.key==="Escape"){e.preventDefault();dismiss()}
  else if(e.key==="Tab"){
   e.preventDefault();close.focus({preventScroll:true});
  }
 });
 window.addEventListener("resize",()=>{if(modal.hidden)return;if(sizeCheck)cancelAnimationFrame(sizeCheck);sizeCheck=requestAnimationFrame(fit)});
 window.openMoonlitLetter=open;
})();