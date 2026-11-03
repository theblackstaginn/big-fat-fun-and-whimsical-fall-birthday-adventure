const chapters = [
  {id:"candle",title:"Crafty Mountain Candle Co.",subtitle:"The First Flame",address:"705 Brucken Strasse, Building 101, Helen, GA 30545",streetQuery:"Crafty Mountain Candle Co., 705 Brucken Strasse, Building 101, Helen, GA 30545",hours:"Monday 11:30 a.m.–3 p.m. · candle bar ~1 hour · reserve ahead",duration:"Aim for the first available Monday workshop, ideally 11:30 a.m.; confirm booking and candle pickup.",description:"Jess’s birthday adventure begins at the candle bar. Choose fragrances, blend a little mountain magic, and make a keepsake to carry home. The shop closes at 3 p.m. on Monday, so book an early session. When the flame is made, head south along Main Street to find your friends at Ruby Mae’s.",clue:"Before any other destination reveals itself, craft a flame to remember this day.",google:"https://www.google.com/maps/search/?api=1&query=Crafty+Mountain+Candle+Co%2C+Helen%2C+GA",apple:"https://maps.apple.com/?q=Crafty+Mountain+Candle+Co%2C+Helen%2C+GA"},
  {id:"ruby",title:"Ruby Mae’s",subtitle:"The Gathering of Friends",address:"8160 S Main St, Unit A-4, Helen, GA 30545",streetQuery:"8160 S Main St, Unit A-4, Helen, GA 30545",hours:"After the candle workshop · confirm meet-up with friends",duration:"Give yourselves room to catch up and enjoy the keepsake waiting here.",description:"With your newly crafted candle, journey south to Ruby Mae’s, where old friends and a special birthday keepsake await. This is the warm-hearted gathering after the workshop. When ready, continue through South Main’s curiosities, then turn north toward downtown for the evening.",clue:"Where mountain lore and beloved friends gather, another page of the day unfolds.",google:"https://www.google.com/maps/search/?api=1&query=8160+S+Main+St+Unit+A-4%2C+Helen%2C+GA+30545",apple:"https://maps.apple.com/?q=Ruby+Mae%27s+Appalachian+Alchemy%2C+8160+S+Main+St+Unit+A-4%2C+Helen%2C+GA+30545"},
  {id:"wonderland",title:"Wonderland Antiques & Curiosities",subtitle:"The Cabinet of Curious Things",address:"8251 S Main St, Helen, GA 30545",streetQuery:"8251 S Main St, Helen, GA 30545",hours:"Monday hours unconfirmed · call ahead",duration:"A short South Main visit after Ruby Mae’s; use an exterior clue if closed.",description:"Explore Wonderland’s treasures on South Main after Ruby Mae’s. Confirm its Monday hours before planning an indoor visit; if the door is closed, the outdoor clue still lets the quest continue without a second long journey. After this stop, follow Main Street north toward the old-world village.",clue:"Seek a curious detail upon the doorway, whether the cabinet is open or sleeping.",google:"https://www.google.com/maps/search/?api=1&query=Wonderland+Antiques+%26+Curiosities%2C+8251+S+Main+St%2C+Helen%2C+GA+30545",apple:"https://maps.apple.com/?q=Wonderland+Antiques+%26+Curiosities%2C+8251+S+Main+St%2C+Helen%2C+GA+30545"},
  {id:"town",title:"The Curiosity Walk",subtitle:"Glass, Crystals & Village Treasures",address:"Glassblowing Shop: 8600 N Main St · ZuZu’s Petals: 8660 N Main St",streetQuery:"The Glassblowing Shop, 8600 N Main St, Helen, GA 30545",hours:"Alpine Festival lists Monday 10 a.m.–6 p.m.; verify other shop hours",duration:"Allow an unrushed hour or two; browse only what’s open and inviting.",description:"Return north into the denser Bavarian village and browse whichever shops are open: handcrafted glass at The Glassblowing Shop, stones and crystals at ZuZu’s Petals, and the little storefronts between. The quest moves through town toward the river and later to the northern park.",clue:"Seek a little color caught in glass, a stone with a story, and a shop you didn’t plan to find.",google:"https://www.google.com/maps/search/?api=1&query=Glassblowing+Shop%2C+8600+N+Main+St%2C+Helen%2C+GA+30545",apple:"https://maps.apple.com/?q=Glassblowing+Shop%2C+8600+N+Main+St%2C+Helen%2C+GA+30545"},
  {id:"river",title:"The Chattahoochee Pause",subtitle:"A Moment by the Water",address:"Fussen Platz / River Street, downtown Helen",streetQuery:"Chattahoochee River at Helen, GA",hours:"Short public river paths before dusk · sunset ~5:29 p.m. on November 16",duration:"A short daylight riverside pause; avoid unlit trails.",description:"Pause near the downtown river crossings and public paths to listen to the Chattahoochee before evening. The sun sets around 5:29 p.m. on November 16. Keep this gentle detour near town and head toward dinner before dark; no trail hike is required.",clue:"Listen to the river carry the autumn leaves and choose one small wish to take with you.",google:"https://www.google.com/maps/search/?api=1&query=Chattahoochee+River+downtown+Helen+GA",apple:"https://maps.apple.com/?q=Chattahoochee+River+downtown+Helen+GA"},
  {id:"dinner",title:"Bavarian Birthday Dinner",subtitle:"The Hearthside Feast",address:"The Heidelberg · 8660 N Main St, Helen, GA 30545",streetQuery:"The Heidelberg, 8660 N Main St, Helen, GA 30545",hours:"Monday 11 a.m.–9 p.m. listed · confirm seating",duration:"Enjoy the birthday feast on North Main; verify the restaurant’s seating policy.",description:"Continue north to the Heidelberg for an unhurried Bavarian birthday feast, warm lights, and stories of the day. Confirm the restaurant’s current Monday seating or reservation policy before the visit. After dinner, gather one more sweet treasure, then head toward the park for the finale.",clue:"When the lanterns wake and the long day softens, follow the music to supper.",google:"https://www.google.com/maps/search/?api=1&query=The+Heidelberg%2C+8660+N+Main+St%2C+Helen%2C+GA+30545",apple:"https://maps.apple.com/?q=The+Heidelberg%2C+8660+N+Main+St%2C+Helen%2C+GA+30545"},
  {id:"sweet",title:"The Sweet Interlude",subtitle:"A Chocolate Treasure",address:"Hansel & Gretel Candy Kitchen · 8651 N Main St, Helen, GA 30545",streetQuery:"Hansel & Gretel Candy Kitchen, 8651 N Main St, Helen, GA 30545",hours:"Monday hours vary by season · check with the shop",duration:"A short North Main sweets stop before the final park-side chapter.",description:"Find a little chocolate, fudge, or something sweet near the North Main dining area, if the shop is still open. This is not the last page. The Moonlit Finale waits a little farther along, near Unicoi Hill Park.",clue:"Find a sweet treasure to carry into the evening’s final chapter.",google:"https://www.google.com/maps/search/?api=1&query=Hansel+%26+Gretel+Candy+Kitchen%2C+Helen%2C+GA",apple:"https://maps.apple.com/?q=Hansel+%26+Gretel+Candy+Kitchen%2C+Helen%2C+GA"},
  {id:"park",title:"The Moonlit Finale",subtitle:"A Wish Beneath the Copper Moon",address:"Unicoi Hill Park area · N Main St / Pete’s Park Rd, Helen, GA 30545",streetQuery:"Unicoi Hill Park, Helen, GA 30545",hours:"Nighttime park access not confirmed · public Main Street is the fallback",duration:"An unhurried birthday ending near the park and northern village lights.",description:"The final quest ends around Unicoi Hill Park on the northern edge of downtown. If the park and gazebo are open to visitors, share a quiet birthday moment there. If park access is restricted after dark, finish safely on public Main Street nearby instead. No unlit paths or trails are required. The real treasure has been beside you all day.",clue:"Where the village grows quiet beneath the copper moon, whisper a wish for the year to come.",google:"https://www.google.com/maps/search/?api=1&query=Unicoi+Hill+Park%2C+Helen%2C+GA",apple:"https://maps.apple.com/?q=Unicoi+Hill+Park%2C+Helen%2C+GA"},
];
const list=document.querySelector("#chapter-list"),storeKey="jess-birthday-quest-progress-v2";
function readProgress(){try{const saved=JSON.parse(localStorage.getItem(storeKey)||"[]");if(!Array.isArray(saved))return[];const prefix=[];for(const chapter of chapters){if(!saved.includes(chapter.id))break;prefix.push(chapter.id)}return prefix}catch{return[]}}
function saveProgress(){try{localStorage.setItem(storeKey,JSON.stringify(completed))}catch{/* progress still works for this open page */}}
let completed=readProgress(),currentIndex=Math.min(completed.length,chapters.length-1),selected=chapters[currentIndex];

/* Each scene opens only when the FIRST quest within it is revealed.
 * Artwork for future scenes must not even be fetched beforehand.
 * These are scene boundaries, not extra quest-completion requirements. */
const adventureScenes=Object.freeze([
 {id:"little-flame",number:"I",title:"The First Flame",startChapter:0},
 {id:"gathering",number:"II",title:"The Gathering",startChapter:1},
 {id:"curious-village",number:"III",title:"The Curious Village",startChapter:3},
 {id:"riverside-finale",number:"IV",title:"The Lanternlit North End",startChapter:4}
]);
function sceneForChapter(chapter){
 const chapterNumber=Math.max(0,chapters.indexOf(chapter));
 for(let i=adventureScenes.length-1;i>=0;i--)if(chapterNumber>=adventureScenes[i].startChapter)return adventureScenes[i];
 return adventureScenes[0];
}
function activeScene(){
 const scene=sceneForChapter(selected);
 return completed.length>=scene.startChapter?scene:adventureScenes[0];
}

/* The preexisting downtown image belongs only to Scene III.
 * Scenes I, II and IV use the truthful geographic map until their own
 * locally verified illustrations are ready; never show downtown as South Main. */
const portraitArtwork=document.querySelector("#portrait-overworld");
let portraitReady=false,portraitRequested=false;
function sceneArtworkVisible(){return !!portraitArtwork&&portraitReady&&!portraitArtwork.hidden;}
function updateSceneArtwork(){
 if(!portraitArtwork)return;
 const eligible=activeScene().id==="curious-village"&&completed.length>=3;
 if(eligible&&!portraitRequested&&portraitArtwork.dataset.sceneSrc){
  portraitRequested=true;portraitArtwork.src=portraitArtwork.dataset.sceneSrc;
 }
 const show=eligible&&portraitReady;
 portraitArtwork.hidden=!show;
 document.querySelector(".map-canvas")?.classList.toggle("portrait-loaded",show);
}
if(portraitArtwork){
 portraitArtwork.addEventListener("load",()=>{
  if(!portraitArtwork.naturalWidth)return;
  portraitReady=true;
  updateSceneArtwork();
  renderProgress();
 });
 portraitArtwork.addEventListener("error",()=>{
  portraitReady=false;
  updateSceneArtwork();
  renderProgress();
 });
 updateSceneArtwork();
}
/* Remove hand-positioned pins and paths from the old SVG-map system.
 * Real-world quest markers remain in Leaflet and MapLibre. */
function renderMap(){
 document.querySelector("#map-hotspots")?.replaceChildren();
 document.querySelector("#trail-visited")?.setAttribute("d","");
 document.querySelector("#trail-to-next")?.setAttribute("d","");
}
function renderList(){list.replaceChildren();const unlockedThrough=Math.min(completed.length,chapters.length-1);chapters.slice(0,unlockedThrough+1).forEach((chapter,index)=>{const button=document.createElement("button");button.type="button";button.className="chapter-button"+(completed.includes(chapter.id)?" is-complete":"");button.setAttribute("aria-current",chapter.id===selected.id?"true":"false");button.innerHTML=`<span class="chapter-number">${completed.includes(chapter.id)?"✓":String(index+1).padStart(2,"0")}</span><span><span class="chapter-name">${chapter.title}</span><span class="chapter-subtitle">${chapter.subtitle}</span></span><span class="chapter-state" aria-hidden="true">${chapter.id===selected.id?"✦":"›"}</span>`;button.addEventListener("click",()=>{selected=chapter;renderProgress()});list.append(button)});for(let i=unlockedThrough+1;i<chapters.length;i++){const locked=document.createElement("div");locked.className="fog-slot";locked.setAttribute("aria-label","Unrevealed location; complete the current chapter to reveal it");locked.innerHTML='<span class="fog-lock" aria-hidden="true">⌑</span><span class="fog-copy">Uncharted trail<span class="fog-caption">Complete the revealed chapter to discover this place</span></span><span aria-hidden="true">· · ·</span>';list.append(locked)}}
function renderDetail(){const i=chapters.indexOf(selected),isDone=completed.includes(selected.id);document.querySelector("#detail-kicker").textContent=isDone?`CHAPTER ${String(i+1).padStart(2,"0")} · EXPLORED`:`CHAPTER ${String(i+1).padStart(2,"0")} · CURRENT CHAPTER`;document.querySelector("#detail-title").textContent=selected.title;document.querySelector("#detail-description").textContent=selected.description;document.querySelector("#detail-clue").textContent=selected.clue;document.querySelector("#detail-meta").innerHTML=`<span><strong>Where:</strong> ${selected.address}</span><span><strong>When:</strong> ${selected.hours}</span><span><strong>Pace:</strong> ${selected.duration}</span>`;document.querySelector("#detail-directions").innerHTML=`<a href="${selected.google}" target="_blank" rel="noopener">Open Google Maps ↗</a><a href="${selected.apple}" target="_blank" rel="noopener">Open Apple Maps ↗</a>`;const button=document.querySelector("#complete-button");button.disabled=isDone;button.textContent=isDone?(completed.length===chapters.length?"Adventure complete":"Place explored ✓"):"Mark this place visited · reveal next";button.setAttribute("aria-pressed",String(isDone))}
let streetMap=null,streetPins=null,leafletPromise=null,geocodeChain=Promise.resolve(),lastGeocodeAt=0,mapRenderId=0;const geocodePending=new Map(),geocodeKey="jess-birthday-map-coordinates-v1",helenCenter=[34.7012,-83.7246];
const homeTestLocation={lat:34.564025725501,lng:-83.673061413538,address:"774 Will Hambrick Rd, Cleveland, GA 30528"};
const CLEVELAND_HOME_SCENE={
 extent:{west:-83.6735,south:34.5636,east:-83.6726,north:34.5645},
 buildings:[
  {height:7.4,pixels:[[674,90],[678,250],[554,266],[538,117]],roof:"#8d4935"},
  {height:4.8,pixels:[[446,329],[596,339],[607,388],[456,379]],roof:"#744537"},
  {height:3.8,pixels:[[516,409],[644,413],[658,456],[524,452]],roof:"#98604a"}
 ],
 trees:[
  [286,85],[370,55],[765,55],[842,105],[192,300],[226,376],[205,456],[267,526],
  [362,593],[408,662],[754,293],[844,351],[919,465],[821,562],[775,635],[916,681],
  [471,758],[535,864],[408,920],[120,842],[48,652],[96,512],[278,172],[915,235]
 ]
};
let streetHomeControl=null,neighborhoodHomeControl=null;
function ensurePlayerTestStyles(){
 if(document.querySelector("#rpg-player-test-styles"))return;
 const style=document.createElement("style");style.id="rpg-player-test-styles";
 style.textContent=".rpg-home-marker-shell,.rpg-player-marker-shell{background:transparent!important;border:0!important}.rpg-home-marker{width:34px;height:38px;display:grid;place-items:center;background:#80502f;border:2px solid #f2d58f;border-radius:50% 50% 50% 5px;transform:rotate(-45deg);box-shadow:0 3px 9px #17110db3;color:#f8e9c7}.rpg-home-marker svg{width:19px;height:19px;transform:rotate(45deg)}.rpg-location-controls svg{width:20px;height:20px;display:block;margin:auto}.rpg-player-marker{width:36px;height:36px;display:grid;place-items:center;background:#315a56;border:3px solid #f2d58f;border-radius:50%;box-shadow:0 2px 9px #17110dcc;color:#fff4d7}.rpg-player-marker svg{width:20px;height:20px}.rpg-location-controls{display:flex;gap:3px;padding:3px!important;background:#38271fd9!important}.rpg-location-controls button{width:40px;height:38px;padding:0;border:0;background:#f5e7c8;color:#39271d;font:700 21px/1 Georgia,serif;cursor:pointer}.rpg-location-controls button:focus-visible{outline:3px solid #c18d45;outline-offset:1px}.maplibregl-ctrl-group.rpg-location-controls{display:flex}.maplibregl-ctrl-group.rpg-location-controls button{border-radius:2px}.rpg-player-marker-shell{z-index:20!important}";
 style.textContent+=".rpg-home-tree-shell{background:transparent!important;border:0!important}.rpg-home-tree{position:absolute;left:50%;bottom:3px;transform:translateX(-50%);width:var(--tree-size);height:calc(var(--tree-size)*.82);filter:drop-shadow(1px 2px 1px #24291e88)}.rpg-home-tree:before{content:'';position:absolute;left:50%;bottom:-3px;transform:translateX(-50%);width:27%;height:30%;background:#59422c;border-radius:2px}.rpg-home-tree i,.rpg-home-tree b{position:absolute;left:50%;transform:translateX(-50%);display:block;width:100%;height:68%;bottom:20%;background:var(--tree-color);clip-path:polygon(50% 0,97% 78%,83% 89%,100% 100%,0 100%,17% 88%,3% 78%)}.rpg-home-tree b{width:68%;height:50%;bottom:42%;filter:brightness(1.12)}.rpg-home-tree i{box-shadow:inset -5px 0 #0002}.rpg-home-tree-shell{z-index:650!important}";style.textContent+=".maplibregl-ctrl-top-right .rpg-location-controls{margin-top:430px!important;margin-right:8px!important}.leaflet-top.leaflet-right .rpg-location-controls{margin-top:430px!important;margin-right:8px!important}";document.head.append(style);
}
function homePixelToLatLng(pixel){
 const e=CLEVELAND_HOME_SCENE.extent,[x,y]=pixel;
 return [e.north-(y/1024)*(e.north-e.south),e.west+(x/1024)*(e.east-e.west)];
}
function renderClevelandHomeSceneLeaflet(L){
 if(!streetTerrain||streetTerrain.__homeSceneAdded)return;
 streetTerrain.__homeSceneAdded=true;
 const pane=streetMap.getPane("village-geometry");
 const buildings=L.layerGroup(),trees=L.layerGroup();
 for(const building of CLEVELAND_HOME_SCENE.buildings){
  const roof=building.pixels.map(homePixelToLatLng);
  const wall=roof.map(([lat,lng])=>[lat-0.000018,lng+0.000012]);
  roof.forEach((point,index)=>{const following=roof[(index+1)%roof.length];const lower=wall[index],lowerFollowing=wall[(index+1)%wall.length];L.polygon([point,following,lowerFollowing,lower],{pane:"village-geometry",stroke:false,fillColor:"#49362a",fillOpacity:.94,interactive:false}).addTo(buildings)});
  L.polygon(roof,{pane:"village-geometry",color:"#583729",weight:1.1,opacity:.92,fillColor:building.roof,fillOpacity:1,interactive:false}).addTo(buildings);
  const ridge=roof.slice(0,2);
  L.polyline(ridge,{pane:"village-geometry",color:"#c17a51",weight:1.2,opacity:.6,interactive:false}).addTo(buildings);
 }
 const palette=["#9b4f31","#b56b2e","#6c7642","#4d6855","#8b6b36"];
 CLEVELAND_HOME_SCENE.trees.forEach((pixel,index)=>{
  const point=homePixelToLatLng(pixel),color=palette[(index*7+Math.floor(pixel[0]/100))%palette.length];
  const size=20+(index%4)*2;
  const html='<span class="rpg-home-tree" style="--tree-color:'+color+';--tree-size:'+size+'px"><i></i><b></b></span>';
  const icon=L.divIcon({className:"rpg-home-tree-shell",html,iconSize:[size+14,size+15],iconAnchor:[(size+14)/2,size+11]});
  L.marker(point,{pane:"markerPane",icon,keyboard:false,interactive:false,zIndexOffset:120}).addTo(trees);
 });
 buildings.addTo(streetTerrain);trees.addTo(streetTerrain);
}
function homePixelToLngLat(pixel){
 const [lat,lng]=homePixelToLatLng(pixel);return [lng,lat];
}
function homeSceneFeatureCollection(){
 const features=[];
 for(const building of CLEVELAND_HOME_SCENE.buildings){
  const ring=building.pixels.map(homePixelToLngLat);ring.push(ring[0]);
  features.push({type:"Feature",properties:{kind:"building",roof:building.roof,height:building.height},geometry:{type:"Polygon",coordinates:[ring]}});
 }
 const treeVariants=["maple-rust","maple-amber","oak-moss","pine-green","maple-gold"];
 CLEVELAND_HOME_SCENE.trees.forEach((pixel,index)=>{
  const variation=(index*7+Math.floor(pixel[0]/100))%treeVariants.length;
  features.push({type:"Feature",properties:{kind:"tree",sprite:treeVariants[variation],scale:.78+(index%4)*.1},geometry:{type:"Point",coordinates:homePixelToLngLat(pixel)}});
 });
 return {type:"FeatureCollection",features};
}
function makeHomeTreeSprite(color,kind){
 const canvas=document.createElement("canvas");canvas.width=52;canvas.height=64;
 const ctx=canvas.getContext("2d");if(!ctx)return null;
 ctx.fillStyle="rgba(40,34,26,.25)";ctx.beginPath();ctx.ellipse(26,57,14,4,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#62472e";ctx.fillRect(23,43,6,12);
 if(kind==="pine"){
  ctx.fillStyle=color;
  [[26,5,13],[26,17,19],[26,31,24]].forEach(([x,y,w])=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y+26);ctx.lineTo(x-w,y+26);ctx.closePath();ctx.fill()});
  ctx.fillStyle="rgba(255,231,180,.18)";
  [[26,5,13],[26,17,19],[26,31,24]].forEach(([x,y,w])=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-w*.3,y+20);ctx.lineTo(x-w*.68,y+23);ctx.closePath();ctx.fill()});
 }else{
  ctx.fillStyle=color;
  [[17,21,12],[31,16,13],[23,31,15],[37,31,10],[12,35,10],[28,42,13]].forEach(([x,y,r])=>{ctx.beginPath();ctx.moveTo(x-r,y+2);ctx.lineTo(x-r*.7,y-r*.48);ctx.lineTo(x-r*.1,y-r);ctx.lineTo(x+r*.65,y-r*.62);ctx.lineTo(x+r,y+3);ctx.lineTo(x+r*.4,y+r*.58);ctx.lineTo(x-r*.65,y+r*.55);ctx.closePath();ctx.fill()});
  ctx.fillStyle="rgba(255,230,174,.18)";
  [[17,21,12],[31,16,13],[23,31,15],[37,31,10],[12,35,10],[28,42,13]].forEach(([x,y,r])=>{ctx.beginPath();ctx.moveTo(x-r,y+2);ctx.lineTo(x-r*.7,y-r*.48);ctx.lineTo(x-r*.1,y-r);ctx.lineTo(x-r*.15,y+1);ctx.closePath();ctx.fill()});
 }
 return ctx.getImageData(0,0,canvas.width,canvas.height);
}
function installClevelandHomeMapLibreScene(map,vegetationBefore,symbolBefore){
 if(!map||map.getSource("birthday-cleveland-home-scene"))return;
 const data=homeSceneFeatureCollection();
 for(const [name,color,kind] of [
  ["maple-rust","#a64f32","deciduous"],["maple-amber","#c17b31","deciduous"],
  ["oak-moss","#778047","deciduous"],["pine-green","#405d50","pine"],["maple-gold","#c6a044","deciduous"]
 ]){
  if(map.hasImage(name))continue;
  const image=makeHomeTreeSprite(color,kind);if(image)map.addImage(name,image,{pixelRatio:2});
 }
 map.addSource("birthday-cleveland-home-scene",{type:"geojson",data});
 const firstSurface=vegetationBefore||symbolBefore;
 try{
  map.addLayer({
   id:"birthday-cleveland-home-trees",type:"symbol",source:"birthday-cleveland-home-scene",minzoom:15,
   filter:["==",["get","kind"],"tree"],
   layout:{"icon-image":["get","sprite"],"icon-size":["get","scale"],"icon-anchor":"bottom","icon-allow-overlap":true,"icon-ignore-placement":true,"symbol-z-order":"source"}
  },firstSurface);
 }catch{/* The home tree sprites are decorative; keep the street map available. */}
 try{
  map.addLayer({
   id:"birthday-cleveland-home-roof-footprints",type:"fill",source:"birthday-cleveland-home-scene",minzoom:15,
   filter:["==",["get","kind"],"building"],
   paint:{"fill-color":["get","roof"],"fill-outline-color":"#583729","fill-opacity":1}
  },symbolBefore);
 }catch{/* Keep the road map available if an optional roof fill is unsupported. */}
 try{
  map.addLayer({
   id:"birthday-cleveland-home-buildings",type:"fill-extrusion",source:"birthday-cleveland-home-scene",minzoom:15,
   filter:["==",["get","kind"],"building"],
   paint:{"fill-extrusion-color":["get","roof"],"fill-extrusion-height":["get","height"],"fill-extrusion-base":0,"fill-extrusion-opacity":1,"fill-extrusion-vertical-gradient":true}
  },symbolBefore);
 }catch{/* The home roofs are decorative; keep the street map available. */}
}
function homeIconSvg(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.2 12 4l9 7.2M5.7 9.1V20h12.6V9.1M9.5 20v-6.2h5V20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
function returnIconSvg(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 3.5 10.5 9 16M4 10.5h9a7 7 0 0 1 0 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 -2)"/></svg>'}
function playerMarkerSvg(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5" fill="currentColor"/><path d="M5.2 21v-2.1a6.8 6.8 0 0 1 13.6 0V21z" fill="currentColor"/></svg>'}
/* Opt-in GPS player marker. Location is never written to quest progress. */
let livePlayerPoint=null,playerWatchId=null,playerFollow=false,gpsSession=0;
let liveStreetMarker=null,liveWorldMarker=null,liveVillageMarker=null;
function makeLiveLeafletIcon(L){
 ensurePlayerTestStyles();
 return L.divIcon({className:"rpg-player-marker-shell",html:'<span class="rpg-player-marker" aria-hidden="true">'+playerMarkerSvg()+'</span>',iconSize:[38,38],iconAnchor:[19,19]});
}
function syncLivePlayerMarkers(){
 if(!livePlayerPoint)return;
 const point=livePlayerPoint;
 if(streetMap&&streetPins&&window.L){
  if(!liveStreetMarker||!streetPins.hasLayer(liveStreetMarker)){
   liveStreetMarker=window.L.marker(point,{icon:makeLiveLeafletIcon(window.L),title:"Your live GPS position",keyboard:true,zIndexOffset:950}).bindPopup("You are here · live GPS location").addTo(streetPins);
  }else liveStreetMarker.setLatLng(point);
 }
 if(worldMap&&window.L){
  if(!liveWorldMarker){
   liveWorldMarker=window.L.marker(point,{icon:makeLiveLeafletIcon(window.L),title:"Your live GPS position",keyboard:true,zIndexOffset:950}).bindPopup("You are here · live GPS location").addTo(worldMap);
  }else liveWorldMarker.setLatLng(point);
 }
 if(neighborhoodMap&&window.maplibregl){
  if(!liveVillageMarker){
   const marker=document.createElement("div");
   marker.className="rpg-player-marker-shell";
   marker.setAttribute("role","img");
   marker.setAttribute("aria-label","Your live GPS location");
   marker.innerHTML='<span class="rpg-player-marker" aria-hidden="true">'+playerMarkerSvg()+'</span>';
   liveVillageMarker=new window.maplibregl.Marker({element:marker,anchor:"center"}).setLngLat([point[1],point[0]]).setPopup(new window.maplibregl.Popup({offset:24}).setText("You are here · live GPS location")).addTo(neighborhoodMap);
  }else liveVillageMarker.setLngLat([point[1],point[0]]);
 }
}
function clearLivePlayerMarkers(){
 if(liveStreetMarker&&streetPins)streetPins.removeLayer(liveStreetMarker);
 if(liveWorldMarker)liveWorldMarker.remove();
 if(liveVillageMarker)liveVillageMarker.remove();
 liveStreetMarker=liveWorldMarker=liveVillageMarker=null;
}
function setGpsControls(message){
 const follow=document.querySelector("#rpg-locate"),stop=document.querySelector("#rpg-stop-location"),status=document.querySelector("#rpg-gps-status");
 if(follow){follow.textContent="⌖";follow.title=playerWatchId===null?"Locate me":"Follow my location";follow.setAttribute("aria-label",follow.title);follow.setAttribute("aria-pressed",String(playerWatchId!==null&&playerFollow));}
 if(stop)stop.hidden=playerWatchId===null;
 if(status&&message){status.textContent=message;status.dataset.state=/(denied|unavailable|needs|unable|timed out)/i.test(message)?"error":"normal";}
}
function onPlayerMapDragged(){
 if(playerWatchId===null||!playerFollow)return;
 playerFollow=false;
 setGpsControls("GPS active · map free");
}
function centerOnLivePlayer(){
 if(!livePlayerPoint)return;
 const nearby=document.querySelector("#nearby-view");
 if(nearby&&!nearby.hidden){
  if(neighborhoodMap&&nearby.classList.contains("vector-ready")){
   neighborhoodMap.easeTo({center:[livePlayerPoint[1],livePlayerPoint[0]],zoom:Math.max(neighborhoodMap.getZoom(),17.5),duration:450});
  }else if(streetMap)streetMap.setView(livePlayerPoint,Math.max(streetMap.getZoom(),17),{animate:true});
 }else if(worldMap)worldMap.setView(livePlayerPoint,Math.max(worldMap.getZoom(),16),{animate:true});
}
function stopLivePlayerTracking(){
 gpsSession++;
 if(playerWatchId!==null&&navigator.geolocation)navigator.geolocation.clearWatch(playerWatchId);
 playerWatchId=null;playerFollow=false;livePlayerPoint=null;
 clearLivePlayerMarkers();
 setGpsControls("Location off");
}
function startLivePlayerTracking(){
 if(playerWatchId!==null){
  playerFollow=true;
  if(document.querySelector("#nearby-view")?.hidden)setMapMode("nearby");
  centerOnLivePlayer();
  setGpsControls(livePlayerPoint?"Following your position":"Waiting for GPS…");
  return;
 }
 if(!window.isSecureContext||!navigator.geolocation){setGpsControls("GPS needs HTTPS and location permission");return;}
 playerFollow=true;
 const session=++gpsSession;
 try{
  playerWatchId=navigator.geolocation.watchPosition(
   position=>{
    if(session!==gpsSession||playerWatchId===null)return;
    const latitude=Number(position.coords.latitude),longitude=Number(position.coords.longitude);
    if(!Number.isFinite(latitude)||!Number.isFinite(longitude))return;
    const firstFix=livePlayerPoint===null;
    livePlayerPoint=[latitude,longitude];
    /* The portrait overview is not georeferenced. Open real streets on the first fix only. */
    if(firstFix&&document.querySelector("#nearby-view")?.hidden)setMapMode("nearby");
    syncLivePlayerMarkers();
    if(playerFollow)centerOnLivePlayer();
    const accuracy=Number(position.coords.accuracy);
    setGpsControls(Number.isFinite(accuracy)?"GPS active · ±"+Math.round(accuracy)+" m":"GPS active");
   },
   error=>{
    if(session!==gpsSession)return;
    if(error.code===1){
     stopLivePlayerTracking();
     setGpsControls("Location denied · check browser settings");
    }else setGpsControls(error.code===3?"GPS timed out · retrying":"GPS unavailable · retrying");
   },
   {enableHighAccuracy:true,maximumAge:5000,timeout:20000}
  );
  setGpsControls("Finding your location…");
 }catch{
  stopLivePlayerTracking();
  setGpsControls("Unable to start GPS");
 }
}
function addLeafletHomePlayerMarkers(L,map,layer){
 ensurePlayerTestStyles();
 const point=[homeTestLocation.lat,homeTestLocation.lng];
 const home=L.divIcon({className:"rpg-home-marker-shell",html:'<span class="rpg-home-marker" aria-hidden="true">'+homeIconSvg()+'</span>',iconSize:[48,46],iconAnchor:[44,43]});
 L.marker(point,{icon:home,title:"Home test location",keyboard:true,zIndexOffset:800}).bindPopup("<strong>Home test location</strong><br>"+homeTestLocation.address).addTo(layer);
}
function ensureLeafletHomeControl(L,map,questPoint){
 ensurePlayerTestStyles();
 if(streetHomeControl){streetHomeControl.questPoint=questPoint;return}
 const control=L.control({position:"topright"});
 control.questPoint=questPoint;
 control.onAdd=function(){
  const wrap=L.DomUtil.create("div","leaflet-bar rpg-location-controls");
  wrap.innerHTML='<button type="button" aria-label="Show home location" title="Show home location"><span aria-hidden="true">'+homeIconSvg()+'</span></button><button type="button" aria-label="Return to current quest" title="Return to current quest"><span aria-hidden="true">'+returnIconSvg()+'</span></button>';
  L.DomEvent.disableClickPropagation(wrap);
  L.DomEvent.on(wrap.children[0],"click",event=>{L.DomEvent.preventDefault(event);onPlayerMapDragged();map.setView([homeTestLocation.lat,homeTestLocation.lng],18.5,{animate:true})});
  L.DomEvent.on(wrap.children[1],"click",event=>{L.DomEvent.preventDefault(event);onPlayerMapDragged();map.setView(control.questPoint||helenCenter,17,{animate:true})});
  return wrap;
 };
 control.addTo(map);streetHomeControl=control;
}
function addMapLibreHomePlayerMarkers(ml,map){
 ensurePlayerTestStyles();
 const home=document.createElement("button");home.type="button";home.className="rpg-home-marker-shell";home.setAttribute("aria-label","Home test location");
 home.innerHTML='<span class="rpg-home-marker" aria-hidden="true">'+homeIconSvg()+'</span>';
 const homeMarker=new ml.Marker({element:home,anchor:"bottom",offset:[-16,0]}).setLngLat([homeTestLocation.lng,homeTestLocation.lat]).setPopup(new ml.Popup({offset:28}).setText("Home test location · "+homeTestLocation.address)).addTo(map);
 neighborhoodPins.push(homeMarker);
}
function ensureMapLibreHomeControl(ml,map,questCenter){
 ensurePlayerTestStyles();
 if(neighborhoodHomeControl){neighborhoodHomeControl.questCenter=[questCenter[1],questCenter[0]];return}
 const control={
  questCenter:[questCenter[1],questCenter[0]],
  onAdd(mapInstance){
   this.map=mapInstance;
   this.container=document.createElement("div");this.container.className="maplibregl-ctrl maplibregl-ctrl-group rpg-location-controls";
   this.container.innerHTML='<button type="button" aria-label="Show home location" title="Show home location"><span aria-hidden="true">'+homeIconSvg()+'</span></button><button type="button" aria-label="Return to current quest" title="Return to current quest"><span aria-hidden="true">'+returnIconSvg()+'</span></button>';
   this.container.children[0].addEventListener("click",()=>{onPlayerMapDragged();mapInstance.flyTo({center:[homeTestLocation.lng,homeTestLocation.lat],zoom:18.5,pitch:42})});
   this.container.children[1].addEventListener("click",()=>{onPlayerMapDragged();mapInstance.flyTo({center:this.questCenter,zoom:17,pitch:42})});
   return this.container;
  },
  onRemove(){this.container?.remove();this.map=null}
 };
 neighborhoodHomeControl=control;map.addControl(control,"top-right");
}

function setStreetStatus(message,show=true){const status=document.querySelector("#street-map-status");status.textContent=message;status.hidden=!show}
function loadLeaflet(){if(window.L)return Promise.resolve(window.L);if(leafletPromise)return leafletPromise;leafletPromise=new Promise((resolve,reject)=>{if(!document.querySelector("#leaflet-style")){const css=document.createElement("link");css.id="leaflet-style";css.rel="stylesheet";css.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.append(css)}const script=document.createElement("script");script.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";script.onload=()=>window.L?resolve(window.L):reject(new Error("Map library did not load"));script.onerror=()=>reject(new Error("Map library could not load"));document.head.append(script)}).catch(error=>{leafletPromise=null;throw error});return leafletPromise}
/* Approximate shopping-center anchor for Ruby Mae’s at 8160 S Main St.
 * Coordinate is published for another business at that same street address:
 * https://maps.roadtrippers.com/us/helen-ga/food-drink/campfire-helen
 * Keep the full Ruby Mae’s address in the quest journal for exact directions. */
const questAnchors=Object.freeze({ruby:[34.700059,-83.721920],park:[34.70286,-83.73157]});
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
  {url:new URL("assets/helen-painted-ground.png?v=20261103-ground21",document.baseURI).href,
   coordinates:[[-83.739,34.713],[-83.709,34.713],[-83.709,34.691],[-83.739,34.691]],minzoom:12},
  {url:new URL("assets/helen-painted-ground-downtown.png?v=20261103-ground21",document.baseURI).href,
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
 /* Place grass and tree geometry below mapped water, roads, footways, and buildings.
  * The first of these source layers is the z-order boundary; their actual map
  * geometry then draws over any imperfect NAIP edge or canopy classification. */
 const surfaceLayers=new Set(["water","waterway","transportation","building"]);
 const vegetationBefore=layers.find(layer=>surfaceLayers.has(layer["source-layer"]))?.id||symbolBefore;
  /* Map the home test parcel into the vector renderer too; this is the active iPhone path. */
  try{installClevelandHomeMapLibreScene(map,vegetationBefore,symbolBefore)}catch{/* Keep map navigation available if decoration fails. */}
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
   },vegetationBefore||roads?.id||symbolBefore);
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
   try{window.installHelenLandscaping(map,vectorSource,vegetationBefore)}
   catch{/* The core street map and existing roofs stay usable. */}
  }
  /* Full-coverage illustrated grass remains beneath mapped roads, paths, water, and buildings. */
  if(typeof window.installHelenTreeOverlay==="function"){
   const treeBefore=layers.find(layer=>layer["source-layer"]==="transportation"&&layer.type==="line")?.id||symbolBefore;
   try{window.installHelenTreeOverlay(map,treeBefore)}catch{/* Trees are decorative; retain map navigation. */}
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
  neighborhoodMap.on("error",event=>showAtlasDiagnostic("Map event: "+(event?.error?.message||"unknown"),true));neighborhoodMap.on("dragstart",onPlayerMapDragged);
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
 addMapLibreHomePlayerMarkers(ml,neighborhoodMap);
 ensureMapLibreHomeControl(ml,neighborhoodMap,center);
 nearby.classList.add("vector-ready");
 syncLivePlayerMarkers();
 if(playerFollow)centerOnLivePlayer();
 neighborhoodMap.resize();
 showAtlasDiagnostic("Vector neighborhood visible");
}

function initStreetMap(L){if(streetMap)return;streetMap=L.map("street-map",{center:helenCenter,zoom:15,scrollWheelZoom:false,zoomControl:true,preferCanvas:true});L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap contributors</a>",updateWhenIdle:true,keepBuffer:1}).addTo(streetMap);createMapGrid(L).addTo(streetMap);streetMap.createPane("village-geometry");streetMap.getPane("village-geometry").style.zIndex="430";streetMap.getPane("village-geometry").style.pointerEvents="none";streetTerrain=L.layerGroup().addTo(streetMap);streetPins=L.layerGroup().addTo(streetMap);streetMap.on("dragstart",onPlayerMapDragged);streetMap.on("tileload",()=>setStreetStatus("",false));streetMap.on("tileerror",()=>setStreetStatus("Map tiles need a connection. The chapter’s directions are below."));setTimeout(()=>streetMap&&streetMap.invalidateSize(),100)}
async function renderStreetMap(){const requestId=++mapRenderId,L=await loadLeaflet();initStreetMap(L);setStreetStatus("Finding this chapter on the real street map…");const visible=chapters.slice(0,Math.min(completed.length,chapters.length-1)+1),points=[];for(const chapter of visible){try{points.push({chapter,point:await coordinatesFor(chapter)})}catch(error){if(chapter.id===selected.id)throw error}}if(!streetMap||requestId!==mapRenderId)return;streetPins.clearLayers();liveStreetMarker=null;renderClevelandHomeSceneLeaflet(L);points.forEach(({chapter,point})=>{const index=chapters.indexOf(chapter),visited=completed.includes(chapter.id),icon=L.divIcon({className:"quest-pin-icon",html:`<span class="street-quest-pin${visited?" visited":" current"}">${visited?"✓":index+1}</span>`,iconSize:[40,46],iconAnchor:[20,42],popupAnchor:[0,-38]});L.marker(point,{icon,title:chapter.title,keyboard:true}).bindPopup(`<strong>${chapter.title}</strong><br>${chapter.subtitle}`).addTo(streetPins)});const current=points.find(item=>item.chapter.id===selected.id);addLeafletHomePlayerMarkers(L,streetMap,streetPins);syncLivePlayerMarkers();ensureLeafletHomeControl(L,streetMap,current?.point||helenCenter);if(current){streetMap.setView(current.point,17,{animate:!matchMedia("(prefers-reduced-motion: reduce)").matches});setStreetStatus("",false);if(playerFollow&&livePlayerPoint)centerOnLivePlayer();renderVillageAtlas(current.point,points).catch(error=>{showAtlasDiagnostic("Fallback: "+(error?.message||String(error)),true)})}else{streetMap.setView(helenCenter,15);setStreetStatus("This address could not be placed. Use the chapter’s directions below.")}}
function updateNearby(){const wasVisited=completed.includes(selected.id);document.querySelector("#nearby-context").textContent=wasVisited?"REAL STREETS · VISITED CHAPTER":"REAL STREETS · CURRENT CHAPTER";document.querySelector("#nearby-place").textContent=selected.title;document.querySelector("#nearby-address").textContent=selected.address;if(document.querySelector("#nearby-view").hidden)return;renderStreetMap().catch(error=>{setStreetStatus(`${error.message}. Use the chapter’s directions below.`)})}
function renderProgress(){currentIndex=Math.min(completed.length,chapters.length-1);if(!completed.includes(selected.id)&&chapters.indexOf(selected)>currentIndex)selected=chapters[currentIndex];updateSceneArtwork();const count=completed.length;document.querySelector("#progress-count").textContent=`${count} of ${chapters.length} places visited`;document.querySelector(".progress-track").setAttribute("aria-valuenow",String(count));document.querySelector("#progress-fill").style.width=`${count/chapters.length*100}%`;document.querySelector("#progress-message").textContent=count===chapters.length?"Adventure complete. Jess has explored the whole map. Roll credits; cue kisses.":count===0?"The opening place is revealed. Explore it to discover the path ahead.":`${count} place${count===1?"":"s"} explored. A new destination has appeared on your map.`;renderList();renderMap();renderDetail();updateNearby()}
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
  hud.innerHTML='<div class="rpg-topbar"><div class="rpg-brand"><span class="rpg-sigil" aria-hidden="true">☾</span><span class="rpg-title">The Rogue Witch’s <em>Excursion</em></span></div><div class="rpg-top-actions"><div class="rpg-gps-row"><button type="button" id="rpg-locate" aria-pressed="false" aria-label="Locate me" title="Locate me">⌖</button><span id="rpg-gps-status" role="status" aria-live="polite">Location off</span></div><button type="button" class="rpg-icon" data-panel="story" aria-label="Read the birthday dedication" title="A letter for Jess">♡</button></div></div><div class="rpg-bottom"><div class="rpg-progress" aria-live="polite"><span aria-hidden="true">✦</span> <span id="rpg-count">Chapter 1 of 7</span> <span aria-hidden="true">✦</span></div><nav class="rpg-toolbar" aria-label="Adventure controls"><button type="button" data-panel="quest" aria-label="Open quest journal"><span aria-hidden="true">✧</span><small>Journal</small></button><button type="button" data-panel="notes" aria-label="Open curiosities and notes"><span aria-hidden="true">❦</span><small>Curios</small></button><button type="button" data-panel="story" aria-label="Read the birthday letter"><span aria-hidden="true">♡</span><small>Letter</small></button><button type="button" data-panel="settings" aria-label="Open satchel and settings"><span aria-hidden="true">⚙</span><small>Satchel</small></button></nav></div>';
  art.append(hud);
  const shade=document.createElement("div");shade.className="rpg-shade";shade.hidden=true;
  const sheet=document.createElement("section");sheet.className="rpg-sheet";sheet.hidden=true;sheet.setAttribute("role","dialog");sheet.setAttribute("aria-modal","true");sheet.setAttribute("aria-label","Adventure journal");
  sheet.innerHTML='<div class="rpg-sheet-head"><strong id="rpg-sheet-title">The Witch’s Journal</strong><button type="button" id="rpg-close" aria-label="Close panel">✕</button></div><div class="rpg-sheet-body" id="rpg-sheet-body"></div>';
  document.body.append(shade,sheet);
  const body=sheet.querySelector("#rpg-sheet-body"),title=sheet.querySelector("#rpg-sheet-title");
  const content={quest:document.querySelector(".quest-section"),notes:document.querySelector(".field-notes"),story:document.querySelector(".hero-copy"),finale:document.querySelector(".finale")};
  const settings=document.createElement("div");settings.className="rpg-settings";settings.innerHTML='<p>Every witch needs a satchel. Your visited chapters stay tucked away on this device.</p><button type="button" id="rpg-stop-location" hidden>Stop GPS tracking</button><button type="button" id="rpg-print">Print the adventure map</button><button type="button" id="rpg-reset">Start the journey over</button><button type="button" id="rpg-finale">Read the birthday blessing</button>';
  const openPanel=(name)=>{
    const target=content[name]||settings;
    if(!target)return;
    body.replaceChildren(target);
    title.textContent=({quest:"The Rogue Witch’s Journal",notes:"Field Notes & Curios",story:"A Letter for Jess",finale:"The Birthday Blessing",settings:"The Adventurer’s Satchel"})[name]||"Adventure";
    shade.hidden=false;sheet.hidden=false;sheet.classList.add("is-open");
    body.scrollTop=0;sheet.querySelector("#rpg-close").focus();
  };
  const closePanel=()=>{sheet.classList.remove("is-open");sheet.hidden=true;shade.hidden=true;};
  hud.querySelectorAll("[data-panel]").forEach(button=>button.addEventListener("click",()=>openPanel(button.dataset.panel)));
  hud.querySelector("#rpg-locate").addEventListener("click",startLivePlayerTracking);
  settings.querySelector("#rpg-stop-location").addEventListener("click",()=>{stopLivePlayerTracking();closePanel()});
  window.addEventListener("pagehide",stopLivePlayerTracking);
  shade.addEventListener("click",closePanel);sheet.querySelector("#rpg-close").addEventListener("click",closePanel);
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!sheet.hidden)closePanel()});
  settings.querySelector("#rpg-print").addEventListener("click",()=>window.print());
  settings.querySelector("#rpg-reset").addEventListener("click",()=>{document.querySelector("#reset-progress").click();closePanel()});
  settings.querySelector("#rpg-finale").addEventListener("click",()=>openPanel("finale"));
  const oldBegin=content.story.querySelector('a[href="#quest"]');
  if(oldBegin)oldBegin.addEventListener("click",event=>{event.preventDefault();openPanel("quest")});
  const oldRender=renderProgress;
  renderProgress=function(){oldRender();const count=document.querySelector("#rpg-count");if(count)count.textContent=completed.length===chapters.length?"Adventure complete":`Scene ${activeScene().number} · Chapter ${Math.min(completed.length+1,chapters.length)} of ${chapters.length}`};
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
 worldPins=L.layerGroup().addTo(worldMap);worldMap.on("dragstart",onPlayerMapDragged);
 L.control.zoom({position:"topright"}).addTo(worldMap);
 worldMap.whenReady(()=>document.querySelector(".map-canvas").classList.add("world-ready"));
 worldMap.on("tileerror",()=>document.querySelector(".map-canvas").classList.remove("world-ready"));
 setTimeout(()=>worldMap&&worldMap.invalidateSize(),100);
}
async function renderWorldMap(){
 if(sceneArtworkVisible())return;
 const request=++worldRequest,L=await loadLeaflet();
 initWorldMap(L);
 const scene=activeScene();
 const visible=chapters.slice(0,Math.min(completed.length,chapters.length-1)+1).filter(chapter=>sceneForChapter(chapter).id===scene.id);
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
 if(playerFollow&&livePlayerPoint)worldMap.setView(livePlayerPoint,Math.max(worldMap.getZoom(),16),{animate:false});
 else if(active)worldMap.setView(active.point,16,{animate:false});
 else worldMap.setView(helenCenter,15,{animate:false});
}
const previousWorldProgress=renderProgress;
renderProgress=function(){previousWorldProgress();renderWorldMap().catch(()=>{/* illustrated map remains as offline fallback */})};
renderWorldMap().catch(()=>{});
