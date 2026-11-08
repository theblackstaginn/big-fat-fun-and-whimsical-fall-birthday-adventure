/* Jess's Birthday Adventure: optional pitched Alpine rooftops.
   Uses the existing MapLibre WebGL context and OSM building footprints.
   No external libraries, service keys, GPS access or quest-state changes. */
(function(){
 "use strict";
 const palettes=[
  [0.60,0.27,0.20],[0.52,0.27,0.23],[0.65,0.37,0.25],
  [0.45,0.31,0.27],[0.57,0.32,0.24],[0.49,0.33,0.28]
 ];

 /* Actual roof rules: one coherent roof per building footprint.
    Rectangular buildings: gable planes with exposed gable ends.
    Convex buildings: exact hip planes meeting along shared ridges.
    Concave buildings: a SINGLE continuous elevation field; reflex corners
    become valleys instead of independent pyramids on triangle fragments. */
 const MAX_RISE=3.8,ROOF_PITCH=.64,EAVE_LIFT=.12;
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 function area(points){
  let sum=0;
  for(let i=0;i<points.length;i++){
   const a=points[i],b=points[(i+1)%points.length];
   sum+=a[0]*b[1]-b[0]*a[1];
  }
  return sum*.5;
 }
 function cleanRing(points){
  const ring=[];
  for(const p of points)if(Number.isFinite(p[0])&&Number.isFinite(p[1])&&
    (!ring.length||distance(ring[ring.length-1],p)>.17))ring.push(p);
  if(ring.length>2&&distance(ring[0],ring[ring.length-1])<.17)ring.pop();
  for(let pass=0;pass<ring.length*2&&ring.length>3;pass++){
   let removed=false;
   for(let i=0;i<ring.length;i++){
    const a=ring[(i+ring.length-1)%ring.length],b=ring[i],c=ring[(i+1)%ring.length];
    const base=distance(a,b)*distance(b,c);
    if(base<.01||Math.abs(cross(a,b,c))/base<.006){
     ring.splice(i,1);removed=true;break;
    }
   }
   if(!removed)break;
  }
  return ring;
 }
 function pointInTriangle(p,a,b,c){
  const d1=cross(a,b,p),d2=cross(b,c,p),d3=cross(c,a,p);
  return (d1>=-1e-7&&d2>=-1e-7&&d3>=-1e-7)||
   (d1<=1e-7&&d2<=1e-7&&d3<=1e-7);
 }
 function segmentsIntersect(a,b,c,d){
  const o1=cross(a,b,c),o2=cross(a,b,d),o3=cross(c,d,a),o4=cross(c,d,b);
  return o1*o2<-.00001&&o3*o4<-.00001;
 }
 function simplePolygon(points){
  if(points.length<3||Math.abs(area(points))<1)return false;
  for(let i=0;i<points.length;i++){
   const a=points[i],b=points[(i+1)%points.length];
   if(distance(a,b)<.16)return false;
   for(let j=i+2;j<points.length;j++){
    if(i===0&&j===points.length-1)continue;
    if(segmentsIntersect(a,b,points[j],points[(j+1)%points.length]))return false;
   }
  }
  return true;
 }
 function triangulate(points){
  const indices=points.map((_,i)=>i),triangles=[],sense=area(points)>0?1:-1;
  for(let pass=0;indices.length>3&&pass<points.length*points.length;pass++){
   let found=false;
   for(let i=0;i<indices.length;i++){
    const a=indices[(i+indices.length-1)%indices.length],
     b=indices[i],c=indices[(i+1)%indices.length];
    if(cross(points[a],points[b],points[c])*sense<=.00005)continue;
    if(indices.some(k=>k!==a&&k!==b&&k!==c&&
      pointInTriangle(points[k],points[a],points[b],points[c])))continue;
    triangles.push([points[a],points[b],points[c]]);
    indices.splice(i,1);found=true;break;
   }
   if(!found)break;
  }
  if(indices.length===3)triangles.push(indices.map(i=>points[i]));
  return triangles.length===points.length-2?triangles:[];
 }
 function isConvex(points){
  const sense=area(points)>0?1:-1;
  for(let i=0;i<points.length;i++)
   if(cross(points[i],points[(i+1)%points.length],
     points[(i+2)%points.length])*sense<-.0001)return false;
  return true;
 }
 function isRectangle(points){
  if(points.length!==4||!isConvex(points))return false;
  for(let i=0;i<4;i++){
   const a=points[i],b=points[(i+1)%4],c=points[(i+2)%4];
   const u=[b[0]-a[0],b[1]-a[1]],v=[c[0]-b[0],c[1]-b[1]];
   const cosine=Math.abs((u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)));
   if(cosine>.14)return false;
  }
  return true;
 }
 function pushTriangle(output,a,b,c,color,shade=1){
  const r=Math.min(1,color[0]*shade),g=Math.min(1,color[1]*shade),blue=Math.min(1,color[2]*shade);
  for(const p of [a,b,c])output.push(p[0],p[1],p[2],r,g,blue);
 }
 function edgeShade(a,b){
  const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
  return .83+.12*(dx*.64-dy*.77)/Math.max(len,.01);
 }
 function drawGable(output,points,height,color){
  let i=0;
  for(let j=1;j<4;j++)
   if(distance(points[j],points[(j+1)%4])>distance(points[i],points[(i+1)%4]))i=j;
  const a=points[i],b=points[(i+1)%4],c=points[(i+2)%4],d=points[(i+3)%4];
  const span=(distance(a,d)+distance(b,c))*.5;
  const rise=Math.min(MAX_RISE,Math.max(.65,span*.5*ROOF_PITCH));
  const eave=height+EAVE_LIFT;
  const A=[...a,eave],B=[...b,eave],C=[...c,eave],D=[...d,eave];
  const Ra=[(a[0]+d[0])*.5,(a[1]+d[1])*.5,eave+rise],
   Rb=[(b[0]+c[0])*.5,(b[1]+c[1])*.5,eave+rise];
  const toneA=edgeShade(a,b),toneB=edgeShade(c,d);
  pushTriangle(output,A,B,Rb,color,toneA);
  pushTriangle(output,A,Rb,Ra,color,toneA);
  pushTriangle(output,D,Ra,Rb,color,toneB);
  pushTriangle(output,D,Rb,C,color,toneB);
  /* Real gable ends are triangular plaster walls. */
  pushTriangle(output,A,Ra,D,[.78,.67,.51],.99);
  pushTriangle(output,B,C,Rb,[.78,.67,.51],.88);
  return 6;
 }
 function inwardEdges(points){
  const sense=area(points)>0?1:-1;
  return points.map((a,i)=>{
   const b=points[(i+1)%points.length],dx=b[0]-a[0],dy=b[1]-a[1];
   const len=Math.hypot(dx,dy),nx=-dy/len*sense,ny=dx/len*sense;
   return {a,b,nx,ny,offset:-(nx*a[0]+ny*a[1])};
  });
 }
 const planeDistance=(edge,p)=>edge.nx*p[0]+edge.ny*p[1]+edge.offset;
 function clippedBySmallerPlane(poly,a,b){
  const result=[];
  if(!poly.length)return result;
  let last=poly[poly.length-1],lastV=planeDistance(a,last)-planeDistance(b,last);
  for(const current of poly){
   const value=planeDistance(a,current)-planeDistance(b,current);
   const lastInside=lastV<=.000001,currentInside=value<=.000001;
   if(lastInside!==currentInside){
    const t=lastV/(lastV-value);
    result.push([last[0]+(current[0]-last[0])*t,last[1]+(current[1]-last[1])*t]);
   }
   if(currentInside)result.push(current);
   last=current;lastV=value;
  }
  return result;
 }
 function drawConvexHip(output,points,height,color){
  const edges=inwardEdges(points),facets=[];
  let maxRun=0;
  for(let i=0;i<edges.length;i++){
   let facet=points.slice();
   for(let j=0;j<edges.length&&facet.length>=3;j++){
    if(i!==j)facet=clippedBySmallerPlane(facet,edges[i],edges[j]);
   }
   if(facet.length<3||Math.abs(area(facet))<.025)continue;
   for(const p of facet)maxRun=Math.max(maxRun,Math.max(0,planeDistance(edges[i],p)));
   facets.push({pts:facet,edge:edges[i]});
  }
  if(!facets.length)return 0;
  const pitch=Math.min(ROOF_PITCH,MAX_RISE/Math.max(maxRun,.01)),eave=height+EAVE_LIFT;
  let triangles=0;
  for(const facet of facets){
   const ed=facet.edge,shade=edgeShade(ed.a,ed.b);
   const raised=p=>[p[0],p[1],eave+Math.max(0,planeDistance(ed,p))*pitch];
   const a=raised(facet.pts[0]);
   for(let k=1;k+1<facet.pts.length;k++){
    const b=raised(facet.pts[k]),c=raised(facet.pts[k+1]);
    if(Math.abs(cross(a,b,c))<.002)continue;
    pushTriangle(output,a,b,c,color,shade);triangles++;
   }
  }
  return triangles;
 }
 function distanceToSegment(p,a,b){
  const dx=b[0]-a[0],dy=b[1]-a[1];
  const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/
   Math.max(dx*dx+dy*dy,.00001)));
  return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);
 }
 function nearestBoundary(p,points){
  let minimum=Infinity,index=0;
  for(let i=0;i<points.length;i++){
   const d=distanceToSegment(p,points[i],points[(i+1)%points.length]);
   if(d<minimum){minimum=d;index=i;}
  }
  return {distance:minimum,index};
 }
 function drawConcaveHip(output,points,height,color){
  const base=triangulate(points);
  if(!base.length)return 0;
  /* All pieces sample one shared roof-height field. An L-shaped valley
     descends toward its inside corner instead of forming isolated spires. */
  const samples=[];
  for(const tri of base){
   samples.push([(tri[0][0]+tri[1][0]+tri[2][0])/3,
                 (tri[0][1]+tri[1][1]+tri[2][1])/3]);
   for(let i=0;i<3;i++){
    const a=tri[i],b=tri[(i+1)%3];
    samples.push([(a[0]+b[0])*.5,(a[1]+b[1])*.5]);
   }
  }
  let maxRun=0;
  for(const point of samples)maxRun=Math.max(maxRun,nearestBoundary(point,points).distance);
  const pitch=Math.min(ROOF_PITCH,MAX_RISE/Math.max(maxRun,.01)),eave=height+EAVE_LIFT;
  const shadeFor=p=>{
   const edge=nearestBoundary(p,points).index;
   return edgeShade(points[edge],points[(edge+1)%points.length]);
  };
  const elev=p=>eave+Math.min(MAX_RISE,nearestBoundary(p,points).distance*pitch);
  const maxTriangles=2400,depth=(points.length<=16&&base.length*64<=maxTriangles)?3:2;
  let total=0;
  function subdivide(a,b,c,remaining){
   if(remaining>0){
    const ab=[(a[0]+b[0])*.5,(a[1]+b[1])*.5],
     bc=[(b[0]+c[0])*.5,(b[1]+c[1])*.5],
     ca=[(c[0]+a[0])*.5,(c[1]+a[1])*.5];
    subdivide(a,ab,ca,remaining-1);subdivide(ab,b,bc,remaining-1);
    subdivide(ca,bc,c,remaining-1);subdivide(ab,bc,ca,remaining-1);
    return;
   }
   const center=[(a[0]+b[0]+c[0])/3,(a[1]+b[1]+c[1])/3];
   pushTriangle(output,[...a,elev(a)],[...b,elev(b)],[...c,elev(c)],color,shadeFor(center));
   total++;
  }
  for(const tri of base)subdivide(...tri,depth);
  return total;
 }
 function buildRoof(output,points,height,color,properties={}){
  if(!simplePolygon(points)||points.length>64)return false;
  const shape=String(properties["roof:shape"]||properties.roof_shape||"").toLowerCase();
  if(shape==="flat"||shape==="skillion")return false;
  const span=points.length===4?distance(points[0],points[1])/
   Math.max(distance(points[1],points[2]),.001):1;
  const gabled=isRectangle(points)&&Math.max(span,1/span)>1.2&&
   (!shape||["gable","gabled","half-hipped"].includes(shape))&&Math.abs(area(points))<2500;
  let count=0;
  if(gabled)count=drawGable(output,points,height,color);
  else if(isConvex(points))count=drawConvexHip(output,points,height,color);
  else count=drawConcaveHip(output,points,height,color);
  return count>0;
 }
 function multiplyMatrices(a,b){
  const out=new Float32Array(16);
  for(let c=0;c<4;c++)for(let r=0;r<4;r++){
   let value=0;
   for(let k=0;k<4;k++)value+=a[k*4+r]*b[c*4+k];
   out[c*4+r]=value;
  }
  return out;
 }
 function installAlpineRoofLayer(map,vectorSource,before){
  if(!map||!vectorSource||map.getLayer("birthday-pitched-roofs"))return;
  const layer={
   id:"birthday-pitched-roofs",
   type:"custom",
   renderingMode:"3d",
   onAdd(map,gl){
    this.map=map;
    const vs="#version 300 es\nprecision highp float; in vec3 a_position; in vec3 a_color; uniform mat4 u_matrix; out vec3 v_color; void main(){gl_Position=u_matrix*vec4(a_position,1.0);v_color=a_color;}";
    const fs="#version 300 es\nprecision mediump float; in vec3 v_color; out vec4 fragColor; void main(){fragColor=vec4(v_color,1.0);}";
    const compile=(type,source)=>{
     const shader=gl.createShader(type);
     gl.shaderSource(shader,source);gl.compileShader(shader);
     if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error("Roof shader: "+gl.getShaderInfoLog(shader));
     return shader;
    };
    const vertex=compile(gl.VERTEX_SHADER,vs),fragment=compile(gl.FRAGMENT_SHADER,fs);
    const program=gl.createProgram();
    gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error("Roof shader link failed");
    gl.deleteShader(vertex);gl.deleteShader(fragment);
    this.program=program;
    this.aPosition=gl.getAttribLocation(program,"a_position");
    this.aColor=gl.getAttribLocation(program,"a_color");
    this.uMatrix=gl.getUniformLocation(program,"u_matrix");
    this.buffer=gl.createBuffer();
    this.count=0;
    this.refresh=()=>{
     if(map.getZoom()<15.2){this.count=0;this.lastKey=null;return;}
     const center=map.getCenter(),features=map.querySourceFeatures(vectorSource,{sourceLayer:"building"});
     if(!features.length){this.count=0;this.lastKey=null;return;}
     const key=[map.getZoom().toFixed(2),center.lng.toFixed(5),
      center.lat.toFixed(5),features.length].join("|");
     if(this.lastKey===key)return;
     const ml=window.maplibregl,origin=ml.MercatorCoordinate.fromLngLat([center.lng,center.lat]);
     const scale=origin.meterInMercatorCoordinateUnits();
     const bounds=map.getBounds(),vertices=[],seen=new Set();
     let accepted=0;
     for(const feature of features){
      if(accepted>=140)break;
      const geometry=feature.geometry;
      if(!geometry||!geometry.coordinates)continue;
      const polys=geometry.type==="Polygon"?[geometry.coordinates]:
       geometry.type==="MultiPolygon"?geometry.coordinates:[];
      for(let pi=0;pi<polys.length&&accepted<140;pi++){
       if(polys[pi].length>1)continue; /* Do not fill real inner courtyards. */
       const ring=polys[pi][0];
       if(!ring||ring.length<4||ring.length>85)continue;
       let lng=0,lat=0;
       for(const coord of ring){lng+=coord[0];lat+=coord[1];}
       lng/=ring.length;lat/=ring.length;
       if(!bounds.contains([lng,lat]))continue;
       const id=feature.id!=null?String(feature.id):"building";
       const identity=[id,Math.round(lng*1e6),Math.round(lat*1e6),ring.length].join(":");
       if(seen.has(identity))continue;
       seen.add(identity);
       const polygon=cleanRing(ring.map(p=>{
        const merc=ml.MercatorCoordinate.fromLngLat([p[0],p[1]]);
        return [(merc.x-origin.x)/scale,(merc.y-origin.y)/scale];
       }));
       if(polygon.length<3||polygon.length>64)continue;
       const squareMeters=Math.abs(area(polygon));
       if(squareMeters<18||squareMeters>24000)continue;
       let height=Number(feature.properties?.render_height??feature.properties?.height??9);
       if(!Number.isFinite(height))height=9;
       height=Math.max(5,Math.min(18,height));
       let hash=0;
       for(const ch of id)hash=(hash*31+ch.charCodeAt(0))|0;
       const color=palettes[(hash>>>0)%palettes.length];
       const before=vertices.length;
       if(!buildRoof(vertices,polygon,height,color,feature.properties||{})){
        vertices.length=before;continue;
       }
       accepted++;
      }
     }
     if(!vertices.length){this.count=0;this.lastKey=key;map.triggerRepaint();return;}
     this.count=vertices.length/6;
     this.origin=origin;this.scale=scale;
     gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
     gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW);
     gl.bindBuffer(gl.ARRAY_BUFFER,null);
     this.lastKey=key;
     map.triggerRepaint();
    };
    map.on("idle",this.refresh);
    map.on("moveend",this.refresh);
    this.refresh();
   },
   render(gl,args){
    if(!this.count||!this.origin)return;
    /* MapLibre 5 passes (WebGL2RenderingContext, CustomRenderMethodInput). */
    const projection=args?.defaultProjectionData?.mainMatrix;
    if(!gl||!projection)return;
    const s=this.scale,o=this.origin;
    const model=[
     s,0,0,0,
     0,s,0,0,
     0,0,s,0,
     o.x,o.y,0,1
    ];
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uMatrix,false,multiplyMatrices(projection,model));
    gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
    gl.enableVertexAttribArray(this.aPosition);
    gl.enableVertexAttribArray(this.aColor);
    gl.vertexAttribPointer(this.aPosition,3,gl.FLOAT,false,24,0);
    gl.vertexAttribPointer(this.aColor,3,gl.FLOAT,false,24,12);
    gl.drawArrays(gl.TRIANGLES,0,this.count);
    gl.disableVertexAttribArray(this.aPosition);
    gl.disableVertexAttribArray(this.aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
   },
   onRemove(map,gl){
    if(this.refresh){
     map.off("idle",this.refresh);
     map.off("moveend",this.refresh);
    }
    if(this.buffer)gl.deleteBuffer(this.buffer);
    if(this.program)gl.deleteProgram(this.program);
   }
  };
  map.addLayer(layer,before);
 }
 window.installAlpineRoofLayer=installAlpineRoofLayer;
})();
