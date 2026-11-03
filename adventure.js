const chapters = [
  {id:"ruby",title:"Ruby Mae’s",subtitle:"The Gathering at the Trailhead",address:"8160 S Main St, Unit A-4, Helen, GA 30545",streetQuery:"8160 S Main St, Unit A-4, Helen, GA 30545",hours:"Opening stop · meet-up time to confirm with friends",duration:"Give yourselves room to catch up and enjoy the start.",description:"The birthday adventure begins where friendship is waiting. Take your time with the people who make this mountain town feel like home; the rest of the map can wait until you’re ready.",clue:"Where mountain lore and old friends meet, the first page of today’s tale opens.",google:"https://www.google.com/maps/search/?api=1&query=8160+S+Main+St+Unit+A-4%2C+Helen%2C+GA+30545",apple:"https://maps.apple.com/?q=Ruby+Mae%27s+Appalachian+Alchemy%2C+8160+S+Main+St+Unit+A-4%2C+Helen%2C+GA+30545"},
  {id:"wonderland",title:"Wonderland Antiques & Curiosities",subtitle:"The Cabinet of Curious Things",address:"8251 S Main St, Helen, GA 30545",streetQuery:"8251 S Main St, Helen, GA 30545",hours:"Monday hours not confirmed · call ahead",duration:"A short walk or drive from Ruby Mae’s; confirm storefront hours.",description:"Wander among old objects and oddities, and let the Rogue Witch decide which relic deserves a second look. No quest requires a purchase; curiosity is plenty.",clue:"Find the door where yesterday’s keepsakes wait for a new chapter.",google:"https://www.google.com/maps/search/?api=1&query=Wonderland+Antiques+%26+Curiosities%2C+8251+S+Main+St%2C+Helen%2C+GA+30545",apple:"https://maps.apple.com/?q=Wonderland+Antiques+%26+Curiosities%2C+8251+S+Main+St%2C+Helen%2C+GA+30545"},
  {id:"candle",title:"Crafty Mountain Candle Co.",subtitle:"The Little Flame Workshop",address:"705 Brucken Strasse, Building 101, Helen, GA 30545",streetQuery:"Crafty Mountain Candle Co., 705 Brucken Strasse, Building 101, Helen, GA 30545",hours:"Monday 11:30 a.m.–3 p.m. · reserve ahead",duration:"Workshop length and a Monday make-a-candle slot need direct confirmation.",description:"If the reservation works, choose a fragrance that feels like this day and make a small flame to carry home. Booking ahead is recommended, and the published Monday window is short.",clue:"A scent is a memory that learned how to glow.",google:"https://www.google.com/maps/search/?api=1&query=Crafty+Mountain+Candle+Co%2C+Helen%2C+GA",apple:"https://maps.apple.com/?q=Crafty+Mountain+Candle+Co%2C+Helen%2C+GA"},
  {id:"town",title:"The Curiosity Walk",subtitle:"Glass, Crystals & Village Treasures",address:"Glassblowing Shop: 8600 N Main St · ZuZu’s Petals: 8660 N Main St",streetQuery:"The Glassblowing Shop, 8600 N Main St, Helen, GA 30545",hours:"Alpine Festival lists Monday 10 a.m.–6 p.m.; verify other shop hours",duration:"Allow an unrushed hour or two; browse only what’s open and inviting.",description:"Follow the village’s shopfronts at your own pace: handmade glass at The Glassblowing Shop, crystals and minerals at ZuZu’s Petals, plus nearby imports and seasonal finds. Alpine Festival of Arts and Crafts lists Monday hours of 10 a.m.–6 p.m.; each shop keeps its own schedule.",clue:"Seek a little color caught in glass, a stone with a story, and a shop you didn’t plan to find.",google:"https://www.google.com/maps/search/?api=1&query=Glassblowing+Shop%2C+8600+N+Main+St%2C+Helen%2C+GA+30545",apple:"https://maps.apple.com/?q=Glassblowing+Shop%2C+8600+N+Main+St%2C+Helen%2C+GA+30545"},
  {id:"river",title:"The Chattahoochee Pause",subtitle:"A Moment by the Water",address:"Downtown Helen riverfront",streetQuery:"Chattahoochee River near Main Street, Helen, GA 30545",hours:"Short downtown paths · use posted access and signs",duration:"A brief pause is enough; the longer Heritage Trail closes at dusk.",description:"Step away from the shop bells and listen to the river. Helen has short downtown paths, boardwalks, and footbridges beside the Chattahoochee. Keep this a small riverside pause before the evening chapter.",clue:"The river carries every leaf downstream, but never asks the leaf to hurry.",google:"https://www.google.com/maps/search/?api=1&query=Chattahoochee+River+downtown+Helen+GA",apple:"https://maps.apple.com/?q=Chattahoochee+River+downtown+Helen+GA"},
  {id:"dinner",title:"Bavarian Birthday Dinner",subtitle:"The Hearthside Feast",address:"The Heidelberg · 8660 N Main St, Helen, GA 30545",streetQuery:"The Heidelberg, 8660 N Main St, Helen, GA 30545",hours:"Monday listed 11 a.m.–9 p.m. · reservations accepted",duration:"Call or reserve directly for your preferred dinner time.",description:"Raise a glass to another year of Jess: warm food, Bavarian village lights, and the rare pleasure of having nowhere else to be. The Heidelberg is a lovely Monday dinner possibility and accepts reservations.",clue:"When the lanterns wake and the long day softens, follow the music to supper.",google:"https://www.google.com/maps/search/?api=1&query=The+Heidelberg%2C+8660+N+Main+St%2C+Helen%2C+GA+30545",apple:"https://maps.apple.com/?q=The+Heidelberg%2C+8660+N+Main+St%2C+Helen%2C+GA+30545"},
  {id:"sweet",title:"The Sweet Last Stop",subtitle:"A Chocolate Epilogue",address:"Hansel & Gretel Candy Kitchen · 8651 N Main St, Helen, GA 30545",streetQuery:"Hansel & Gretel Candy Kitchen, 8651 N Main St, Helen, GA 30545",hours:"Monday hours vary by season · check with the shop",duration:"Best as an easy post-dinner stroll if the shop is still open.",description:"End with a little chocolate, fudge, or whatever sweet thing makes you grin. Hansel & Gretel Candy Kitchen is on North Main, an easy downtown finale when its doors are open.",clue:"The final treasure is small, sweet, and meant to be shared.",google:"https://www.google.com/maps/search/?api=1&query=Hansel+%26+Gretel+Candy+Kitchen%2C+Helen%2C+GA",apple:"https://maps.apple.com/?q=Hansel+%26+Gretel+Candy+Kitchen%2C+Helen%2C+GA"}
];
const list=document.querySelector("#chapter-list"),storeKey="jess-birthday-quest-progress-v1",pinPositions=[[21,67],[32,57],[45,65],[48,50],[65,63],[59,43],[80,63]],trailPoints=[[252,530],[384,450],[540,513],[580,395],[780,495],[705,337],[965,500]];
function readProgress(){try{const saved=JSON.parse(localStorage.getItem(storeKey)||"[]");return chapters.filter(c=>saved.includes(c.id)).map(c=>c.id)}catch{return[]}}
function saveProgress(){try{localStorage.setItem(storeKey,JSON.stringify(completed))}catch{/* progress still works for this open page */}}
let completed=readProgress(),currentIndex=Math.min(completed.length,chapters.length-1),selected=chapters[currentIndex];
function routePath(points){return points.length<2?"":points.map((p,i)=>`${i?"L":"M"}${p[0]} ${p[1]}`).join(" ")}
/* Prepared portrait artwork overlay. Missing image leaves the real-world map untouched. */
const portraitArtwork=document.querySelector("#portrait-overworld");
let portraitReady=false;
const portraitPinPositions=[[22,82],[35,69],[40,49],[49,34],[76,62],[57,57],[75,80]];
if(portraitArtwork){
 portraitArtwork.addEventListener("load",()=>{
  if(!portraitArtwork.naturalWidth)return;
  portraitReady=true;portraitArtwork.hidden=false;
  document.querySelector(".map-canvas")?.classList.add("portrait-loaded");
  renderProgress();
 });
 portraitArtwork.addEventListener("error",()=>{portraitArtwork.hidden=true;});
 if(portraitArtwork.complete&&portraitArtwork.naturalWidth){
  portraitReady=true;portraitArtwork.hidden=false;
  document.querySelector(".map-canvas")?.classList.add("portrait-loaded");
 }
}

function renderMap(){const pins=document.querySelector("#map-hotspots");pins.replaceChildren();const unlockedThrough=Math.min(completed.length,chapters.length-1);chapters.slice(0,unlockedThrough+1).forEach((chapter,index)=>{const pin=document.createElement("button"),isDone=completed.includes(chapter.id);pin.type="button";pin.className="map-pin"+(isDone?" visited":"")+(chapter.id===selected.id?" selected":"");pin.setAttribute("aria-label",isDone?`Revisit explored chapter ${index+1}: ${chapter.title}`:`Open the next revealed chapter: ${chapter.title}`);pin.style.left=`${(portraitReady?portraitPinPositions:pinPositions)[index][0]}%`;pin.style.top=`${(portraitReady?portraitPinPositions:pinPositions)[index][1]}%`;pin.innerHTML=`<span class="pin-number">${isDone?"✓":index+1}</span><span class="pin-label">${chapter.title}</span>`;pin.addEventListener("click",()=>{selected=chapter;renderProgress();document.querySelector("#quest").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})});pins.append(pin)});const visited=document.querySelector("#trail-visited"),next=document.querySelector("#trail-to-next");visited.setAttribute("d",routePath(trailPoints.slice(0,Math.max(1,completed.length))));next.setAttribute("d",completed.length<chapters.length?routePath(trailPoints.slice(Math.max(0,completed.length-1),completed.length+1)):"")}
function renderList(){list.replaceChildren();const unlockedThrough=Math.min(completed.length,chapters.length-1);chapters.slice(0,unlockedThrough+1).forEach((chapter,index)=>{const button=document.createElement("button");button.type="button";button.className="chapter-button"+(completed.includes(chapter.id)?" is-complete":"");button.setAttribute("aria-current",chapter.id===selected.id?"true":"false");button.innerHTML=`<span class="chapter-number">${completed.includes(chapter.id)?"✓":String(index+1).padStart(2,"0")}</span><span><span class="chapter-name">${chapter.title}</span><span class="chapter-subtitle">${chapter.subtitle}</span></span><span class="chapter-state" aria-hidden="true">${chapter.id===selected.id?"✦":"›"}</span>`;button.addEventListener("click",()=>{selected=chapter;renderProgress()});list.append(button)});for(let i=unlockedThrough+1;i<chapters.length;i++){const locked=document.createElement("div");locked.className="fog-slot";locked.setAttribute("aria-label","Unrevealed location; complete the current chapter to reveal it");locked.innerHTML='<span class="fog-lock" aria-hidden="true">⌑</span><span class="fog-copy">Uncharted trail<span class="fog-caption">Complete the revealed chapter to discover this place</span></span><span aria-hidden="true">· · ·</span>';list.append(locked)}}
function renderDetail(){const i=chapters.indexOf(selected),isDone=completed.includes(selected.id);document.querySelector("#detail-kicker").textContent=isDone?`CHAPTER ${String(i+1).padStart(2,"0")} · EXPLORED`:`CHAPTER ${String(i+1).padStart(2,"0")} · CURRENT CHAPTER`;document.querySelector("#detail-title").textContent=selected.title;document.querySelector("#detail-description").textContent=selected.description;document.querySelector("#detail-clue").textContent=selected.clue;document.querySelector("#detail-meta").innerHTML=`<span><strong>Where:</strong> ${selected.address}</span><span><strong>When:</strong> ${selected.hours}</span><span><strong>Pace:</strong> ${selected.duration}</span>`;document.querySelector("#detail-directions").innerHTML=`<a href="${selected.google}" target="_blank" rel="noopener">Open Google Maps ↗</a><a href="${selected.apple}" target="_blank" rel="noopener">Open Apple Maps ↗</a>`;const button=document.querySelector("#complete-button");button.disabled=isDone;button.textContent=isDone?(completed.length===chapters.length?"Adventure complete":"Place explored ✓"):"Mark this place visited · reveal next";button.setAttribute("aria-pressed",String(isDone))}
let streetMap=null,streetPins=null,leafletPromise=null,geocodeChain=Promise.resolve(),lastGeocodeAt=0,mapRenderId=0;const geocodePending=new Map(),geocodeKey="jess-birthday-map-coordinates-v1",helenCenter=[34.7012,-83.7246];
function setStreetStatus(message,show=true){const status=document.querySelector("#street-map-status");status.textContent=message;status.hidden=!show}
function loadLeaflet(){if(window.L)return Promise.resolve(window.L);if(leafletPromise)return leafletPromise;leafletPromise=new Promise((resolve,reject)=>{if(!document.querySelector("#leaflet-style")){const css=document.createElement("link");css.id="leaflet-style";css.rel="stylesheet";css.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.append(css)}const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";script.onload=()=>window.L?resolve(window.L):reject(new Error("Map library did not load"));script.onerror=()=>reject(new Error("Map library could not load"));document.head.append(script)}).catch(error=>{leafletPromise=null;throw error});return leafletPromise}
/* Approximate shopping-center anchor for Ruby Mae’s at 8160 S Main St.
 * Coordinate is published for another business at that same street address:
 * https://maps.roadtrippers.com/us/helen-ga/food-drink/campfire-helen
 * Keep the full Ruby Mae’s address in the quest journal for exact directions. */
const questAnchors=Object.freeze({ruby:[34.700059,-83.721920]});
function coordinatesFor(chapter){const known=questAnchors[chapter.id];if(known)return Promise.resolve([...known]);const query=chapter.streetQuery||chapter.address;let cache={};try{cache=JSON.parse(localStorage.getItem(geocodeKey)||"{}")}catch{}if(cache[query])return Promise.resolve(cache[query]);if(geocodePending.has(query))return geocodePending.get(query);const task=geocodeChain.then(async()=>{const wait=Math.max(0,1150-(Date.now()-lastGeocodeAt));if(wait)await new Promise(resolve=>setTimeout(resolve,wait));lastGeocodeAt=Date.now();const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&q=${encodeURIComponent(query)}`;const response=await fetch(url,{headers:{Accept:"application/json"}});if(!response.ok)throw new Error("Address lookup unavailable");const matches=await response.json();if(!matches.length)throw new Error("This address was not found on the street map");const point=[Number(matches[0].lat),Number(matches[0].lon)];cache[query]=point;try{localStorage.setItem(geocodeKey,JSON.stringify(cache))}catch{}return point});geocodeChain=task.catch(()=>{});geocodePending.set(query,task);task.then(()=>geocodePending.delete(query),()=>geocodePending.delete(query));return task}
function createMapGrid(L){const Grid=L.GridLayer.extend({createTile(){const tile=document.createElement("canvas"),size=this.getTileSize();tile.width=size.x;tile.height=size.y;const ctx=tile.getContext("2d");ctx.strokeStyle="rgba(102,69,39,.16)";ctx.lineWidth=1;ctx.setLineDash([3,5]);for(let p=0;p<=size.x;p+=48){ctx.beginPath();ctx.moveTo(p,0);ctx.lineTo(p,size.y);ctx.stroke();ctx.beginPath();ctx.moveTo(0,p);ctx.lineTo(size.x,p);ctx.stroke()}return tile}});return new Grid({tileSize:256,interactive:false,opacity:.72})}

/* Interactive RPG street atlas: real OSM roads, buildings, and water.
 * MapLibre/OpenFreeMap provides the 3D village; Leaflet uses car-free OSM tiles as fallback. */
let neighborhoodMap=null,neighborhoodLoad=null,neighborhoodLibrary=null,neighborhoodPins=[],neighborhoodRequest=0;
/* Temporary on-screen atlas diagnostic for iPhone / embedded browsers.
 * Reports only map-loading stages, never visitor location or personal data. */
/* Keep atlas diagnostics in the developer console so they never cover the map. */
function showAtlasDiagnostic(message,failed=false){
 const status=document.querySelector("#atlas-diagnostic");
 if(status)status.remove();
 if(failed)console.warn("3D village view unavailable; showing the street map.",String(message).slice(0,180));
}
function loadNeighborhoodLibrary(){
 if(window.maplibregl&&typeof window.maplibregl.Map==="function")return Promise.resolve(window.maplibregl);
 if(neighborhoodLibrary)return neighborhoodLibrary;
 if(!document.querySelector("#maplibre-css")){
  const link=document.createElement("link");link.rel="stylesheet";link.id="maplibre-css";
  link.href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css";document.head.append(link);
 }
 // Pin v5.24.0 while diagnosing a real-iOS crash in the v6 neighborhood renderer.
 // Leaflet uses car-free OpenStreetMap tiles as the safe fallback.
 neighborhoodLibrary=new Promise((resolve,reject)=>{
  const script=document.createElement("script");
  script.src="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js";
  script.onload=()=>window.maplibregl&&typeof window.maplibregl.Map==="function"
   ?resolve(window.maplibregl):reject(new Error("Compatible atlas library did not initialize"));
  script.onerror=()=>reject(new Error("Compatible atlas library could not load"));
  document.head.append(script);
 }).catch(error=>{neighborhoodLibrary=null;throw error});
 return neighborhoodLibrary;
}
/* Autumn alpine environment: enhancements stay in the vector map only.
 * Real streets, quest pins, and saved progress remain intact. */
function makeAutumnCanopyTile(){
 const canvas=document.createElement("canvas");
 canvas.width=canvas.height=128;
 const ctx=canvas.getContext("2d");
 if(!ctx)return null;
 let seed=17317;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const foliage=["#4c694c","#657449","#9c874b","#c49756","#9c6640","#814b38"];
 for(let i=0;i<26;i++){
  const x=random()*128,y=random()*128,r=5+random()*8,tone=foliage[Math.floor(random()*foliage.length)];
  /* Wrap each canopy at tile edges so the texture remains seamless. */
  for(const ox of [-128,0,128])for(const oy of [-128,0,128]){
   const cx=x+ox,cy=y+oy;
   ctx.fillStyle="rgba(35,48,36,.22)";
   ctx.beginPath();ctx.ellipse(cx+2,cy+3,r*1.12,r*.83,.27,0,Math.PI*2);ctx.fill();
   ctx.fillStyle=tone;
   ctx.beginPath();ctx.ellipse(cx,cy,r,r*.84,-.32,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="rgba(250,217,144,.25)";
   ctx.beginPath();ctx.ellipse(cx-r*.23,cy-r*.26,r*.48,r*.27,-.45,0,Math.PI*2);ctx.fill();
  }
 }
 return ctx.getImageData(0,0,128,128);
}
/* Synthetic, car-free ground cover classified from 2023 USDA NAIP.
 * OSM roads, buildings, and water are drawn above this transparent image. */
function installSyntheticHelenGround(map){
 /* Ground images share the landscaping WebGL layer with trees. Keep their
  * transparent alpha so roads, roofs, parking, and water stay unobstructed. */
 map.__birthdayGroundLayers=[
  {url:new URL("assets/helen-painted-ground.png?v=20261103-ground17",document.baseURI).href,
   coordinates:[[-83.739,34.713],[-83.709,34.713],[-83.709,34.691],[-83.739,34.691]],minzoom:12},
  {url:new URL("assets/helen-painted-ground-downtown.png?v=20261103-ground17",document.baseURI).href,
   coordinates:[[-83.732,34.708],[-83.717,34.708],[-83.717,34.694],[-83.732,34.694]],minzoom:14}
 ];
 return true;
}

/* A repeating meadow wash gives mapped parks and grass a visible storybook
 * ground texture even where NAIP classification is soft or partly transparent. */
function makeAutumnMeadowTile(){
 const canvas=document.createElement("canvas");
 canvas.width=canvas.height=128;
 const ctx=canvas.getContext("2d");
 if(!ctx)return null;
 let seed=80421;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 ctx.fillStyle="#aeb889";ctx.fillRect(0,0,128,128);
 const blades=["#788a5b","#89996a","#c6bd83","#d2c48d","#94a373"];
 for(let i=0;i<310;i++){
  const x=random()*128,y=random()*128,len=2+random()*5;
  ctx.strokeStyle=blades[Math.floor(random()*blades.length)];
  ctx.globalAlpha=.24+random()*.24;ctx.lineWidth=.7+random()*.6;
  for(const ox of [-128,0,128])for(const oy of [-128,0,128]){
   ctx.beginPath();ctx.moveTo(x+ox,y+oy);ctx.lineTo(x+ox+(random()-.5)*2,y+oy-len);ctx.stroke();
  }
 }
 const leaves=["#bd8751","#d1aa65","#967146"];
 for(let i=0;i<22;i++){
  const x=random()*128,y=random()*128;
  ctx.fillStyle=leaves[Math.floor(random()*leaves.length)];ctx.globalAlpha=.62;
  for(const ox of [-128,0,128])for(const oy of [-128,0,128]){
   ctx.beginPath();ctx.ellipse(x+ox,y+oy,1.6,1,.6,0,Math.PI*2);ctx.fill();
  }
 }
 ctx.globalAlpha=1;
 return ctx.getImageData(0,0,128,128);
}
function styleVillageAtlas(map){
 const style=map.getStyle(),layers=style?.layers||[];
 const paintedGround=installSyntheticHelenGround(map,layers);
 /* Soft illustrated ground detail is used only in mapped park and grass polygons. */
 try{
  const meadow=makeAutumnMeadowTile();
  if(meadow&&!map.hasImage("birthday-autumn-meadow"))map.addImage("birthday-autumn-meadow",meadow,{pixelRatio:2});
  if(meadow)for(const layer of layers){
   if(layer.type!=="fill")continue;
   const source=layer["source-layer"],filter=JSON.stringify(layer.filter||[]);
   const mappedPark=source==="park";
   const mappedGrass=source==="landcover"&&filter.includes('"grass"');
   const mappedGarden=source==="landuse"&&/(park|garden|village_green|grass|meadow|orchard|pitch)/.test(filter);
   if(mappedPark||mappedGrass||mappedGarden){
    map.setPaintProperty(layer.id,"fill-pattern","birthday-autumn-meadow");
    map.setPaintProperty(layer.id,"fill-opacity",.78);
   }
  }
 }catch{/* Ground texture is decorative; base map remains usable. */}
 /* Warm late-autumn color grading, without losing real roads or river placement. */
 for(const layer of layers){
  const source=layer["source-layer"];
  if(!source)continue;
  try{
   if(layer.type==="fill"){
    if(source==="water"){
     map.setPaintProperty(layer.id,"fill-color","#498697");
     map.setPaintProperty(layer.id,"fill-opacity",.94);
    }else if(source==="landcover"){
     map.setPaintProperty(layer.id,"fill-color",["match",["get","class"],
      "wood","#586f50","grass","#a8aa72","sand","#dac79c","wetland","#78927b","#88936a"]);
     map.setPaintProperty(layer.id,"fill-opacity",paintedGround?.52:.78);
    }else if(source==="landuse"){
     map.setPaintProperty(layer.id,"fill-color",["match",["get","class"],
      "park","#909f72","residential","#d6c8a7","forest","#6b7855",
      "cemetery","#a29a78","pitch","#91a76b","#b4ad8f"]);
     if(!layer.paint?.["fill-pattern"]){
      const softLanduses=["park","garden","village_green","orchard","forest","grass","meadow","cemetery","residential"];
      map.setPaintProperty(layer.id,"fill-opacity",paintedGround?["case",["in",["get","class"],["literal",softLanduses]],.42,1]:.75);
     }
    }else if(source==="building"){
     map.setPaintProperty(layer.id,"fill-color","#a78a68");
     map.setPaintProperty(layer.id,"fill-opacity",.9);
    }
   }
   if(layer.type==="line"&&source==="transportation"){
    const casing=/case|outline|border/i.test(layer.id);
    map.setPaintProperty(layer.id,"line-color",casing?"#6b5442":"#e4d4b1");
   }
   if(layer.type==="symbol"&&layer.layout?.["text-field"]){
    map.setPaintProperty(layer.id,"text-color","#46372e");
    map.setPaintProperty(layer.id,"text-halo-color","#f0e2c5");
    map.setPaintProperty(layer.id,"text-halo-width",1.25);
   }
  }catch{/* Keep provider styling if a particular tile layer rejects an override. */}
 }
 try{
  if(typeof map.setLight==="function")map.setLight({
   anchor:"viewport",color:"#ffe3b4",intensity:.6,position:[1.3,205,48]
  });
 }catch{/* A missing legacy light option should never break navigation. */}
 const vectorSource=Object.keys(style?.sources||{}).find(key=>style.sources[key].type==="vector");
 if(!vectorSource||map.getLayer("birthday-rooftops"))return;
 const symbolBefore=layers.find(layer=>layer.type==="symbol")?.id;
 /* Pattern only true OSM woodland polygons: it never paints trees onto streets. */
 try{
  const woods=makeAutumnCanopyTile();
  if(woods&&!map.hasImage("birthday-autumn-canopy")){
   map.addImage("birthday-autumn-canopy",woods,{pixelRatio:2});
  }
  if(woods){
   const roads=layers.find(layer=>layer.type==="line"&&layer["source-layer"]==="transportation");
   map.addLayer({
    id:"birthday-autumn-woods",type:"fill",source:vectorSource,"source-layer":"landcover",minzoom:12,
    filter:["==",["get","class"],"wood"],
    paint:{"fill-pattern":"birthday-autumn-canopy","fill-opacity":.8}
   },roads?.id||symbolBefore);
  }
 }catch{/* Woodland texture is optional; vector map remains available. */}
 /* Village paving uses only mapped pedestrian paths and service-lane edges. */
 if(typeof window.installHelenStonework==="function"){
  try{window.installHelenStonework(map,vectorSource,symbolBefore)}
  catch{/* Decorative stonework must not affect map navigation. */}
 }
 /* OSM building height is used when present. Unmapped heights get modest village proportions.
  * Dark eaves and copper-red roof caps hint at alpine architecture without inventing
  * a claimed survey of every real roof or adding heavy 3D models on iPhone. */
 const buildingHeight=["min",18,["max",5,["case",
  ["has","render_height"],["to-number",["get","render_height"],9],
  ["has","height"],["to-number",["get","height"],9],9]]];
 const raised=(height)=>["interpolate",["linear"],["zoom"],15,0,16,height];
 try{
  map.addLayer({
   id:"birthday-alpine-walls",type:"fill-extrusion",source:vectorSource,"source-layer":"building",minzoom:15,
   paint:{
    "fill-extrusion-color":["match",["get","type"],
     "commercial","#e8d1ad","industrial","#b7a99a","residential","#e2c9a5","#d9c09b"],
    "fill-extrusion-height":raised(["-",buildingHeight,1.55]),
    "fill-extrusion-base":0,"fill-extrusion-opacity":.96,
    "fill-extrusion-vertical-gradient":true
   }
  },symbolBefore);
  map.addLayer({
   id:"birthday-alpine-eaves",type:"fill-extrusion",source:vectorSource,"source-layer":"building",minzoom:15,
   paint:{
    "fill-extrusion-color":"#594338",
    "fill-extrusion-height":raised(["-",buildingHeight,1.12]),
    "fill-extrusion-base":raised(["-",buildingHeight,1.65]),
    "fill-extrusion-opacity":.96
   }
  },symbolBefore);
  map.addLayer({
   id:"birthday-rooftops",type:"fill-extrusion",source:vectorSource,"source-layer":"building",minzoom:15,
   paint:{
    "fill-extrusion-color":["match",["get","type"],
     "commercial","#a75c43","industrial","#71675d","residential","#87483c","#9b5742"],
    "fill-extrusion-height":raised(buildingHeight),
    "fill-extrusion-base":raised(["-",buildingHeight,1.2]),
    "fill-extrusion-opacity":.97,
    "fill-extrusion-vertical-gradient":true
   }
  },symbolBefore);
  /* Autumn trees appear only in mapped vegetation areas, away from streets.
   * Keep the renderer completely optional for older iOS browsers. */
  if(typeof window.installHelenLandscaping==="function"){
   try{window.installHelenLandscaping(map,vectorSource,symbolBefore)}
   catch{/* The core street map and existing roofs stay usable. */}
  }
  /* Overlay real sloping roof geometry only when the lightweight renderer is available.
   * If unsupported or unavailable, MapLibre's native buildings remain in place. */
  if(typeof window.installAlpineRoofLayer==="function"){
   try{window.installAlpineRoofLayer(map,vectorSource,symbolBefore)}
   catch{/* Leave the standard rooftops and navigation available. */}
  }
 }catch(error){
  /* Partially installed decorative layers must not interrupt street navigation. */
  for(const id of ["birthday-rooftops","birthday-alpine-eaves","birthday-alpine-walls"]){
   try{if(map.getLayer(id))map.removeLayer(id)}catch{}
  }
  showAtlasDiagnostic("Using standard village buildings",false);
 }
}
async function renderVillageAtlas(center,features){
 showAtlasDiagnostic("Starting vector map");
 const request=++neighborhoodRequest;
 const pane=document.querySelector(".street-map-frame"),nearby=document.querySelector("#nearby-view");
 if(!pane||!nearby||nearby.hidden){showAtlasDiagnostic("Nearby container not visible",true);return;}
 let container=pane.querySelector("#rpg-neighborhood-map");
 if(!container){container=document.createElement("div");container.id="rpg-neighborhood-map";container.setAttribute("aria-label","Illustrated interactive streets of Helen");pane.append(container);}
 const ml=await loadNeighborhoodLibrary();
 showAtlasDiagnostic("Map library loaded");
 if(!neighborhoodMap){
  neighborhoodMap=new ml.Map({
   container,style:"https://tiles.openfreemap.org/styles/liberty",
   center:[center[1],center[0]],zoom:17,minZoom:14,maxZoom:19,pitch:42,maxPitch:55,
   bearing:0,dragRotate:false,pitchWithRotate:false,renderWorldCopies:false
  });
  neighborhoodMap.addControl(new ml.NavigationControl({showCompass:false}),"top-left");
  showAtlasDiagnostic("Loading vector style and tiles");
  neighborhoodMap.on("error",event=>showAtlasDiagnostic("Map event: "+(event?.error?.message||"unknown"),true));
  neighborhoodLoad=new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error("Vector map startup timed out")),18000);
   neighborhoodMap.once("load",()=>{clearTimeout(timeout);showAtlasDiagnostic("Style loaded; applying rooftops");styleVillageAtlas(neighborhoodMap);resolve()});
  });
 }
 await neighborhoodLoad;
 if(request!==neighborhoodRequest||!neighborhoodMap)return;
 neighborhoodMap.jumpTo({center:[center[1],center[0]],zoom:17,pitch:42});
 for(const marker of neighborhoodPins)marker.remove();
 neighborhoodPins=[];
 for(const {chapter,point} of features){
  const index=chapters.indexOf(chapter),visited=completed.includes(chapter.id);
  const node=document.createElement("button");node.type="button";
  node.className="rpg-neighborhood-pin"+(visited?" is-explored":"");
  node.textContent=visited?"✓":String(index+1);
  node.setAttribute("aria-label",chapter.title+(visited?" explored":" current quest"));
  node.title=chapter.title;
  node.addEventListener("click",event=>{
   event.stopPropagation();selected=chapter;renderProgress();
   document.querySelector('[data-panel="quest"]')?.click();
  });
  neighborhoodPins.push(new ml.Marker({element:node,anchor:"bottom"}).setLngLat([point[1],point[0]]).addTo(neighborhoodMap));
 }
 nearby.classList.add("vector-ready");
 neighborhoodMap.resize();
 showAtlasDiagnostic("Vector neighborhood visible");
}

function initStreetMap(L){if(streetMap)return;streetMap=L.map("street-map",{center:helenCenter,zoom:15,scrollWheelZoom:false,zoomControl:true,preferCanvas:true});L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>",updateWhenIdle:true,keepBuffer:1}).addTo(streetMap);createMapGrid(L).addTo(streetMap);streetMap.createPane("village-geometry");streetMap.getPane("village-geometry").style.zIndex="430";streetMap.getPane("village-geometry").style.pointerEvents="none";streetTerrain=L.layerGroup().addTo(streetMap);streetPins=L.layerGroup().addTo(streetMap);streetMap.on("tileload",()=>setStreetStatus("",false));streetMap.on("tileerror",()=>setStreetStatus("Map tiles need a connection. The chapter’s directions are below."));setTimeout(()=>streetMap&&streetMap.invalidateSize(),100)}
async function renderStreetMap(){const requestId=++mapRenderId,L=await loadLeaflet();initStreetMap(L);setStreetStatus("Finding this chapter on the real street map…");const visible=chapters.slice(0,Math.min(completed.length,chapters.length-1)+1),points=[];for(const chapter of visible){try{points.push({chapter,point:await coordinatesFor(chapter)})}catch(error){if(chapter.id===selected.id)throw error}}if(!streetMap||requestId!==mapRenderId)return;streetPins.clearLayers();points.forEach(({chapter,point})=>{const index=chapters.indexOf(chapter),visited=completed.includes(chapter.id),icon=L.divIcon({className:"quest-pin-icon",html:`<span class="street-quest-pin${visited?" visited":" current"}">${visited?"✓":index+1}</span>`,iconSize:[40,46],iconAnchor:[20,42],popupAnchor:[0,-38]});L.marker(point,{icon,title:chapter.title,keyboard:true}).bindPopup(`<strong>${chapter.title}</strong><br>${chapter.subtitle}`).addTo(streetPins)});const current=points.find(item=>item.chapter.id===selected.id);if(current){streetMap.setView(current.point,17,{animate:!matchMedia("(prefers-reduced-motion: reduce)").matches});setStreetStatus("",false);renderVillageAtlas(current.point,points).catch(error=>{showAtlasDiagnostic("Fallback: "+(error?.message||String(error)),true)})}else{streetMap.setView(helenCenter,15);setStreetStatus("This address could not be placed. Use the chapter’s directions below.")}}
function updateNearby(){const wasVisited=completed.includes(selected.id);document.querySelector("#nearby-context").textContent=wasVisited?"REAL STREETS · VISITED CHAPTER":"REAL STREETS · CURRENT CHAPTER";document.querySelector("#nearby-place").textContent=selected.title;document.querySelector("#nearby-address").textContent=selected.address;if(document.querySelector("#nearby-view").hidden)return;renderStreetMap().catch(error=>{setStreetStatus(`${error.message}. Use the chapter’s directions below.`)})}
function renderProgress(){currentIndex=Math.min(completed.length,chapters.length-1);if(!completed.includes(selected.id)&&chapters.indexOf(selected)>currentIndex)selected=chapters[currentIndex];const count=completed.length;document.querySelector("#progress-count").textContent=`${count} of ${chapters.length} places visited`;document.querySelector(".progress-track").setAttribute("aria-valuenow",String(count));document.querySelector("#progress-fill").style.width=`${count/chapters.length*100}%`;document.querySelector("#progress-message").textContent=count===chapters.length?"Adventure complete. Jess has explored the whole map. Roll credits; cue kisses.":count===0?"The opening place is revealed. Explore it to discover the path ahead.":`${count} place${count===1?"":"s"} explored. A new destination has appeared on your map.`;renderList();renderMap();renderDetail();updateNearby()}
function setMapMode(mode){const nearby=mode==="nearby";document.querySelector("#overview-view").hidden=nearby;document.querySelector("#nearby-view").hidden=!nearby;document.querySelector("#overview-view").classList.toggle("is-active",!nearby);document.querySelector("#nearby-view").classList.toggle("is-active",nearby);document.querySelector("#mode-overview").classList.toggle("is-active",!nearby);document.querySelector("#mode-nearby").classList.toggle("is-active",nearby);document.querySelector("#mode-overview").setAttribute("aria-pressed",String(!nearby));document.querySelector("#mode-nearby").setAttribute("aria-pressed",String(nearby));if(nearby){updateNearby();setTimeout(()=>streetMap&&streetMap.invalidateSize(),80)}}
document.querySelector("#mode-overview").addEventListener("click",()=>setMapMode("overview"));document.querySelector("#mode-nearby").addEventListener("click",()=>setMapMode("nearby"));
document.querySelector("#complete-button").addEventListener("click",()=>{if(completed.includes(selected.id)||chapters.indexOf(selected)!==completed.length)return;completed.push(selected.id);saveProgress();selected=chapters[Math.min(completed.length,chapters.length-1)];renderProgress()});document.querySelector("#reset-progress").addEventListener("click",()=>{completed=[];selected=chapters[0];try{localStorage.removeItem(storeKey)}catch{}renderProgress()});renderProgress();


/* Full-screen RPG shell: preserve the existing quest system and content. */
(function installAdventureShell(){
  const hero=document.querySelector(".hero"),art=document.querySelector(".hero-art");
  if(!hero||!art)return;
  document.body.classList.add("rpg-fullscreen");
  const hud=document.createElement("div");
  hud.className="rpg-hud";
  hud.innerHTML='<div class="rpg-topbar"><span class="rpg-title">✦ Jess’s Birthday Adventure</span><button type="button" class="rpg-icon" data-panel="story" aria-label="Read the birthday dedication">♡</button></div><div class="rpg-bottom"><div class="rpg-progress" aria-live="polite">✧ <span id="rpg-count">Chapter 1 of 7</span></div><div class="rpg-toolbar"><button type="button" data-panel="quest">✦ Journal</button><button type="button" data-panel="notes">❧ Notes</button><button type="button" data-panel="story">♡ Story</button><button type="button" data-panel="settings">⚙ More</button></div></div>';
  art.append(hud);
  const shade=document.createElement("div");shade.className="rpg-shade";shade.hidden=true;
  const sheet=document.createElement("section");sheet.className="rpg-sheet";sheet.hidden=true;sheet.setAttribute("role","dialog");sheet.setAttribute("aria-modal","true");sheet.setAttribute("aria-label","Adventure journal");
  sheet.innerHTML='<div class="rpg-sheet-head"><strong id="rpg-sheet-title">Quest journal</strong><button type="button" id="rpg-close" aria-label="Close panel">✕</button></div><div class="rpg-sheet-body" id="rpg-sheet-body"></div>';
  document.body.append(shade,sheet);
  const body=sheet.querySelector("#rpg-sheet-body"),title=sheet.querySelector("#rpg-sheet-title");
  const content={quest:document.querySelector(".quest-section"),notes:document.querySelector(".field-notes"),story:document.querySelector(".hero-copy"),finale:document.querySelector(".finale")};
  const settings=document.createElement("div");settings.className="rpg-settings";settings.innerHTML='<p>Carry the adventure in your pocket. Your visited chapters stay saved on this device.</p><button type="button" id="rpg-print">Print the adventure map</button><button type="button" id="rpg-reset">Start the journey over</button><button type="button" id="rpg-finale">Read the birthday blessing</button>';
  const openPanel=(name)=>{
    const target=content[name]||settings;
    if(!target)return;
    body.replaceChildren(target);
    title.textContent=({quest:"The quest journal",notes:"Adventurer’s notes",story:"A letter to the Rogue Witch",finale:"The birthday blessing",settings:"Map & adventure settings"})[name]||"Adventure";
    shade.hidden=false;sheet.hidden=false;sheet.classList.add("is-open");
    body.scrollTop=0;sheet.querySelector("#rpg-close").focus();
  };
  const closePanel=()=>{sheet.classList.remove("is-open");sheet.hidden=true;shade.hidden=true;};
  hud.querySelectorAll("[data-panel]").forEach(button=>button.addEventListener("click",()=>openPanel(button.dataset.panel)));
  shade.addEventListener("click",closePanel);sheet.querySelector("#rpg-close").addEventListener("click",closePanel);
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!sheet.hidden)closePanel()});
  settings.querySelector("#rpg-print").addEventListener("click",()=>window.print());
  settings.querySelector("#rpg-reset").addEventListener("click",()=>{document.querySelector("#reset-progress").click();closePanel()});
  settings.querySelector("#rpg-finale").addEventListener("click",()=>openPanel("finale"));
  const oldBegin=content.story.querySelector('a[href="#quest"]');
  if(oldBegin)oldBegin.addEventListener("click",event=>{event.preventDefault();openPanel("quest")});
  const oldRender=renderProgress;
  renderProgress=function(){oldRender();const count=document.querySelector("#rpg-count");if(count)count.textContent=completed.length===chapters.length?"Adventure complete":`Chapter ${Math.min(completed.length+1,chapters.length)} of ${chapters.length}`};
  const oldMap=renderMap;
  renderMap=function(){oldMap();document.querySelectorAll(".map-pin").forEach(pin=>pin.addEventListener("click",()=>openPanel("quest")))};
  renderProgress();
  document.querySelectorAll(".hero-art .print-button").forEach(button=>button.remove());
})();


/* Geographically grounded overworld: real street placement with a car-free map fallback. */
let worldMap=null,worldPins=null,worldRequest=0;
function initWorldMap(L){
 if(worldMap)return;
 worldMap=L.map("world-map",{center:helenCenter,zoom:15,minZoom:12,maxZoom:19,zoomControl:false,scrollWheelZoom:false,preferCanvas:true});
 L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>",crossOrigin:true}).addTo(worldMap);
 worldPins=L.layerGroup().addTo(worldMap);
 L.control.zoom({position:"topright"}).addTo(worldMap);
 worldMap.whenReady(()=>document.querySelector(".map-canvas").classList.add("world-ready"));
 worldMap.on("tileerror",()=>document.querySelector(".map-canvas").classList.remove("world-ready"));
 setTimeout(()=>worldMap&&worldMap.invalidateSize(),100);
}
async function renderWorldMap(){
 if(portraitReady)return;
 const request=++worldRequest,L=await loadLeaflet();
 initWorldMap(L);
 const visible=chapters.slice(0,Math.min(completed.length,chapters.length-1)+1);
 const found=[];
 for(const chapter of visible){
  try{const point=await coordinatesFor(chapter);if(Number.isFinite(point[0])&&Number.isFinite(point[1])&&Math.abs(point[0]-helenCenter[0])<.1&&Math.abs(point[1]-helenCenter[1])<.1)found.push({chapter,point})}catch{/* Never fabricate a location if geocoding fails. */}
 }
 if(request!==worldRequest||!worldMap)return;
 worldPins.clearLayers();
 found.forEach(({chapter,point})=>{
  const index=chapters.indexOf(chapter),visited=completed.includes(chapter.id);
  const icon=L.divIcon({className:"quest-pin-icon",html:`<span class="street-quest-pin${visited?" visited":" current"}">${visited?"✓":index+1}</span>`,iconSize:[40,46],iconAnchor:[20,42]});
  L.marker(point,{icon,title:chapter.title}).on("click",()=>{selected=chapter;renderProgress();document.querySelector('[data-panel="quest"]')?.click()}).addTo(worldPins);
 });
 const active=found.find(x=>x.chapter.id===selected.id);
 if(active)worldMap.setView(active.point,16,{animate:false});
 else worldMap.setView(helenCenter,15,{animate:false});
}
const previousWorldProgress=renderProgress;
renderProgress=function(){previousWorldProgress();renderWorldMap().catch(()=>{/* illustrated map remains as offline fallback */})};
renderWorldMap().catch(()=>{});
