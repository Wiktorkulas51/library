// Global accordion pattern [data-accordion]: exclusive group behavior.
// After opening one question the remaining open questions in the same group
// are closed. Panel height animation is measured here so native details and
// browser scroll anchoring cannot produce a second layout movement.
// Script loaded via defer, no exports.
(function () {
  var transitionDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320;

  function getPanel(detail) {
    return Array.from(detail.children).find(function (child) {
      return child.tagName.toLowerCase() !== "summary";
    });
  }

  function keepTriggerInPlace(trigger, until) {
    var startTop = trigger.getBoundingClientRect().top;

    function frame() {
      var delta = trigger.getBoundingClientRect().top - startTop;
      if (Math.abs(delta) > 0.5) window.scrollBy(0, delta);
      if (performance.now() < until) window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  function animateDetail(detail, open) {
    var panel = getPanel(detail);
    var trigger = detail.querySelector(":scope > summary");
    if (!panel) {
      detail.open = open;
      return;
    }

    panel.style.overflow = "hidden";
    panel.style.transition = "height " + transitionDuration + "ms cubic-bezier(0.16, 1, 0.3, 1), opacity " + transitionDuration + "ms ease";

    if (open) {
      detail.open = true;
      panel.style.height = "0px";
      panel.style.opacity = "0";
      var targetHeight = panel.scrollHeight;
      window.requestAnimationFrame(function () {
        panel.style.height = targetHeight + "px";
        panel.style.opacity = "1";
      });
    } else {
      panel.style.height = panel.scrollHeight + "px";
      panel.style.opacity = "1";
      window.requestAnimationFrame(function () {
        panel.style.height = "0px";
        panel.style.opacity = "0";
      });
    }

    if (trigger) keepTriggerInPlace(trigger, performance.now() + transitionDuration + 40);

    window.setTimeout(function () {
      if (!open) detail.open = false;
      panel.style.height = "";
      panel.style.opacity = "";
      panel.style.overflow = "";
      panel.style.transition = "";
    }, transitionDuration + 40);
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(function (group) {
      if (group.dataset.accordionManaged === "true") return;
      group.dataset.accordionManaged = "true";
      var items = Array.from(group.querySelectorAll(":scope > details"));

      items.forEach(function (detail) {
        detail.dataset.accordionManaged = "true";
        detail.addEventListener("click", function (event) {
          var target = event.target;
          var summary = target && target.closest ? target.closest("summary") : null;
          if (!summary || summary.parentElement !== detail) return;
          event.preventDefault();
          var shouldOpen = !detail.open;
          items.forEach(function (other) {
            if (other !== detail && other.open) animateDetail(other, false);
          });
          animateDetail(detail, shouldOpen);
        });
      });
    });

    document.querySelectorAll("[data-faq-question]").forEach(function (trigger) {
      if (trigger.dataset.accordionScrollManaged === "true") return;
      trigger.dataset.accordionScrollManaged = "true";
      trigger.addEventListener("click", function () {
        keepTriggerInPlace(trigger, performance.now() + transitionDuration + 40);
      }, true);
    });
  }

  initAccordions();
  document.addEventListener("astro:page-load", initAccordions);
})();
