/* Jess's birthday adventure: modest village stonework on real OSM paths.
   The paving is decorative, not a statement about actual street materials.
   Real road geometry, waterways, labels and quest navigation are not changed. */
(function(){
 "use strict";
 const IMAGE_ID="birthday-worn-stone";
 const STYLE_IDS=[
  "birthday-pedestrian-stone-backing",
  "birthday-pedestrian-stone-pavers",
  "birthday-pedestrian-stone-edges",
  "birthday-village-service-curbs",
  "birthday-mapped-plaza-stones"
 ];
 function wornStoneTile(){
  const canvas=document.createElement("canvas");
  canvas.width=canvas.height=64;
  const ctx=canvas.getContext("2d");
  if(!ctx)return null;
  const palette=["#c2b39b","#d4c5ab","#b5a388","#cab89a","#ab977d","#d9cbb6","#bea98b"];
  ctx.fillStyle="#8a7862";ctx.fillRect(0,0,64,64);
  let seed=1977;
  const random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
  for(let row=-1;row<7;row++){
   const y=row*11,offset=(row%2?7:0);
   for(let x=-18+offset;x<83;x+=16){
    const n=random(),tone=palette[Math.floor(n*palette.length)];
    const px=x+.6+random()*.9,py=y+.7+random()*.8;
    const w=13.2+random()*.9,h=8.3+random()*.7;
    ctx.fillStyle=tone;
    ctx.beginPath();
    ctx.moveTo(px+2,py);ctx.lineTo(px+w-2,py+.15);
    ctx.quadraticCurveTo(px+w,py+.3,px+w,py+2);
    ctx.lineTo(px+w-.25,py+h-1.7);
    ctx.quadraticCurveTo(px+w-.5,py+h,px+w-2.4,py+h);
    ctx.lineTo(px+1.6,py+h-.25);
    ctx.quadraticCurveTo(px,py+h-.4,px,py+h-2);
    ctx.lineTo(px+.15,py+1.6);
    ctx.quadraticCurveTo(px+.3,py,px+2,py);
    ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(76,58,41,.24)";ctx.lineWidth=.55;ctx.stroke();
    ctx.fillStyle="rgba(255,245,218,.24)";
    ctx.fillRect(px+2.5,py+1.7,Math.max(1,w-6),.45);
   }
  }
  return ctx.getImageData(0,0,64,64);
 }
 function installHelenStonework(map,source,before){
  if(!map||!source||map.getLayer(STYLE_IDS[0]))return;
  const pathFilter=["all",["==",["geometry-type"],"LineString"],["any",
   ["in",["get","class"],["literal",["path","pedestrian"]]],
   ["in",["get","subclass"],["literal",["footway","pedestrian","path","steps"]]]
  ]];
  const serviceFilter=["all",["==",["geometry-type"],"LineString"],["any",
   ["==",["get","class"],"service"],["==",["get","subclass"],"service"]
  ]];
  const plazaFilter=["all",["==",["geometry-type"],"Polygon"],["any",
   ["in",["get","class"],["literal",["pedestrian","plaza","square"]]],
   ["in",["get","subclass"],["literal",["pedestrian","plaza","square"]]]
  ]];
  try{
   const tile=wornStoneTile();
   if(tile&&!map.hasImage(IMAGE_ID))map.addImage(IMAGE_ID,tile,{pixelRatio:1});
   /* First a narrow stone strip, then its worn pavers. Only public footpaths
      and pedestrian lanes are eligible; major vehicular roads are excluded. */
   map.addLayer({
    id:STYLE_IDS[0],type:"line",source,"source-layer":"transportation",minzoom:15.5,
    filter:pathFilter,layout:{"line-cap":"round","line-join":"round"},
    paint:{"line-color":"#7b6954",
     "line-width":["interpolate",["linear"],["zoom"],15.5,2,17,5.5,19,10],
     "line-opacity":.83}
   },before);
   if(tile){
    map.addLayer({
     id:STYLE_IDS[1],type:"line",source,"source-layer":"transportation",minzoom:15.5,
     filter:pathFilter,layout:{"line-cap":"round","line-join":"round"},
     paint:{"line-pattern":IMAGE_ID,
      "line-width":["interpolate",["linear"],["zoom"],15.5,1.7,17,4.8,19,8.9],
      "line-opacity":.93}
    },before);
   }else{
    map.addLayer({
     id:STYLE_IDS[1],type:"line",source,"source-layer":"transportation",minzoom:15.5,
     filter:pathFilter,paint:{"line-color":"#c6b59a","line-width":3,"line-opacity":.85}
    },before);
   }
   /* Small broken-edge joints keep it a cobbled footpath, not a thick
      yellow quest trail or a navigational line. */
   map.addLayer({
    id:STYLE_IDS[2],type:"line",source,"source-layer":"transportation",minzoom:16.3,
    filter:pathFilter,layout:{"line-cap":"butt","line-join":"round"},
    paint:{"line-color":"#554638","line-opacity":.35,
     "line-width":["interpolate",["linear"],["zoom"],16.3,.55,19,1.25],
     "line-dasharray":[1.3,3.5]}
   },before);
   /* True service-access roads get faint stone curb joints only. */
   map.addLayer({
    id:STYLE_IDS[3],type:"line",source,"source-layer":"transportation",minzoom:17.4,
    filter:serviceFilter,layout:{"line-cap":"round","line-join":"round"},
    paint:{"line-color":"#756550","line-opacity":.45,
     "line-width":["interpolate",["linear"],["zoom"],17.4,.5,19,1],
     "line-gap-width":["interpolate",["linear"],["zoom"],17.4,3,19,6],
     "line-dasharray":[1.2,2.1]}
   },before);
   /* Any genuinely mapped pedestrian plaza may show the same paving. The
      polygon filter means parks, building footprints and river stay intact. */
   if(tile){
    map.addLayer({
     id:STYLE_IDS[4],type:"fill",source,"source-layer":"landuse",minzoom:16,
     filter:plazaFilter,paint:{"fill-pattern":IMAGE_ID,"fill-opacity":.46}
    },before);
   }
  }catch(error){
   for(const id of STYLE_IDS){
    try{if(map.getLayer(id))map.removeLayer(id)}catch{}
   }
   /* Decorative failure must never prevent loading the real street map. */
  }
 }
 window.installHelenStonework=installHelenStonework;
})();
