/* ==========================================================================
   OOP Lab — application bootstrap
   ========================================================================== */
(function (window, document) {
  "use strict";

  function boot() {
    if (!window.OOP || !window.OOP.navigation) {
      if (window.console && window.console.error) {
        window.console.error("OOP Lab: core scripts did not load.");
      }
      return;
    }
    window.OOP.navigation.start();

    if (!window.OOP.motion.available()) {
      // GSAP missing (offline) or reduced motion requested. Everything still works.
      document.documentElement.classList.add("is-lite-motion");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window, document);
