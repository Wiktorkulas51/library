// Wspólny postęp przewinięcia dla headerów, które płynnie zmieniają kształt przy scrollu
// (Alan Zbel HomeHeader, Forma SiteNavbar). Header oznacza się atrybutem
// data-header-progress, a opcjonalnie data-header-progress-distance="220" (px do pełnego stanu).
// Skrypt zapisuje na headerze zmienną --nav-scroll-progress od 0 do 1, a cały wygląd
// liczy CSS bloku przez calc(). Dzięki temu nie ma skoku klasy ani przełączania position.
(function () {
  // Po podmianie strony (ClientRouter, data-astro-rerun) skrypt działa ponownie,
  // więc najpierw zdejmujemy słuchaczy z poprzedniego uruchomienia.
  if (window.__headerScrollProgressCleanup) window.__headerScrollProgressCleanup();

  var headers = Array.prototype.slice.call(document.querySelectorAll('[data-header-progress]'));
  if (!headers.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var states = headers.map(function (header) {
    var distance = parseFloat(header.getAttribute('data-header-progress-distance') || '220');
    return { header: header, distance: distance > 0 ? distance : 220, current: 0, target: 0 };
  });
  var frame = 0;
  var previousTime = 0;

  function apply(state) {
    state.header.style.setProperty('--nav-scroll-progress', state.current.toFixed(4));
  }

  // Surowy scroll daje szarpane zmiany, więc postęp jest wygładzany wykładniczo.
  // Stała 115 ms daje podobne przejście niezależnie od liczby klatek na sekundę.
  function render(time) {
    var elapsed = previousTime ? Math.min(time - previousTime, 32) : 16;
    previousTime = time;
    var factor = 1 - Math.exp(-elapsed / 115);
    var settled = true;

    states.forEach(function (state) {
      state.current += (state.target - state.current) * factor;
      if (Math.abs(state.target - state.current) < 0.001) state.current = state.target;
      if (state.current !== state.target) settled = false;
      apply(state);
    });

    if (settled) {
      frame = 0;
      previousTime = 0;
    } else {
      frame = requestAnimationFrame(render);
    }
  }

  function update() {
    states.forEach(function (state) {
      state.target = Math.min(Math.max(window.scrollY / state.distance, 0), 1);
      if (reduceMotion) {
        state.current = state.target;
        apply(state);
      }
    });
    if (!reduceMotion && !frame) frame = requestAnimationFrame(render);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.__headerScrollProgressCleanup = function () {
    window.removeEventListener('scroll', update);
    cancelAnimationFrame(frame);
    window.__headerScrollProgressCleanup = undefined;
  };
  update();
})();
