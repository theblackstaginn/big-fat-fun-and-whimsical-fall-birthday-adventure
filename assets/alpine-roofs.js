/* Jess's Birthday Adventure: optional pitched Alpine rooftops.
   Uses the existing MapLibre WebGL context and OSM building footprints.
   No external libraries, service keys, GPS access or quest-state changes. */
(function(){
 "use strict";
 const palettes=[
  [0.60,0.27,0.20],[0.52,0.27,0.23],[0.65,0.37,0.25],
  [0.45,0.31,0.27],[0.57,0.32,0.24],[0.49,0.33,0.28]
 ];
 function distance(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1]);}
 function cross(a,b,c){return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);}
 function area(points){
  let total=0;
  for(let i=0;i<points.length;i++){
   const a=points[i],b=points[(i+1)%points.length];
   total+=a[0]*b[1]-b[0]*a[1];
  }
  return total/2;
 }
 function cleanRing(points){
  const result=[];
  for(const p of points){
   if(Number.isFinite(p[0])&&Number.isFinite(p[1])&&(!result.length||distance(result[result.length-1],p)>.2))result.push(p);
  }
  if(result.length>2&&distance(result[0],result[result.length-1])<.2)result.pop();
  let changed=true,rounds=0;
  while(changed&&result.length>3&&rounds++<50){
   changed=false;
   for(let i=0;i<result.length;i++){
    const a=result[(i+result.length-1)%result.length],b=result[i],c=result[(i+1)%result.length];
    const denominator=distance(a,b)*distance(b,c);
    if(denominator>0&&Math.abs(cross(a,b,c))/denominator<.012){
     result.splice(i,1);changed=true;break;
    }
   }
  }
  return result;
 }
 function insideTriangle(p,a,b,c){
  const ab=cross(a,b,p),bc=cross(b,c,p),ca=cross(c,a,p);
  return (ab>=-1e-5&&bc>=-1e-5&&ca>=-1e-5)||(ab<=1e-5&&bc<=1e-5&&ca<=1e-5);
 }
 function triangulate(points){
  const remaining=points.map((_,i)=>i),triangles=[];
  const winding=area(points)>0?1:-1;
  for(let attempts=0;remaining.length>3&&attempts<250;attempts++){
   let clipped=false;
   for(let i=0;i<remaining.length;i++){
    const prev=remaining[(i+remaining.length-1)%remaining.length],curr=remaining[i],next=remaining[(i+1)%remaining.length];
    const a=points[prev],b=points[curr],c=points[next];
    if(cross(a,b,c)*winding<=.02)continue;
    if(remaining.some(id=>id!==prev&&id!==curr&&id!==next&&insideTriangle(points[id],a,b,c)))continue;
    triangles.push([prev,curr,next]);
    remaining.splice(i,1);
    clipped=true;break;
   }
   if(!clipped)break;
  }
  if(remaining.length===3)triangles.push(remaining.slice());
  return triangles;
 }
 function isConvexQuad(points){
  if(points.length!==4)return false;
  const w=area(points)>0?1:-1;
  for(let i=0;i<4;i++)if(cross(points[i],points[(i+1)%4],points[(i+2)%4])*w<.1)return false;
  return true;
 }
 function polygonPieces(points){
  if(points.length===4&&isConvexQuad(points))return [points];
  if(points.length===3)return [points];
  const tris=triangulate(points),used=new Set(),pieces=[];
  for(let i=0;i<tris.length;i++){
   if(used.has(i))continue;
   let pair=-1,quad=null;
   for(let j=i+1;j<tris.length;j++){
    if(used.has(j))continue;
    const union=[...new Set([...tris[i],...tris[j]])];
    if(union.length!==4)continue;
    const center=[union.reduce((s,k)=>s+points[k][0],0)/4,union.reduce((s,k)=>s+points[k][1],0)/4];
    union.sort((a,b)=>Math.atan2(points[a][1]-center[1],points[a][0]-center[0])-
                       Math.atan2(points[b][1]-center[1],points[b][0]-center[0]));
    const candidate=union.map(k=>points[k]);
    if(isConvexQuad(candidate)){pair=j;quad=candidate;break;}
   }
   used.add(i);
   if(pair>=0){used.add(pair);pieces.push(quad);}
   else pieces.push(tris[i].map(k=>points[k]));
  }
  return pieces;
 }
 function pushTriangle(output,a,b,c,color,shade){
  for(const p of [a,b,c])output.push(p[0],p[1],p[2],color[0]*shade,color[1]*shade,color[2]*shade);
 }
 function gabledRoof(output,points,height,color){
  let longIndex=0,longest=0;
  for(let i=0;i<4;i++){
   const len=distance(points[i],points[(i+1)%4]);
   if(len>longest){longest=len;longIndex=i;}
  }
  const a=points[longIndex],b=points[(longIndex+1)%4],c=points[(longIndex+2)%4],d=points[(longIndex+3)%4];
  const shortSpan=(distance(a,d)+distance(b,c))/2;
  const rise=Math.max(1.5,Math.min(4.3,shortSpan*.43));
  const eave=height+.18;
  const mid1=[(a[0]+d[0])/2,(a[1]+d[1])/2];
  const mid2=[(b[0]+c[0])/2,(b[1]+c[1])/2];
  const ridgeA=[mid1[0]*.87+mid2[0]*.13,mid1[1]*.87+mid2[1]*.13,eave+rise];
  const ridgeB=[mid1[0]*.13+mid2[0]*.87,mid1[1]*.13+mid2[1]*.87,eave+rise];
  const A=[a[0],a[1],eave],B=[b[0],b[1],eave],C=[c[0],c[1],eave],D=[d[0],d[1],eave];
  pushTriangle(output,A,B,ridgeB,color,.99);
  pushTriangle(output,A,ridgeB,ridgeA,color,.99);
  pushTriangle(output,C,D,ridgeA,color,.69);
  pushTriangle(output,C,ridgeA,ridgeB,color,.69);
  pushTriangle(output,D,A,ridgeA,color,.81);
  pushTriangle(output,B,C,ridgeB,color,.77);
 }
 function pitchedTriangle(output,points,height,color){
  const A=points[0],B=points[1],C=points[2];
  const eave=height+.18;
  const avgSide=(distance(A,B)+distance(B,C)+distance(C,A))/3;
  const ridge=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3,eave+Math.max(1.2,Math.min(3.2,avgSide*.25))];
  pushTriangle(output,[...A,eave],[...B,eave],ridge,color,.97);
  pushTriangle(output,[...B,eave],[...C,eave],ridge,color,.73);
  pushTriangle(output,[...C,eave],[...A,eave],ridge,color,.84);
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
    const vs="precision highp float; attribute vec3 a_position; attribute vec3 a_color; uniform mat4 u_matrix; varying vec3 v_color; void main(){gl_Position=u_matrix*vec4(a_position,1.0);v_color=a_color;}";
    const fs="precision mediump float; varying vec3 v_color; void main(){gl_FragColor=vec4(v_color,1.0);}";
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
     if(map.getZoom()<15.2){this.count=0;return;}
     const center=map.getCenter();
     const key=[map.getZoom().toFixed(2),center.lng.toFixed(5),center.lat.toFixed(5)].join("|");
     if(this.lastKey===key&&this.count>0)return;
     const features=map.querySourceFeatures(vectorSource,{sourceLayer:"building"});
     if(!features.length)return;
     const ml=window.maplibregl;
     const origin=ml.MercatorCoordinate.fromLngLat([center.lng,center.lat]);
     const scale=origin.meterInMercatorCoordinateUnits();
     const bounds=map.getBounds(),vertices=[],seen=new Set();
     let accepted=0;
     for(const feature of features){
      if(accepted>=180)break;
      const geometry=feature.geometry;
      if(!geometry||!geometry.coordinates)continue;
      const polys=geometry.type==="Polygon"?[geometry.coordinates]:
       geometry.type==="MultiPolygon"?geometry.coordinates:[];
      for(let pi=0;pi<polys.length&&accepted<180;pi++){
       const ring=polys[pi][0];
       if(!ring||ring.length<4||ring.length>65)continue;
       let lng=0,lat=0,count=0;
       for(const coord of ring){lng+=coord[0];lat+=coord[1];count++;}
       lng/=count;lat/=count;
       if(!bounds.contains([lng,lat]))continue;
       const id=feature.id!=null?String(feature.id)+"-"+pi:
        String(Math.round(lng*1e6))+":"+String(Math.round(lat*1e6))+":"+ring.length;
       if(seen.has(id))continue;
       seen.add(id);
       const polygon=cleanRing(ring.map(p=>{
        const merc=ml.MercatorCoordinate.fromLngLat([p[0],p[1]]);
        return [(merc.x-origin.x)/scale,(merc.y-origin.y)/scale];
       }));
       if(polygon.length<3||polygon.length>28)continue;
       const squareMeters=Math.abs(area(polygon));
       if(squareMeters<16||squareMeters>24000)continue;
       let height=Number(feature.properties?.render_height??feature.properties?.height??9);
       if(!Number.isFinite(height))height=9;
       height=Math.max(5,Math.min(18,height));
       let hash=0;
       for(const char of id)hash=(hash*31+char.charCodeAt(0))|0;
       const color=palettes[(hash>>>0)%palettes.length];
       const parts=polygonPieces(polygon);
       if(!parts.length)continue;
       for(const part of parts){
        if(part.length===4&&isConvexQuad(part))gabledRoof(vertices,part,height,color);
        else if(part.length===3)pitchedTriangle(vertices,part,height,color);
       }
       accepted++;
      }
     }
     if(!vertices.length)return;
     this.count=vertices.length/6;
     this.origin=origin;
     this.scale=scale;
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
   render(arg,matrixArg){
    if(!this.count||!this.origin)return;
    const gl=arg?.gl||arg;
    const projection=arg?.modelViewProjectionMatrix||matrixArg;
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
