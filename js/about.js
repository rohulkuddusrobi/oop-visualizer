/* ==========================================================================
   OOP Lab — about / how it works view
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP;
  var icon = OOP.icon;
  var esc = OOP.esc;
  var progress = OOP.progress;

  var PILLAR_LINKS = [
    { id: "encapsulation", label: "Encapsulation", note: "Protect data, expose careful methods" },
    { id: "inheritance", label: "Inheritance", note: "Reuse a parent class" },
    { id: "polymorphism", label: "Polymorphism", note: "One method, many behaviours" },
    { id: "abstraction", label: "Abstraction", note: "Hide the machinery, show the controls" }
  ];

  function render(root) {
    var count = progress.count();
    var quiz = progress.quiz();
    var armed = false;
    var armTimer = null;

    root.innerHTML =
      '<header class="page-head">' +
        '<div class="page-head__top"><span class="eyebrow">' + icon("compass", 14) + "How this lab works</span>" +
          '<span class="pill">' + icon("heart", 14) + "Made for beginners</span></div>" +
        "<h1>Built for people who have never written code.</h1>" +
        '<p class="lede">Every idea here is taught twice: once as a moving picture, and once as a small piece of code. ' +
          "You do not need to read the code to understand the picture — it is there for the day you are curious.</p>" +
      "</header>" +

      '<div class="about-grid">' +
        '<section class="about-card">' +
          '<span class="eyebrow">Why visuals first</span>' +
          "<h2 style=\"margin-top:8px\">A picture holds an idea in place</h2>" +
          "<p>Programming words are abstract. “Private field” and “overridden method” mean little until you have seen " +
            "money refused at an ATM or heard three animals answer the same call.</p>" +
          "<p>Each demo isolates one pillar, gives it a familiar machine, and lets you move it forward and backward. " +
            "That is deliberate: you learn the boundary of an idea by pushing against it.</p>" +
        "</section>" +

        '<section class="about-card">' +
          '<span class="eyebrow">The syllabus</span>' +
          '<h2 style="margin-top:8px">Four pillars, in order</h2>' +
          '<ul class="about-list">' +
            PILLAR_LINKS.map(function (p) {
              return "<li><a href=\"#/" + p.id + "\"><b>" + esc(p.label) + "</b></a> — " + esc(p.note) + "</li>";
            }).join("") +
          "</ul>" +
          '<p class="muted" style="margin-top:12px;font-size:0.8rem">The quiz draws on all four. It is conceptual, not a memory test.</p>' +
        "</section>" +

        '<section class="about-card">' +
          '<span class="eyebrow">Controls</span>' +
          '<h2 style="margin-top:8px">You are always in charge</h2>' +
          '<ul class="about-list">' +
            "<li><b>Play</b> runs the guided steps with enough time to read each one.</li>" +
            "<li><b>Pause</b> stops the tour wherever you are.</li>" +
            "<li><b>Next / Previous</b> move one step at a time and pause the tour.</li>" +
            "<li><b>Reset</b> returns the demo and its data to the starting state.</li>" +
            "<li>The <b>step dots</b> jump straight to any step. Arrow keys work too.</li>" +
          "</ul>" +
        "</section>" +

        '<section class="about-card">' +
          '<span class="eyebrow">Under the hood</span>' +
          "<h2 style=\"margin-top:8px\">Small on purpose</h2>" +
          "<p>No framework, no build step, no account, nothing sent anywhere. The whole lab is HTML, CSS, SVG and " +
            "plain JavaScript. Progress is stored only in this browser.</p>" +
          '<div class="stack-row">' +
            '<span class="stack-tag">HTML5</span><span class="stack-tag">CSS3</span>' +
            '<span class="stack-tag">Vanilla JS</span><span class="stack-tag">SVG</span>' +
            '<span class="stack-tag">GSAP</span><span class="stack-tag">Lucide icons</span>' +
          "</div>" +
          '<p class="muted" style="margin-top:12px;font-size:0.8rem">Animations respect your system’s ' +
            "“reduce motion” setting. If the animation library cannot load, the demos still work — states change instantly.</p>" +
        "</section>" +

        '<section class="about-card">' +
          '<span class="eyebrow">Your data</span>' +
          '<h2 style="margin-top:8px">Progress summary</h2>' +
          '<div class="result__stats" style="justify-content:flex-start;margin:14px 0 0">' +
            '<div class="stat-box"><b data-ref="statPillars">' + count + " / 4</b><span>Pillars complete</span></div>" +
            '<div class="stat-box"><b data-ref="statQuiz">' + (quiz && quiz.best ? quiz.best : 0) + " / " + (quiz && quiz.total ? quiz.total : 12) + "</b><span>Best quiz</span></div>" +
            '<div class="stat-box"><b data-ref="statAttempts">' + (quiz && quiz.attempts ? quiz.attempts : 0) + "</b><span>Quiz attempts</span></div>" +
          "</div>" +
        "</section>" +

        '<section class="about-card">' +
          '<span class="eyebrow">Run it locally</span>' +
          "<h2 style=\"margin-top:8px\">Two ways to open it</h2>" +
          "<p>Double-click <code>index.html</code>, or serve the folder for the cleanest experience:</p>" +
          '<pre class="code-block" style="background:#0f172a;color:#e2e8f0;border-radius:10px;margin-top:12px;padding:12px 14px;font-size:0.76rem"><code>python -m http.server 8000</code></pre>' +
          '<p class="muted" style="margin-top:10px;font-size:0.8rem">Then visit <code>http://localhost:8000</code>.</p>' +
        "</section>" +

        '<section class="about-card reset-card about-card--wide">' +
          '<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between">' +
            "<div style=\"flex:1 1 320px\">" +
              '<span class="eyebrow" style="color:#b91c1c">Start over</span>' +
              '<h2 style="margin-top:8px">Reset your progress</h2>' +
              '<p class="muted" style="font-size:0.84rem">Clears completed pillars and your best quiz score from this browser. ' +
                "This cannot be undone.</p>" +
            "</div>" +
            '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">' +
              '<button class="btn btn--danger" id="resetProgressBtn" type="button">' + icon("trash", 16) + "<span>Reset progress</span></button>" +
              '<span class="micro" id="resetNote" style="text-align:right;max-width:260px">You will be asked to confirm.</span>' +
            "</div>" +
          "</div>" +
        "</section>" +
      "</div>";

    OOP.hydrateIcons(root);

    var btn = OOP.qs("#resetProgressBtn", root);
    var note = OOP.qs("#resetNote", root);
    var statPillars = OOP.qs('[data-ref="statPillars"]', root);
    var statQuiz = OOP.qs('[data-ref="statQuiz"]', root);
    var statAttempts = OOP.qs('[data-ref="statAttempts"]', root);

    function refreshStats() {
      var latestQuiz = progress.quiz();
      if (statPillars) statPillars.textContent = progress.count() + " / 4";
      if (statQuiz) statQuiz.textContent = (latestQuiz.best || 0) + " / " + (latestQuiz.total || 12);
      if (statAttempts) statAttempts.textContent = String(latestQuiz.attempts || 0);
    }

    function disarm() {
      armed = false;
      if (armTimer) {
        window.clearTimeout(armTimer);
        armTimer = null;
      }
      btn.classList.remove("is-armed");
      btn.innerHTML = icon("trash", 16) + "<span>Reset progress</span>";
    }

    function onReset() {
      if (!armed) {
        armed = true;
        btn.classList.add("is-armed");
        btn.innerHTML = icon("circle-alert", 16) + "<span>Click again to confirm</span>";
        note.textContent = "This removes all saved progress in this browser.";
        armTimer = window.setTimeout(function () {
          disarm();
          note.textContent = "You will be asked to confirm.";
        }, 6000);
        return;
      }

      window.clearTimeout(armTimer);
      progress.reset();
      refreshStats();
      disarm();
      note.textContent = "Progress cleared. Every demo starts fresh.";
      OOP.toast("Progress cleared", "trash");
    }

    btn.addEventListener("click", onReset);

    return function cleanup() {
      if (armTimer) window.clearTimeout(armTimer);
    };
  }

  OOP.views = OOP.views || {};
  OOP.views.about = {
    id: "about",
    title: "How it works",
    render: render
  };
})(window, document);
