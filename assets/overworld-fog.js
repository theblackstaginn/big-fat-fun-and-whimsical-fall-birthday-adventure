/* The Rogue Witch's keepsake ledger, achievement unlocks and illustrated fog.
 * Installed after adventure.js. No images or private memories are sent to GitHub. */
(function(){
  "use strict";
  if(!Array.isArray(chapters)||!document.querySelector("#complete-button"))return;

  /* Chapters now come directly from adventure.js as nine independent stops.
   * Do not splice them, rewrite saved progress, or send cloud updates on load. */
  if(chapters.length!==9||chapters[3]?.id!=="glass"||chapters[4]?.id!=="zuzu"){
    console.error("The birthday adventure requires nine independent quests.");
    return;
  }
  const symbols=["I","II","III","IV","V","VI","VII","VIII","IX"];
  sceneForChapter=function(chapter){
    const index=Math.max(0,chapters.indexOf(chapter));
    return {id:chapters[index].id,number:symbols[index]||String(index+1),title:chapters[index].title,startChapter:index};
  };
  activeScene=function(){
    return sceneForChapter(chapters[Math.min(Math.max(0,chapters.indexOf(selected)),completed.length)]);
  };
  document.querySelector(".progress-track")?.setAttribute("aria-valuemax",String(chapters.length));

  /* Overlay the map. The map image, rooftops and bridge remain untouched. */
  const artwork=document.querySelector("#portrait-overworld"),stage=artwork?.closest(".map-canvas");
  const fog=document.createElement("div");
  fog.id="overworld-fog";
  fog.className="overworld-fog";
  fog.setAttribute("aria-hidden","true");
  fog.hidden=true;
  if(artwork&&stage)artwork.insertAdjacentElement("afterend",fog);
  const fogFronts=[77,71,63,56,49,43,36,29,21,0];
  const publishedImage=artwork?.dataset.sceneSrc||"assets/helen-overworld.webp?v=portrait2";
  const approvedImage="assets/helen-enchanted-overworld.webp?v=20261104-memoryquest1";
  let fallbackAttempted=false;
  if(artwork&&stage){
    updateSceneArtwork=function(){
      artwork.hidden=!portraitReady;
      stage.classList.toggle("portrait-loaded",portraitReady);
      const count=Math.min(completed.length,fogFronts.length-1);
      fog.style.setProperty("--fog-front",fogFronts[count]+"%");
      fog.hidden=!portraitReady||count===chapters.length;
    };
    artwork.addEventListener("error",()=>{
      if(fallbackAttempted)return;
      fallbackAttempted=true;
      artwork.src=publishedImage;
    });
    portraitRequested=true;
    portraitReady=false;
    artwork.hidden=true;
    artwork.src=approvedImage;
    updateSceneArtwork();
  }

  /* Full-size camera roll photos live in IndexedDB on this device only. */
  let dbTask;
  function database(){
    if(dbTask)return dbTask;
    dbTask=new Promise((resolve,reject)=>{
      if(!window.indexedDB){reject(new Error("Private photo storage is unavailable in this browser."));return}
      const req=indexedDB.open("rogue-witch-birthday-keepsakes",1);
      req.onupgradeneeded=()=>req.result.createObjectStore("stops",{keyPath:"id"});
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error||new Error("Could not open private photo storage."));
      req.onblocked=()=>reject(new Error("Please close other tabs showing the adventure and retry."));
    });
    return dbTask;
  }
  async function getRecord(id){
    const db=await database();
    return new Promise((resolve,reject)=>{
      const req=db.transaction("stops","readonly").objectStore("stops").get(id);
      req.onsuccess=()=>resolve(req.result||{id:id,note:"",photo:null});
      req.onerror=()=>reject(req.error);
    });
  }
  async function patchRecord(id,changes){
    const db=await database();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction("stops","readwrite"),store=tx.objectStore("stops");
      let result;
      const req=store.get(id);
      req.onsuccess=()=>{
        result=Object.assign({id:id,note:"",photo:null},req.result||{},changes,{updatedAt:Date.now()});
        store.put(result);
      };
      tx.oncomplete=()=>resolve(result);
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error);
    });
  }
  const cache=new Map();
  let activeId="",photoUrl="",achievementPhotoUrl="",loadingNumber=0;
  const detail=document.querySelector(".chapter-detail");
  const noteCard=document.createElement("div");
  noteCard.className="quest-memory-card";
  noteCard.innerHTML='<label for="witch-memory-text">✒ The Witch’s Journal</label><p>A few words about this stop. What made you smile?</p><textarea id="witch-memory-text" rows="3" maxlength="1000" placeholder="A little memory from this part of our adventure…"></textarea><button type="button" id="witch-memory-save">Save journal note</button><p id="witch-memory-status" class="memory-feedback" role="status"></p>';
  detail?.insertBefore(noteCard,document.querySelector("#complete-button"));

  const curiosSection=document.querySelector(".field-notes");
  const photoCard=document.createElement("div");
  photoCard.className="quest-memory-card curios-memory-card";
  photoCard.innerHTML='<strong id="curios-current-title">❦ Today’s Treasure</strong><p>Take or choose a photo of your booty haul, a little souvenir, or the moment itself. No purchase required.</p><label for="curios-photo-input">Add a photo from this stop</label><input type="file" id="curios-photo-input" accept="image/*"><img id="curios-photo-preview" alt="Saved treasure photo" hidden><p id="curios-photo-status" class="memory-feedback" role="status">Photos are saved privately on this device, not uploaded online.</p><button type="button" id="curios-open-journal">Return to Journal</button><div class="curios-collection"><h3>Collected Curios</h3><div id="curios-album"></div></div>';
  curiosSection?.prepend(photoCard);

  const noteInput=noteCard.querySelector("#witch-memory-text");
  const noteStatus=noteCard.querySelector("#witch-memory-status");
  const noteSave=noteCard.querySelector("#witch-memory-save");
  const photoInput=photoCard.querySelector("#curios-photo-input");
  const photoStatus=photoCard.querySelector("#curios-photo-status");
  const photoPreview=photoCard.querySelector("#curios-photo-preview");
  const completeButton=document.querySelector("#complete-button");
  function openTab(tab){
    document.querySelector('.rpg-toolbar [data-panel="'+tab+'"]')?.click();
  }
  function revokePreview(){
    if(photoUrl){URL.revokeObjectURL(photoUrl);photoUrl=""}
  }
  function showRecord(id,record){
    if(selected.id!==id)return;
    cache.set(id,record);
    noteInput.value=record.note||"";
    noteStatus.textContent=record.note?"✓ Journal memory saved on this device.":"Save a quick note to complete this chapter.";
    photoCard.querySelector("#curios-current-title").textContent="❦ "+selected.title+" · Treasure";
    revokePreview();
    if(record.photo instanceof Blob){
      photoUrl=URL.createObjectURL(record.photo);
      photoPreview.src=photoUrl;
      photoPreview.hidden=false;
      photoStatus.textContent="✓ Treasure photo saved on this device.";
    }else{
      photoPreview.hidden=true;
      photoPreview.removeAttribute("src");
      photoStatus.textContent="Choose a photo to complete this chapter. No purchase required.";
    }
  }
  async function syncSelection(){
    const id=selected.id;
    if(activeId===id)return;
    activeId=id;
    noteInput.value="";
    noteStatus.textContent="Loading journal…";
    photoPreview.hidden=true;
    photoStatus.textContent="Loading curios…";
    const turn=++loadingNumber;
    try{
      const record=await getRecord(id);
      if(turn!==loadingNumber||selected.id!==id)return;
      showRecord(id,record);
      renderAlbum().catch(()=>{});
    }catch(err){
      noteStatus.textContent="Photo storage unavailable: "+(err?.message||err);
      photoStatus.textContent="Please use Safari normally, not Private Browsing.";
    }
  }
  async function renderAlbum(){
    const album=photoCard.querySelector("#curios-album");
    if(!album)return;
    album.replaceChildren();
    const visible=chapters.slice(0,Math.min(completed.length+1,chapters.length));
    for(const chapter of visible){
      let item;
      try{item=await getRecord(chapter.id)}catch{return}
      if(!item.note&&!item.photo)continue;
      const card=document.createElement("div");
      card.className="curios-album-entry";
      const title=document.createElement("strong");
      title.textContent=chapter.title;
      card.append(title);
      if(item.note){
        const p=document.createElement("p");
        p.textContent=item.note;
        card.append(p);
      }
      if(item.photo instanceof Blob){
        const picture=document.createElement("img");
        picture.alt="Keepsake photo from "+chapter.title;
        picture.src=URL.createObjectURL(item.photo);
        picture.addEventListener("load",()=>URL.revokeObjectURL(picture.src),{once:true});
        card.append(picture);
      }
      album.append(card);
    }
    if(!album.childElementCount)album.textContent="Our treasure collection begins at the first stop.";
  }
  function hideAchievement(){
    overlay.hidden=true;
    overlay.classList.remove("is-revealing");
    if(achievementPhotoUrl){URL.revokeObjectURL(achievementPhotoUrl);achievementPhotoUrl=""}
  }
  const overlay=document.createElement("div");
  overlay.className="quest-achievement";
  overlay.hidden=true;
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-modal","true");
  overlay.setAttribute("aria-label","Birthday quest achievement");
  overlay.innerHTML='<div class="quest-achievement-inner"><span class="achievement-sigil" aria-hidden="true">✦</span><p class="achievement-kicker">NEW ACHIEVEMENT · SYSTEM BROADCAST</p><h2 id="achievement-title">Loot Acquired!</h2><p id="achievement-place"></p><img id="achievement-photo" alt="Today’s treasure" hidden><p id="achievement-copy"></p><p id="achievement-reward"></p><p id="achievement-epilogue" hidden></p><button type="button" id="achievement-reveal">Reveal Next Destination ✧</button></div>';
  document.body.append(overlay);

  /* Original, theatrically unqualified dungeon announcer. Shares the same
   * scenes with real progression and isolated Satchel Preview. */
  const achievementScripts=Object.freeze({
  "ruby": {
    "kind": "quest",
    "sigil": "⚔",
    "kicker": "SYSTEM NOTICE · SOCIAL LOOT",
    "title": "PARTY ACQUIRED. ALARMING.",
    "copy": "You entered a mystical shop and voluntarily interacted with other humans. The Overseer had allotted six minutes for awkward silence. You have ruined its calculations.",
    "reward": "REWARD: +1 adventuring party. +8 friendship. Algorithmic dignity: unrecoverable."
  },
  "wonderland": {
    "kind": "quest",
    "sigil": "🗝",
    "kicker": "INVENTORY MANAGEMENT INCIDENT",
    "title": "JUST LOOKING. SURE.",
    "copy": "Congratulations! You wandered into a building where every object insists it is an ancient artifact. Your wallet has requested legal counsel. The System has denied the request.",
    "reward": "REWARD: +3 curiosity. Available bag space: emotionally compromised."
  },
  "candle": {
    "kind": "quest",
    "sigil": "🕯",
    "kicker": "FLAME MANAGEMENT PROTOCOL",
    "title": "FIRE HAZARD: ADORABLE.",
    "copy": "You purchased fragrant fire inside a jar. Humans apparently consider this a normal hobby. The safety department has been instructed to stop asking questions.",
    "reward": "REWARD: Cozy aura +15. Accidental summoning risk: probably fine."
  },
  "glass": {
    "kind": "quest",
    "sigil": "✧",
    "kicker": "EMERGENCY BROADCAST · FRAGILITY DETECTED",
    "title": "THE GLASS IS JUDGING YOU.",
    "copy": "Congratulations, Rogue Witch. You've survived a building packed with beautiful objects and roughly ZERO acceptable places to put your elbows. The System has rolled a Dexterity save on your behalf. It landed sideways. Somehow, you're fine. I have fired the dice.",
    "reward": "REWARD: +7 shimmer. GLASS QUEST COMPLETE. A separate crystal-hoarding incident is now available.",
    "button": "Unlock the Suspiciously Shiny Rock Shop ✧"
  },
  "zuzu": {
    "kind": "quest",
    "sigil": "💎",
    "kicker": "SYSTEM ALERT · UNLICENSED GEOLOGICAL BONDING",
    "title": "YOU HAVE BEEN ADOPTED BY A ROCK.",
    "copy": "Outstanding. You've encountered a collection of glittering minerals and immediately formed emotional attachments to ancient geology. That stone has selected you as its legal guardian. The System has filed custody paperwork and named itself the godparent. This is legally binding in exactly zero jurisdictions.",
    "reward": "REWARD: +1 devoted pebble. ROCK QUEST COMPLETE. River magic now unlocked.",
    "button": "Proceed to the Extremely Wet Side Quest ✧"
  },
  "river": {
    "kind": "quest",
    "sigil": "≈",
    "kicker": "UNAUTHORIZED PEACEFUL MOMENT",
    "title": "SCENERY HAS WON.",
    "copy": "The party halted to stare at moving water. The Overseer expected danger, screaming, or at least some paperwork. Instead you have discovered a suspiciously effective calming spell.",
    "reward": "REWARD: Serenity +20. Boss music temporarily disabled."
  },
  "dinner": {
    "kind": "feast",
    "sigil": "🍜",
    "kicker": "SPECIAL ENCOUNTER · DINNER BOSS",
    "title": "THE HUNGER BEAST HAS FALLEN.",
    "copy": "The Rogue Witch faced an entire menu at Bangkok Haus and emerged victorious. The System prepared a survival tutorial. You ordered dinner instead. Show-offs.",
    "reward": "BOSS DROP: +20 satisfied hearts. Optional nap debuff unlocked.",
    "button": "Proceed to Dessert, You Glorious Menaces ✧"
  },
  "sweet": {
    "kind": "sweet",
    "sigil": "🍬",
    "kicker": "SPECIAL ENCOUNTER · SUGAR EVENT",
    "title": "SUGAR CONTAINMENT FAILURE!",
    "copy": "You breached a candy kitchen. Nobody read the warnings. The System is detecting dangerously elevated joy and a 100% probability of sticky fingers. Excellent work, you tiny disasters.",
    "reward": "REWARD: +40 grin damage. FINAL DESTINATION UNLOCKED.",
    "button": "Reveal the Moonlit Secret ☾"
  },
  "park": {
    "kind": "finale",
    "sigil": "☾",
    "kicker": "FINAL TRANSMISSION · THE SYSTEM IS NOT CRYING",
    "title": "ERROR 999: TOO MUCH JOY.",
    "copy": "Nine stops. One Rogue Witch. An utterly unreasonable quantity of laughter, wonder, and loot. The System tried to calculate the value of this day. Its processors melted. Its insurance has declined coverage.",
    "reward": "ULTIMATE REWARD: Every moment you kept, every story you made, and one enchanted village beneath the moon.",
    "epilogue": "Happy birthday, Jess. The clouds have parted. The adventure is yours, and this magic is real in all the ways that count. ♡",
    "button": "Claim Your Moonlit Ending ✦"
  }
});
  function decorateBirthdayAchievement(chapter,preview=false){
   const script=achievementScripts[chapter?.id]||achievementScripts.ruby;
   overlay.classList.remove("is-feast","is-sweet","is-finale");
   if(script.kind!=="quest")overlay.classList.add("is-"+script.kind);
   overlay.setAttribute("aria-label",script.kind==="finale"?"Moonlit birthday finale":"Quest achievement for "+chapter.title);
   overlay.querySelector(".achievement-sigil").textContent=script.sigil;
   overlay.querySelector(".achievement-kicker").textContent=(preview?"✧ TEST BROADCAST · ":"")+script.kicker;
   overlay.querySelector("#achievement-title").textContent=script.title;
   overlay.querySelector("#achievement-place").textContent=chapter.title;
   overlay.querySelector("#achievement-copy").textContent=script.copy;
   overlay.querySelector("#achievement-reward").textContent=script.reward;
   const epilogue=overlay.querySelector("#achievement-epilogue");
   epilogue.hidden=!script.epilogue;
   epilogue.textContent=script.epilogue||"";
   overlay.querySelector("#achievement-reveal").textContent=script.button||"Reveal Next Destination ✧";
   return script;
  }
  window.renderBirthdayAchievement=decorateBirthdayAchievement;
  let acceptingUnlock=false,bypass=false;
  function showAchievement(id,record){
    if(!overlay.hidden||completed.includes(id)||selected.id!==id)return;
    decorateBirthdayAchievement(selected,false);
    const img=overlay.querySelector("#achievement-photo");
    if(achievementPhotoUrl){URL.revokeObjectURL(achievementPhotoUrl);achievementPhotoUrl=""}
    img.hidden=!(record.photo instanceof Blob);
    if(record.photo instanceof Blob){
      achievementPhotoUrl=URL.createObjectURL(record.photo);
      img.src=achievementPhotoUrl;
    }
    overlay.hidden=false;
    overlay.querySelector("#achievement-reveal").focus();
  }
  async function maybeCelebrate(id,record){
    cache.set(id,record);
    if(selected.id===id && completed.length===chapters.indexOf(selected)&&record.note?.trim()&&record.photo instanceof Blob){
      showAchievement(id,record);
    }
  }
  noteSave.addEventListener("click",async()=>{
    const id=selected.id,text=noteInput.value.trim();
    if(!text){noteStatus.textContent="Write a little memory first.";noteInput.focus();return}
    noteSave.disabled=true;
    noteStatus.textContent="Saving your memory…";
    try{
      const record=await patchRecord(id,{note:text});
      if(selected.id===id)showRecord(id,record);
      await renderAlbum();
      await maybeCelebrate(id,record);
    }catch(err){noteStatus.textContent="Could not save: "+(err?.message||err)}
    finally{noteSave.disabled=false}
  });
  photoInput.addEventListener("change",async()=>{
    const id=selected.id,file=photoInput.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/")||file.size>40*1024*1024){
      photoStatus.textContent="Choose an image no larger than 40 MB.";
      photoInput.value="";return;
    }
    photoInput.disabled=true;
    photoStatus.textContent="Saving your photo privately on this device…";
    try{
      const record=await patchRecord(id,{photo:file,photoName:file.name});
      if(selected.id===id)showRecord(id,record);
      await renderAlbum();
      await maybeCelebrate(id,record);
    }catch(err){photoStatus.textContent="Could not save photo: "+(err?.message||err)}
    finally{photoInput.disabled=false;photoInput.value=""}
  });
  photoCard.querySelector("#curios-open-journal").addEventListener("click",()=>openTab("quest"));

  completeButton.addEventListener("click",async event=>{
    if(bypass)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(acceptingUnlock||completed.includes(selected.id)||chapters.indexOf(selected)!==completed.length)return;
    try{
      const record=await getRecord(selected.id);
      if(!record.note?.trim()){
        openTab("quest");
        noteStatus.textContent="First, write and save a little journal memory.";
        noteInput.focus();
      }else if(!(record.photo instanceof Blob)){
        openTab("notes");
        photoStatus.textContent="Now add a photo in Curios to secure the treasure.";
        photoInput.focus();
      }else showAchievement(selected.id,record);
    }catch(err){openTab("quest");noteStatus.textContent="Storage unavailable: "+(err?.message||err)}
  },true);
  overlay.querySelector("#achievement-reveal").addEventListener("click",()=>{
    if(acceptingUnlock)return;
    acceptingUnlock=true;
    overlay.classList.add("is-revealing");
    if(!document.querySelector(".rpg-sheet")?.hidden)document.querySelector("#rpg-close")?.click();
    setMapMode("overview");
    const finalGift=selected.id==="park"&&completed.length===chapters.length-1;
    const before=completed.length;
    bypass=true;
    try{completeButton.click()}finally{bypass=false}
    if(completed.length!==before+1){
      acceptingUnlock=false;
      hideAchievement();
      return;
    }
    syncSelection();
    renderAlbum().catch(()=>{});
    setTimeout(()=>{
      hideAchievement();
      acceptingUnlock=false;
      /* Only the final park achievement opens the private letter.
       * The actual save/progress and all other achievements are unchanged. */
      if(finalGift)window.openMoonlitLetter?.();
    },1050);
  });
  const previousRender=renderProgress;
  renderProgress=function(){
    previousRender();
    syncSelection().catch(()=>{});
    if(artwork&&stage)updateSceneArtwork();
  };
  renderProgress();
})();