(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,99222,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(90072),o=e.i(8560),l=e.i(18268);let i="Paula López Román",n="©2026",s=[{family:"Lay Grotesk",weight:"500",url:"/portfolio/fonts/LayGrotesk-Medium.woff"},{family:"Teodor",weight:"300",url:"/portfolio/fonts/Teodor-Light.woff"},{family:"Lay Grotesk Regular",weight:"400",url:"/portfolio/fonts/LayGrotesk-Trial-Regular.otf"},{family:"Teodor",weight:"400",url:"/portfolio/fonts/Teodor-Regular.woff"}];e.s(["default",0,function({project:e}){let u=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t,a=u.current;if(!a||!e)return;let c=e.detail||{},d={bg:"#ffffff",ink:"#0a0a0a",ease:.12,pagePadPx:8,topPadPx:200,blockGapPx:8,pairGapPx:8,headGapPx:10,headBotPx:80,headNameSizePx:16,headTypeSizePx:17,headLineMul:1.15,footerTopPx:80,footerBotPx:16,footerSizePx:13,teodor:"'Teodor', serif",grotesk:"'Lay Grotesk', sans-serif",glassBandTopPct:.08,glassBandBotPct:.08,glassStrength:1,glassCurve:1,chromatic:.01},m=window.visualViewport,p=()=>{let e=m?m.height:window.innerHeight;a.style.height=Math.round(e)+"px"};p();let v=a.clientWidth,h=a.clientHeight,f=Math.min(window.devicePixelRatio,2),x=v<=640,g=new r.Scene,P=35*Math.PI/180,y=new r.PerspectiveCamera(35,v/h,1,1e4),w=()=>{y.position.set(v/2,-h/2,h/2/Math.tan(P/2)),y.lookAt(v/2,-h/2,0),y.aspect=v/h,y.updateProjectionMatrix()};w();let S=new o.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});S.setPixelRatio(f),S.setSize(v,h),S.outputColorSpace=r.SRGBColorSpace,S.setClearColor(new r.Color(d.bg),1),S.domElement.style.display="block",S.domElement.style.touchAction="none",S.domElement.style.overscrollBehavior="none",S.domElement.style.webkitUserSelect="none",S.domElement.style.userSelect="none",S.domElement.style.webkitTouchCallout="none",a.querySelectorAll("canvas").forEach(e=>e.parentNode&&e.parentNode.removeChild(e)),a.appendChild(S.domElement);let T=new r.Group;g.add(T);let E=`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,b=`
      uniform sampler2D uTex;
      uniform float uOpacity;
      uniform vec3 uInk;
      uniform float uHighlightOnHover;
      uniform float uHover;
      uniform float uSlide;
      varying vec2 vUv;
      void main() {
        float sampleY=vUv.y+uSlide;
        vec4 c=texture2D(uTex, vec2(vUv.x,clamp(sampleY,0.0,1.0)));
        if(sampleY>1.0) c.a=0.0;
        gl_FragColor = vec4(mix(c.rgb, mix(uInk, c.rgb, uHover), uHighlightOnHover), c.a * uOpacity);
      }
    `,M=`
      uniform sampler2D uTex;
      uniform float uOpacity;
      uniform float uStickerOverlay;
      uniform float uNegative;
      uniform float uFineMatte;
      
      uniform sampler2D uBackdrop;
      uniform vec2 uDrawingSize;
      uniform float uReveal;   // 0 = skeleton placeholder, 1 = loaded media
      uniform float uTime;     // seconds, drives the skeleton shimmer sweep
      uniform vec2 uUvScale;
      uniform vec2 uUvOffset;
      varying vec2 vUv;
      void main() {
        float sweep = fract(uTime * 0.6);
        float pos = (vUv.x + vUv.y) * 0.5;
        float band = smoothstep(0.18, 0.0, abs(pos - sweep));
        vec3 skel = vec3(0.914) + band * 0.05; // ~#E9E9E9, brightening in the band

        vec2 uv = vUv * uUvScale + uUvOffset;
        if (uStickerOverlay > 0.5) {
  vec3 color = texture2D(uTex, vec2(uv.x, 0.501 + 0.498 * uv.y)).rgb;
  float mask = texture2D(uTex, vec2(uv.x, 0.001 + 0.498 * uv.y)).r;
  if (uFineMatte > 0.5) {
    color=texture2D(uTex,vec2(uv.x,0.5+uv.y*0.5)).rgb;
    mask=texture2D(uTex,vec2(uv.x,uv.y*0.5)).r;
  }
  if (uNegative > 0.5) {
    vec3 backdrop = texture2D(uBackdrop, gl_FragCoord.xy / uDrawingSize).rgb;
    color = 1.0 - backdrop;
  }
  gl_FragColor = vec4(color, smoothstep(0.025, 0.985, mask) * uReveal * uOpacity);
  return;
}
vec4 c = texture2D(uTex, uv);

        vec3 rgb = mix(skel, c.rgb, uReveal);
        float a = mix(1.0, c.a, uReveal) * uOpacity;
        gl_FragColor = vec4(rgb, a);
      }
    `,B=new r.WebGLRenderTarget(v*f,h*f,{samples:4,minFilter:r.LinearFilter,magFilter:r.LinearFilter}),C=`
      uniform sampler2D tDiffuse;
      uniform float uBandTop;
      uniform float uBandBot;
      uniform float uStrength;
      uniform float uCurve;
      uniform float uChromaticAberration;
      varying vec2 vUv;

      float sag(float t) {
        t = clamp(pow(t, uCurve), 0.0, 1.0);
        return 1.0 - sqrt(1.0 - t * t);
      }

      void main() {
        vec2 uv = vUv; // uv.y: 0 = bottom, 1 = top
        float dist = 0.0;

        if (uBandTop > 0.0 && uv.y > 1.0 - uBandTop) {
          float t = (uv.y - (1.0 - uBandTop)) / uBandTop;
          dist = sag(t) * uBandTop * uStrength;
          uv.y -= dist;
        } else if (uBandBot > 0.0 && uv.y < uBandBot) {
          float t = (uBandBot - uv.y) / uBandBot;
          dist = sag(t) * uBandBot * uStrength;
          uv.y += dist;
        }

        uv = clamp(uv, vec2(0.0), vec2(1.0));

        if (dist == 0.0 || uChromaticAberration == 0.0) {
          gl_FragColor = texture2D(tDiffuse, uv);
          return;
        }

        vec3 finalColor = vec3(0.0);
        vec3 weightSum = vec3(0.0);
        for (int i = 0; i < 16; i++) {
          float t = float(i) / 15.0;
          vec3 w = vec3(
            smoothstep(0.8, 0.2, t),
            smoothstep(0.0, 0.5, t) * smoothstep(1.0, 0.5, t),
            smoothstep(0.2, 0.8, t)
          );
          float shift = (t - 0.5) * uChromaticAberration * dist * 30.0;
          vec2 sampleUv = clamp(uv + vec2(0.0, shift), vec2(0.0), vec2(1.0));
          finalColor += texture2D(tDiffuse, sampleUv).rgb * w;
          weightSum += w;
        }
        finalColor /= weightSum;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,L={tDiffuse:{value:B.texture},uBandTop:{value:d.glassBandTopPct},uBandBot:{value:d.glassBandBotPct},uStrength:{value:d.glassStrength},uCurve:{value:d.glassCurve},uChromaticAberration:{value:d.chromatic}},D=new r.Scene,A=new r.OrthographicCamera(-1,1,1,-1,0,1),U=new r.Mesh(new r.PlaneGeometry(2,2),new r.ShaderMaterial({uniforms:L,vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,fragmentShader:C,depthTest:!1,depthWrite:!1}));D.add(U);let G=[],k=e=>{let t=e.userData.opts,a=v-2*(t.sideRoom||d.pagePadPx),o=t.maxWidthPx?Math.min(t.maxWidthPx,a):0,{texture:l,wPx:i,hPx:n,ascentPx:s,padPx:u}=((e,t)=>{let a,{sizePx:o,font:l,color:i,maxWidthPx:n=0,lineStepPx:s,align:u="left",letterSpacingPx:c=0}=t,d=e=>{e.font=`${o}px ${l}`,e.textBaseline="alphabetic","letterSpacing"in e&&(e.letterSpacing=`${c}px`)},m=document.createElement("canvas").getContext("2d");d(m);let p=e=>String(e).split(/\r?\n/);if(Array.isArray(e))a=e.flatMap(p);else{let t=p(e);a=n>0?t.flatMap(e=>e.length?((e,t,a)=>{let r=t.split(/\s+/).filter(Boolean),o=[],l="";for(let t of r){let r=l?l+" "+t:t;e.measureText(r).width>a&&l?(o.push(l),l=t):l=r}return l&&o.push(l),o})(m,e,n):[""]):t}0===a.length&&(a=[""]);let v=s||Math.ceil(1.2*o),h=0;a.forEach(e=>{h=Math.max(h,m.measureText(e).width)});let x=Math.ceil(n>0?Math.max(n,h):h)+2,g=m.measureText(a[0]||"M"),P=m.measureText(a[a.length-1]||"M"),y=g.actualBoundingBoxAscent||.8*o,w=P.actualBoundingBoxDescent||.2*o,T=Math.ceil(v*(a.length-1)+y+w)+2,E=document.createElement("canvas");if (t.image) {
  const logoWidth = Math.min(280, t.availableWidthPx - 2);
  const scale = Math.min(logoWidth / t.image.width, 150 / t.image.height);
  x = Math.ceil(t.image.width * scale) + 2;
  T = Math.ceil(t.image.height * scale) + 2;
}E.width=Math.max(1,x*f),E.height=Math.max(1,T*f);let b=E.getContext("2d");b.scale(f,f),d(b),b.fillStyle=i,b.textAlign="center"===u?"center":"left";let M="center"===u?x/2:1;if (t.image) {
  const scale = Math.min((x - 2) / t.image.width, (T - 2) / t.image.height);
  const width = t.image.width * scale;
  const height = t.image.height * scale;
  b.drawImage(t.image, (x - width) / 2, (T - height) / 2, width, height);
} else {
  if (!t.highlights) {
    a.forEach((line,index)=>b.fillText(line,M,1+y+index*v));
  } else {
    const content=String(e).trim().replace(/\s+/g," ");
    const ranges=t.highlights.flatMap(phrase=>{
      const start=content.indexOf(phrase);
      return start<0 ? [] : [[start,start+phrase.length]];
    });
    let offset=0;
    a.forEach((line,index)=>{
      const start=content.indexOf(line,offset);
      offset=start+line.length;
      const baseline=1+y+index*v;
      const left=M-(u==="center"?m.measureText(line).width/2:0);
      const cuts=ranges.flatMap(([from,to])=> from<offset && to>start
        ? [[Math.max(0,from-start),Math.min(line.length,to-start)]] : []);
      const edges=[...new Set([0,line.length,...cuts.flat()])].sort((a,b)=>a-b);
      for(let j=0;j<edges.length-1;j++){
        const from=edges[j],to=edges[j+1];
        const x1=from===0?0:left+m.measureText(line.slice(0,from)).width;
        const x2=to===line.length?x:left+m.measureText(line.slice(0,to)).width;
        b.save();
        b.beginPath();
        b.rect(x1,0,x2-x1,T);
        b.clip();
        b.fillStyle=cuts.some(([lo,hi])=>from>=lo && to<=hi)?i:"#e1e1e1";
        b.fillText(line,M,baseline);
        b.restore();
      }
    });
  }
}let B=new r.CanvasTexture(E);return B.colorSpace=r.SRGBColorSpace,B.minFilter=r.LinearFilter,B.generateMipmaps=!1,B.anisotropy=S.capabilities.getMaxAnisotropy(),{texture:B,wPx:x,hPx:T,ascentPx:y,padPx:1}})(e.userData.input,{...t,maxWidthPx:o,availableWidthPx:a}),c=e.material.uniforms.uTex.value;e.material.uniforms.uTex.value=l,c&&c.dispose(),e.userData.wPx=i,e.userData.hPx=n,e.userData.ascentPx=s,e.userData.padPx=u,e.geometry.dispose(),e.geometry=new r.PlaneGeometry(i,n,1,1)},F=(e,t)=>{let a=new r.ShaderMaterial({uniforms:{uTex:{value:null},uOpacity:{value:1},uInk:{value:new r.Color(t.color)},uHighlightOnHover:{value:Number(Boolean(t.highlights))},uHover:{value:0},uSlide:{value:0}},vertexShader:E,fragmentShader:b,transparent:!0}),o=new r.Mesh(new r.PlaneGeometry(1,1,1,1),a);return o.userData={input:e,opts:t,wPx:1,hPx:1,isText:!0},T.add(o),G.push(o),k(o),t.imageSrc&&(()=>{const image=new Image();image.onload=()=>{t.image=image;k(o);Z()};image.src=t.imageSrc})(),o},R=(e,t,a,r,o)=>{e.position.x=t+r/2,e.position.y=-(a+o/2)},z=(e,t,a)=>{let r=e.mat.uniforms;if(!r.uUvScale)return;let o=t/a,l=e.aspect||o,i=1,n=1;o>l?n=l/o:i=o/l,r.uUvScale.value.set(i,n),r.uUvOffset.value.set((1-i)/2,(1-n)/2)},O=new r.TextureLoader;O.crossOrigin="anonymous";let W=[],_=[],N={value:0},$=1.5*h,H=(e,t,{eager:a=!1,ar:o=null,scrollDriven=false,stickerOverlay=false,pinScreens=0,cartonEntrance=false,bottleDrop=false,editorialSequence=false,packedAlpha=false,fitViewport=false,hoverPlayback=false,visiblePlayback=false}={})=>{let i=(e=>{if(!e)return null;if("string"==typeof e)return e;let t=(x?e.m:e.d)||e.d||e.m||null;if(t&&(0,l.isWebmUrl)(t)&&!(0,l.canUseWebmTexture)(t)){let a=t===e.m?e.d:e.m;if(a&&(!(0,l.isWebmUrl)(a)||(0,l.canUseWebmTexture)(a)))return a}return t})(e),n=!x&&!!t,s=new r.ShaderMaterial({uniforms:{uTex:{value:null},uOpacity:{value:1},uReveal:{value:0},uStickerOverlay:{value:Number(stickerOverlay||cartonEntrance||bottleDrop||packedAlpha)},uTime:N,uNegative:{value:0},uFineMatte:{value:0},uBackdrop:{value:null},uDrawingSize:{value:new r.Vector2(v*f,h*f)},uUvScale:{value:new r.Vector2(1,1)},uUvOffset:{value:new r.Vector2(0,0)}},vertexShader:E,fragmentShader:M,transparent:!0,depthTest:!(stickerOverlay||bottleDrop||editorialSequence),depthWrite:!(stickerOverlay||bottleDrop||editorialSequence)}),u=new r.Mesh(new r.PlaneGeometry(1,1,1,1),s);T.add(u);if(stickerOverlay||bottleDrop||editorialSequence||packedAlpha){u.layers.set(1);u.renderOrder=10}if(cartonEntrance||bottleDrop||editorialSequence)u.visible=false;let c={stickerOverlay,packedAlpha,fitViewport,pinScreens,cartonEntrance,bottleDrop,editorialSequence,mesh:u,mat:s,aspect:n?t:o||1,fixedAspect:n?t:null,naturalAspect:o||null,reveal:0,loaded:!1,loadStarted:!1,yPx:0},d=()=>{if(c.loadStarted||!i)return;c.loadStarted=true;if(editorialSequence){c.loaded=true;return}if(/\.(webm|mp4|m4v|mov)$/i.test(i)){let e=document.createElement("video");a&&(e.fetchPriority="high"),e.src=i,e.loop=!(scrollDriven||visiblePlayback),e.muted=!0,e.playsInline=!0,e.setAttribute("playsinline",""),e.setAttribute("webkit-playsinline",""),e.preload="auto",e.crossOrigin="anonymous",_.push(e);if(scrollDriven){/* iOS Safari: vídeos de scroll */e.style.cssText="position:fixed;left:0;top:0;width:2px;height:2px;opacity:0.01;pointer-events:none;z-index:-1";(document.body||document.documentElement).appendChild(e);const un=window.__scrollVideoUnlock||(window.__scrollVideoUnlock=(()=>{const list=new Set(),go=v=>{if(v.__unlocked)return;const p=v.play();p&&p.then?p.then(()=>{v.pause();v.__unlocked=!0}).catch(()=>{}):(v.pause(),v.__unlocked=!0)},all=()=>list.forEach(go);["touchend","click","pointerup","keydown"].forEach(n=>window.addEventListener(n,all,{passive:!0,capture:!0}));return v=>{list.add(v);go(v)}})());un(e)}let t=new r.VideoTexture(e);scrollDriven&&["seeked","loadeddata","canplay"].forEach(n=>e.addEventListener(n,()=>{t.needsUpdate=!0}));t.colorSpace=r.SRGBColorSpace,t.minFilter=r.LinearFilter,t.magFilter=r.LinearFilter,t.generateMipmaps=!1,s.uniforms.uTex.value=t,s.uniforms.uOpacity.value=1,e.addEventListener("loadedmetadata",()=>{e.videoWidth&&e.videoHeight&&(c.naturalAspect=e.videoWidth/(e.videoHeight/(stickerOverlay||cartonEntrance||bottleDrop||packedAlpha||editorialSequence?2:1)),c.fixedAspect||(c.aspect=c.naturalAspect)),c.loaded=!0,Z()});if (hoverPlayback || visiblePlayback) {
  c.hoverVideo = e;
  c.visiblePlayback = visiblePlayback;
} else if (scrollDriven) {
  c.scrollVideo = e;

} else {
  const play = () => e.play().catch(() => {});
  e.addEventListener("canplay",play,{once:true});
  play();
}}else a&&(0,l.preloadAssets)([i],{priority:"high"}),O.load(i,e=>{e.minFilter=r.LinearMipmapLinearFilter,e.anisotropy=S.capabilities.getMaxAnisotropy(),s.uniforms.uTex.value=e,s.uniforms.uOpacity.value=1,c.naturalAspect=e.image.width/e.image.height,c.fixedAspect||(c.aspect=c.naturalAspect),c.loaded=!0,Z()},void 0,()=>{c.loaded=!0,Z()})};return c.startLoad=d,a&&d(),W.push(c),c},V=(c.blocks||[]).map((e,t)=>{let a=0===t;if (e.type==="copy") {
  const text = (value, sizePx, font, maxWidthPx, highlights) => value ? F(value,{ highlights, sideRoom:e.stage==="seed-copy"?32:0,
    sizePx,font,maxWidthPx,color:d.ink,align:"center",lineStepPx:Math.ceil(sizePx*1.32)
  }) : null;
  return {type:"copy", stage:e.stage, pad:e.pad, padBottom:e.padBottom,
    title:text(e.title,Math.min(48,Math.max(31,v*.048)),d.teodor,760),
    body:text(e.text,16,'"Lay Grotesk Regular", sans-serif',e.bodyWidth||540,e.highlights),scrollReveal:e.scrollReveal,offsetY:e.offsetY||0,opening:0};
}if("pair"===e.type){let[t,r]=e.aspects||[],o=e.ars||[];return{type:"pair",stage:e.stage,cells:[H(e.files&&e.files[0],t||null,{eager:a,ar:o[0]}),H(e.files&&e.files[1],r||null,{eager:a,ar:o[1]})]}}return"spacer"===e.type?{type:"spacer",height:e.height||0,viewportFraction:e.viewportFraction||0}:{type:"full",stage:e.stage,sprites:e.sprites,cell:H(e.file,e.aspect||null,{eager:a,ar:e.ar,scrollDriven:e.scrollDriven,stickerOverlay:e.stickerOverlay,pinScreens:e.pinScreens,cartonEntrance:e.cartonEntrance,bottleDrop:e.bottleDrop,editorialSequence:e.editorialSequence,packedAlpha:e.packedAlpha,fitViewport:e.fitViewport,hoverPlayback:e.hoverPlayback,visiblePlayback:e.stage==="visible-video"})}}),j=e.name?F(e.name,{sizePx:d.headNameSizePx,font:d.grotesk,color:d.ink,align:"center",lineStepPx:Math.round(d.headNameSizePx*d.headLineMul)}):null,q=e.overview?.category?F(e.overview.category,{sizePx:d.headTypeSizePx,font:d.teodor,color:d.ink,align:"center",lineStepPx:Math.round(d.headTypeSizePx*d.headLineMul)}):null,Y={sizePx:d.footerSizePx,font:d.teodor,color:d.ink,align:"center"},I=F(`${i} ${n}`,Y);I.layers.set(1);const isFrisona = e.slug==="frisona";const isVision = e.slug==="vision";const pinnedCell = W.find(cell => cell.stickerOverlay || cell.pinScreens);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const stageSettings = {seeds:{screens:2.8,delay:0},turn:{screens:3.4,delay:0},notes:{screens:2.5,delay:550},milk:{screens:2.6,delay:0},"milk-logo":{screens:2.4,delay:0}};
const scrollScenes = V.filter(block=>stageSettings[block.stage]).map(block=>({
  cell:block.cell,kind:block.stage,...stageSettings[block.stage],start:0,holdStart:null,ready:false
}));
const boxes = scrollScenes.some(scene=>scene.kind==="seeds") ? V.find((block,index)=>V[index+1]?.stage==="seeds")?.cell : null;
const seedScene=scrollScenes.find(scene=>scene.kind==="seeds");
const seedCopy=V.find(block=>block.stage==="seed-copy")?.body;
const seedSpecs=V.find(block=>block.stage==="seeds")?.sprites;
const seedSprites=seedCopy && seedSpecs ? seedSpecs.map(spec=>{
  const material=new r.MeshBasicMaterial({transparent:true,depthTest:false,depthWrite:false});
  const mesh=new r.Mesh(new r.PlaneGeometry(1,1),material);
  mesh.layers.set(1);
  mesh.renderOrder=16;
  mesh.visible=false;
  T.add(mesh);
  O.load("/portfolio/media/"+spec.file,texture=>{
    texture.colorSpace=r.SRGBColorSpace;
    material.map=texture;
    material.needsUpdate=true;
  });
  return {...spec,mesh};
}) : [];
// The text is already rendered to a canvas. Its alpha gives us the highest
// visible point of the glyphs for each landing column, including after wraps.
const findSeedLandings = () => {
  if(!seedSprites.length) return;
  const canvas=seedCopy.material.uniforms.uTex.value.image;
  const {width,height}=canvas;
  const ink=canvas.getContext("2d").getImageData(0,0,width,height).data;
  const {wPx,hPx}=seedCopy.userData;
  const left=(v-wPx)/2;
  const geometry=seedScene.cell.mesh.geometry.parameters;
  seedSprites.forEach((sprite,index)=>{
    const halfWidth=sprite.width*geometry.width/3840;
    const halfHeight=sprite.height*geometry.height/2160;
    const sourceX=(v-geometry.width)/2+sprite.x/1920*geometry.width;
    const sourceY=(h-geometry.height)/2+sprite.y/1080*geometry.height;
    const edge=index===0?-1:index===seedSprites.length-1?1:0;
    // The outside seeds clear the text even when it wraps across a narrow screen.
    const clearX=edge<0?left-halfWidth*.65:left+wPx+halfWidth*.65;
    sprite.targetX=edge ? Math.max(halfWidth,Math.min(v-halfWidth,
      edge<0?Math.min(sourceX,clearX):Math.max(sourceX,clearX))) : sourceX;
    const contactWidth=halfWidth*.44;
    const from=Math.max(0,Math.floor((sprite.targetX-contactWidth-left)/wPx*width));
    const to=Math.min(width,Math.ceil((sprite.targetX+contactWidth-left)/wPx*width));
    const startY=Math.max(0,Math.floor((seedScene.start+sourceY+halfHeight-seedScene.textTop)/hPx*height));
    let targetRow=height;
    if(!edge){
      rows: for(let y=startY;y<height;y++){
        for(let x=from;x<to;x++){
          if(ink[(y*width+x)*4+3]>150){targetRow=y;break rows;}
        }
      }
    }
    sprite.landsOnText=targetRow<height;
    sprite.targetY=sprite.landsOnText
      ? seedScene.textTop+targetRow/height*hPx-halfHeight-8
      : seedScene.start+h-Math.min(18,h*.03)-halfHeight;
  });
};
const sceneTravel = scene => h*scene.screens;
const logoCaption = e.slug === "cha-cha"
  ? V.find((block,index) => block.scrollReveal && V[index-1]?.stage === "small-artwork")
  : null;
const logoHoldDistance = () => logoCaption && !reducedMotion.matches ? h*.58 : 0;
const sceneScrollRoom = () => logoHoldDistance()+scrollScenes.reduce((distance,scene)=>distance+sceneTravel(scene),0);
let cowsTop=0, milkTop=0;
const cartonEntranceDistance = () => pinnedCell?.cartonEntrance && !reducedMotion.matches ? Math.max(900,h*1.8) : 0;
const pinDistance = () => pinnedCell ? Math.max(1800,(pinnedCell.pinScreens || 2.5)*h) + cartonEntranceDistance() : 0;let Q=h,X=(e,t)=>(R(e,(v-e.userData.wPx)/2,t,e.userData.wPx,e.userData.hPx),t+e.userData.hPx),Z=()=>{let e,t=v-2*d.pagePadPx,a=d.topPadPx;const hasLogo = Boolean(j?.userData.opts.imageSrc);
const headingLift = hasLogo ? 84 : 0;
const pinnedHeadingLift = hasLogo && pinnedCell?.pinScreens ? 32 : 0;
a -= headingLift + pinnedHeadingLift;
if (j) {
  if (hasLogo) a += Math.max(0, 152 - j.userData.hPx);
  a = X(j,a);
}
j&&q&&(a+=hasLogo?32:d.headGapPx),q&&(a=X(q,a)),[j,q].forEach(heading=>{if(heading)heading.userData.baseY=heading.position.y}),a+=pinnedHeadingLift,(j||q)&&(a+=V[0]?.cell?.scrollVideo&&!pinnedCell?.stickerOverlay?12:d.headBotPx+headingLift);let o=a;V.forEach(e=>{
  if(e.type==="copy"){
    if(e.stage==="seed-copy" && seedSprites.length){
      const position=seedScene.start+h-seedCopy.userData.hPx-Math.min(66,h*.10);
      seedScene.textTop=position;
      X(seedCopy,position);
      findSeedLandings();
      a+=Math.min(128,h*.18);
      o=a;
      return;
    }
    const pad = v<640 ? e.pad*.72 : e.pad;
    if(e.scrollReveal){
      e.anchor=a;
      const copyHeight=(e.title?.userData.hPx||0)+(e.body?.userData.hPx||0)+(e.title&&e.body?16:0);
      const bottomPad=e.padBottom == null ? pad : e.padBottom*(v<640 ? .72 : 1);
      const height=10+(copyHeight+pad+bottomPad-10)*e.opening;
      const reveal=Math.max(0,Math.min(1,(e.opening-.55)/.45));
      let top=a+(height-copyHeight)/2+((pad-bottomPad)/2+e.offsetY)*e.opening;
      for(const mesh of [e.title,e.body]){
        if(!mesh)continue;
        mesh.visible=reveal>0;
        mesh.material.uniforms.uSlide.value=(1-reveal)**3;
        top=X(mesh,top)+16;
      }
      a+=height;
      o=a;
      return;
    }
    a+=pad;
    if(e.title) a=X(e.title,a);
    if(e.title&&e.body) a+=16;
    if(e.body) a=X(e.body,a);
    a+=pad;
    o=a;
    return;
  }
  if (e.cell===boxes && boxes) {
    const width=Math.min(t,(h-64)*boxes.aspect);
    const height=width/boxes.aspect;
    boxes.mesh.geometry.dispose();
    boxes.mesh.geometry=new r.PlaneGeometry(width,height,1,1);
    R(boxes.mesh,(v-width)/2,a+(h-height)/2,width,height);
    boxes.yPx=a;
    boxes.heightPx=height;
    a+=h;
    o=a;
    return;
  }
  if (e.stage==="cows") {
    const cell=e.cell;
    cowsTop=a;
    cell.mesh.geometry.dispose();
    cell.mesh.geometry=new r.PlaneGeometry(v,h,1,1);
    R(cell.mesh,0,a,v,h);
    z(cell,v,h);
    cell.yPx=a;
    cell.heightPx=h;
    a+=h+d.blockGapPx;
    o=a;
    return;
  }
  const scene=scrollScenes.find(scene=>scene.cell===e.cell);
  if (scene) {
    const cell=scene.cell;
    const notes=scene.kind==="notes";
    const milk=scene.kind==="milk";
    const milkLogo=scene.kind==="milk-logo";
    if (milk) milkTop=a;
    const width=notes||milk||scene.kind==="seeds"?v:milkLogo?Math.min(t*.85,h*.82*cell.aspect):Math.min(t,(h-24)*cell.aspect);
    const height=notes||milk?h:scene.kind==="seeds"?Math.min(h-24,width/cell.aspect):width/cell.aspect;
    scene.start=notes?cowsTop:milkLogo?milkTop:a;
    cell.mesh.geometry.dispose();
    cell.mesh.geometry=new r.PlaneGeometry(width,height,1,1);
    R(cell.mesh,(v-width)/2,scene.start+(h-height)/2,width,height);
    cell.yPx=scene.start;
    cell.heightPx=height;
    if (notes) {
      z(cell,width,height);
      cell.mat.uniforms.uNegative.value=1;
      cell.mat.uniforms.uBackdrop.value=B.texture;
      S.getDrawingBufferSize(cell.mat.uniforms.uDrawingSize.value);
    } else if (milkLogo) {
      cell.mesh.renderOrder=11;
    } else {
      if (milk) { z(cell,width,height); cell.mat.uniforms.uFineMatte.value=1; }
      a+=h+d.blockGapPx;
      o=a;
    }
    return;
  }
  if (e.cell?.stickerOverlay) {
    const width = Math.min(t, h * (16 / 9));
    const height = width * (9 / 16);
    e.cell.mesh.geometry.dispose();
    e.cell.mesh.geometry = new r.PlaneGeometry(width,height,1,1);
    R(e.cell.mesh,(v-width)/2,Math.max(0,(h-height)/2-68),width,height);
    a = Math.max(a,h) + d.blockGapPx;
    o = a;
    return;
  }
if (e.cell?.pinScreens) {
  const cell = e.cell;
  const aspect = cell.aspect;
  if (cell.bottleDrop) a = Math.max(a, Math.min(310, h*0.44));
  const availableHeight = Math.max(1,h-a-32);
  const vision = cell === pinnedCell && isVision;
const width = vision
  ? Math.min(t*1.1,availableHeight*aspect,Math.max(1,(h-350)*1.12)*aspect)
  : Math.min(t,availableHeight*aspect);
  const height = width/aspect;
  cell.mesh.geometry.dispose();
  cell.mesh.geometry = new r.PlaneGeometry(width,height,1,1);
  R(cell.mesh,(v-width)/2,a,width,height);
  cell.yPx=a;
  cell.heightPx=height;
  a = Math.max(a+height,h) + d.blockGapPx;
  o = a;
  return;
}
if (e.stage==="viewport-pair") {
  const stacked=v/h<.85;
  const width=stacked?v:(v-d.pairGapPx)/2;
  const height=stacked?(h-d.pairGapPx)/2:h;
  e.cells.forEach((cell,index)=>{
    const top=a+(stacked?index*(height+d.pairGapPx):0);
    const left=stacked?0:index*(width+d.pairGapPx);
    cell.mesh.geometry.dispose();
    cell.mesh.geometry=new r.PlaneGeometry(width,height,1,1);
    R(cell.mesh,left,top,width,height);
    const uniforms=cell.mat.uniforms;
    const scaleX=Math.max(1,width/(height*cell.aspect));
    const scaleY=Math.max(1,height*cell.aspect/width);
    uniforms.uUvScale.value.set(scaleX,scaleY);
    uniforms.uUvOffset.value.set((1-scaleX)/2,(1-scaleY)/2);
    cell.yPx=top;
    cell.heightPx=height;
  });
  a+=h+d.blockGapPx;
  o=a;
  return;
}
if (e.stage==="small-artwork") {
  const cell=e.cell;
  const artworkIsWide=cell.aspect>1;
  const width=artworkIsWide?Math.min(t*.72,h*.71*cell.aspect):Math.min(t*.34,h*.38*cell.aspect,320);
  const height=width/cell.aspect;
  cell.mesh.geometry.dispose();
  cell.mesh.geometry=new r.PlaneGeometry(width,height,1,1);
  R(cell.mesh,(v-width)/2,a+32,width,height);
  cell.yPx=a+32;
  cell.heightPx=height;
  a+=height+64+d.blockGapPx;
  o=a;
  return;
}
if (e.stage==="isolated-image") {
  const cell=e.cell;
  const width=Math.min(t,h*.88*cell.aspect);
  const height=width/cell.aspect;
  const top=a+(h-height)/2;
  cell.mesh.geometry.dispose();
  cell.mesh.geometry=new r.PlaneGeometry(width,height,1,1);
  R(cell.mesh,(v-width)/2,top,width,height);
  cell.yPx=top;
  cell.heightPx=height;
  a+=h+d.blockGapPx;
  o=a;
  return;
}
if (e.stage==="spoon") {
  const cell=e.cell;
  const width=Math.min(v+2,h*cell.aspect);
  const height=width/cell.aspect;
  cell.mesh.geometry.dispose();
  cell.mesh.geometry=new r.PlaneGeometry(width,height,1,1);
  R(cell.mesh,v-width+2,a+(h-height)/2,width,height);
  cell.yPx=a;
  cell.heightPx=height;
  a+=h+d.blockGapPx;
  o=a;
  return;
}
if (e.cell?.fitViewport) {
  const cell=e.cell;
  const width=Math.min(t*.92,h*.82*cell.aspect);
  const height=width/cell.aspect;
  cell.mesh.geometry.dispose();
  cell.mesh.geometry=new r.PlaneGeometry(width,height,1,1);
  R(cell.mesh,(v-width)/2+(e.stage==="dieline-shift"?Math.min(26,(v-width)*.22):0),a,width,height);
  cell.yPx=a;
  cell.heightPx=height;
  a+=height+d.blockGapPx;
  o=a;
  return;
}
if("full"===e.type){let l=t/(e.cell.aspect||1);e.cell.mesh.geometry.dispose(),e.cell.mesh.geometry=new r.PlaneGeometry(t,l,1,1),R(e.cell.mesh,d.pagePadPx,a,t,l),e.cell.yPx=a,e.cell.heightPx=l,a+=l,o=a,a+=d.blockGapPx}else if("pair"===e.type)if(x)e.cells.forEach((o,l)=>{let i=t/(o.aspect||1);o.mesh.geometry.dispose(),o.mesh.geometry=new r.PlaneGeometry(t,i,1,1),R(o.mesh,d.pagePadPx,a,t,i),z(o,t,i),o.yPx=a,a+=i,l<e.cells.length-1&&(a+=d.pairGapPx)}),o=a,a+=d.blockGapPx;else{let l=(t-d.pairGapPx)/2,i=Math.max(...e.cells.map(e=>l/(e.aspect||1)));e.cells.forEach((e,t)=>{e.mesh.geometry.dispose(),e.mesh.geometry=new r.PlaneGeometry(l,i,1,1);let o=d.pagePadPx+t*(l+d.pairGapPx);R(e.mesh,o,a,l,i),z(e,l,i),e.yPx=a}),a+=i,o=a,a+=d.blockGapPx}else"spacer"===e.type&&(a+=(e.height==="viewport"?h:e.height+h*e.viewportFraction),o=a)});let l=o+d.footerTopPx;
if (isFrisona && scrollScenes.some(scene=>scene.kind==="milk-logo")) {
  I.visible=false;
  I.renderOrder=20;
  X(I,milkTop+h-I.userData.hPx-18);
  Q=Math.max(h,o);
  return;
}
I.visible=true;Q=Math.max(h,X(I,l)+d.footerBotPx)},ee=()=>{a.clientWidth,d.pagePadPx=8,d.blockGapPx=8,d.pairGapPx=8};ee(),G.forEach(k),Z(),"FontFace"in window&&Promise.all(s.map(async e=>{try{let t=new FontFace(e.family,`url(${e.url})`,{weight:e.weight,style:"normal"});await t.load(),document.fonts.add(t)}catch{}})).then(()=>{G.forEach(k),Z()});let et=0,ea=0,er=0,eo=!1,el=()=>Math.max(0,Q-h)+pinDistance()+sceneScrollRoom(),ei=e=>Math.min(el(),Math.max(0,e)),en=e=>{
  if (e.ctrlKey) return;
  e.preventDefault();
  const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?h:1);
  if (returnFromEdge(delta)) return;
  eo=false;
  er=0;
  et=ei(et+delta*projectScrollRate);
};const documentScroll = !!pinnedCell?.editorialSequence;
const projectScrollRate=.72;
const scrollRoot = a.parentElement;
let documentHeight = 0;
// Continued input at either edge returns to the project selection.
const listPath = "/portfolio/projects";
const referrer = document.referrer ? new URL(document.referrer) : null;
const returnPath = location.hash === "#desde-nube"
  ? "/portfolio/#nube"
  : location.hash === "#desde-proyectos" ||
      (referrer?.origin === location.origin && referrer.pathname.replace(/\/$/, "") === listPath)
    ? listPath : null;
let leavingProject = false, edgePixels = 0, lastEdgeInput = 0, edgeDirection = 0;
const returnFromEdge = delta => {
  if (!returnPath || leavingProject) return leavingProject;
  const direction = Math.sign(delta);
  const atStart = direction < 0 && (documentScroll ? window.scrollY <= 1 : et <= 1 && ea <= 2);
  const atEnd = direction > 0 && el()-ea <= 2 &&
    (!documentScroll || window.scrollY + h >= scrollRoot.offsetHeight - 2);
  if (!atStart && !atEnd) {
    edgePixels = 0;
    return false;
  }
  const now = performance.now();
  if (direction !== edgeDirection || now-lastEdgeInput > 420) edgePixels = 0;
  edgeDirection = direction;
  lastEdgeInput = now;
  edgePixels += Math.abs(delta);
  if (edgePixels < 36) return false;
  navigateFromProject(returnPath, atEnd);
  return true;
};
const navigateFromProject = (destination, animate) => {
  leavingProject = true;
  if (!animate || reducedMotion.matches) {
    window.location.assign(destination);
    return true;
  }
  const fade = document.createElement("div");
  fade.setAttribute("data-case-white-fade", "");
  fade.setAttribute("aria-hidden", "true");
  document.body.append(fade);
  window.addEventListener("pageshow", () => {
    fade.remove();
    leavingProject = false;
    edgePixels = 0;
  }, { once: true });
  fade.animate([{opacity:0}, {opacity:1}], {
    duration: 750,
    easing: "ease-in-out",
    fill: "forwards"
  }).finished.then(() => window.location.assign(destination));
  return true;
};
const projectOrder = ["cha-cha", "vision", "frisona", "gajo"];
const currentProjectIndex = projectOrder.indexOf(e.slug);
const changeProject = delta => {
  if (leavingProject || currentProjectIndex < 0) return;
  const index = (currentProjectIndex + Math.sign(delta) + projectOrder.length) % projectOrder.length;
  const origin = returnPath === "/portfolio/#nube" ? "#desde-nube" : "#desde-proyectos";
  navigateFromProject(listPath + "/" + projectOrder[index] + origin, true);
};
let horizontalPixels = 0, lastHorizontalInput = 0;
const horizontalWheel = event => {
  const x = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
  const y = event.shiftKey ? 0 : event.deltaY;
  if (event.ctrlKey || !x || Math.abs(x) <= Math.abs(y) || currentProjectIndex < 0) return;
  if (event.cancelable) event.preventDefault();
  event.stopPropagation();
  const now = performance.now();
  if (now - lastHorizontalInput > 200 || Math.sign(x) !== Math.sign(horizontalPixels)) horizontalPixels = 0;
  lastHorizontalInput = now;
  horizontalPixels += x * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? v : 1);
  if (Math.abs(horizontalPixels) >= 55) changeProject(horizontalPixels);
};
let touchOrigin = null;
const startProjectSwipe = event => {
  const touch = event.touches.length === 1 ? event.touches[0] : null;
  touchOrigin = touch ? { x: touch.clientX, y: touch.clientY, axis: null } : null;
};
const moveProjectSwipe = event => {
  if (!touchOrigin || event.touches.length !== 1) return;
  const x = touchOrigin.x - event.touches[0].clientX;
  const y = touchOrigin.y - event.touches[0].clientY;
  if (!touchOrigin.axis && Math.max(Math.abs(x), Math.abs(y)) >= 12) {
    touchOrigin.axis = Math.abs(x) > Math.abs(y) * 1.3 ? "x" : "y";
  }
  if (touchOrigin.axis !== "x" || currentProjectIndex < 0) return;
  if (event.cancelable) event.preventDefault();
  event.stopPropagation();
  if (Math.abs(x) >= 60) changeProject(x);
};
window.addEventListener("wheel", horizontalWheel, {capture:true, passive:false});
window.addEventListener("touchstart", startProjectSwipe, {capture:true, passive:true});
window.addEventListener("touchmove", moveProjectSwipe, {capture:true, passive:false});
const documentReturnWheel = event => {
  if (!event.ctrlKey && returnFromEdge(event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? h : 1))) {
    event.preventDefault();
  }
};
let returnTouchY = null;
const documentReturnTouchStart = event => {
  returnTouchY = event.touches.length === 1 ? event.touches[0].clientY : null;
};
const documentReturnTouchMove = event => {
  if (returnTouchY === null || event.touches.length !== 1) return;
  const nextY=event.touches[0].clientY;
  if (returnFromEdge(returnTouchY-nextY) && event.cancelable) event.preventDefault();
  returnTouchY=nextY;
};
if (documentScroll && returnPath) {
  window.addEventListener("wheel",documentReturnWheel,{passive:false});
  window.addEventListener("touchstart",documentReturnTouchStart,{passive:true});
  window.addEventListener("touchmove",documentReturnTouchMove,{passive:false});
}
if (documentScroll) {
  Object.assign(a.style,{position:"absolute",inset:"0",touchAction:"pan-y",overscrollBehavior:"auto"});
  Object.assign(S.domElement.style,{position:"fixed",top:"0",left:"0",zIndex:"1",touchAction:"pan-y"});
  document.body.appendChild(S.domElement);
} else {
  a.addEventListener("wheel",en,{passive:false});
}let es=0,eu=!1,ec=0,ed=e=>{if(1!==e.touches.length){eu=!1;return}eu=!0,eo=!0,es=e.touches[0].clientY,ec=performance.now(),er=0},em=e=>{if(!eu||1!==e.touches.length)return;e.cancelable&&e.preventDefault();let t=e.touches[0].clientY,a=es-t;es=t;let r=performance.now(),o=Math.max(1,r-ec);ec=r,returnFromEdge(a)||(er=a/o*16,et=ei(et+a))},ep=e=>{0===e.touches.length&&(eu=!1)};if(!documentScroll){a.addEventListener("touchstart",ed,{passive:true});a.addEventListener("touchmove",em,{passive:false});a.addEventListener("touchend",ep,{passive:true});a.addEventListener("touchcancel",ep,{passive:true});}const cartonTurnStart=0.3, cartonTurnEnd=0.75, cartonTurnSeconds=8.2;
const updateCartonEntrance = (cell, scrollPosition) => {
  if (!cell.cartonEntrance || !cell.heightPx) return;
  const distance = cartonEntranceDistance();
  const progress = distance ? Math.min(1,Math.max(0,scrollPosition/distance)) : 1;
const arrival = 1 - Math.pow(1-Math.min(1,progress/cartonTurnStart),3);
const crossing = Math.max(0,(progress-cartonTurnEnd)/(1-cartonTurnEnd));
const centerTravel = crossing*crossing*(3-2*crossing);
const centerY = -cell.yPx-cell.heightPx/2;
const rightX = v*0.76;
const startX = v+cell.heightPx*0.35;
const mesh = cell.mesh;
mesh.visible = true;
mesh.position.x = startX+(rightX-startX)*arrival+(v/2-rightX)*centerTravel;
mesh.position.y = centerY*arrival+cell.heightPx*0.3*(1-arrival);
mesh.rotation.z = 1.35*(1-arrival);
};
const updateBottleDrop = (cell, scrollPosition) => {
  if (!cell.bottleDrop || !cell.heightPx) return;
  const progress = reducedMotion.matches ? 1 : Math.min(1,Math.max(0,scrollPosition/(pinDistance()/2)));
  const fall = progress*progress*(3-2*progress);
  const targetY = -cell.yPx-cell.heightPx/2;
  cell.mesh.position.y = (cell.heightPx/2+16)*(1-fall)+targetY*fall;
  cell.mesh.visible = true;
};
const editorialTurnSeconds = 8.85;
const editorialFrameRate = 30;
const editorialFrameCount = 1466;
const editorialDuration = (editorialFrameCount-1)/editorialFrameRate;
const editorialTime = progress => progress*(editorialDuration+editorialTurnSeconds);
const editorialFrames = new Map();
const repairedEditorialFrames = new Set([1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1170, 1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179, 1180, 1181, 1182, 1183, 1184, 1185, 1186, 1187, 1188, 1189, 1190, 1191, 1192, 1193, 1194, 1195, 1201, 1202, 1203, 1204, 1205, 1206, 1207]);
let smoothedEditorialScroll;
let lastEditorialTick;
let editorialDirection = 1;
let requestedEditorialFrame = -1;
let displayedEditorialFrame = -1;
const updateEditorialFrame = (cell, time) => {
  const sourceTime = time < editorialTurnSeconds ? time : time-editorialTurnSeconds;
  const index = Math.min(editorialFrameCount-1,Math.round(sourceTime*editorialFrameRate));
  const show = (key,texture) => {
    if (requestedEditorialFrame !== key) return;
    cell.mat.uniforms.uTex.value = texture;
    displayedEditorialFrame = key;
  };
  const load = key => {
    if (key < 0 || key >= editorialFrameCount || editorialFrames.has(key)) return;
    editorialFrames.set(key,null);
    const suffix = repairedEditorialFrames.has(key) ? "-completo" : "";
    O.load("/portfolio/media/vision-scroll-frames-30fps/"+key+suffix+".webp", texture => {
      texture.colorSpace=r.NoColorSpace;
      texture.minFilter=r.LinearFilter;
      texture.generateMipmaps=false;
      editorialFrames.set(key,texture);

      for (const [cached,asset] of editorialFrames) {
        if (asset && Math.abs(cached-requestedEditorialFrame)>7 && cached!==displayedEditorialFrame) {
          asset.dispose();
          editorialFrames.delete(cached);
        }
      }
    },undefined,()=>editorialFrames.delete(key));
  };
  if (index !== requestedEditorialFrame) editorialDirection = Math.sign(index-requestedEditorialFrame);
  requestedEditorialFrame = index;
  // Prefer the target frame, then a decoded frame on the way to it.
  for (let distance=0; distance<=6; distance++) {
    const candidate=index-distance*editorialDirection;
    const cached=editorialFrames.get(candidate);
    if (cached && (distance===0 || displayedEditorialFrame<0 ||
        (candidate-displayedEditorialFrame)*editorialDirection>0)) {
      show(index,cached);
      displayedEditorialFrame=candidate;
      break;
    }
  }
  for (const offset of [0,1,2,3,4,5,6,-1,-2]) load(index+offset*editorialDirection);
};
if (pinnedCell?.editorialSequence) {
  for (const heading of [j,q]) {
    if (!heading) continue;
    heading.layers.set(1);
    heading.renderOrder = 5;
    heading.material.depthTest = false;
  }
}
const updateEditorialSequence = (cell, scrollPosition) => {
  if (!cell.editorialSequence || !cell.heightPx) return;
const time = editorialTime(Math.max(0,Math.min(1,scrollPosition/pinDistance())));
updateEditorialFrame(cell,time);
  const ease = value => {
    const progress = Math.max(0,Math.min(1,value));
    return progress*progress*(3-2*progress);
  };
  const dropProgress = Math.min(1,time/(2*editorialTurnSeconds));
  const arrival = reducedMotion.matches ? 1 : 1-Math.pow(1-dropProgress,3);
  const opening = ease((time-2*editorialTurnSeconds)/0.28);
  const normalY = -cell.yPx-cell.heightPx/2;
  const openingY = -h/2;
  // The diagonal credits spread needs a little more room than the flat pages.
  const sourceTime = time-editorialTurnSeconds;
  const creditsInset = ease((sourceTime-37.5)/0.75)*(1-ease((sourceTime-40.35)/0.85));
  const expandedHeight = Math.max(cell.heightPx,Math.min(h*(.99-.13*creditsInset),(v-24)*1.32/cell.aspect));
  const size = 1+(expandedHeight/cell.heightPx-1)*opening;
  const initialY = cell.heightPx/2+24;
  cell.mesh.position.y = initialY*(1-arrival)+normalY*arrival+(openingY-normalY)*opening;
  const frameHeight = repairedEditorialFrames.has(displayedEditorialFrame) ? 668/540 : 1;
  cell.mesh.scale.set(size,size*frameHeight,size);
  cell.mesh.visible = displayedEditorialFrame >= 0;
  for (const heading of [j,q]) {
    if (heading) heading.position.y = heading.userData.baseY+h*opening;
  }
};
const updateFrisonaFraming = (cell, scrollPosition) => {
  if (!isFrisona || cell !== pinnedCell || !cell.heightPx) return;
  const duration = cell.scrollVideo?.duration;
  if (!Number.isFinite(duration)) return;
  const seconds = duration * Math.min(1,Math.max(0,scrollPosition/pinDistance()));
  const ease = value => {
    const progress = Math.min(1,Math.max(0,value));
    return progress*progress*(3-2*progress);
  };
  const leaveHeading = ease(seconds/4);
  const expand = ease((seconds-8.25)/1.1);
  const startCenter = cell.yPx+cell.heightPx/2;
  // In the pour the source runs beyond its top and bottom. Match those
  // edges to the viewport so the milk and the carton leave the screen itself.
  const fullWidth=Math.max(v,h*cell.aspect);
  const scaleX=1+(fullWidth/(cell.heightPx*cell.aspect)-1)*expand;
  const scaleY=1+(h/cell.heightPx-1)*expand;
  const sourceCenter=.51-.055*ease((seconds-11)/2);
  const cropOffset=Math.max(-((fullWidth-v)/2),Math.min((fullWidth-v)/2,(.5-sourceCenter)*fullWidth));
  cell.mesh.scale.set(scaleX,scaleY,1);
  cell.mesh.position.x=v/2+cropOffset*expand;
  cell.mesh.position.y=-(startCenter+(h/2-startCenter)*Math.max(leaveHeading,expand));
  for (const heading of [j,q]) {
    if (heading) heading.position.y=heading.userData.baseY+h*leaveHeading;
  }
};
const updateScrollVideo = (cell, scrollPosition) => {
  const video = cell.scrollVideo;
  if (!video || !Number.isFinite(video.duration)) return;
  const pinned = cell === pinnedCell;
  const start = pinned ? cartonEntranceDistance() : Math.max(0, cell.yPx - h * 0.8);
  const distance = pinned ? pinDistance() - start : Math.max(cell.heightPx, h * 0.5);
  const progress = Math.min(1, Math.max(0, (scrollPosition - start) / distance));
  let time = progress * Math.max(0, video.duration - (pinned ? 0.018 : 0.04));


if (cell.cartonEntrance && start > 0 && scrollPosition < start) {
  const entrance = scrollPosition/start;
  const turn = (entrance-cartonTurnStart)/(cartonTurnEnd-cartonTurnStart);
  time = Math.min(1,Math.max(0,turn))*cartonTurnSeconds;
}
  if (video.seeking && (!cell.editorialSequence ||
    performance.now() - (cell.lastSeekAt ?? 0) < 250 ||
    Math.abs(time - (cell.lastSeekTime ?? time)) < 0.12)) return;
if (Math.abs(video.currentTime-time) >= (pinned ? 0.012 : 0.025)) {
  cell.lastSeekAt = performance.now();
  cell.lastSeekTime = time;
  video.currentTime = time;
}
};
let ev=0,eh=!1,ef=()=>{t=requestAnimationFrame(ef),!eh&&++ev>=2&&(eh=!0,window.__pageContentReady=!0,window.dispatchEvent(new Event("page-content-ready"))),!eu&&Math.abs(er)>.05?(et=ei(et+er),er*=.95,(et<=0||et>=el())&&(er=0)):eu||(er=0),eo?ea=et:ea+=(et-ea)*d.ease,N.value=performance.now()/1e3;
if (documentScroll) {
  const height = Math.ceil(h+el()/projectScrollRate);
  if (documentHeight !== height) {
    scrollRoot.style.minHeight = height+"px";
    documentHeight = height;
  }
  const offset = window.scrollY*projectScrollRate;
    const now = performance.now();
  const target = ei(offset);
  const elapsed = lastEditorialTick === undefined ? 0 : now-lastEditorialTick;
  smoothedEditorialScroll ??= target;
  smoothedEditorialScroll += (target-smoothedEditorialScroll)*(1-Math.exp(-elapsed/105));
  if (Math.abs(target-smoothedEditorialScroll)<0.5) smoothedEditorialScroll=target;
  lastEditorialTick=now;
  et=ea=smoothedEditorialScroll;
}
const pinnedVideo = pinnedCell?.scrollVideo;
const finished = documentScroll ? displayedEditorialFrame===editorialFrameCount-1 : pinnedVideo && (pinnedVideo.error ||
  (Number.isFinite(pinnedVideo.duration) && !pinnedVideo.seeking && pinnedVideo.currentTime >= pinnedVideo.duration - 0.04));
let afterIntro = !pinnedCell || finished ? Math.max(0,ea-pinDistance()) : 0;
let pageScroll = afterIntro;
for (const scene of scrollScenes) {
  const position=pageScroll;
  const entered=position>=scene.start-.5;
  if (!scene.ready && entered) {
    scene.holdStart ??= performance.now();
    scene.ready=performance.now()-scene.holdStart>=scene.delay;
    if (scene.delay>0) {
      const holdAt=pinDistance()+afterIntro-position+scene.start;
      et=Math.min(et,holdAt);
      ea=Math.min(ea,holdAt);
      er=0;
      pageScroll=scene.start;
      scene.cell.mesh.visible=scene.kind==="turn";
      break;
    }
  } else if (!scene.ready) {
    scene.holdStart=null;
  }
  const progress=Math.max(0,position-scene.start);
  const travel=sceneTravel(scene);
  if (scene.ready) pageScroll=position-Math.min(progress,travel);
  const video=scene.cell.scrollVideo;
  if (video && Number.isFinite(video.duration)) {
    const playbackFraction=scene.kind==="notes" ? .9 : scene.kind==="milk" || scene.kind==="milk-logo" ? .90 : 1;
    const time=scene===seedScene && seedSprites.length
      ? Math.min(1,progress/(travel*.57))*Math.min(3.1,video.duration-.02)
      : Math.min(1,progress/(travel*playbackFraction))*Math.max(0,video.duration-.02);
    if (!video.seeking && Math.abs(video.currentTime-time)>=.016) video.currentTime=time;
    if (progress>=travel && !(scene===seedScene && seedSprites.length) && (video.seeking || video.currentTime<video.duration-.055)) pageScroll=scene.start;
  }
  scene.cell.mesh.visible=scene.kind==="turn" || (scene.ready && (progress>0 || scene.kind==="seeds" && entered));
  if (scene===seedScene && seedSprites.length) {
    const phase=Math.max(0,Math.min(1,progress/travel));
    const arrival=Math.max(0,Math.min(1,(phase-.53)/.15));
    seedCopy.visible=arrival>0;
    seedCopy.position.y=-(scene.textTop+seedCopy.userData.hPx/2+(1-arrival)**2*(seedCopy.userData.hPx+95));
    const ready=seedSprites.every(sprite=>sprite.mesh.material.map);
    const showSprites=phase>=.65 && ready;
    if(showSprites) scene.cell.mesh.visible=false;
    const clamp=value=>Math.max(0,Math.min(1,value));
    seedSprites.forEach((sprite,index)=>{
      sprite.mesh.visible=showSprites;
      if(!showSprites)return;
      const fall=clamp((phase-.65-index*.009)/.26);
      const drift=fall*fall*(3-2*fall);
      const hit=sprite.landsOnText?.71:.88;
      const descent=clamp(fall/hit);
      const rebound=clamp((fall-hit)/(1-hit));
      const bounce=Math.sin(rebound*Math.PI)*(1-rebound)*(sprite.landsOnText?10:15);
      const geometry=scene.cell.mesh.geometry.parameters;
      const width=sprite.width*geometry.width/1920;
      const height=sprite.height*geometry.height/1080;
      const sourceX=sprite.x/1920*geometry.width+(v-geometry.width)/2;
      const sourceY=scene.start+(h-geometry.height)/2+sprite.y/1080*geometry.height;
      sprite.mesh.scale.set(width,height,1);
      sprite.mesh.position.set(sourceX+(sprite.targetX-sourceX)*drift,
        -(sourceY+(sprite.targetY-sourceY)*descent*descent-bounce),0);
    });
  }
  if (scene.kind==="milk-logo") {
    const opacity=Math.max(0,Math.min(1,(progress/travel-.92)/.08));
    I.visible=opacity>0;
    I.material.uniforms.uOpacity.value=opacity;
  }
  if (scene.kind==="notes") {
    const fraction = progress / travel;
    const entrance = Math.max(0, 1 - fraction / .22);
    const exit = Math.max(0, Math.min(1, (fraction - .76) / .24));
    scene.cell.mesh.position.y = -(scene.start + h / 2) + h * (exit - entrance);
    scene.cell.mat.uniforms.uOpacity.value = 1;
    if (exit === 1) scene.cell.mesh.visible = false;
  }
}
let logoCaptionProgress = null;
const holdDistance = logoHoldDistance();
if (holdDistance && Number.isFinite(logoCaption.anchor)) {
  const holdStart = logoCaption.anchor-h*.72;
  const held = Math.min(holdDistance,Math.max(0,pageScroll-holdStart));
  if (pageScroll >= holdStart) logoCaptionProgress = Math.min(1,held/(h*.28));
  pageScroll -= held;
}
let copyLayoutChanged=false;
for(const block of V){
 if(!block.scrollReveal)continue;
 const progress=block===logoCaption && holdDistance ? logoCaptionProgress ?? 0 : Math.max(0,Math.min(1,(pageScroll+h*.82-block.anchor)/(h*.38)));
 const opening=progress*progress*(3-2*progress);
 if(Math.abs(block.opening-opening)>.002 || (opening===0 || opening===1) && block.opening!==opening){
  block.opening=opening;
  copyLayoutChanged=true;
 }
}
if(copyLayoutChanged)Z();
T.position.y=pageScroll;
const hoverNow=performance.now();
const hoverDelta=Math.min(50,hoverNow-lastHoverFrame);
lastHoverFrame=hoverNow;
for (const text of G) {
  if (!text.userData.opts.highlights) continue;
  const {wPx,hPx}=text.userData;
  const y=-text.position.y-pageScroll;
  const target=Number(Boolean(text.visible && pointer &&
    Math.abs(pointer.x-text.position.x)<=wPx/2 &&
    Math.abs(pointer.y-y)<=hPx/2));
  const hover=text.material.uniforms.uHover;
  hover.value=reducedMotion.matches ? target : hover.value+(target-hover.value)*(1-Math.exp(-hoverDelta/115));
}
for (const cell of W) {
  if (!cell.hoverVideo) continue;
  const top = cell.yPx - pageScroll;
  const inside = cell.visiblePlayback ? top < h*.45 && top+cell.heightPx>h*.15 : pointer && pointer.x >= d.pagePadPx && pointer.x <= v - d.pagePadPx &&
    pointer.y >= Math.max(0, top) && pointer.y < Math.min(h, top + cell.heightPx);
  if (inside && cell.hoverVideo.paused) cell.hoverVideo.play().catch(() => {});
  if (!inside && !cell.hoverVideo.paused) cell.hoverVideo.pause();
}
let e=pageScroll+$;W.forEach(t=>{!t.loadStarted&&t.yPx<=e&&t.startLoad();updateCartonEntrance(t,et);updateBottleDrop(t,et);if(!scrollScenes.some(scene=>scene.cell===t))updateScrollVideo(t,t!==pinnedCell?pageScroll:isFrisona?ea:et);updateFrisonaFraming(t,ea);updateEditorialSequence(t,et);t.loaded&&t.reveal<1&&(t.reveal=Math.min(1,t.reveal+.08),t.mat.uniforms.uReveal.value=t.reveal)}),ex()};function ex(){y.layers.set(0),S.setRenderTarget(B),S.render(g,y),S.setRenderTarget(null),S.render(D,A),y.layers.set(1),S.autoClear=!1,S.render(g,y),S.autoClear=!0,y.layers.set(0)}let pointer = null;
let lastHoverFrame=performance.now();
const trackPointer = event => {
  const bounds = a.getBoundingClientRect();
  pointer = event.pointerType === "touch" ? null : { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
};
const clearPointer = () => { pointer = null; };
a.addEventListener("pointermove", trackPointer);
a.addEventListener("pointerleave", clearPointer);
window.addEventListener("blur", clearPointer);
ef(),S.domElement.__snapshotRender=ex;let eg=()=>{p(),v=a.clientWidth,h=a.clientHeight,S.setSize(v,h),B.setSize(v*f,h*f),w(),ee(),G.forEach(k),Z(),et=Math.min(et,el())};return window.addEventListener("resize",eg),m&&(m.addEventListener("resize",eg),m.addEventListener("scroll",eg)),()=>{if(documentScroll){scrollRoot.style.minHeight="";for(const frame of editorialFrames.values()) frame?.dispose();}window.removeEventListener("wheel",horizontalWheel,true),window.removeEventListener("touchstart",startProjectSwipe,true),window.removeEventListener("touchmove",moveProjectSwipe,true),window.removeEventListener("wheel",documentReturnWheel),window.removeEventListener("touchstart",documentReturnTouchStart),window.removeEventListener("touchmove",documentReturnTouchMove),cancelAnimationFrame(t),a.removeEventListener("pointermove",trackPointer),a.removeEventListener("pointerleave",clearPointer),window.removeEventListener("blur",clearPointer),a.removeEventListener("wheel",en),a.removeEventListener("touchstart",ed),a.removeEventListener("touchmove",em),a.removeEventListener("touchend",ep),a.removeEventListener("touchcancel",ep),window.removeEventListener("resize",eg),m&&(m.removeEventListener("resize",eg),m.removeEventListener("scroll",eg)),T.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){let t=e.material.uniforms;t&&t.uTex&&t.uTex.value&&t.uTex.value.dispose(),e.material.map?.dispose(),e.material.dispose()}}),U.geometry.dispose(),U.material.dispose(),B.dispose(),S.dispose(),_.forEach(e=>{try{e.pause(),e.removeAttribute("src"),e.load(),e.remove()}catch(e){}}),S.domElement.parentNode&&S.domElement.parentNode.removeChild(S.domElement)}},[e?.slug]),(0,t.jsx)("div",{ref:u,"aria-hidden":"true",style:{position:"relative",width:"100%",height:"100dvh",overflow:"hidden",touchAction:"none",overscrollBehavior:"none"}})}])}]);