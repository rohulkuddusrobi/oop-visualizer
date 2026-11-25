/* ==========================================================================
   OOP Lab — core runtime
   Shared helpers, icons, storage, progress, motion, toasts, the concept page
   scaffold, and the step engine used by all four visualizations.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP || (window.OOP = {});

  /* ------------------------------------------------------------------ Icons
     Lucide-style geometry embedded as strings (MIT). Inlining means icons
     never break when the machine is offline or the CDN is blocked.
     ------------------------------------------------------------------ */
  var ICONS = {
    dashboard:
      '<rect x="3" y="3" width="7.5" height="9" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="5.5" rx="1.6"/><rect x="13.5" y="12" width="7.5" height="9" rx="1.6"/><rect x="3" y="15.5" width="7.5" height="5.5" rx="1.6"/>',
    compass:
      '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    lock:
      '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.6"/><path d="M8 10.5V7.2a4 4 0 0 1 8 0v3.3"/><circle cx="12" cy="16" r="1.1"/>',
    "git-branch":
      '<circle cx="6" cy="18" r="2.6"/><circle cx="18" cy="6" r="2.6"/><path d="M6 3.5v11.9"/><path d="M18 8.6a9.4 9.4 0 0 1-9.4 9.4"/>',
    waves:
      '<path d="M2 8.5c2.2-2.4 4.3-2.4 6.5 0s4.3 2.4 6.5 0 4.3-2.4 6.5 0"/><path d="M2 15.5c2.2-2.4 4.3-2.4 6.5 0s4.3 2.4 6.5 0 4.3-2.4 6.5 0"/>',
    car:
      '<path d="M4 16.5h16"/><path d="M5.5 16.5 4 11.5l2.2-4.2h11.6L20 11.5l-1.5 5"/><circle cx="7.6" cy="17.4" r="1.7"/><circle cx="16.4" cy="17.4" r="1.7"/><path d="M4 11.5h16"/><path d="M9 7.3h6"/>',
    quiz:
      '<circle cx="12" cy="12" r="9"/><path d="M9.3 9.2a2.9 2.9 0 0 1 5.6.9c0 1.9-2.9 2.2-2.9 3.9"/><path d="M12 17.3h.01"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
    "panel-left":
      '<rect x="3" y="4" width="18" height="16" rx="2.4"/><path d="M9 4v16"/><path d="m6 10-1.5 2L6 14"/>',
    play: '<path d="M8 5.2v13.6L19 12z" fill="currentColor" stroke="none"/>',
    pause:
      '<rect x="7" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.4" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none"/>',
    rotate:
      '<path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2"/><path d="M3.5 4.4v4.9h4.9"/>',
    "arrow-left": '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "arrow-up-right": '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    lightbulb:
      '<path d="M9.2 18h5.6"/><path d="M10.2 21h3.6"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.4 1 1.1 1 1.9V16h5.2v-.3c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z"/>',
    code: '<path d="m9 8-5 4 5 4"/><path d="m15 8 5 4-5 4"/>',
    target:
      '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    book:
      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15.5H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 18.5V5.5"/><path d="M8 7.5h7"/>',
    sparkles:
      '<path d="m12 3 1.7 4.6L18 9.3l-4.3 1.7L12 15.6l-1.7-4.6L6 9.3l4.3-1.7z"/><path d="M18.5 15.5 19.3 18l2.5.8-2.5.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8z"/>',
    banknote:
      '<rect x="2.5" y="6.5" width="19" height="11" rx="2.4"/><circle cx="12" cy="12" r="2.4"/><path d="M6.2 12h.01"/><path d="M17.8 12h.01"/>',
    shield:
      '<path d="M12 3.2 19.4 6v5.1c0 4.8-3 8.3-7.4 9.7-4.4-1.4-7.4-4.9-7.4-9.7V6z"/>',
    "shield-check":
      '<path d="M12 3.2 19.4 6v5.1c0 4.8-3 8.3-7.4 9.7-4.4-1.4-7.4-4.9-7.4-9.7V6z"/><path d="m8.8 12 2.1 2.1 4.3-4.3"/>',
    wallet:
      '<path d="M4 7.6A2.6 2.6 0 0 1 6.6 5H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6.6A2.6 2.6 0 0 1 4 17.4z"/><path d="M4 8.2h13"/><circle cx="16.4" cy="13" r="1.2"/>',
    volume:
      '<path d="M11 5 6 9H3.2v6H6l5 4z"/><path d="M15.3 8.7a4.7 4.7 0 0 1 0 6.6"/><path d="M18.2 5.8a8.7 8.7 0 0 1 0 12.4"/>',
    gauge:
      '<path d="M4.1 18a9 9 0 1 1 15.8 0"/><path d="m12 14 4.2-4.2"/><circle cx="12" cy="14" r="1.2"/>',
    fuel:
      '<path d="M5 20V5.6A1.6 1.6 0 0 1 6.6 4h5A1.6 1.6 0 0 1 13 5.6V20"/><path d="M3.4 20h11.2"/><path d="M13 9.2h3.4L19 11.7V17a1.8 1.8 0 0 1-3.6 0v-4H13"/>',
    key: '<circle cx="8" cy="8" r="4"/><path d="m10.9 10.9 8 8"/><path d="m16.4 16.4 2-2"/><path d="m18.9 18.9 2-2"/>',
    zap: '<path d="M13 2.6 5 13h5.6L10.5 21.4 19 10.6h-5.6z"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.3M12 18.9v2.3M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.8 12h2.3M18.9 12h2.3M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/>',
    flame:
      '<path d="M12 21c3.9 0 6.4-2.6 6.4-6 0-4.4-4.4-6.4-4.9-11.8-2 1.4-3.4 3.9-3.4 5.9 0 1.3.5 2.4.9 2.9-1.5-.5-2.4-1.6-2.9-3.4-1.4 1.4-2.1 3.3-2.1 5.4 0 3.9 2.6 7 6 7z"/>',
    wind: '<path d="M3 8h9a3 3 0 1 0-3-3"/><path d="M3 12h13a3 3 0 1 1-3 3"/><path d="M3 16h6"/>',
    trophy:
      '<path d="M8 21h8"/><path d="M12 17.2V21"/><path d="M7 4h10v3.6a5 5 0 0 1-10 0z"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/>',
    refresh:
      '<path d="M20.8 12a8.8 8.8 0 1 1-2.5-6.2"/><path d="M20.8 3.4v4.9h-4.9"/>',
    trash:
      '<path d="M4 7h16"/><path d="M9.2 7V5.2h5.6V7"/><path d="m6.2 7 .9 13h9.8l.9-13"/>',
    pointer: '<path d="m5 3 6.6 17 2.2-6.4L20 11z"/>',
    heart:
      '<path d="M12 20.2s-7.2-4.5-7.2-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.2 2.8c0 4.9-7.2 9.4-7.2 9.4z"/>',
    layers:
      '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.4V12l3.1 2"/>',
    eye:
      '<path d="M2.6 12S6 5.6 12 5.6 21.4 12 21.4 12 18 18.4 12 18.4 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.8h.01"/>',
    layers2:
      '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
    route:
      '<circle cx="6" cy="18.5" r="2.4"/><circle cx="18" cy="5.5" r="2.4"/><path d="M8.4 18.5h4.9a4 4 0 0 0 0-8h-3a4 4 0 0 1 0-8h5.3"/>',
    mouse: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v4"/>',
    "circle-alert":
      '<circle cx="12" cy="12" r="9"/><path d="M12 7.6v5"/><path d="M12 16.2h.01"/>',
    login: '<path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 7 5 5-5 5"/><path d="M15 12H3"/>',
    gauge2:
      '<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M13.4 10.6 17 7"/><path d="M4.2 18a9 9 0 1 1 15.6 0"/>'
  };

  function icon(name, size, extraClass) {
    var body = ICONS[name] || "";
    var s = size || 18;
    return (
      '<svg class="icon ' +
      (extraClass || "") +
      '" width="' +
      s +
      '" height="' +
      s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      body +
      "</svg>"
    );
  }

  function hydrateIcons(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-icon]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset.iconReady === "1") continue;
      el.innerHTML = icon(el.dataset.icon, Number(el.dataset.iconSize || 18));
      el.dataset.iconReady = "1";
    }
  }

  /* ------------------------------------------------------------- Utilities */
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function fmtMoney(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  /* --------------------------------------------------------------- Storage */
  var memoryStore = {};

  var store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        if (raw == null) return fallback;
        return JSON.parse(raw);
      } catch (err) {
        return key in memoryStore ? memoryStore[key] : fallback;
      }
    },
    set: function (key, value) {
      memoryStore[key] = value;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        /* storage may be unavailable (private mode / file://) — memory only */
      }
    },
    remove: function (key) {
      delete memoryStore[key];
      try {
        window.localStorage.removeItem(key);
      } catch (err) {
        /* ignore */
      }
    }
  };

  /* -------------------------------------------------------------- Progress */
  var PILLARS = ["encapsulation", "inheritance", "polymorphism", "abstraction"];
  var PROGRESS_KEY = "oopviz.progress.v1";

  function readProgress() {
    var data = store.get(PROGRESS_KEY, null);
    if (!data || typeof data !== "object") data = {};
    if (!data.pillars || typeof data.pillars !== "object") data.pillars = {};
    if (!data.quiz || typeof data.quiz !== "object") data.quiz = { best: 0, attempts: 0, last: 0, total: 0 };
    return data;
  }

  function emitProgress() {
    try {
      window.dispatchEvent(new CustomEvent("oopviz:progress"));
    } catch (err) {
      /* older browsers: no custom events constructor */
    }
  }

  var progress = {
    KEY: PROGRESS_KEY,
    PILLARS: PILLARS,

    get: function () {
      return readProgress();
    },

    pillar: function (id) {
      var data = readProgress();
      return data.pillars[id] || null;
    },

    total: function (id) {
      var p = progress.pillar(id);
      return p ? p.total : 0;
    },

    isComplete: function (id) {
      var p = progress.pillar(id);
      return !!(p && p.completed);
    },

    /* Returns "new" | "progress" | "done" */
    status: function (id) {
      var p = progress.pillar(id);
      if (!p) return "new";
      return p.completed ? "done" : "progress";
    },

    saveStep: function (id, step, total) {
      if (PILLARS.indexOf(id) === -1) return;
      var data = readProgress();
      var prev = data.pillars[id];
      var maxStep = prev ? Math.max(prev.maxStep, step) : step;
      var completed = !!(prev && prev.completed) || step >= total - 1;
      data.pillars[id] = {
        maxStep: maxStep,
        total: total,
        completed: completed,
        updated: Date.now()
      };
      store.set(PROGRESS_KEY, data);
      emitProgress();
    },

    count: function () {
      var data = readProgress();
      var count = 0;
      PILLARS.forEach(function (id) {
        if (data.pillars[id] && data.pillars[id].completed) count++;
      });
      return count;
    },

    quiz: function () {
      return readProgress().quiz;
    },

    saveQuiz: function (score, total) {
      var data = readProgress();
      var q = data.quiz || { best: 0, attempts: 0 };
      q.best = Math.max(Number(q.best) || 0, score);
      q.attempts = (Number(q.attempts) || 0) + 1;
      q.last = score;
      q.total = total;
      data.quiz = q;
      store.set(PROGRESS_KEY, data);
      emitProgress();
      return q;
    },

    reset: function () {
      store.remove(PROGRESS_KEY);
      emitProgress();
    },

    /* Next pillar the learner has not finished, or encapsulation. */
    nextUp: function () {
      for (var i = 0; i < PILLARS.length; i++) {
        if (!progress.isComplete(PILLARS[i])) return PILLARS[i];
      }
      return "encapsulation";
    }
  };

  /* ---------------------------------------------------------------- Motion
     GSAP is used when available. If the CDN is blocked, animations resolve
     instantly so the demo still teaches and never throws.
     ---------------------------------------------------------------- */
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hasGsap() {
    return typeof window.gsap !== "undefined" && !!window.gsap;
  }

  var motion = {
    reduced: reduceMotion,

    available: function () {
      return hasGsap() && !reduceMotion;
    },

    to: function (targets, vars) {
      if (!targets) return null;
      if (hasGsap() && !reduceMotion) return window.gsap.to(targets, vars);
      if (vars && typeof vars.onComplete === "function") {
        window.setTimeout(vars.onComplete, 0);
      }
      return null;
    },

    from: function (targets, vars) {
      if (!targets) return null;
      if (hasGsap() && !reduceMotion) return window.gsap.from(targets, vars);
      if (vars && typeof vars.onComplete === "function") {
        window.setTimeout(vars.onComplete, 0);
      }
      return null;
    },

    fromTo: function (targets, fromVars, toVars) {
      if (!targets) return null;
      if (hasGsap() && !reduceMotion) return window.gsap.fromTo(targets, fromVars, toVars);
      if (toVars && typeof toVars.onComplete === "function") {
        window.setTimeout(toVars.onComplete, 0);
      }
      return null;
    },

    set: function (targets, vars) {
      if (!targets) return;
      if (hasGsap()) {
        window.gsap.set(targets, vars);
        return;
      }
      var nodes = typeof targets === "string" ? qsa(targets) : targets.length ? targets : [targets];
      nodes.forEach(function (el) {
        if (!el || !el.style) return;
        if (vars.opacity != null) el.style.opacity = vars.opacity;
        if (vars.scale != null) el.style.transform = "scale(" + vars.scale + ")";
      });
    },

    kill: function (targets) {
      if (hasGsap() && targets) window.gsap.killTweensOf(targets);
    }
  };

  /* ---------------------------------------------------------------- Toast */
  var toastHost = null;

  function toast(message, iconName) {
    if (!toastHost) toastHost = document.getElementById("toastHost");
    if (!toastHost) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = icon(iconName || "check", 16) + "<span>" + esc(message) + "</span>";
    toastHost.appendChild(el);
    window.setTimeout(function () {
      el.classList.add("is-out");
      window.setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 320);
    }, 2600);
  }

  /* --------------------------------------------------------------- CountUp */
  function countUp(el, to, opts) {
    if (!el) return;
    opts = opts || {};
    var format = opts.format || function (v) {
      return String(Math.round(v));
    };
    var from = opts.from != null ? opts.from : Number(el.dataset.value || 0);
    el.dataset.value = String(to);
    if (reduceMotion || typeof window.requestAnimationFrame !== "function") {
      el.textContent = format(to);
      return;
    }
    var duration = opts.duration || 700;
    var start = null;
    function tick(now) {
      if (start == null) start = now;
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(from + (to - from) * eased);
      if (p < 1) window.requestAnimationFrame(tick);
      else el.textContent = format(to);
    }
    window.requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------- Highlight */
  var KEYWORDS = {
    class: 1, extends: 1, new: 1, this: 1, return: 1, const: 1, let: 1, var: 1,
    function: 1, if: 1, else: 1, for: 1, of: 1, private: 1, public: 1,
    protected: 1, get: 1, set: 1, true: 1, false: 1, null: 1, static: 1, void: 1
  };

  function tok(cls, text) {
    return '<span class="' + cls + '">' + esc(text) + "</span>";
  }

  function highlight(code) {
    var out = "";
    var i = 0;
    while (i < code.length) {
      var c = code.charAt(i);
      var next = code.charAt(i + 1);

      if (c === "/" && next === "/") {
        var nl = code.indexOf("\n", i);
        var endCom = nl === -1 ? code.length : nl;
        out += tok("tok-com", code.slice(i, endCom));
        i = endCom;
        continue;
      }

      if (c === '"' || c === "'") {
        var j = i + 1;
        while (j < code.length && code.charAt(j) !== c) {
          if (code.charAt(j) === "\\") j++;
          j++;
        }
        out += tok("tok-str", code.slice(i, j + 1));
        i = j + 1;
        continue;
      }

      if (/[0-9]/.test(c)) {
        var k = i;
        while (k < code.length && /[0-9.]/.test(code.charAt(k))) k++;
        out += tok("tok-num", code.slice(i, k));
        i = k;
        continue;
      }

      if (/[A-Za-z_$]/.test(c)) {
        var m = i;
        while (m < code.length && /[A-Za-z0-9_$]/.test(code.charAt(m))) m++;
        var word = code.slice(i, m);
        if (KEYWORDS[word]) out += tok("tok-key", word);
        else if (/^[A-Z]/.test(word)) out += tok("tok-fn", word);
        else out += esc(word);
        i = m;
        continue;
      }

      out += esc(c);
      i++;
    }
    return out;
  }

  /* ------------------------------------------------------------ Reveal in */
  function stagger(root, selector, step) {
    var nodes = qsa(selector || ".reveal", root);
    nodes.forEach(function (el, i) {
      el.style.animationDelay = Math.min(i * (step || 60), 420) + "ms";
      el.classList.add("is-in");
    });
  }

  /* ------------------------------------------------------------ Animal art */
  function animalSvg(kind) {
    var stroke =
      'fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"';
    if (kind === "dog") {
      return (
        '<svg viewBox="0 0 64 64" role="img" aria-label="Dog" ' + stroke + ">" +
        '<path d="M19 22c-5.6.4-9 5.6-7.5 11.6S19 41 21.5 37" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
        '<path d="M45 22c5.6.4 9 5.6 7.5 11.6S45 41 42.5 37" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
        '<circle cx="32" cy="33" r="13" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
        '<circle cx="27.4" cy="31" r="1.5" fill="currentColor" stroke="none"/>' +
        '<circle cx="36.6" cy="31" r="1.5" fill="currentColor" stroke="none"/>' +
        '<circle cx="32" cy="35.5" r="2.2" fill="currentColor" stroke="none"/>' +
        '<path d="M29 39.5c1.3 1.5 4.7 1.5 6 0"/>' +
        "</svg>"
      );
    }
    if (kind === "cat") {
      return (
        '<svg viewBox="0 0 64 64" role="img" aria-label="Cat" ' + stroke + ">" +
        '<path d="M22 24 18 10l11.5 6.5" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
        '<path d="M42 24 46 10 34.5 16.5" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
        '<circle cx="32" cy="34" r="12.5" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
        '<circle cx="27.6" cy="32" r="1.5" fill="currentColor" stroke="none"/>' +
        '<circle cx="36.4" cy="32" r="1.5" fill="currentColor" stroke="none"/>' +
        '<path d="m32 36.3-1.8 1.6h3.6z" fill="currentColor" stroke="none"/>' +
        '<path d="M32 38v1.4M32 39.4c-.9.9-1.8.9-2.6 0M32 39.4c.9.9 1.8.9 2.6 0"/>' +
        '<path d="M14 31h8M14 35h8M42 31h8M42 35h8" stroke-opacity=".7"/>' +
        "</svg>"
      );
    }
    /* cow */
    return (
      '<svg viewBox="0 0 64 64" role="img" aria-label="Cow" ' + stroke + ">" +
      '<path d="M23 21c-3.4-3.6-2.2-8.5 2.4-8.5.8 2.2 1.6 4.3 1.6 5.6" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
      '<path d="M41 21c3.4-3.6 2.2-8.5-2.4-8.5-.8 2.2-1.6 4.3-1.6 5.6" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
      '<path d="M19.5 24.5c-4.4.4-6.6 3.6-5.2 6.6" stroke-opacity=".75"/>' +
      '<path d="M44.5 24.5c4.4.4 6.6 3.6 5.2 6.6" stroke-opacity=".75"/>' +
      '<circle cx="32" cy="32" r="13" fill="var(--accent-soft,#fef3c7)" stroke="currentColor"/>' +
      '<circle cx="27.2" cy="29.5" r="1.5" fill="currentColor" stroke="none"/>' +
      '<circle cx="36.8" cy="29.5" r="1.5" fill="currentColor" stroke="none"/>' +
      '<ellipse cx="32" cy="39.5" rx="8" ry="5.6" fill="#fff" stroke="currentColor"/>' +
      '<circle cx="29.4" cy="38.6" r="1" fill="currentColor" stroke="none"/>' +
      '<circle cx="34.6" cy="38.6" r="1" fill="currentColor" stroke="none"/>' +
      '<path d="M29 42h6" stroke-opacity=".7"/>' +
      "</svg>"
    );
  }

  /* ------------------------------------------------------- Concept scaffold */
  function conceptPage(root, config) {
    var accent = config.accent || "cyan";
    var stageClass = config.stageClass ? " " + config.stageClass : "";

    root.innerHTML =
      '<header class="page-head ' + "accent-" + accent + '">' +
        '<div class="page-head__top">' +
          '<span class="eyebrow">' + esc(config.eyebrow) + "</span>" +
          '<span class="pill">' + icon("sparkles", 14) + esc(config.pill || "Interactive demo") + "</span>" +
        "</div>" +
        "<h1>" + esc(config.title) + "</h1>" +
        '<p class="lede">' + esc(config.lede) + "</p>" +
        '<div class="page-head__meta">' +
          '<span class="meta-item">' + icon("layers", 15) + esc(config.metaSteps) + "</span>" +
          '<span class="meta-item">' + icon("clock", 15) + esc(config.metaTime) + "</span>" +
          '<span class="meta-item">' + icon("pointer", 15) + esc(config.metaHint || "Click the demo to interact") + "</span>" +
        "</div>" +
      "</header>" +
      '<div class="concept-layout accent-' + accent + '">' +
        '<section class="stage-card" aria-label="' + esc(config.title) + ' visualization">' +
          '<div class="stage-card__bar">' +
            '<div class="stage-card__title"><span class="live-dot"></span><span data-ref="stepTitle">Getting started</span></div>' +
            '<div class="step-counter"><b data-ref="counterNow">01</b><span aria-hidden="true">/</span><span data-ref="counterTotal">00</span></div>' +
          "</div>" +
          '<div class="stage-canvas' + stageClass + '" data-ref="canvas"></div>' +
          '<div class="stage-card__foot">' +
            '<div class="step-dots" data-ref="dots" aria-label="Demo steps"></div>' +
            '<div class="transport">' +
              '<button class="icon-btn icon-btn--ghost" type="button" data-ref="prevBtn" aria-label="Previous step" title="Previous step">' + icon("arrow-left", 18) + "</button>" +
              '<button class="btn btn--primary btn--play" type="button" data-ref="playBtn" aria-label="Play animation" title="Play the guided animation">' + icon("play", 16) + "<span>Play</span></button>" +
              '<button class="icon-btn icon-btn--ghost" type="button" data-ref="nextBtn" aria-label="Next step" title="Next step">' + icon("arrow-right", 18) + "</button>" +
              '<button class="icon-btn" type="button" data-ref="resetBtn" aria-label="Reset demo" title="Reset">' + icon("rotate", 18) + "</button>" +
            "</div>" +
          "</div>" +
        "</section>" +
        '<aside class="concept-side">' +
          '<section class="panel panel--explain" aria-live="polite">' +
            '<div class="panel__label">' + icon("lightbulb", 14) + "Step <span data-ref=\"panelStep\">1</span></div>" +
            '<h2 data-ref="exTitle">Getting started</h2>' +
            '<p data-ref="exBody"></p>' +
            '<ul class="hint-list" data-ref="exHints"></ul>' +
          "</section>" +
          '<section class="panel panel--code">' +
            '<div class="panel__label">' + icon("code", 14) + "The same idea in code" +
              '<span class="code-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
            "</div>" +
            '<pre class="code-block"><code data-ref="codeBlock">' + highlight(config.code) + "</code></pre>" +
          "</section>" +
          '<section class="panel panel--takeaway">' +
            '<div class="takeaway__icon">' + icon("target", 18) + "</div>" +
            "<div>" +
              '<div class="panel__label">Key takeaway</div>' +
              '<p data-ref="takeaway">' + esc(config.takeaway) + "</p>" +
            "</div>" +
          "</section>" +
        "</aside>" +
      "</div>";

    var refs = {
      layout: qs(".concept-layout", root),
      stage: qs(".stage-card", root),
      canvas: qs('[data-ref="canvas"]', root),
      stepTitle: qs('[data-ref="stepTitle"]', root),
      counterNow: qs('[data-ref="counterNow"]', root),
      counterTotal: qs('[data-ref="counterTotal"]', root),
      dots: qs('[data-ref="dots"]', root),
      prevBtn: qs('[data-ref="prevBtn"]', root),
      playBtn: qs('[data-ref="playBtn"]', root),
      nextBtn: qs('[data-ref="nextBtn"]', root),
      resetBtn: qs('[data-ref="resetBtn"]', root),
      panelStep: qs('[data-ref="panelStep"]', root),
      exTitle: qs('[data-ref="exTitle"]', root),
      exBody: qs('[data-ref="exBody"]', root),
      exHints: qs('[data-ref="exHints"]', root),
      codeBlock: qs('[data-ref="codeBlock"]', root),
      takeaway: qs('[data-ref="takeaway"]', root)
    };

    hydrateIcons(root);
    return refs;
  }

  /* ---------------------------------------------------------------- Stepper */
  function createStepper(config) {
    var steps = config.steps || [];
    var refs = config.refs;
    var viewId = config.viewId || null;
    var delay = config.delay || 6000;
    var onReset = config.onReset;
    var index = 0;
    var playing = false;
    var timer = null;
    var destroyed = false;

    if (!steps.length || !refs) return null;

    refs.dots.innerHTML = steps
      .map(function (step, i) {
        return (
          '<button class="step-dot" type="button" data-step="' + i +
          '" aria-label="Step ' + (i + 1) + ": " + esc(step.label || step.title) +
          '" title="' + esc(step.label || step.title) + '"></button>'
        );
      })
      .join("");

    var dotEls = qsa(".step-dot", refs.dots);
    refs.counterTotal.textContent = pad2(steps.length);

    function clearTimer() {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    }

    function updatePlayButton() {
      refs.playBtn.classList.toggle("is-playing", playing);
      refs.playBtn.innerHTML =
        icon(playing ? "pause" : "play", 16) + "<span>" + (playing ? "Pause" : "Play") + "</span>";
      refs.playBtn.setAttribute("aria-label", playing ? "Pause the guided animation" : "Play the guided animation");
    }

    function stopPlayback() {
      playing = false;
      clearTimer();
      updatePlayButton();
    }

    function schedule() {
      clearTimer();
      if (!playing || destroyed) return;
      if (index >= steps.length - 1) {
        stopPlayback();
        return;
      }
      timer = window.setTimeout(function () {
        timer = null;
        if (!playing || destroyed) return;
        apply(index + 1);
      }, delay);
    }

    function apply(i, opts) {
      if (destroyed) return;
      opts = opts || {};
      index = clamp(i, 0, steps.length - 1);
      var step = steps[index];

      refs.stepTitle.textContent = step.label || step.title;
      refs.counterNow.textContent = pad2(index + 1);
      refs.panelStep.textContent = String(index + 1);
      refs.exTitle.textContent = step.title;
      refs.exBody.textContent = step.body;
      refs.exHints.innerHTML = (step.hints || []).map(function (h) {
        return "<li>" + esc(h) + "</li>";
      }).join("");

      dotEls.forEach(function (dot, di) {
        dot.classList.toggle("is-active", di === index);
        dot.classList.toggle("is-done", di < index);
        if (di === index) dot.setAttribute("aria-current", "step");
        else dot.removeAttribute("aria-current");
      });

      refs.prevBtn.disabled = index === 0;
      refs.nextBtn.disabled = index === steps.length - 1;

      try {
        step.apply(index);
      } catch (err) {
        /* a visual step must never take the page down */
        if (window.console && window.console.error) window.console.error(err);
      }

      if (viewId) progress.saveStep(viewId, index, steps.length);

      if (!opts.manual && playing) schedule();
      if (opts.manual) clearTimer();
    }

    function next() {
      stopPlayback();
      apply(index + 1, { manual: true });
    }

    function prev() {
      stopPlayback();
      apply(index - 1, { manual: true });
    }

    function play() {
      if (destroyed) return;
      if (playing) {
        stopPlayback();
        return;
      }
      if (index >= steps.length - 1) {
        apply(0, { manual: true });
      }
      playing = true;
      updatePlayButton();
      apply(index, { manual: true });
      schedule();
    }

    function reset() {
      stopPlayback();
      if (typeof onReset === "function") onReset();
      apply(0, { manual: true });
    }

    refs.prevBtn.addEventListener("click", prev);
    refs.nextBtn.addEventListener("click", next);
    refs.playBtn.addEventListener("click", play);
    refs.resetBtn.addEventListener("click", reset);

    refs.dots.addEventListener("click", function (event) {
      var dot = event.target.closest(".step-dot");
      if (!dot) return;
      stopPlayback();
      apply(Number(dot.dataset.step), { manual: true });
    });

    function onKeydown(event) {
      if (destroyed || event.metaKey || event.ctrlKey || event.altKey) return;
      var tag = (event.target && event.target.tagName) || "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (event.target && event.target.isContentEditable)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      } else if (event.key === " ") {
        var active = document.activeElement;
        if (active && /^(BUTTON|A)$/.test(active.tagName)) return;
        event.preventDefault();
        play();
      }
    }
    document.addEventListener("keydown", onKeydown);

    updatePlayButton();
    apply(0, { manual: true });

    return {
      apply: apply,
      next: next,
      prev: prev,
      play: play,
      pause: stopPlayback,
      reset: reset,
      destroy: function () {
        destroyed = true;
        stopPlayback();
        document.removeEventListener("keydown", onKeydown);
        motion.kill(refs.canvas.querySelectorAll("*"));
      },
      get current() {
        return index;
      }
    };
  }

  /* ---------------------------------------------------------------- Export */
  OOP.icon = icon;
  OOP.hydrateIcons = hydrateIcons;
  OOP.qs = qs;
  OOP.qsa = qsa;
  OOP.esc = esc;
  OOP.clamp = clamp;
  OOP.pad2 = pad2;
  OOP.fmtMoney = fmtMoney;
  OOP.store = store;
  OOP.progress = progress;
  OOP.motion = motion;
  OOP.toast = toast;
  OOP.countUp = countUp;
  OOP.highlight = highlight;
  OOP.stagger = stagger;
  OOP.animalSvg = animalSvg;
  OOP.conceptPage = conceptPage;
  OOP.createStepper = createStepper;
})(window, document);
