// Mobilne menu navbaru Forma: otwieranie, zamykanie linkiem, klawiszem Escape i kliknięciem poza blokiem.
// Postęp przewinięcia nie jest tutaj, obsługuje go header-scroll-progress.js.
// Skrypt działa ponownie po podmianie strony (data-astro-rerun), więc najpierw zdejmuje
// słuchaczy z poprzedniego uruchomienia, żeby nie dublować zdarzeń.
(function () {
  if (window.__formaNavbarCleanup) window.__formaNavbarCleanup();

  var roots = Array.prototype.slice.call(document.querySelectorAll('[data-forma-navbar]'));
  if (!roots.length) return;

  var cleanups = [];

  roots.forEach(function (root) {
    var toggle = root.querySelector('[data-forma-navbar-toggle]');
    var menu = root.querySelector('[data-forma-navbar-menu]');
    if (!toggle || !menu) return;

    var openLabel = toggle.getAttribute('data-open-label') || '';
    var closeLabel = toggle.getAttribute('data-close-label') || '';
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
      menu.hidden = !open;
    }

    function onToggleClick() {
      setOpen(!isOpen());
    }

    function onLinkClick() {
      setOpen(false);
    }

    function onKeydown(event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    }

    // Klik w środku headera jest obsługiwany przez przycisk, więc zamykamy tylko klik z zewnątrz.
    function onDocumentClick(event) {
      if (!root.contains(event.target)) setOpen(false);
    }

    toggle.addEventListener('click', onToggleClick);
    links.forEach(function (link) {
      link.addEventListener('click', onLinkClick);
    });
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onDocumentClick);

    cleanups.push(function () {
      toggle.removeEventListener('click', onToggleClick);
      links.forEach(function (link) {
        link.removeEventListener('click', onLinkClick);
      });
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onDocumentClick);
    });
  });

  window.__formaNavbarCleanup = function () {
    cleanups.forEach(function (cleanup) {
      cleanup();
    });
    cleanups = [];
    window.__formaNavbarCleanup = undefined;
  };
})();
