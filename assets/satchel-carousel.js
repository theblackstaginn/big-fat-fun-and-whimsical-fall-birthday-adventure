/* Portrait Satchel carousel. True 3D jars share a rotation state with the 3D turntable.
   Only the existing Satchel panel is modified. No jar labels or new modal. */
(()=>{
"use strict";
const sheet=document.querySelector(".rpg-sheet"),body=document.getElementById("rpg-sheet-body"),title=document.getElementById("rpg-sheet-title");
if(!sheet||!body||!title||sheet.dataset.susanInstalled)return;
sheet.dataset.susanInstalled="1";
const items=[
 ["ruby",0],["wonderland",1],["candle",2],["glass",3],["zuzu",3],
 ["river",4],["dinner",5],["sweet",6],["park",7]
],T=Math.PI*2,STEP=T/9;
let stage,viewer,fallback,ring,jarCanvas,buttons=[],angle=Math.PI,selected=0,active=false,modelReady=false;
let animation=0,drag=null,moved=false,pending=false,previewAll=false;
const jarSprites={empty:"assets/satchel/jars/empty_site.webp",ruby:"assets/satchel/jars/01_ruby_maes.webp",wonderland:"assets/satchel/jars/02_wonderland.webp",candle:"assets/satchel/jars/03_crafty_mountain.webp",glass:"assets/satchel/jars/04_glassblowing.webp",zuzu:"assets/satchel/jars/05_zuzus_petals_no_glow.webp",river:"assets/satchel/jars/06_chattahoochee_river.webp",dinner:"assets/satchel/jars/07_bangkok_haus.webp",sweet:"assets/satchel/jars/08_hansel_gretel_no_glow.webp",park:"assets/satchel/jars/09_unicoi_hill_park_gazebo.webp"};
let THREE=null,renderer3d=null,scene3d=null,camera3d=null,jarRoots=Array(9).fill(null);
let artMeshes=Array(9).fill(null),artTextures=Array(9).fill(null),artLoading=Array(9).fill(false),threePromise=null;
const jarScale=1.21;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v)),wrap=n=>(n%9+9)%9;
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
function count(){
 if(typeof completed!=="undefined"&&Array.isArray(completed))return completed.length;
 try{const x=JSON.parse(localStorage.getItem("jess-birthday-quest-progress-v3")||"[]");return Array.isArray(x)?x.length:0}catch{return 0}
}
function removeArt(i){
 const mesh=artMeshes[i];
 if(mesh&&jarRoots[i]){jarRoots[i].remove(mesh);mesh.geometry.dispose();mesh.material.dispose()}
 artMeshes[i]=null;
 if(artTextures[i]){artTextures[i].dispose();artTextures[i]=null}
}
function showArt(i,id){
 if(!THREE||!jarRoots[i]||artMeshes[i]||artLoading[i])return;
 artLoading[i]=true;
 new THREE.TextureLoader().load("assets/scenes/"+id+".webp",texture=>{
  artLoading[i]=false;
  if(count()<items[i][1]){texture.dispose();return}
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=THREE.RepeatWrapping;
  texture.wrapT=THREE.ClampToEdgeWrapping;
  const imageWidth=texture.image?.width||1,imageHeight=texture.image?.height||1;
  const fit=Math.min(.42/imageWidth,.54/imageHeight);
  const geometry=new THREE.PlaneGeometry(imageWidth*fit,imageHeight*fit);
  const material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,toneMapped:false,transparent:true,depthWrite:false});
  const mesh=new THREE.Mesh(geometry,material);
  mesh.position.set(0,.49,-.31);
  mesh.renderOrder=0;
  jarRoots[i].add(mesh);artMeshes[i]=mesh;artTextures[i]=texture;
  paint();
 },undefined,()=>{artLoading[i]=false});
}
function unlock(){
 const n=count();
 items.forEach(([id,threshold],i)=>{
  const b=buttons[i];if(!b)return;
  const open=n>=threshold;
  b.setAttribute("aria-label",open?"Collected jar "+(i+1):"Undiscovered jar "+(i+1));
  const sprite=b.querySelector(".satchel-jar-sprite");
  if(sprite){const src=(previewAll||open)?(jarSprites[id]||jarSprites.empty):jarSprites.empty;if(sprite.getAttribute("src")!==src)sprite.setAttribute("src",src);}
 });
}
async function init3D(){
 if(threePromise)return threePromise;
 threePromise=(async()=>{
  try{
   const [threeModule,{GLTFLoader}]=await Promise.all([
    import("three"),
    import("three/addons/loaders/GLTFLoader.js")
   ]);
   THREE=threeModule;
   renderer3d=new THREE.WebGLRenderer({canvas:jarCanvas,alpha:true,antialias:true,powerPreference:"low-power"});
   renderer3d.setClearColor(0x000000,0);
   renderer3d.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
   renderer3d.outputColorSpace=THREE.SRGBColorSpace;
   renderer3d.toneMapping=THREE.ACESFilmicToneMapping;
   renderer3d.toneMappingExposure=1.2;
   scene3d=new THREE.Scene();
   const phi=62*Math.PI/180;
   camera3d=new THREE.PerspectiveCamera(30,1,.1,100);
   camera3d.position.set(0,.55+10*Math.cos(phi),10*Math.sin(phi));
   camera3d.lookAt(0,.55,0);
   scene3d.add(new THREE.HemisphereLight(0xffead3,0x2b1d32,2.0));
   const key=new THREE.DirectionalLight(0xffe4c4,2.2);key.position.set(-3,7,6);scene3d.add(key);
   const fill=new THREE.DirectionalLight(0xc8d6ff,1.0);fill.position.set(4,3,-5);scene3d.add(fill);
   const loader=new GLTFLoader();
   await Promise.all(items.map(([id],i)=>new Promise(resolve=>{
    const file=i===0?"assets/satchel/jars/jar_01_ruby_showcase.glb":"assets/satchel/jars/jar_"+String(i+1).padStart(2,"0")+"_"+id+".glb";
    loader.load(file,gltf=>{
     const root=new THREE.Group();root.add(gltf.scene);scene3d.add(root);jarRoots[i]=root;
     gltf.scene.traverse(obj=>{
      if(!obj.isMesh)return;
      obj.castShadow=true;obj.receiveShadow=true;
      if(Array.isArray(obj.material))obj.material.forEach(m=>{if(m.transparent)m.depthWrite=false});
      else if(obj.material.transparent)obj.material.depthWrite=false;
     });
     resolve();
    },undefined,error=>{console.error("Could not load Satchel jar model "+file,error);resolve()});
   })));
   resize3D();unlock();paint();
  }catch(error){console.error("The 3D Satchel jars could not initialize.",error)}
 })();
 return threePromise;
}
function resize3D(){
 if(!renderer3d||!camera3d||!jarCanvas)return;
 const width=jarCanvas.clientWidth,height=jarCanvas.clientHeight;
 if(!width||!height)return;
 renderer3d.setSize(width,height,false);
 camera3d.aspect=width/height;camera3d.updateProjectionMatrix();
}
function paint(){
 if(!stage||!active)return;
 const rect=stage.getBoundingClientRect();if(!rect.width||!rect.height)return;
 const h=rect.height,vh=h*.74,cy=h*.19+vh/2+h*.07,cx=rect.width/2,focal=vh/(2*Math.tan(Math.PI/12));
 const norm=(angle%T+T)%T;
 if(modelReady){try{viewer.currentTime=12*norm/T}catch{}}
 const sinP=Math.sin(62*Math.PI/180),cosP=Math.cos(62*Math.PI/180),seatY=.615;
 items.forEach(([id],i)=>{
  const a=-Math.PI/2+i*STEP,x=2.08*Math.cos(a),z=2.08*Math.sin(a);
  const xx=x*Math.cos(angle)-z*Math.sin(angle),zz=x*Math.sin(angle)+z*Math.cos(angle);
  const root=jarRoots[i];
  // Jar images are camera-facing sprites. Their feet follow the original bronze ring centers.
  const scale=focal/(10-(seatY*cosP+zz*sinP));
  const b=buttons[i];if(!b)return;
  b.style.left=(cx+xx*1.28*scale).toFixed(1)+"px";
  b.style.top=(cy-(seatY*sinP-zz*cosP)*scale+scale*1.10).toFixed(1)+"px";
  b.style.width=clamp(scale*1.99,89,190).toFixed(1)+"px";
  b.style.zIndex=String(Math.round((zz+3)*100));
  b.classList.toggle("is-front",i===selected);
  b.setAttribute("aria-pressed",String(i===selected));
 });
 if(renderer3d&&scene3d&&camera3d)renderer3d.render(scene3d,camera3d);
}
function settle(target){
 cancelAnimationFrame(animation);
 if(reduce.matches){angle=target;paint();return}
 const start=performance.now(),from=angle;
 const tick=now=>{
  if(!active)return;
  const k=clamp((now-start)/550,0,1),ease=1-Math.pow(1-k,3);
  angle=from+(target-from)*ease;paint();
  if(k<1)animation=requestAnimationFrame(tick);
 };
 animation=requestAnimationFrame(tick);
}
function turn(delta){selected=wrap(selected+delta);settle(angle-delta*STEP)}
function choose(i){
 if(i===selected)return;
 let delta=i-selected;if(delta>4)delta-=9;if(delta< -4)delta+=9;
 selected=i;settle(angle-delta*STEP);
}
function build(){
 if(stage)return;
 stage=document.createElement("div");stage.className="satchel-rotunda";
 fallback=document.createElement("img");fallback.className="satchel-platter-fallback";
 fallback.src="assets/satchel/lazy_susan_isolated.webp";fallback.alt="";fallback.draggable=false;
 viewer=document.createElement("model-viewer");viewer.className="satchel-model";
 jarCanvas=document.createElement("canvas");jarCanvas.className="satchel-jar-canvas";jarCanvas.setAttribute("aria-hidden","true");
 const attrs={src:"assets/satchel/oddities_lazy_susan_spinning.glb",
  "animation-name":"One Gentle Full Turn - 12 Seconds",
  "camera-orbit":"0deg 62deg 10m","camera-target":"0m 0.55m 0m",
  "field-of-view":"30deg",exposure:"1.35","environment-image":"neutral",
  "shadow-intensity":"0","interaction-prompt":"none",loading:"eager","aria-hidden":"true"};
 Object.entries(attrs).forEach(([key,value])=>viewer.setAttribute(key,value));
 viewer.addEventListener("load",()=>{modelReady=true;viewer.pause();viewer.classList.add("model-ready");fallback.hidden=true;paint()});
 viewer.addEventListener("error",()=>{modelReady=false;viewer.classList.remove("model-ready");fallback.hidden=false});
 ring=document.createElement("div");ring.className="satchel-jar-ring";
 items.forEach(([id],i)=>{
  const b=document.createElement("button");b.type="button";b.className="satchel-jar";
  b.setAttribute("aria-label","Jar "+(i+1));b.setAttribute("aria-pressed","false");
  const sprite=document.createElement("img");sprite.className="satchel-jar-sprite";sprite.alt="";sprite.draggable=false;sprite.src=jarSprites.empty;b.append(sprite);
  b.addEventListener("click",()=>{if(!moved)choose(i)});
  buttons.push(b);ring.append(b);
 });
 const nav=document.createElement("div");nav.className="satchel-nav";
 for(const [delta,symbol,label] of [[-1,"‹","Previous jar"],[1,"›","Next jar"]]){
  const btn=document.createElement("button");btn.type="button";btn.className="satchel-arrow";
  btn.textContent=symbol;btn.setAttribute("aria-label",label);
  btn.addEventListener("click",()=>turn(delta));nav.append(btn);
 }
 const preview=document.createElement("button");
 preview.type="button";preview.className="satchel-preview-all";
 preview.textContent="View Full Susan";preview.setAttribute("aria-pressed","false");
 preview.style.cssText="position:absolute;top:12px;right:12px;z-index:9999;padding:9px 13px;border:1px solid #b99158;border-radius:24px;background:#211927e8;color:#f6e4c6;font:600 12px system-ui;cursor:pointer;touch-action:manipulation";
 preview.addEventListener("click",e=>{
  e.stopPropagation();previewAll=!previewAll;
  preview.textContent=previewAll?"Show Collected Jars":"View Full Susan";
  preview.setAttribute("aria-pressed",String(previewAll));
  unlock();
 });
 stage.append(fallback,viewer,ring,nav,preview);
 stage.addEventListener("pointerdown",e=>{
  if(e.button!==0||e.target.closest(".satchel-nav, .satchel-preview-all"))return;
  cancelAnimationFrame(animation);drag={id:e.pointerId,x:e.clientX,y:e.clientY,angle,moving:false};moved=false;
 });
 stage.addEventListener("pointermove",e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moving&&Math.abs(dx)>9&&Math.abs(dx)>Math.abs(dy)){
   drag.moving=true;stage.setPointerCapture(e.pointerId);
  }
  if(!drag.moving)return;
  e.preventDefault();moved=true;angle=drag.angle+dx*STEP/78;paint();
 });
 const finish=e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const moving=drag.moving;drag=null;
  if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);
  if(!moving)return;
  const steps=Math.round((Math.PI-angle)/STEP);selected=wrap(steps);settle(Math.PI-steps*STEP);
  setTimeout(()=>{moved=false},80);
 };
 stage.addEventListener("pointerup",finish);stage.addEventListener("pointercancel",finish);
 if(!customElements.get("model-viewer")&&!document.querySelector("script[data-satchel-viewer]")){
  const script=document.createElement("script");script.type="module";
  script.src="https://unpkg.com/@google/model-viewer@4.2.0/dist/model-viewer.min.js";
  script.dataset.satchelViewer="1";document.head.append(script);
 }
 // The realistic jars are transparent 2D billboards; no GLB loading required.
}
function sync(){
 pending=false;
 const host=body.querySelector(":scope > .rpg-satchel");
 active=!sheet.hidden&&!!host&&title.textContent.includes("Satchel");
 sheet.classList.toggle("is-satchel-susan",active);
 if(!active){cancelAnimationFrame(animation);return}
 build();host.classList.add("satchel-immersive");
 if(host.firstElementChild!==stage||host.childElementCount!==1)host.replaceChildren(stage);
 unlock();requestAnimationFrame(()=>{resize3D();paint()});
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(sync)}}
new MutationObserver(schedule).observe(body,{childList:true});
new MutationObserver(schedule).observe(title,{childList:true,subtree:true,characterData:true});
new MutationObserver(schedule).observe(sheet,{attributes:true,attributeFilter:["hidden"]});
window.addEventListener("resize",()=>{if(active){resize3D();requestAnimationFrame(paint)}},{passive:true});
schedule();
})();