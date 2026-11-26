let returningToEnvelope = false;

window.addEventListener('scroll', async () => {
  const page = document.scrollingElement;
  if (returningToEnvelope || !page.scrollTop ||
      page.scrollHeight - page.clientHeight - page.scrollTop > 2) return;
  returningToEnvelope = true;

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fade = document.createElement('div');
    fade.setAttribute('data-case-white-fade', '');
    fade.setAttribute('aria-hidden', 'true');
    document.body.append(fade);
    window.addEventListener('pageshow', () => fade.remove(), { once: true });
    await fade.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 650,
      easing: 'ease-in-out',
      fill: 'forwards'
    }).finished;
  }

  window.location.assign('/portfolio/sobre-mi/#sobre');
}, { passive: true });

window.addEventListener('pageshow', event => {
  if (event.persisted) returningToEnvelope = false;
});
