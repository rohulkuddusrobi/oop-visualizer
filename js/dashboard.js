/* ==========================================================================
   OOP Lab — dashboard view
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP;
  var icon = OOP.icon;
  var esc = OOP.esc;
  var progress = OOP.progress;

  var PILLARS = [
    {
      id: "encapsulation",
      index: "01",
      accent: "cyan",
      icon: "lock",
      title: "Encapsulation",
      desc: "Keep the important data private, then open small, safe doors for using it.",
      example: "ATM cash machine",
      exampleIcon: "banknote"
    },
    {
      id: "inheritance",
      index: "02",
      accent: "violet",
      icon: "git-branch",
      title: "Inheritance",
      desc: "Build a new class on top of an existing one, so shared behaviour comes for free.",
      example: "Animal family",
      exampleIcon: "git-branch"
    },
    {
      id: "polymorphism",
      index: "03",
      accent: "amber",
      icon: "waves",
      title: "Polymorphism",
      desc: "Call the same method on different objects and let each one answer in its own way.",
      example: "Dog, cat and cow sounds",
      exampleIcon: "volume"
    },
    {
      id: "abstraction",
      index: "04",
      accent: "emerald",
      icon: "car",
      title: "Abstraction",
      desc: "Show only the simple controls and hide the complicated machinery behind them.",
      example: "Starting a car",
      exampleIcon: "key"
    }
  ];

  var C = 2 * Math.PI * 54; // ring circumference

  function statusMeta(id) {
    var status = progress.status(id);
    if (status === "done") return { cls: "is-done", label: "Complete" };
    if (status === "progress") return { cls: "is-progress", label: "In progress" };
    return { cls: "", label: "Not started" };
  }

  function pillarCard(p, i) {
    var meta = statusMeta(p.id);
    var pillar = progress.pillar(p.id);
    var stepNote = "";
    if (meta.cls === "is-progress" && pillar) {
      stepNote = " · step " + (pillar.maxStep + 1) + " of " + pillar.total;
    }
    return (
      '<article class="pillar-card accent-' + p.accent + ' reveal">' +
        '<div class="pillar-card__top">' +
          '<span class="pillar-icon">' + icon(p.icon, 24) + "</span>" +
          '<span class="pillar-index">' + p.index + "</span>" +
        "</div>" +
        "<div>" +
          "<h3>" + esc(p.title) + "</h3>" +
          "<p>" + esc(p.desc) + "</p>" +
          '<span class="pillar-example">' + icon(p.exampleIcon, 13) + esc(p.example) + "</span>" +
        "</div>" +
        '<div class="pillar-card__foot">' +
          '<span class="status-pill ' + meta.cls + '"><span class="dot"></span>' + meta.label + esc(stepNote) + "</span>" +
          '<a class="card-link" href="#/' + p.id + '">Open demo ' + icon("arrow-right", 15) + "</a>" +
        "</div>" +
      "</article>"
    );
  }

  function legendRows(count) {
    return PILLARS.map(function (p) {
      var done = progress.isComplete(p.id);
      return (
        '<a class="legend-row' + (done ? " is-done" : "") + '" href="#/' + p.id + '">' +
          '<span class="dot" aria-hidden="true"></span>' +
          "<span>" + esc(p.title) + "</span>" +
          '<span class="tick" aria-hidden="true">' + icon("check", 12) + "</span>" +
        "</a>"
      );
    }).join("");
  }

  function render(root) {
    var count = progress.count();
    var nextId = progress.nextUp();
    var next = PILLARS.filter(function (p) {
      return p.id === nextId;
    })[0] || PILLARS[0];
    var offset = C - (count / 4) * C;
    var quiz = progress.quiz();
    var quizLine = quiz && quiz.best
      ? "Your best score is " + quiz.best + " of " + (quiz.total || 12) + "."
      : "Twelve short questions, instant feedback, no pressure.";

    root.innerHTML =
      '<header class="hero reveal">' +
        '<span class="hero__orb" aria-hidden="true"></span>' +
        '<div class="hero__content">' +
          '<span class="hero__eyebrow"><span class="ico">' + icon("sparkles", 13) + "</span> Four pillars · one mental model</span>" +
          '<h1 class="hero__title">See what <em>objects</em> actually do.</h1>' +
          '<p class="hero__lede">Object-Oriented Programming organises software the way we organise the real world. ' +
            "A cash machine protects its balance. A dog inherits from an animal. One command makes three different sounds. " +
            "A car hides its engine behind a key. Pick a pillar and play with it.</p>" +
          '<div class="hero__actions">' +
            '<a class="btn btn--primary" href="#/' + next.id + '">' + icon("play", 16) +
              (count === 0 ? "Start with " : "Continue with ") + esc(next.title) + "</a>" +
            '<a class="btn btn--glass" href="#/quiz">' + icon("quiz", 16) + "Take the quiz</a>" +
          "</div>" +
          '<div class="hero__meta">' +
            "<span>" + icon("layers", 15) + "4 guided demos</span>" +
            "<span>" + icon("quiz", 15) + "12 questions</span>" +
            "<span>" + icon("book", 15) + "No code needed</span>" +
          "</div>" +
        "</div>" +
        '<aside class="progress-card" aria-label="Learning progress">' +
          '<div class="progress-ring">' +
            '<svg viewBox="0 0 160 160" aria-hidden="true">' +
              "<defs>" +
                '<linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">' +
                  '<stop offset="0" stop-color="#67e8f9"/>' +
                  '<stop offset=".55" stop-color="#a5b4fc"/>' +
                  '<stop offset="1" stop-color="#f0abfc"/>' +
                "</linearGradient>" +
              "</defs>" +
              '<circle class="progress-ring__track" cx="80" cy="80" r="54"/>' +
              '<circle class="progress-ring__fill" cx="80" cy="80" r="54" ' +
                'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"/>' +
            "</svg>" +
            '<div class="progress-ring__center">' +
              '<div class="progress-ring__num">' + count + "<small>/4</small></div>" +
              '<div class="progress-ring__label">Pillars complete</div>' +
            "</div>" +
          "</div>" +
          '<div class="progress-legend">' + legendRows(count) + "</div>" +
        "</aside>" +
      "</header>" +

      '<section class="section" aria-labelledby="pillarsTitle">' +
        '<div class="section-head">' +
          '<div><h2 id="pillarsTitle">The four pillars</h2>' +
            '<p>Each one is a short guided demo with its own real-life machine.</p></div>' +
          '<a class="card-link" href="#/about">How this lab works ' + icon("arrow-right", 15) + "</a>" +
        "</div>" +
        '<div class="pillar-grid">' + PILLARS.map(pillarCard).join("") + "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="split-grid">' +
          '<div class="info-card reveal">' +
            '<span class="eyebrow">Start here</span>' +
            '<h3 style="margin-top:8px">What is Object-Oriented Programming?</h3>' +
            '<p>It is a way of grouping data together with the actions that use it. ' +
              'A <b>class</b> is the blueprint. An <b>object</b> is one thing built from that blueprint. ' +
              "OOP gives us four tools for arranging those blueprints so programs stay understandable.</p>" +
            '<div class="analogy-list">' +
              '<div class="analogy"><span class="analogy__num">01</span><div><b>Encapsulation</b>' +
                "<span>Like a vending machine — you press a button, you never reach inside.</span></div></div>" +
              '<div class="analogy"><span class="analogy__num">02</span><div><b>Inheritance</b>' +
                "<span>Like a family recipe — children start with what the parent already knows.</span></div></div>" +
              '<div class="analogy"><span class="analogy__num">03</span><div><b>Polymorphism</b>' +
                "<span>Like the word “open” — a door, a shop and a book all open differently.</span></div></div>" +
              '<div class="analogy"><span class="analogy__num">04</span><div><b>Abstraction</b>' +
                "<span>Like driving — you use the pedal, not the fuel injector.</span></div></div>" +
            "</div>" +
          "</div>" +

          '<div class="info-card reveal">' +
            '<span class="eyebrow">How to use this lab</span>' +
            '<h3 style="margin-top:8px">Learn by poking at it</h3>' +
            '<ol class="learn-steps">' +
              '<li class="learn-step"><span class="learn-step__dot">1</span><div><b>Pick a pillar</b>' +
                "<span>Start with encapsulation. It is the easiest to feel.</span></div></li>" +
              '<li class="learn-step"><span class="learn-step__dot">2</span><div><b>Press Play — or step through</b>' +
                "<span>Use the arrows to move at your own speed. Nothing is timed.</span></div></li>" +
              '<li class="learn-step"><span class="learn-step__dot">3</span><div><b>Read the takeaway</b>' +
                "<span>One sentence per pillar is enough to remember the idea.</span></div></li>" +
              '<li class="learn-step"><span class="learn-step__dot">4</span><div><b>Try the quiz</b>' +
                "<span>Twelve questions. Instant feedback, and you can retake it.</span></div></li>" +
            "</ol>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="section">' +
        '<div class="info-card reveal" style="display:flex;flex-wrap:wrap;align-items:center;gap:18px;justify-content:space-between">' +
          '<div style="display:flex;gap:14px;align-items:flex-start;min-width:min(100%,420px);flex:1 1 320px">' +
            '<span class="pillar-icon" style="background:#eef2ff;color:#4338ca;border-color:#e0e7ff">' + icon("trophy", 24) + "</span>" +
            "<div>" +
              '<h3 style="font-size:1.08rem;margin-bottom:4px">Check your understanding</h3>' +
              '<p class="muted" style="font-size:0.86rem;line-height:1.6">' + esc(quizLine) + "</p>" +
            "</div>" +
          "</div>" +
          '<a class="btn btn--soft" href="#/quiz">' + icon("quiz", 16) + (quiz && quiz.attempts ? "Retake the quiz" : "Start the quiz") + "</a>" +
        "</div>" +
      "</section>";

    OOP.hydrateIcons(root);
    OOP.stagger(root, ".reveal", 65);

    return function cleanup() {
      /* dashboard has no timers or listeners */
    };
  }

  OOP.views = OOP.views || {};
  OOP.views.dashboard = {
    id: "dashboard",
    title: "Dashboard",
    render: render
  };
})(window, document);
