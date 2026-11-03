/* Autumn scenery for Jess's Helen birthday adventure.
   Stylized (not surveyed) trees are generated ONLY inside mapped woodland,
   grassy and park polygons. Skips roads, buildings and water, including safety
   margins. The whole layer is optional and does not alter map navigation. */
(function(){
 "use strict";
 const WORLD=40075016.68557849, TAU=Math.PI*2, MAX_TREES=360;
 const PALETTE=[
  [.67,.37,.17],[.76,.49,.20],[.77,.60,.29],[.59,.39,.20],
  [.48,.48,.25],[.55,.28,.18],[.36,.46,.31],[.29,.40,.33]
 ];
 const EXTENT={west:-83.739,south:34.691,east:-83.709,north:34.713};
 let vegetationMask=null;
 function loadVegetationMask(){
  return new Promise(resolve=>{
   const image=new Image();
   image.onload=()=>{
    try{
     const canvas=document.createElement("canvas");canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
     const ctx=canvas.getContext("2d",{willReadFrequently:true});
     if(!ctx)throw new Error("Canvas unavailable");
     ctx.drawImage(image,0,0);vegetationMask={width:canvas.width,height:canvas.height,data:ctx.getImageData(0,0,canvas.width,canvas.height).data};
    }catch{vegetationMask=null}
    resolve(vegetationMask);
   };
   image.onerror=()=>resolve(null);
   image.src=new URL("assets/helen-vegetation-data.png?v=20261103-ground5",document.baseURI).href;
  });
 }
 function hash(a,b,salt=0){
  let n=(Math.imul(a,374761393)+Math.imul(b,668265263)+Math.imul(salt,1442695041))|0;
  n=Math.imul(n^(n>>>13),1274126177);
  return ((n^(n>>>16))>>>0)/4294967296;
 }
 function mercator(lnglat){
  const coord=window.maplibregl.MercatorCoordinate.fromLngLat(lnglat);
  return [coord.x*WORLD,coord.y*WORLD];
 }
 function fromMercator(x,y){
  return [x/WORLD*360-180,Math.atan(Math.sinh(Math.PI*(1-2*y/WORLD)))*180/Math.PI];
 }
 function polygonContains(point,ring){
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
   const a=ring[i],b=ring[j],dy=b[1]-a[1];
   if((a[1]>point[1])!==(b[1]>point[1]) &&
     point[0]<(b[0]-a[0])*(point[1]-a[1])/(dy||1e-20)+a[0])inside=!inside;
  }
  return inside;
 }
 function shapeContains(point,rings){
  return rings.length>0&&polygonContains(point,rings[0])&&
   !rings.slice(1).some(hole=>polygonContains(point,hole));
 }
 function distSegment(p,a,b){
  const dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;
  const t=len<1e-9?0:Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/len));
  return Math.hypot(p[0]-a[0]-dx*t,p[1]-a[1]-dy*t);
 }
 function shapeEdgeDistance(p,rings){
  let nearest=Infinity;
  for(const ring of rings)for(let i=0;i<ring.length;i++){
   nearest=Math.min(nearest,distSegment(p,ring[i],ring[(i+1)%ring.length]));
  }
  return nearest;
 }
 function polygons(feature){
  const geometry=feature?.geometry;
  if(!geometry)return [];
  let raw=[];
  if(geometry.type==="Polygon")raw=[geometry.coordinates];
  else if(geometry.type==="MultiPolygon")raw=geometry.coordinates;
  return raw.slice(0,18).map(poly=>poly.map(ring=>ring.slice(0,700).map(mercator)))
   .filter(poly=>poly[0]?.length>=3);
 }
 function lineSegments(features,viewport,maxSegments=2200){
  const segments=[];
  for(const feature of features){
   if(segments.length>=maxSegments)break;
   const g=feature.geometry;
   if(!g)continue;
   const lines=g.type==="LineString"?[g.coordinates]:g.type==="MultiLineString"?g.coordinates:[];
   const clazz=String(feature.properties?.class||"");
   const width=["motorway","trunk","primary","secondary"].includes(clazz)?11:6.5;
   for(const line of lines){
    for(let i=1;i<line.length&&segments.length<maxSegments;i++){
     const a=mercator(line[i-1]),b=mercator(line[i]);
     if(Math.max(a[0],b[0])<viewport.minX-20||Math.min(a[0],b[0])>viewport.maxX+20||
        Math.max(a[1],b[1])<viewport.minY-20||Math.min(a[1],b[1])>viewport.maxY+20)continue;
     segments.push({a,b,width});
    }
   }
  }
  return segments;
 }
 function getViewport(map){
  const bounds=map.getBounds(),nw=mercator([bounds.getWest(),bounds.getNorth()]),
   se=mercator([bounds.getEast(),bounds.getSouth()]);
  return {minX:Math.min(nw[0],se[0]),minY:Math.min(nw[1],se[1]),
          maxX:Math.max(nw[0],se[0]),maxY:Math.max(nw[1],se[1]),bounds};
 }
 function gather(map,source){
  const layerFeatures={};
  for(const layer of ["landcover","landuse","building","transportation","water"]){
   try{layerFeatures[layer]=map.querySourceFeatures(source,{sourceLayer:layer})||[]}
   catch{layerFeatures[layer]=[]}
  }
  return layerFeatures;
 }
 function collectTrees(map,source){
  const features=gather(map,source),view=getViewport(map);
  const green=[];
  for(const [layer,items] of [["landcover",features.landcover],["landuse",features.landuse]]){
   for(const feature of items){
    const cls=String(feature.properties?.class||"").toLowerCase();
    const sub=String(feature.properties?.subclass||"").toLowerCase();
    let kind=null;
    if(layer==="landcover"){
     if(cls==="wood")kind="wood";
     else if(cls==="grass"){
      kind=["garden","park","village_green","orchard","meadow","grass","grassland"].includes(sub)?"park":"grass";
     }
    }else if(["park","garden","village_green","orchard"].includes(cls))kind="park";
    if(kind)for(const poly of polygons(feature))green.push({kind,rings:poly});
    if(green.length>=170)break;
   }
  }
  const buildings=[];
  for(const feature of features.building.slice(0,300))
   for(const poly of polygons(feature))buildings.push(poly);
  const hardscape=[],hardscapeClasses=new Set(["parking","retail","commercial","industrial","construction","garages"]);
  for(const feature of features.landuse.slice(0,180)){
   const cls=String(feature.properties?.class||"").toLowerCase();
   if(hardscapeClasses.has(cls))for(const poly of polygons(feature))hardscape.push(poly);
  }
  const waters=[];
  for(const feature of features.water.slice(0,100))
   for(const poly of polygons(feature))waters.push(poly);
  const roads=lineSegments(features.transportation,view);
  const trees=[],occupied=new Set();
  let attempts=0;
  function addTree(px,py,kind,gx,gy){
   if(trees.length>=MAX_TREES||px<view.minX||px>view.maxX||py<view.minY||py>view.maxY)return;
   const key=Math.round(px/5)+":"+Math.round(py/5);
   if(occupied.has(key))return;
   if(waters.some(poly=>shapeContains([px,py],poly)||shapeEdgeDistance([px,py],poly)<5.5))return;
   if(buildings.some(poly=>shapeContains([px,py],poly)||shapeEdgeDistance([px,py],poly)<6.5))return;
   if(hardscape.some(poly=>shapeContains([px,py],poly)||shapeEdgeDistance([px,py],poly)<4.5))return;
   if(roads.some(seg=>distSegment([px,py],seg.a,seg.b)<seg.width))return;
   if(trees.some(t=>Math.hypot(t.x-px,t.y-py)<8.8))return;
   const [lon,lat]=fromMercator(px,py);
   if(!view.bounds.contains([lon,lat]))return;
   occupied.add(key);
   const variant=hash(gx,gy,113),size=.78+.48*hash(gx,gy,171);
   trees.push({x:px,y:py,variant:variant<.13?"pine":variant<.23?"shrub":"deciduous",
    size,color:PALETTE[Math.floor(hash(gx,gy,203)*PALETTE.length)]});
  }
  if(vegetationMask){
   const b=view.bounds,w=vegetationMask.width,h=vegetationMask.height,d=vegetationMask.data;
   const x0=Math.max(0,Math.floor((b.getWest()-EXTENT.west)/(EXTENT.east-EXTENT.west)*w));
   const x1=Math.min(w-1,Math.ceil((b.getEast()-EXTENT.west)/(EXTENT.east-EXTENT.west)*w));
   const y0=Math.max(0,Math.floor((EXTENT.north-b.getNorth())/(EXTENT.north-EXTENT.south)*h));
   const y1=Math.min(h-1,Math.ceil((EXTENT.north-b.getSouth())/(EXTENT.north-EXTENT.south)*h));
   const candidates=[],sampleStep=4;
   for(let gy=Math.floor(y0/sampleStep);gy<=Math.floor(y1/sampleStep)&&attempts<30000;gy++){
    for(let gx=Math.floor(x0/sampleStep);gx<=Math.floor(x1/sampleStep)&&attempts<12000;gx++){
     attempts++;
     const ix=Math.min(w-1,gx*sampleStep+Math.floor(hash(gx,gy,267)*sampleStep));
     const iy=Math.min(h-1,gy*sampleStep+Math.floor(hash(gx,gy,311)*sampleStep));
     if(d[(iy*w+ix)*4]!==205)continue;
     const lon=EXTENT.west+(ix+.5)/w*(EXTENT.east-EXTENT.west);
     const lat=EXTENT.north-(iy+.5)/h*(EXTENT.north-EXTENT.south);
     const [mx,my]=mercator([lon,lat]);
     candidates.push({x:mx,y:my,gx,gy,rank:hash(gx,gy,419)});
    }
   }
   candidates.sort((a,b)=>a.rank-b.rank);
   for(const candidate of candidates){
    if(trees.length>=MAX_TREES)break;
    if(candidate.rank>.90)continue;
    addTree(candidate.x,candidate.y,"wood",candidate.gx,candidate.gy);
   }
  }else{
   /* If NAIP is unavailable, use mapped woodland, parks, and grass as the safe fallback. */
   for(const {kind,rings} of green){
    if(trees.length>=MAX_TREES||attempts>=8500)break;
    const outer=rings[0],xs=outer.map(p=>p[0]),ys=outer.map(p=>p[1]);
    const step=kind==="wood"?14:kind==="park"?18:21;
    const keep=kind==="wood"?.78:kind==="park"?.42:.23;
    const minX=Math.max(view.minX,Math.min(...xs)),maxX=Math.min(view.maxX,Math.max(...xs));
    const minY=Math.max(view.minY,Math.min(...ys)),maxY=Math.min(view.maxY,Math.max(...ys));
    for(let gy=Math.floor(minY/step);gy<=Math.floor(maxY/step)&&trees.length<MAX_TREES&&attempts<8500;gy++){
     for(let gx=Math.floor(minX/step);gx<=Math.floor(maxX/step)&&trees.length<MAX_TREES&&attempts<8500;gx++){
      attempts++;
      if(hash(gx,gy,31)>keep)continue;
      const px=(gx+.16+.68*hash(gx,gy,67))*step;
      const py=(gy+.16+.68*hash(gx,gy,91))*step,p=[px,py];
      if(px<view.minX||px>view.maxX||py<view.minY||py>view.maxY||!shapeContains(p,rings))continue;
      if(shapeEdgeDistance(p,rings)<(kind==="grass"?3:2.3))continue;
      addTree(px,py,kind,gx,gy);
     }
    }
   }
  }
  return {trees,features:{greens:green.length,buildingMasks:buildings.length,
    hardscapeMasks:hardscape.length,waterMasks:waters.length,roadSegments:roads.length},attempts};
 }
 function tri(out,a,b,c,col,shade=1){
  for(const p of [a,b,c]){
   out.push(p[0],p[1],p[2],Math.min(col[0]*shade,1),Math.min(col[1]*shade,1),Math.min(col[2]*shade,1));
  }
 }
 function makeTree(out,x,y,tree){
  const pine=tree.variant==="pine",shrub=tree.variant==="shrub",s=tree.size;
  const trunkH=shrub?.4:pine?2.4*s:2.0*s,top=shrub?2.2*s:pine?12.5*s:9.6*s;
  const radius=shrub?2.25*s:pine?3.15*s:3.8*s;
  const trunkCol=[.32,.22,.16],n=8;
  /* Ground-contact shadow, subtle enough not to obscure map linework. */
  const shadow=[.32,.37,.29],shadowCenter=[x+.65,y+.85,.045];
  for(let i=0;i<n;i++){
   const a=TAU*i/n,b=TAU*(i+1)/n;
   tri(out,shadowCenter,[x+.65+radius*.92*Math.cos(a),y+.85+radius*.65*Math.sin(a),.045],
    [x+.65+radius*.92*Math.cos(b),y+.85+radius*.65*Math.sin(b),.045],shadow,.82);
  }
  if(!shrub){
   const r=.31*s;
   const base=[[x-r,y-r,0],[x+r,y-r,0],[x+r,y+r,0],[x-r,y+r,0]];
   const upper=base.map(p=>[p[0],p[1],trunkH]);
   for(let i=0;i<4;i++){
    const j=(i+1)%4;
    tri(out,base[i],base[j],upper[i],trunkCol,.82+i*.04);
    tri(out,base[j],upper[j],upper[i],trunkCol,.82+i*.04);
   }
  }
  let rings=[];
  if(pine){
   rings=[[trunkH*.60,radius*.53],[trunkH+1.0*s,radius],
    [trunkH+3.4*s,radius*.70],[top-.4*s,radius*.12]];
  }else{
   rings=[[shrub?.25:trunkH-.35*s,radius*.35],
    [shrub?1.05*s:trunkH+1.0*s,radius],
    [shrub?1.85*s:trunkH+2.7*s,radius*.88],
    [top-.6*s,radius*.35]];
  }
  const color=tree.color;
  for(let level=0;level<rings.length-1;level++){
   const [z0,r0]=rings[level],[z1,r1]=rings[level+1];
   for(let i=0;i<n;i++){
    const a=TAU*i/n,b=TAU*(i+1)/n;
    const a0=[x+Math.cos(a)*r0,y+Math.sin(a)*r0,z0],
     b0=[x+Math.cos(b)*r0,y+Math.sin(b)*r0,z0],
     a1=[x+Math.cos(a)*r1,y+Math.sin(a)*r1,z1],
     b1=[x+Math.cos(b)*r1,y+Math.sin(b)*r1,z1];
    const shade=.76+.24*Math.max(0,Math.cos(a-1.1));
    tri(out,a0,b0,a1,color,shade);
    tri(out,b0,b1,a1,color,shade);
   }
  }
  const peak=[x,y,top];
  const [lastZ,lastR]=rings[rings.length-1];
  for(let i=0;i<n;i++){
   const a=TAU*i/n,b=TAU*(i+1)/n;
   tri(out,[x+Math.cos(a)*lastR,y+Math.sin(a)*lastR,lastZ],
    [x+Math.cos(b)*lastR,y+Math.sin(b)*lastR,lastZ],
    peak,color,.88);
  }
 }
 function multiply(a,b){
  const out=new Float32Array(16);
  for(let c=0;c<4;c++)for(let r=0;r<4;r++){
   let n=0;
   for(let k=0;k<4;k++)n+=a[k*4+r]*b[c*4+k];
   out[c*4+r]=n;
  }
  return out;
 }
 function installHelenLandscaping(map,vectorSource,before){
  if(!map||!vectorSource||map.getLayer("birthday-landscaping"))return;
  const layer={
   id:"birthday-landscaping",type:"custom",renderingMode:"3d",
   onAdd(map,gl){
    const vert="#version 300 es\nprecision highp float; in vec3 a_position; in vec3 a_color; uniform mat4 u_matrix; out vec3 v_color; void main(){gl_Position=u_matrix*vec4(a_position,1.0);v_color=a_color;}";
    const frag="#version 300 es\nprecision mediump float; in vec3 v_color; out vec4 fragColor; void main(){fragColor=vec4(v_color,1.0);}";
    const compile=(type,source)=>{
     const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
     if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error("Landscaping shader failed");
     return shader;
    };
    const vertex=compile(gl.VERTEX_SHADER,vert),fragment=compile(gl.FRAGMENT_SHADER,frag);
    const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error("Landscaping program failed");
    gl.deleteShader(vertex);gl.deleteShader(fragment);
    this.program=program;this.buffer=gl.createBuffer();
    this.aPosition=gl.getAttribLocation(program,"a_position");
    this.aColor=gl.getAttribLocation(program,"a_color");
    this.uMatrix=gl.getUniformLocation(program,"u_matrix");
    this.count=0;this.lastKey=null;
    this.refresh=()=>{
     if(map.getZoom()<14.8){this.count=0;this.lastKey=null;return}
     const center=map.getCenter();
     const key=[center.lng.toFixed(5),center.lat.toFixed(5),map.getZoom().toFixed(2)].join("|");
     const found=collectTrees(map,vectorSource),trees=found.trees;
     const fullKey=key+":"+trees.length+":"+(trees[0]?.x||"");
     if(fullKey===this.lastKey)return;
     const ml=window.maplibregl,origin=ml.MercatorCoordinate.fromLngLat([center.lng,center.lat]);
     const scale=origin.meterInMercatorCoordinateUnits();
     const out=[];
     for(const tree of trees){
      const x=(tree.x/WORLD-origin.x)/scale,y=(tree.y/WORLD-origin.y)/scale;
      makeTree(out,x,y,tree);
     }
     this.count=out.length/6;
     this.origin=origin;this.scale=scale;
     gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
     gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(out),gl.DYNAMIC_DRAW);
     gl.bindBuffer(gl.ARRAY_BUFFER,null);
     this.lastKey=fullKey;
     map.triggerRepaint();
    };
    map.on("idle",this.refresh);map.on("moveend",this.refresh);
    this.refresh();
    loadVegetationMask().then(mask=>{if(mask){this.lastKey=null;this.refresh()}});
   },
   render(gl,args){
    if(!this.count||!this.origin)return;
    const projection=args?.defaultProjectionData?.mainMatrix;
    if(!gl||!projection)return;
    const s=this.scale,o=this.origin;
    const model=[s,0,0,0,0,s,0,0,0,0,s,0,o.x,o.y,0,1];
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uMatrix,false,multiply(projection,model));
    gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
    gl.enableVertexAttribArray(this.aPosition);gl.enableVertexAttribArray(this.aColor);
    gl.vertexAttribPointer(this.aPosition,3,gl.FLOAT,false,24,0);
    gl.vertexAttribPointer(this.aColor,3,gl.FLOAT,false,24,12);
    gl.drawArrays(gl.TRIANGLES,0,this.count);
    gl.disableVertexAttribArray(this.aPosition);gl.disableVertexAttribArray(this.aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
   },
   onRemove(map,gl){
    if(this.refresh){map.off("idle",this.refresh);map.off("moveend",this.refresh)}
    if(this.buffer)gl.deleteBuffer(this.buffer);
    if(this.program)gl.deleteProgram(this.program);
   }
  };
  map.addLayer(layer,before);
 }
 window.installHelenLandscaping=installHelenLandscaping;
})();
