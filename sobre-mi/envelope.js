const envelope = document.querySelector('.portfolio-envelope');
const envelopeVideo = envelope.querySelector('video');
const envelopeButton = envelope.querySelector('button');
const envelopeCanvas = envelope.querySelector('canvas');
const envelopeContext = envelopeCanvas.getContext('2d');
const packedFrame = document.createElement('canvas');
const frameWidth = packedFrame.width = envelopeCanvas.width;
const frameHeight = envelopeCanvas.height;
packedFrame.height = frameHeight * 2;
const packedContext = packedFrame.getContext('2d', { willReadFrequently: true });
const openingStart = .55;
const openingEnd = 2;
const envelopePlaybackRate = 1;
const envelopeMotion = matchMedia('(prefers-reduced-motion: reduce)');
const openingSource = envelopeVideo.getAttribute('src');
let closingEnvelope = false;
let revealStarted = false;
let openingStarted = false;
let envelopeFrame = 0;
let pointerPosition = null;
const labelCanvas = document.createElement('canvas');
const labelWidth = 96;
const labelHeight = 22;
const labelScale = window.devicePixelRatio || 1;
labelCanvas.width = Math.ceil(labelWidth * labelScale);
labelCanvas.height = Math.ceil(labelHeight * labelScale);
labelCanvas.style.width = labelWidth + 'px';
labelCanvas.style.height = labelHeight + 'px';
labelCanvas.className = 'portfolio-envelope-cursor';
labelCanvas.hidden = true;
labelCanvas.setAttribute('aria-hidden', 'true');
document.body.append(labelCanvas);
const labelContext = labelCanvas.getContext('2d', { willReadFrequently: true });
labelContext.scale(labelScale, labelScale);

function drawPointerLabel() {
  if (!pointerPosition) return;
  const { x, y } = pointerPosition;
  const bounds = envelopeCanvas.getBoundingClientRect();
  labelContext.clearRect(0, 0, labelWidth, labelHeight);
  labelContext.fillStyle = '#fff';
  labelContext.fillRect(0, 0, labelWidth, labelHeight);
  labelContext.drawImage(envelopeCanvas, bounds.left - x, bounds.top - y, bounds.width, bounds.height);
  const background = labelContext.getImageData(0, 0, labelCanvas.width, labelCanvas.height);
  labelContext.clearRect(0, 0, labelWidth, labelHeight);
  labelContext.font = '14px "Lay Grotesk Regular", Arial, sans-serif';
  labelContext.fillStyle = '#000';
  labelContext.fillText('abrir archivo', 0, 15);
  const glyphs = labelContext.getImageData(0, 0, labelCanvas.width, labelCanvas.height);
  for (let i = 0; i < glyphs.data.length; i += 4) {
    if (!glyphs.data[i + 3]) continue;
    const lightness = .2126 * background.data[i] + .7152 * background.data[i + 1] + .0722 * background.data[i + 2];
    const ink = lightness < 180 ? 255 : 0;
    glyphs.data[i] = glyphs.data[i + 1] = glyphs.data[i + 2] = ink;
  }
  labelContext.putImageData(glyphs, 0, 0);
}

function hidePointerLabel() {
  pointerPosition = null;
  labelCanvas.hidden = true;
  envelope.classList.remove('has-label-cursor');
}

envelope.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse') return;
  const viewWidth = document.documentElement.clientWidth;
  const x = Math.min(event.clientX, viewWidth - labelWidth);
  const y = event.clientY - labelHeight / 2;
  pointerPosition = { x, y };
  labelCanvas.style.left = x + 'px';
  labelCanvas.style.top = y + 'px';
  labelCanvas.hidden = false;
  envelope.classList.add('has-label-cursor');
  drawPointerLabel();
  openEnvelope();
});
function endEnvelopeHover() {
  hidePointerLabel();
  if (!openingStarted || revealStarted || closingEnvelope) return;
  openingStarted = false;
  envelopeVideo.pause();
  envelopeVideo.currentTime = 0;
}

envelope.addEventListener('pointerleave', endEnvelopeHover);
window.addEventListener('scroll', endEnvelopeHover, { passive: true });
window.addEventListener('blur', endEnvelopeHover);

function drawEnvelope() {
  if (envelopeVideo.readyState < 2) return;
  packedContext.drawImage(envelopeVideo, 0, 0, frameWidth, frameHeight * 2);
  const color = packedContext.getImageData(0, 0, frameWidth, frameHeight);
  const mask = packedContext.getImageData(0, frameHeight, frameWidth, frameHeight);
  for (let offset = 0; offset < color.data.length; offset += 4) {
    color.data[offset + 3] = mask.data[offset];
  }
  envelopeContext.putImageData(color, 0, 0);
  drawPointerLabel();
}

function drawReveal() {
  envelopeFrame = 0;
  if (!closingEnvelope && !revealStarted && envelopeVideo.currentTime >= openingEnd) {
    envelopeVideo.pause();
    envelopeVideo.currentTime = openingEnd;
    return;
  }
  drawEnvelope();
  if (!envelopeVideo.paused && !envelopeVideo.ended) scheduleEnvelopeFrame();
}

function scheduleEnvelopeFrame() {
  if (!envelopeFrame) envelopeFrame = requestAnimationFrame(drawReveal);
}

envelopeVideo.addEventListener('loadeddata', drawEnvelope);
envelopeVideo.addEventListener('seeked', drawEnvelope);

// En el iPhone el vídeo no carga hasta que tocas la pantalla, así que el sobre
// cerrado se pinta desde una imagen fija para que se vea desde el principio.
const closedPoster = new Image();
closedPoster.src = '/portfolio/media/sobre-kraft-cerrado.png';
function drawClosedPoster() {
  if (!closedPoster.complete || !closedPoster.naturalWidth) return;
  if (openingStarted || revealStarted || closingEnvelope) return;
  envelopeContext.clearRect(0, 0, frameWidth, frameHeight);
  envelopeContext.drawImage(closedPoster, 0, 0, frameWidth, frameHeight);
}
closedPoster.addEventListener('load', () => {
  if (envelopeVideo.readyState < 2) drawClosedPoster();
});
if (closedPoster.complete) drawClosedPoster();
window.addEventListener('pageshow', () => {
  if (envelopeVideo.readyState < 2) drawClosedPoster();
});

async function openEnvelope() {
  if (openingStarted || revealStarted || closingEnvelope) return;
  openingStarted = true;
  try {
    if (envelopeMotion.matches) {
      if (envelopeVideo.readyState === 0) {
        openingStarted = false;
        return;
      }
      envelopeVideo.currentTime = openingEnd;
      return;
    }
    if (envelopeVideo.currentTime < openingStart) envelopeVideo.currentTime = openingStart;
    envelopeVideo.playbackRate = envelopePlaybackRate;
    await envelopeVideo.play();
    if (openingStarted || revealStarted) scheduleEnvelopeFrame();
  } catch {
    openingStarted = false;
  }
}

envelopeButton.addEventListener('click', async () => {
  if (revealStarted || closingEnvelope) return;
  revealStarted = true;
  envelopeButton.disabled = true;
  try {
    await envelopeVideo.play();
    scheduleEnvelopeFrame();
  } catch {
    revealStarted = false;
    envelopeButton.disabled = false;
  }
});
envelopeVideo.addEventListener('ended', async () => {
  if (closingEnvelope) {
    resetClosedEnvelope();
    return;
  }
  hidePointerLabel();
  if (!envelopeMotion.matches) {
    const fade = document.createElement('div');
    fade.setAttribute('data-case-white-fade', '');
    fade.setAttribute('aria-hidden', 'true');
    document.body.append(fade);
    window.addEventListener('pageshow', () => {
      fade.remove();
      revealStarted = false;
      openingStarted = false;
      envelopeButton.disabled = false;
      envelopeVideo.currentTime = 0;
    }, { once: true });
    await fade.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 460,
      easing: 'ease-in-out',
      fill: 'forwards'
    }).finished;
  }
  window.location.assign('/portfolio/hoja/#desde-sobre');
});

function resetClosedEnvelope() {
  closingEnvelope = false;
  envelopeVideo.src = openingSource;
  envelopeButton.disabled = false;
  drawClosedPoster();
}

async function returnToClosedEnvelope() {
  envelope.scrollIntoView({ block: 'center', behavior: 'instant' });
  history.replaceState(history.state, '', location.pathname + location.search);
  if (envelopeMotion.matches) return;
  closingEnvelope = true;
  envelopeButton.disabled = true;
  const fade = document.createElement('div');
  fade.setAttribute('data-case-white-fade', '');
  fade.setAttribute('aria-hidden', 'true');
  document.body.append(fade);
  envelopeVideo.src = '/portfolio/media/sobre-kraft-cierre.mp4';
  try {
    envelopeVideo.playbackRate = envelopePlaybackRate;
    await envelopeVideo.play();
    drawEnvelope();
    scheduleEnvelopeFrame();
  } catch {
    resetClosedEnvelope();
  } finally {
    await fade.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 440,
      easing: 'ease-out',
      fill: 'forwards'
    }).finished;
    fade.remove();
  }
}

drawEnvelope();
if (location.hash === '#sobre') returnToClosedEnvelope();
