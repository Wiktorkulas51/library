/*
 * Navbar WebScale: stan po przewinięciu, dropdowny z jednym stage, pill hovera
 * i overlay mobilny. Skrypt jest uruchamiany ponownie po przejściach ClientRouter,
 * więc najpierw zdejmuje poprzednie listenery, zamiast zostawiać duplikaty.
 */
(() => {
  const SCROLL_THRESHOLD = 20;
  const SWITCH_MS = 260;
  const DESKTOP_QUERY = "(min-width: 1024px)";

  const previousCleanup = window.__wsbNavbarCleanup;
  if (typeof previousCleanup === "function") previousCleanup();

  const initNavbar = (root) => {
    const header = root.querySelector("[data-wsb-header]");
    const desktop = root.querySelector("[data-wsb-desktop]");
    const links = root.querySelector("[data-wsb-links]");
    const indicator = root.querySelector("[data-wsb-indicator]");
    const stage = root.querySelector("[data-wsb-stage]");
    const backdrop = root.querySelector("[data-wsb-backdrop]");
    const mobile = root.querySelector("[data-wsb-mobile]");
    const menuToggle = root.querySelector("[data-wsb-menu-toggle]");
    const menuClose = root.querySelector("[data-wsb-menu-close]");
    if (!header || !desktop || !links || !indicator || !stage || !backdrop || !mobile) return null;

    const controller = new AbortController();
    const { signal } = controller;
    const triggers = Array.from(root.querySelectorAll("[data-wsb-trigger]"));
    const buttonTriggers = Array.from(root.querySelectorAll("button[data-wsb-trigger]"));
    const cardSurfaces = Array.from(root.querySelectorAll("[data-wsb-card]"));
    const menuItems = Array.from(root.querySelectorAll("[data-wsb-menuitem]"));
    const panels = new Map(
      Array.from(root.querySelectorAll("[data-wsb-panel]")).map((panel) => [panel.dataset.wsbPanel, panel]),
    );

    let activeKey = null;
    // Dlaczego: klik przypina dropdown, a sam hover tylko go pokazuje, więc drugi klik może go zamknąć.
    let pinnedKey = null;
    let switchTimer = 0;
    let previousOverflow = "";

    const findTrigger = (key) => triggers.find((trigger) => trigger.dataset.wsbPanelKey === key) ?? null;
    const getTriggerItem = (trigger) => trigger.closest("[data-wsb-item]");

    const syncBackdropTop = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      if (height > 0) backdrop.style.setProperty("--wsb-backdrop-top", `${height}px`);
    };

    const moveIndicator = (element) => {
      const parentRect = links.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      indicator.style.left = `${rect.left - parentRect.left}px`;
      indicator.style.width = `${rect.width}px`;
      indicator.style.opacity = "1";
    };

    const hideIndicator = () => {
      indicator.style.opacity = "0";
    };

    const moveCardIndicator = (menuItem) => {
      const card = menuItem.closest("[data-wsb-card]");
      const cardIndicator = card?.querySelector("[data-wsb-card-indicator]");
      if (!card || !cardIndicator) return;

      const cardRect = card.getBoundingClientRect();
      const itemRect = menuItem.getBoundingClientRect();
      cardIndicator.style.setProperty("--wsb-card-left", `${itemRect.left - cardRect.left}px`);
      cardIndicator.style.setProperty("--wsb-card-top", `${itemRect.top - cardRect.top}px`);
      cardIndicator.style.setProperty("--wsb-card-width", `${itemRect.width}px`);
      cardIndicator.style.setProperty("--wsb-card-height", `${itemRect.height}px`);
      cardIndicator.style.opacity = "1";
    };

    const hideCardIndicator = (card) => {
      const cardIndicator = card.querySelector("[data-wsb-card-indicator]");
      if (cardIndicator) cardIndicator.style.opacity = "0";
    };

    const resetTriggers = () => {
      triggers.forEach((trigger) => {
        trigger.setAttribute("aria-expanded", "false");
      });
      root.querySelectorAll("[data-wsb-item]").forEach((item) => {
        item.dataset.open = "false";
      });
    };

    const setBackdropOpen = (isOpen) => {
      backdrop.dataset.open = isOpen ? "true" : "false";
      backdrop.setAttribute("aria-hidden", String(!isOpen));
      header.classList.toggle("is-dropdown-open", isOpen);
    };

    const positionStage = (panel, trigger) => {
      const parentRect = links.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const width = parseFloat(panel.dataset.wsbWidth) * rootFontSize;
      const triggerLeft = triggerRect.left - parentRect.left;
      const left = panel.dataset.wsbAlign === "center"
        ? triggerLeft + (triggerRect.width - width) / 2
        : triggerLeft;

      stage.style.setProperty("--wsb-stage-left", `${left}px`);
      stage.style.setProperty("--wsb-stage-width", panel.dataset.wsbWidth);
    };

    const closePanel = () => {
      window.clearTimeout(switchTimer);
      stage.classList.remove("is-switching");
      stage.dataset.open = "false";
      stage.setAttribute("aria-hidden", "true");
      // Dlaczego: bez zdjęcia is-active zamknięty panel zostaje klikalny.
      panels.forEach((panel) => panel.classList.remove("is-active"));
      cardSurfaces.forEach(hideCardIndicator);
      activeKey = null;
      pinnedKey = null;
      resetTriggers();
      setBackdropOpen(false);
    };

    const openPanel = (trigger, pin = false) => {
      const key = trigger.dataset.wsbPanelKey;
      const panel = panels.get(key);
      if (!panel) {
        closePanel();
        return;
      }

      if (stage.dataset.open === "true" && activeKey && activeKey !== key) {
        window.clearTimeout(switchTimer);
        stage.classList.add("is-switching");
        switchTimer = window.setTimeout(() => stage.classList.remove("is-switching"), SWITCH_MS);
      }

      activeKey = key;
      pinnedKey = pin ? key : null;
      resetTriggers();
      const item = getTriggerItem(trigger);
      if (item) item.dataset.open = "true";
      trigger.setAttribute("aria-expanded", "true");

      panels.forEach((candidate, candidateKey) => {
        candidate.classList.toggle("is-active", candidateKey === key);
      });
      positionStage(panel, trigger);
      stage.dataset.open = "true";
      stage.setAttribute("aria-hidden", "false");
      syncBackdropTop();
      setBackdropOpen(true);
    };

    const setMobileOpen = (isOpen) => {
      if (isOpen) {
        closePanel();
        previousOverflow = document.body.style.overflow;
      }
      mobile.classList.toggle("is-open", isOpen);
      mobile.setAttribute("aria-hidden", String(!isOpen));
      menuToggle?.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : previousOverflow;

      if (isOpen) {
        menuClose?.focus();
      } else if (mobile.contains(document.activeElement)) {
        menuToggle?.focus();
      }
    };

    let skipFocusOpen = false;

    triggers.forEach((trigger) => {
      const handleEnter = (event) => {
        if (event.type === "focus" && skipFocusOpen) return;
        moveIndicator(trigger);
        if (trigger.dataset.wsbPanelKey) {
          openPanel(trigger);
        } else {
          closePanel();
        }
      };
      trigger.addEventListener("mouseenter", handleEnter, { signal });
      trigger.addEventListener("focus", handleEnter, { signal });
    });

    buttonTriggers.forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.wsbPanelKey;
        if (pinnedKey === key && activeKey === key) {
          closePanel();
        } else {
          openPanel(button, true);
        }
      }, { signal });
    });

    // Dlaczego: scena z panelami stoi w DOM za wszystkimi linkami, więc zwykły Tab z triggera
    // trafiłby na następny link i zamknął panel. Tab albo strzałka w dół przenosi fokus do panelu.
    buttonTriggers.forEach((button) => {
      button.addEventListener("keydown", (event) => {
        const key = button.dataset.wsbPanelKey;
        const intoPanel = event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey && activeKey === key);
        if (!intoPanel) return;
        if (activeKey !== key) openPanel(button, true);
        const firstItem = panels.get(key)?.querySelector("[data-wsb-menuitem]");
        if (!firstItem) return;
        event.preventDefault();
        window.requestAnimationFrame(() => firstItem.focus());
      }, { signal });
    });

    stage.addEventListener("focusout", (event) => {
      if (!stage.contains(event.relatedTarget)) closePanel();
    }, { signal });

    menuItems.forEach((menuItem) => {
      const showCardIndicator = () => moveCardIndicator(menuItem);
      menuItem.addEventListener("mouseenter", showCardIndicator, { signal });
      menuItem.addEventListener("focus", showCardIndicator, { signal });
    });

    cardSurfaces.forEach((card) => {
      card.addEventListener("mouseleave", () => hideCardIndicator(card), { signal });
      card.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget)) hideCardIndicator(card);
      }, { signal });
    });

    links.addEventListener("mouseleave", () => {
      hideIndicator();
      closePanel();
    }, { signal });

    document.addEventListener("click", (event) => {
      if (!desktop.contains(event.target)) closePanel();
    }, { signal });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (mobile.classList.contains("is-open")) {
        setMobileOpen(false);
        return;
      }
      if (activeKey) {
        const trigger = findTrigger(activeKey);
        const focusInside = root.contains(document.activeElement);
        closePanel();
        // Fokus wraca na trigger, żeby klawiatura nie zgubiła miejsca w menu.
        if (focusInside && trigger) {
          skipFocusOpen = true;
          trigger.focus({ preventScroll: true });
          skipFocusOpen = false;
        }
      }
    }, { signal });

    window.addEventListener("resize", () => {
      syncBackdropTop();
      if (!activeKey) return;
      const trigger = findTrigger(activeKey);
      const panel = panels.get(activeKey);
      if (trigger && panel) positionStage(panel, trigger);
    }, { signal });

    let ticking = false;
    const updateScrollState = () => {
      ticking = false;
      header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    };
    window.addEventListener("scroll", onScroll, { passive: true, signal });

    menuToggle?.addEventListener("click", () => setMobileOpen(true), { signal });
    menuClose?.addEventListener("click", () => setMobileOpen(false), { signal });
    mobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMobileOpen(false), { signal });
    });

    // Dlaczego: po przejściu na desktop pełnoekranowy overlay zostawiłby zablokowany scroll.
    window.matchMedia(DESKTOP_QUERY).addEventListener("change", (event) => {
      if (event.matches) setMobileOpen(false);
    }, { signal });

    syncBackdropTop();
    closePanel();
    updateScrollState();

    return () => {
      controller.abort();
      window.clearTimeout(switchTimer);
      if (mobile.classList.contains("is-open")) document.body.style.overflow = previousOverflow;
    };
  };

  const cleanups = [];
  document.querySelectorAll("[data-wsb-navbar]").forEach((root) => {
    const cleanup = initNavbar(root);
    if (cleanup) cleanups.push(cleanup);
  });

  window.__wsbNavbarCleanup = () => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
    delete window.__wsbNavbarCleanup;
  };
})();
