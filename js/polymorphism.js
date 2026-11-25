/* ==========================================================================
   OOP Lab — Polymorphism (animal sounds)
   One method name, three objects, three different answers.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP;
  var icon = OOP.icon;

  var ANIMALS = [
    { id: "dog", name: "Dog", sound: "Woof!", accent: "violet" },
    { id: "cat", name: "Cat", sound: "Meow!", accent: "cyan" },
    { id: "cow", name: "Cow", sound: "Moo!", accent: "emerald" }
  ];

  function render(root) {
    var refs = OOP.conceptPage(root, {
      accent: "amber",
      eyebrow: "Pillar 03 · Polymorphism",
      title: "Polymorphism",
      lede: "Three objects, one method name. When you call makeSound(), you do not check what kind of animal you have — " +
        "each object already knows how to answer. Same call, different behaviour.",
      metaSteps: "6 guided steps",
      metaTime: "About 3 minutes",
      metaHint: "Press the call button, or click an animal",
      code:
        'class Animal {\n' +
        '  makeSound() { return "..."; }\n' +
        '}\n' +
        '\n' +
        'class Dog extends Animal {\n' +
        '  makeSound() { return "Woof!"; }\n' +
        '}\n' +
        'class Cat extends Animal {\n' +
        '  makeSound() { return "Meow!"; }\n' +
        '}\n' +
        '\n' +
        'const animals = [new Dog(), new Cat(), new Cow()];\n' +
        'animals.forEach(animal => animal.makeSound());',
      takeaway: "One method name can produce many behaviours. You call the same thing; each object decides how to respond."
    });

    var canvas = refs.canvas;

    function card(a) {
      var bars = "";
      for (var i = 0; i < 7; i++) bars += "<span></span>";
      return (
        '<button class="sound-card accent-' + a.accent + '" type="button" data-animal="' + a.id +
          '" aria-label="Call makeSound on ' + a.name + '">' +
          '<span class="bubble">“' + a.sound + '”</span>' +
          '<span class="sound-card__avatar">' + OOP.animalSvg(a.id) + "</span>" +
          '<span class="sound-card__name">' + a.name + "</span>" +
          '<span class="method-line">makeSound()</span>' +
          '<span class="wave" aria-hidden="true">' + bars + "</span>" +
          '<span class="sound-card__hint">Click to call</span>' +
        "</button>"
      );
    }

    canvas.innerHTML =
      '<div class="poly-scene">' +
        '<div class="poly-toolbar">' +
          '<button class="btn btn--primary btn-sheen" data-ref="callAll" type="button">' + icon("volume", 16) +
            " Call makeSound() on all</button>" +
          '<span class="method-chip"><span class="dot" aria-hidden="true"></span>makeSound()</span>' +
        "</div>" +
        '<div class="poly-row">' + ANIMALS.map(card).join("") + "</div>" +
        '<div class="poly-console" data-ref="console" aria-live="polite" aria-label="Method call output">' +
          '<div class="console-line is-muted"><span class="prompt">&gt;</span><span>// three objects, one method name</span></div>' +
        "</div>" +
      "</div>";

    OOP.hydrateIcons(canvas);

    var cards = OOP.qsa(".sound-card", canvas);
    var callAllBtn = OOP.qs('[data-ref="callAll"]', canvas);
    var consoleEl = OOP.qs('[data-ref="console"]', canvas);
    var clearTimer = null;

    function logCall(a) {
      var line = document.createElement("div");
      line.className = "console-line";
      line.innerHTML =
        '<span class="prompt">&gt;</span>' +
        "<span><span class=\"res\">" + a.id + ".makeSound()</span> → “" + a.sound + "”</span>";
      consoleEl.prepend(line);
      while (consoleEl.children.length > 3) {
        consoleEl.removeChild(consoleEl.lastElementChild);
      }
    }

    function clearActive() {
      cards.forEach(function (cardEl) {
        cardEl.classList.remove("is-active", "is-dim");
      });
      if (clearTimer) {
        window.clearTimeout(clearTimer);
        clearTimer = null;
      }
    }

    function scheduleClear() {
      if (clearTimer) window.clearTimeout(clearTimer);
      clearTimer = window.setTimeout(clearActive, 4200);
    }

    function call(id, options) {
      options = options || {};
      var a = ANIMALS.filter(function (x) {
        return x.id === id;
      })[0];
      if (!a) return;

      var cardEl = OOP.qs('.sound-card[data-animal="' + id + '"]', canvas);
      if (!cardEl) return;

      if (options.focus) {
        cards.forEach(function (el) {
          el.classList.remove("is-active");
          el.classList.toggle("is-dim", el !== cardEl);
        });
      } else {
        cards.forEach(function (el) {
          el.classList.remove("is-dim");
        });
      }

      cardEl.classList.remove("is-active");
      void cardEl.offsetWidth;
      cardEl.classList.add("is-active");

      logCall(a);
      scheduleClear();
    }

    function callAll() {
      clearActive();
      cards.forEach(function (cardEl) {
        void cardEl.offsetWidth;
        cardEl.classList.add("is-active");
      });
      // Log in reverse so the first animal ends up at the top of the console.
      ANIMALS.slice().reverse().forEach(logCall);
      scheduleClear();
    }

    function resetVisuals() {
      clearActive();
      consoleEl.innerHTML =
        '<div class="console-line is-muted"><span class="prompt">&gt;</span><span>// three objects, one method name</span></div>';
    }

    callAllBtn.addEventListener("click", callAll);

    cards.forEach(function (cardEl) {
      cardEl.addEventListener("click", function () {
        call(cardEl.dataset.animal, { focus: false });
      });
    });

    /* --------------------------------------------------------------- steps */
    var steps = [
      {
        label: "One interface",
        title: "Same method, three objects",
        body: "Each animal card carries the same label: makeSound(). If you wrote code that calls that method, " +
          "you would not need to care which animal you were holding.",
        hints: ["The method name is the shared doorway.", "The object supplies the behaviour."],
        apply: function () {
          resetVisuals();
        }
      },
      {
        label: "Dog",
        title: "Dog answers with a bark",
        body: "Calling dog.makeSound() runs the version of the method that belongs to Dog. The call looks identical; " +
          "the answer is not.",
        hints: ["Dog overrides makeSound().", "The other animals are not involved."],
        apply: function () {
          resetVisuals();
          call("dog", { focus: true });
        }
      },
      {
        label: "Cat",
        title: "Cat answers differently",
        body: "The same call on a Cat runs Cat's version and returns “Meow!”. Nothing in the calling code changed.",
        hints: ["The object chooses the behaviour.", "No if/else on animal type."],
        apply: function () {
          resetVisuals();
          call("cat", { focus: true });
        }
      },
      {
        label: "Cow",
        title: "Cow answers differently again",
        body: "A third object, a third answer, still the same method name. This is polymorphism: many forms behind one interface.",
        hints: ["Three classes, one method signature.", "Calling code stays simple."],
        apply: function () {
          resetVisuals();
          call("cow", { focus: true });
        }
      },
      {
        label: "All together",
        title: "One loop, three sounds",
        body: "A single loop can call makeSound() on every animal and collect three different results. " +
          "The loop does not know or care what each object is.",
        hints: ["Same line of code runs three times.", "Each call resolves to that object's own method."],
        apply: function () {
          resetVisuals();
          callAll();
        }
      },
      {
        label: "Why it matters",
        title: "Add a fourth animal, change no caller",
        body: "If Duck joins the family with makeSound() returning “Quack!”, the existing call-all loop works immediately. " +
          "Polymorphism lets new objects plug into old code.",
        hints: ["Callers depend on the method, not the class.", "New behaviour, same interface."],
        apply: function () {
          resetVisuals();
          callAll();
        }
      }
    ];

    var stepper = OOP.createStepper({
      steps: steps,
      refs: refs,
      viewId: "polymorphism",
      delay: 6000,
      onReset: resetVisuals
    });

    return function cleanup() {
      if (stepper) stepper.destroy();
      if (clearTimer) window.clearTimeout(clearTimer);
      OOP.motion.kill(canvas.querySelectorAll("*"));
    };
  }

  OOP.views = OOP.views || {};
  OOP.views.polymorphism = {
    id: "polymorphism",
    title: "Polymorphism",
    render: render
  };
})(window, document);
