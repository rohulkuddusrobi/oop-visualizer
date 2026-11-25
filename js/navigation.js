/* ==========================================================================
   OOP Lab — routing and shell navigation
   Hash-based routing keeps every pillar a real, linkable page while the app
   stays a single lightweight document.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP;
  var qs = OOP.qs;
  var qsa = OOP.qsa;
  var icon = OOP.icon;
  var hydrateIcons = OOP.hydrateIcons;
  var progress = OOP.progress;

  var COLLAPSE_KEY = "oopviz.sidebar.collapsed";
  var currentId = null;
  var cleanup = null;

  function readRoute() {
    var raw = window.location.hash.replace(/^#\/?/, "").split("?")[0].trim();
    if (!raw) return "dashboard";
    return raw;
  }

  function viewFor(id) {
    return (OOP.views && OOP.views[id]) || null;
  }

  function setActive(id) {
    qsa(".nav-link").forEach(function (link) {
      var isActive = link.dataset.nav === id;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function setCrumbs(label) {
    var crumbs = qs("#crumbs");
    if (!crumbs) return;
    crumbs.innerHTML =
      '<a href="#/dashboard">OOP Lab</a>' +
      '<span class="crumbs__sep" aria-hidden="true">/</span>' +
      '<span class="crumbs__now" aria-current="page">' + OOP.esc(label) + "</span>";
  }

  function errorView(root, id) {
    root.innerHTML =
      '<div class="page-head"><span class="eyebrow">Something went wrong</span>' +
      "<h1>This demo could not start</h1>" +
      '<p class="lede">The page hit an unexpected error. Your progress is safe. Try opening it again.</p></div>' +
      '<div class="panel"><p class="muted">Route: ' + OOP.esc(id) + "</p>" +
      '<p style="margin-top:12px"><a class="btn" href="#/dashboard">Back to dashboard</a></p></div>';
  }

  function mount(id) {
    var view = viewFor(id);
    var redirect = false;

    if (!view) {
      // Unknown route: fall back to the dashboard without adding history noise.
      id = "dashboard";
      view = viewFor(id);
      redirect = true;
    }

    if (cleanup) {
      try {
        cleanup();
      } catch (err) {
        if (window.console && window.console.warn) window.console.warn("View cleanup failed", err);
      }
      cleanup = null;
    }

    var root = qs("#app");
    root.innerHTML = "";
    OOP.motion.kill(root.querySelectorAll("*"));

    try {
      cleanup = view.render(root) || null;
    } catch (err) {
      if (window.console && window.console.error) window.console.error(err);
      errorView(root, id);
      cleanup = null;
    }

    currentId = id;
    setActive(id);
    setCrumbs(view.title || "Dashboard");
    hydrateIcons(document);
    document.title =
      id === "dashboard" ? "OOP Lab — Learn OOP visually" : view.title + " · OOP Lab";

    if (redirect && window.location.hash !== "#/dashboard") {
      try {
        window.history.replaceState(null, "", "#/dashboard");
      } catch (err) {
        window.location.hash = "#/dashboard";
      }
    }

    closeDrawer();
    window.scrollTo(0, 0);
    root.focus({ preventScroll: true });
  }

  function paintProgress() {
    var count = progress.count();
    var pct = Math.round((count / 4) * 100);
    var side = qs("#sideProgress");
    var bar = qs("#sideBar");
    var note = qs("#sideNote");
    var top = qs("#topProgress");

    if (side) side.textContent = count + " / 4";
    if (bar) bar.style.width = pct + "%";
    if (top) top.textContent = count + " of 4 complete";

    if (note) {
      if (count === 0) note.textContent = "Start with encapsulation";
      else if (count >= 4) note.textContent = "All four pillars complete";
      else note.textContent = count + (count === 1 ? " pillar" : " pillars") + " done · keep going";
    }

    progress.PILLARS.forEach(function (id) {
      var check = qs('[data-navcheck="' + id + '"]');
      if (check) check.classList.toggle("is-done", progress.isComplete(id));
    });
  }

  function closeDrawer() {
    var shell = qs("#appShell");
    var menuBtn = qs("#menuBtn");
    var scrim = qs("#scrim");
    if (!shell) return;
    shell.classList.remove("nav-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (scrim) scrim.hidden = true;
    document.body.style.removeProperty("overflow");
  }

  function openDrawer() {
    var shell = qs("#appShell");
    var menuBtn = qs("#menuBtn");
    var scrim = qs("#scrim");
    if (!shell) return;
    shell.classList.add("nav-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    if (scrim) scrim.hidden = false;
    document.body.style.overflow = "hidden";
    var first = qs(".nav-link", qs("#sidebar"));
    if (first) first.focus({ preventScroll: true });
  }

  function initCollapse() {
    var shell = qs("#appShell");
    var btn = qs("#collapseBtn");
    if (!shell || !btn) return;

    var collapsed = false;
    try {
      collapsed = window.localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch (err) {
      collapsed = false;
    }
    // Desktop only: avoid a "collapsed drawer" state on small screens.
    if (window.matchMedia("(min-width: 901px)").matches && collapsed) {
      shell.classList.add("is-collapsed");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function () {
      var isCollapsed = shell.classList.toggle("is-collapsed");
      btn.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
      btn.setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Collapse sidebar");
      btn.title = isCollapsed ? "Expand sidebar" : "Collapse sidebar";
      try {
        window.localStorage.setItem(COLLAPSE_KEY, isCollapsed ? "1" : "0");
      } catch (err) {
        /* ignore */
      }
    });
  }

  function initDrawer() {
    var menuBtn = qs("#menuBtn");
    var scrim = qs("#scrim");

    if (menuBtn) {
      menuBtn.addEventListener("click", function () {
        var shell = qs("#appShell");
        if (shell.classList.contains("nav-open")) closeDrawer();
        else openDrawer();
      });
    }

    if (scrim) scrim.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDrawer();
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 901px)").matches && qs("#appShell").classList.contains("nav-open")) {
        closeDrawer();
      }
    });

    // Close the drawer after choosing a destination on mobile.
    qsa(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) closeDrawer();
      });
    });
  }

  function start() {
    hydrateIcons(document);
    initCollapse();
    initDrawer();
    paintProgress();

    window.addEventListener("hashchange", function () {
      mount(readRoute());
    });
    window.addEventListener("oopviz:progress", paintProgress);

    mount(readRoute());
  }

  OOP.navigation = {
    start: start,
    mount: mount,
    closeDrawer: closeDrawer,
    get current() {
      return currentId;
    }
  };
})(window, document);
