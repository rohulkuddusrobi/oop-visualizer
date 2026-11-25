/* ==========================================================================
   OOP Lab — Quiz
   Twelve conceptual questions, instant feedback, a score ring, and a review.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP;
  var icon = OOP.icon;
  var esc = OOP.esc;
  var progress = OOP.progress;

  var QUESTIONS = [
    {
      pillar: "Encapsulation",
      icon: "lock",
      q: "A class keeps its balance private and gives you deposit() and withdraw(). What does this design protect you from?",
      options: [
        "Changing the balance directly, without going through the rules",
        "Ever seeing the balance",
        "Using methods at all",
        "Creating more than one object"
      ],
      answer: 0,
      why: "The private field cannot be written from outside. The methods are the only path, so the class's own rules always apply."
    },
    {
      pillar: "Encapsulation",
      icon: "lock",
      q: "Which member belongs in the public interface of a well-encapsulated class?",
      options: [
        "The raw private balance field",
        "An internal debugging counter",
        "A method that validates a request before changing data",
        "Every field, so other code has freedom"
      ],
      answer: 2,
      why: "Public members are the deliberate doors. A validating method lets the class check every request before touching its own data."
    },
    {
      pillar: "Encapsulation",
      icon: "lock",
      q: "Why is making data private useful even inside a small program?",
      options: [
        "It makes the program run faster",
        "It stops other code from breaking the object's rules",
        "It hides code from the compiler",
        "It removes the need for methods"
      ],
      answer: 1,
      why: "The benefit is correctness, not speed. If nobody can bypass the rules, the object cannot be left in an impossible state."
    },
    {
      pillar: "Inheritance",
      icon: "git-branch",
      q: "Dog extends Animal. Which statement is true?",
      options: [
        "Animal receives all of Dog's members",
        "Dog must rewrite every Animal member",
        "Dog cannot add new methods",
        "Dog receives Animal's members and may add its own"
      ],
      answer: 3,
      why: "Inheritance flows from parent to child. Dog reuses what Animal already defines, then adds bark()."
    },
    {
      pillar: "Inheritance",
      icon: "git-branch",
      q: "Animal gains a new method called breathe(). What happens to Dog and Cat?",
      options: [
        "Both inherit the new method automatically",
        "You must copy it into each child by hand",
        "Only Dog receives it",
        "The children stop working"
      ],
      answer: 0,
      why: "That is the payoff of inheritance: one change in the parent reaches every child."
    },
    {
      pillar: "Inheritance",
      icon: "git-branch",
      q: "What does “extends” express about Dog and Animal?",
      options: [
        "Dog and Animal are unrelated",
        "Animal is a kind of Dog",
        "A Dog is a kind of Animal, so a Dog can be used where an Animal is expected",
        "Dog replaces Animal completely"
      ],
      answer: 2,
      why: "“is-a” is the test. A Dog is an Animal, so any code that needs an Animal can accept a Dog."
    },
    {
      pillar: "Polymorphism",
      icon: "waves",
      q: "dog.makeSound() returns “Woof!” and cat.makeSound() returns “Meow!”. What is polymorphic here?",
      options: [
        "The same method name resolves to different behaviour per object",
        "The method name changes from object to object",
        "Both animals share one method body",
        "The caller must check the animal type with if/else"
      ],
      answer: 0,
      why: "The interface stays the same — makeSound() — while each class supplies its own implementation."
    },
    {
      pillar: "Polymorphism",
      icon: "waves",
      q: "You add a Duck class with makeSound(). Why does an existing “call every animal” loop keep working?",
      options: [
        "The compiler rewrites the loop",
        "Duck inherits the loop from Animal",
        "The loop skips unknown animals",
        "The loop calls the shared method name, not a specific class"
      ],
      answer: 3,
      why: "The loop depends on the method, not on the concrete class. New objects that honour the same method plug straight in."
    },
    {
      pillar: "Polymorphism",
      icon: "waves",
      q: "What is the main benefit of polymorphism for the person calling the code?",
      options: [
        "They can treat different objects through one common interface",
        "They no longer need classes",
        "They can skip testing",
        "Every method returns the same value"
      ],
      answer: 0,
      why: "Callers write one simple line and let each object decide how to respond. That keeps calling code small and stable."
    },
    {
      pillar: "Abstraction",
      icon: "car",
      q: "A car exposes start() and hides pumpFuel(), ignite() and spinEngine(). What is the point?",
      options: [
        "The hidden methods do nothing",
        "The car has no engine",
        "Drivers get a simple control without managing internal steps",
        "start() must be called once for every internal step"
      ],
      answer: 2,
      why: "Abstraction selects a small surface and hides the sequence behind it. The complexity still exists — it is just not the driver's job."
    },
    {
      pillar: "Abstraction",
      icon: "car",
      q: "How is abstraction different from encapsulation?",
      options: [
        "Encapsulation protects data; abstraction chooses which complexity to expose",
        "They are the same thing under two names",
        "Abstraction is only about private fields",
        "Encapsulation hides the dashboard"
      ],
      answer: 0,
      why: "They cooperate but answer different questions. Encapsulation asks “who may touch this data?”; abstraction asks “what should the user have to know?”"
    },
    {
      pillar: "Abstraction",
      icon: "car",
      q: "Which change best improves abstraction in an app?",
      options: [
        "Make every internal helper public",
        "Replace five low-level setup calls with one well-named operation",
        "Expose every configuration flag by default",
        "Print internal state to the user"
      ],
      answer: 1,
      why: "One meaningful operation hides the sequence and reduces the decisions a caller must make."
    }
  ];

  var TOTAL = QUESTIONS.length;
  var RING_C = 2 * Math.PI * 62;

  function tier(score) {
    var pct = score / TOTAL;
    if (pct === 1) {
      return {
        title: "Perfect score.",
        copy: "You can explain all four pillars in your own words. That is the goal — not the number, but the mental model."
      };
    }
    if (pct >= 0.75) {
      return {
        title: "Strong understanding.",
        copy: "The core ideas are in place. Read the explanations for the ones you missed, and you are done."
      };
    }
    if (pct >= 0.5) {
      return {
        title: "Good foundation.",
        copy: "You have the shape of it. Revisit the demo behind each miss — one minute with the animation usually settles it."
      };
    }
    return {
      title: "Worth a second pass.",
      copy: "That is completely normal. The quiz is not timed. Play through the four demos again, then retake it."
    };
  }

  function render(root) {
    var index = 0;
    var score = 0;
    var answered = false;
    var finished = false;
    var chosen = -1;
    var answers = [];
    var optionEls = [];
    var feedbackEl = null;
    var nextBtn = null;

    root.innerHTML =
      '<div class="quiz-view">' +
        '<header class="quiz-head">' +
          '<span class="eyebrow">' + icon("quiz", 14) + " Knowledge check</span>" +
          "<h1>Do the four pillars make sense?</h1>" +
          "<p>Twelve questions about meaning, not memorised definitions. Every answer comes with an explanation, " +
            "and you can retake the quiz as often as you like.</p>" +
          '<div class="quiz-meta">' +
            '<span data-ref="stepMeta">Question <b data-ref="qnum">1</b> of ' + TOTAL + "</span>" +
            '<span><span data-ref="scoreLabel">Score</span> <b data-ref="score">0</b><span data-ref="scoreTotal"></span></span>' +
          "</div>" +
          '<div class="quiz-progress"><span data-ref="bar" style="width:0%"></span></div>' +
        "</header>" +
        '<div data-ref="body"></div>' +
      "</div>";

    var body = OOP.qs('[data-ref="body"]', root);
    var qnumEl = OOP.qs('[data-ref="qnum"]', root);
    var scoreEl = OOP.qs('[data-ref="score"]', root);
    var barEl = OOP.qs('[data-ref="bar"]', root);
    var stepMetaEl = OOP.qs('[data-ref="stepMeta"]', root);
    var scoreLabelEl = OOP.qs('[data-ref="scoreLabel"]', root);
    var scoreTotalEl = OOP.qs('[data-ref="scoreTotal"]', root);

    function updateChrome() {
      qnumEl.textContent = String(Math.min(index + 1, TOTAL));
      scoreEl.textContent = String(score);
      var done = index + (answered ? 1 : 0);
      barEl.style.width = Math.round((done / TOTAL) * 100) + "%";
    }

    function renderQuestion() {
      answered = false;
      chosen = -1;
      var q = QUESTIONS[index];

      body.innerHTML =
        '<div class="quiz-card">' +
          '<span class="quiz-pillar">' + icon(q.icon, 12) + esc(q.pillar) + "</span>" +
          '<h2 class="quiz-question">' + esc(q.q) + "</h2>" +
          '<div class="options" role="group" aria-label="Answer choices">' +
            q.options.map(function (opt, i) {
              return (
                '<button class="option" type="button" data-index="' + i + '">' +
                  '<span class="option__key" aria-hidden="true">' + String.fromCharCode(65 + i) + "</span>" +
                  '<span class="option__text">' + esc(opt) + "</span>" +
                  '<span class="option__mark" aria-hidden="true"></span>' +
                "</button>"
              );
            }).join("") +
          "</div>" +
          '<div data-ref="feedback" role="status" aria-live="polite" hidden></div>' +
          '<div class="quiz-actions">' +
            '<span class="quiz-hint">Choose one answer — you can use keys 1–4.</span>' +
            '<button class="btn btn--primary" data-ref="next" type="button" disabled>Next question</button>' +
          "</div>" +
        "</div>";

      optionEls = OOP.qsa(".option", body);
      feedbackEl = OOP.qs('[data-ref="feedback"]', body);
      nextBtn = OOP.qs('[data-ref="next"]', body);

      optionEls.forEach(function (btn, i) {
        btn.addEventListener("click", function () {
          choose(i);
        });
      });
      nextBtn.addEventListener("click", onNext);
      updateChrome();
    }

    function choose(i) {
      if (answered) return;
      var q = QUESTIONS[index];
      answered = true;
      chosen = i;
      var correct = i === q.answer;

      if (correct) score++;
      answers[index] = { chosen: i, correct: correct };

      optionEls.forEach(function (btn, bi) {
        btn.disabled = true;
        var mark = OOP.qs(".option__mark", btn);
        if (bi === q.answer) {
          btn.classList.add("is-correct");
          if (mark) mark.innerHTML = icon("check", 16);
        } else if (bi === i) {
          btn.classList.add("is-wrong");
          if (mark) mark.innerHTML = icon("x", 16);
        } else {
          btn.classList.add("is-muted");
        }
      });

      feedbackEl.hidden = false;
      feedbackEl.className = "feedback" + (correct ? "" : " is-bad");
      feedbackEl.innerHTML =
        '<span class="feedback__icon">' + icon(correct ? "check" : "x", 15) + "</span>" +
        "<div><b>" + (correct ? "Correct" : "Not quite") + "</b><p>" + esc(q.why) + "</p></div>";

      nextBtn.disabled = false;
      nextBtn.innerHTML =
        (index === TOTAL - 1 ? "See my result" : "Next question") + " " + icon("arrow-right", 15);

      updateChrome();
    }

    function onNext() {
      if (!answered) return;
      if (index === TOTAL - 1) {
        finish();
        return;
      }
      index++;
      renderQuestion();
    }

    function finish() {
      if (finished) return;
      finished = true;
      var saved = progress.saveQuiz(score, TOTAL);
      var t = tier(score);

      body.innerHTML =
        '<div class="result" tabindex="-1">' +
          '<div class="result__ring">' +
            '<svg viewBox="0 0 160 160" aria-hidden="true">' +
              "<defs>" +
                '<linearGradient id="resultGrad" x1="0" y1="0" x2="1" y2="1">' +
                  '<stop offset="0" stop-color="#6366f1"/>' +
                  '<stop offset=".6" stop-color="#8b5cf6"/>' +
                  '<stop offset="1" stop-color="#06b6d4"/>' +
                "</linearGradient>" +
              "</defs>" +
              '<circle class="track" cx="80" cy="80" r="62"/>' +
              '<circle class="fill" cx="80" cy="80" r="62" stroke-dasharray="' + RING_C.toFixed(1) +
                '" stroke-dashoffset="' + RING_C.toFixed(1) + '"/>' +
            "</svg>" +
            '<div class="result__center"><b>' + score + "</b><span>out of " + TOTAL + "</span></div>" +
          "</div>" +
          "<h2>" + esc(t.title) + "</h2>" +
          "<p>" + esc(t.copy) + "</p>" +
          '<div class="result__stats">' +
            '<div class="stat-box"><b>' + score + "</b><span>Correct</span></div>" +
            '<div class="stat-box"><b>' + (TOTAL - score) + "</b><span>Missed</span></div>" +
            '<div class="stat-box"><b>' + saved.best + "</b><span>Best score</span></div>" +
            '<div class="stat-box"><b>' + saved.attempts + "</b><span>Attempts</span></div>" +
          "</div>" +
          '<div class="result__actions">' +
            '<button class="btn btn--primary" type="button" data-ref="restart">' + icon("refresh", 16) + " Restart quiz</button>" +
            '<a class="btn btn--ghost" href="#/dashboard">Back to dashboard</a>' +
            '<a class="btn btn--ghost" href="#/encapsulation">Revisit the demos</a>' +
          "</div>" +
          '<div class="review">' +
            "<h3>Review every answer</h3>" +
            QUESTIONS.map(function (q, i) {
              var a = answers[i] || { chosen: -1, correct: false };
              var mark = a.correct ? "is-ok" : "is-bad";
              var line = a.correct
                ? "Correct — " + esc(q.pillar)
                : "You chose “" + esc(q.options[a.chosen] || "—") + "”. Correct answer: “" + esc(q.options[q.answer]) + "”.";
              return (
                '<div class="review-item">' +
                  '<span class="review-item__mark ' + mark + '">' + icon(a.correct ? "check" : "x", 12) + "</span>" +
                  "<div><b>" + esc(q.q) + "</b><span>" + line + "</span></div>" +
                "</div>"
              );
            }).join("") +
          "</div>" +
        "</div>";

      updateChrome();
      barEl.style.width = "100%";
      stepMetaEl.hidden = true;
      scoreLabelEl.textContent = "Final score";
      scoreTotalEl.textContent = " / " + TOTAL;
      window.scrollTo(0, 0);

      var resultEl = OOP.qs(".result", body);
      if (resultEl) resultEl.focus({ preventScroll: true });

      var fill = OOP.qs(".result__ring .fill", body);
      if (fill) {
        window.setTimeout(function () {
          fill.style.strokeDashoffset = String(RING_C * (1 - score / TOTAL));
        }, 80);
      }

      if (score / TOTAL >= 0.8) celebrate(OOP.qs(".result", body));

      var restart = OOP.qs('[data-ref="restart"]', body);
      if (restart) {
        restart.addEventListener("click", function () {
          index = 0;
          score = 0;
          answers = [];
          finished = false;
          stepMetaEl.hidden = false;
          scoreLabelEl.textContent = "Score";
          scoreTotalEl.textContent = "";
          renderQuestion();
          updateChrome();
          window.scrollTo(0, 0);
        });
      }
    }

    function celebrate(host) {
      if (!host || !OOP.motion.available()) return;
      var colors = ["#4f46e5", "#06b6d4", "#f59e0b", "#10b981"];
      for (var i = 0; i < 18; i++) {
        var dot = document.createElement("i");
        dot.style.position = "absolute";
        dot.style.left = "50%";
        dot.style.top = "42%";
        dot.style.width = "7px";
        dot.style.height = "7px";
        dot.style.borderRadius = "50%";
        dot.style.pointerEvents = "none";
        dot.style.zIndex = "5";
        dot.style.background = colors[i % colors.length];
        host.appendChild(dot);

        var angle = (Math.PI * 2 * i) / 18;
        OOP.motion.to(dot, {
          x: Math.cos(angle) * (90 + Math.random() * 90),
          y: Math.sin(angle) * (70 + Math.random() * 60) + 40,
          opacity: 0,
          scale: 0.4,
          duration: 1.3,
          ease: "power2.out",
          onComplete: (function (el) {
            return function () {
              el.remove();
            };
          })(dot)
        });
      }
    }

    function onKeydown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      var tag = (event.target && event.target.tagName) || "";
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;

      if (/^[1-4]$/.test(event.key) && !answered) {
        var i = Number(event.key) - 1;
        if (i < QUESTIONS[index].options.length) {
          event.preventDefault();
          choose(i);
        }
      } else if (event.key === "Enter" && answered && !finished) {
        event.preventDefault();
        onNext();
      }
    }

    document.addEventListener("keydown", onKeydown);
    renderQuestion();

    return function cleanup() {
      document.removeEventListener("keydown", onKeydown);
      OOP.motion.kill(root.querySelectorAll("*"));
    };
  }

  OOP.views = OOP.views || {};
  OOP.views.quiz = {
    id: "quiz",
    title: "Quiz",
    render: render
  };
})(window, document);
