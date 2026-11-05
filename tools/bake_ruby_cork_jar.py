"""Build Ruby Mae's collectible cork oddities jar from the original scene painting.
Run: pip install numpy pillow trimesh
     python tools/bake_ruby_cork_jar.py
The exported GLB embeds the original image and 3D oddities; no runtime image fetch.
"""
from pathlib import Path
import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageOps
import trimesh
from trimesh.visual import TextureVisuals
from trimesh.visual.material import PBRMaterial

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/scenes/ruby.webp"
TARGET = ROOT / "assets/satchel/jars/jar_01_ruby_showcase.glb"

def mat(name, color=(255,255,255,255), texture=None, rough=0.65, metal=0, blend=False):
    return PBRMaterial(name=name, baseColorFactor=list(color), baseColorTexture=texture,
                       roughnessFactor=rough, metallicFactor=metal,
                       alphaMode="BLEND" if blend else "OPAQUE", doubleSided=blend)

scene=trimesh.Scene()
def add(mesh, name, material=None, uv=None):
    if material is not None:
        mesh.visual=TextureVisuals(uv=uv, material=material)
    scene.add_geometry(mesh, geom_name=name, node_name=name)

def lathe(points, sides=96):
    vertices=[]; faces=[]; uv=[]
    low=min(y for _,y in points); high=max(y for _,y in points)
    for radius,y in points:
        for k in range(sides+1):
            theta=k*2*math.pi/sides
            vertices.append((radius*math.cos(theta),y,radius*math.sin(theta)))
            uv.append((k/sides,(y-low)/(high-low)))
    row=sides+1
    for j in range(len(points)-1):
        for k in range(sides):
            a=j*row+k; b=a+row
            faces.extend(((a,b,a+1),(a+1,b,b+1)))
    return trimesh.Trimesh(vertices=vertices,faces=faces,process=False),np.array(uv)

def blob(name,xyz,scale,material, subdivisions=2):
    mesh=trimesh.creation.icosphere(subdivisions=subdivisions,radius=1)
    mesh.apply_scale(scale);mesh.apply_translation(xyz)
    add(mesh,name,material)

def stem(name, start, end, radius, material):
    a=np.array(start);b=np.array(end);diff=b-a
    mesh=trimesh.creation.cylinder(radius=radius,height=float(np.linalg.norm(diff)),sections=10)
    mesh.apply_transform(trimesh.geometry.align_vectors((0,0,1),diff/np.linalg.norm(diff)))
    mesh.apply_translation((a+b)/2);add(mesh,name,material)

# Actual hollow bottle body, not a flat silhouette. Neck is open beneath stopper.
glass,uv=lathe([
    (0,.055),(.43,.055),(.51,.067),(.566,.105),(.603,.170),(.620,.290),
    (.630,.530),(.627,.945),(.612,1.085),(.573,1.184),(.490,1.302),
    (.382,1.391),(.365,1.425),(.365,1.554),(.379,1.565),
    (.380,1.585),(.328,1.585),(.322,1.553),(.322,1.437),
    (.349,1.375),(.447,1.268),(.518,1.162),(.559,1.066),
    (.568,.917),(.569,.534),(.565,.307),(.541,.212),(.495,.159),
    (.417,.148),(0,.148)])
add(glass,"Hollow_real_glass",mat("Clear glass",(245,250,255,24),rough=.06,blend=True),uv)

# Natural textured cork, fitted in the mouth with a broader rounded head.
rng=np.random.default_rng(3927);size=512
noise=rng.normal(0,11,(size,size));pigment=np.zeros((size,size,3),dtype=np.uint8)
for j,c in enumerate((176,122,72)): pigment[:,:,j]=np.uint8(np.clip(c+noise,0,255))
cork_img=Image.fromarray(pigment,"RGB")
draw=ImageDraw.Draw(cork_img,"RGBA");r=random.Random(3927)
for k in range(5200):
    x=r.randrange(size);y=r.randrange(size)
    draw.ellipse((x,y,x+2,y+2),fill=(43,27,17,r.randint(20,130)))
cork,uv=lathe([(0,1.403),(.295,1.403),(.307,1.433),(.324,1.492),
  (.328,1.546),(.337,1.571),(.362,1.584),(.372,1.609),
  (.376,1.648),(.366,1.694),(.351,1.715),(.327,1.728),
  (.268,1.737),(.160,1.742),(0,1.744)])
add(cork,"Real_cork_stopper",mat("Porous wine cork",texture=cork_img,rough=.98),uv)

# The original painting is BAKED into this GLB, on a gently curved interior plate.
art=Image.open(SOURCE).convert("RGBA")
paper=Image.new("RGBA",(680,800),(42,32,38,255))
d=ImageDraw.Draw(paper);d.rounded_rectangle((13,12,667,788),radius=23,fill=(166,132,92,255))
fit=ImageOps.fit(art,(626,740),method=Image.Resampling.LANCZOS,centering=(.5,.56))
paper.alpha_composite(fit,((680-fit.width)//2,(800-fit.height)//2))
d=ImageDraw.Draw(paper);d.rounded_rectangle((13,12,667,788),radius=23,outline=(217,173,105),width=9)
verts=[];uv=[];faces=[];segments=32
for row,y in enumerate((.34,1.29)):
    for k in range(segments+1):
        t=(k/segments-.5)*2.10
        verts.append((.52*math.sin(t),y,-.19+.10*(1-math.cos(t))))
        uv.append((k/segments,1-row))
for k in range(segments):
    a=k;b=k+segments+1;faces.extend(((a,b,a+1),(a+1,b,b+1)))
painting=trimesh.Trimesh(vertices=verts,faces=faces,process=False)
paintmat=mat("Actual Ruby Mae painting embedded",texture=paper,rough=.95,blend=True)
paintmat.alphaMode="OPAQUE";paintmat.doubleSided=True
paintmat.emissiveFactor=[.25,.25,.25];paintmat.emissiveTexture=paper
add(painting,"Ruby_Maes_original_art_baked_in_GLb",paintmat,np.array(uv))

# Physical forest-floor specimens and keepsake rosebuds in front of the painting.
soil=mat("Deep forest earth",(55,42,31,255),rough=1)
greens=[mat("Living moss %d"%i,c,rough=1) for i,c in enumerate(((74,88,47,255),(54,78,43,255),(102,100,61,255)))]
petal=mat("Ruby colored preserved rose",(151,52,63,255),rough=.83)
twig=mat("Aged copper and stem",(144,92,56,255),rough=.85,metal=.12)
stone=mat("Little pebbles",(133,119,99,255),rough=.93)
blob("Real_earth_floor",(0,.22,.14),(.49,.08,.30),soil)
for j in range(32):
    a=r.uniform(0,2*math.pi);radius=r.uniform(.14,.42)
    blob("Moss_%02d"%j,(radius*math.cos(a),r.uniform(.255,.30),radius*math.sin(a)),
         (r.uniform(.03,.07),r.uniform(.02,.048),r.uniform(.03,.065)),
         r.choice(greens),subdivisions=1)
for j in range(8):
    a=r.uniform(0,2*math.pi);radius=r.uniform(.17,.40)
    blob("Pebble_%02d"%j,(radius*math.cos(a),.27,radius*math.sin(a)),(.034,.026,.041),stone,1)
for j in range(3):
    x=-.24+.23*j; z=.34
    stem("Rose_stem_%d"%j,(x,.30,z),(x,.51+j*.048,z),.018,twig)
    blob("Three_dimensional_rose_%d"%j,(x,.53+j*.048,z),
         (.067,.062,.067),petal)
scene.metadata.update({"title":"Ruby Mae's original artwork cork curiosity jar",
                       "source":"assets/scenes/ruby.webp",
                       "details":"Real 3D glass, cork, moss, stones, rosebuds, baked image texture"})
TARGET.parent.mkdir(parents=True,exist_ok=True)
scene.export(TARGET)
print("Created",TARGET,"bytes",TARGET.stat().st_size)
