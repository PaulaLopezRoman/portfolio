const section = document.querySelector('.portfolio-app-scroll');
const viewport = section.querySelector('.portfolio-app-viewport');
const row = viewport.querySelector('.portfolio-app-row');
const track = document.createElement('div');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = value => Math.min(1, Math.max(0, value));
let cycle = 0;
let scrollOffset = 0;
let manualOffset = 0;
let position = 0;
let frame = 0;
let previousTime = 0;

track.className = 'portfolio-app-track';
row.replaceWith(track);
track.append(row);
const lenses = ['left','right'].map(side => {
  const canvas = document.createElement('canvas');
  canvas.className = 'portfolio-app-lens';
  canvas.dataset.side = side;
  canvas.setAttribute('aria-hidden','true');
  viewport.append(canvas);
  const source = document.createElement('canvas');
  return {side, canvas, source, input:source.getContext('2d',{willReadFrequently:true}), context:canvas.getContext('2d')};
});

const smoothstep = (start, end, value) => {
  const t = clamp((value-start)/(end-start));
  return t*t*(3-2*t);
};
const glassSamples = Array.from({length:16}, (_, index) => {
  const t = index/15;
  return {shift:(t-.5)*.30, weights:[
    smoothstep(.8,.2,t),
    smoothstep(0,.5,t)*smoothstep(1,.5,t),
    smoothstep(.2,.8,t)
  ]};
});
const glassWeight = [0,1,2].map(channel =>
  glassSamples.reduce((sum, sample)=>sum+sample.weights[channel],0));
function drawLenses() {
  const bounds = viewport.getBoundingClientRect();
  const icons = [...track.querySelectorAll('img')].filter(img => img.complete && img.naturalWidth).map(img => {
    const box = img.getBoundingClientRect();
    const scale = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;
    return {img, left:box.left-bounds.left+(box.width-width)/2,
      top:box.top-bounds.top+(box.height-height)/2, width, height};
  });
  for (const {side,canvas,source,input,context} of lenses) {
    const width=canvas.clientWidth, height=canvas.clientHeight;
    if(!context||!input||!width||!height)continue;
    const sampleWidth=Math.min(Math.ceil(width*1.2)+1,Math.floor(bounds.width));
    const isLeft=side==='left';
    const startX=isLeft?0:bounds.width-sampleWidth;
    if(canvas.width!==width||canvas.height!==height){
      canvas.width=width;
      canvas.height=height;
    }
    if(source.width!==sampleWidth||source.height!==height){
      source.width=sampleWidth;
      source.height=height;
    }
    input.fillStyle='#fff';
    input.fillRect(0,0,sampleWidth,height);
    for(const icon of icons){
      if(icon.left+icon.width<=startX||icon.left>=startX+sampleWidth)continue;
      input.drawImage(icon.img,icon.left-startX,icon.top,icon.width,icon.height);
    }
    const original=input.getImageData(0,0,sampleWidth,height).data;
    const output=context.createImageData(width,height);
    for(let x=0;x<width;x++){
      const distance=isLeft?x:width-1-x;
      const t=1-(distance+.5)/width;
      const bend=(1-Math.sqrt(1-t*t))*width;
      const refracted=distance+bend;
      const samples=glassSamples.map(({shift,weights})=>{
        const local=Math.min(sampleWidth-1,Math.max(0,refracted+shift*bend));
        return {x:isLeft?Math.round(local):sampleWidth-1-Math.round(local),weights};
      });
      for(let y=0;y<height;y++){
        const sourceRow=y*sampleWidth*4;
        const dest=(y*width+x)*4;
        let red=0,green=0,blue=0;
        for(const sample of samples){
          const offset=sourceRow+sample.x*4;
          red+=original[offset]*sample.weights[0];
          green+=original[offset+1]*sample.weights[1];
          blue+=original[offset+2]*sample.weights[2];
        }
        output.data[dest]=red/glassWeight[0];
        output.data[dest+1]=green/glassWeight[1];
        output.data[dest+2]=blue/glassWeight[2];
        output.data[dest+3]=255;
      }
    }
    context.putImageData(output,0,0);
  }
}

function render(time) {
  frame = 0;
  const elapsed = previousTime ? Math.min(50, time - previousTime) : 16;
  previousTime = time;
  const target = scrollOffset + manualOffset;
  position += (target - position) * (1 - Math.exp(-elapsed / 95));
  const done = Math.abs(target - position) < .15;
  if (done) position = target;
  const loopPosition = ((position % cycle) + cycle) % cycle;
  track.style.transform = 'translate3d(' + -loopPosition + 'px,0,0)';
  drawLenses();
  if (!done) frame = requestAnimationFrame(render);
}

function schedule() {
  if (!frame && cycle && !motion.matches) frame = requestAnimationFrame(render);
}

function updateScroll() {
  const bounds = section.getBoundingClientRect();
  const screenHeight = document.documentElement.clientHeight;
  const visibleProgress = clamp((screenHeight - bounds.top) / Math.max(1, bounds.height));
  scrollOffset = visibleProgress * cycle;
  schedule();
}

function measure() {
  for (const duplicate of track.querySelectorAll('[aria-hidden]')) duplicate.remove();
  cycle = row.getBoundingClientRect().width;
  if (motion.matches || !cycle) {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    track.style.transform = '';
    return;
  }
  const count = Math.ceil(viewport.clientWidth / cycle) + 1;
  for (let index = 0; index < count; index++) {
    const duplicate = row.cloneNode(true);
    duplicate.setAttribute('aria-hidden','true');
    for (const icon of duplicate.querySelectorAll('img')) icon.alt = '';
    track.append(duplicate);
  }
  updateScroll();
}

viewport.addEventListener('wheel', event => {
  if (motion.matches || event.ctrlKey || (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY))) return;
  event.preventDefault();
  manualOffset += (event.deltaX || event.deltaY) * (event.deltaMode === 1 ? 16 : 1);
  schedule();
}, {passive:false});
viewport.addEventListener('keydown', event => {
  if (motion.matches || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  manualOffset += (event.key === 'ArrowLeft' ? -1 : 1) * cycle / row.children.length;
  schedule();
});
viewport.addEventListener('load', schedule, true);
addEventListener('scroll', updateScroll, {passive:true});
new ResizeObserver(measure).observe(viewport);
motion.addEventListener('change', measure);
measure();
