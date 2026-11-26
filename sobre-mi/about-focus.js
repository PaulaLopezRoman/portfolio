// En pantallas táctiles no existe "pasar el ratón por encima". Para que el efecto de
// resaltar las palabras clave también se vea en móvil y tablet, se activa cuando el
// bloque de texto pasa por el centro de la pantalla al hacer scroll.
const touchOnly = matchMedia('(hover: none)');
const blocks = [...document.querySelectorAll('.portfolio-about')];

if ('IntersectionObserver' in window && blocks.length) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-focused', touchOnly.matches && entry.isIntersecting);
    }
  }, {rootMargin: '-35% 0px -35% 0px'});
  blocks.forEach(block => observer.observe(block));
}
