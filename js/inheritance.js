/* ==========================================================================
   OOP Lab — Inheritance (animal family)
   A parent class lends its members to three children, then each child adds one.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP;
  var icon = OOP.icon;
  var esc = OOP.esc;

  var PROPS = [
    { key: "name", label: "name" },
    { key: "age", label: "age" },
    { key: "eat", label: "eat()" },
    { key: "sleep", label: "sleep()" }
  ];

  var ANIMALS = {
    animal: {
      name: "Animal",
      unique: [],
      note: "The parent class. It defines what every animal shares, and nothing more."
    },
    dog: { name: "Dog", unique: ["bark()"] },
    cat: { name: "Cat", unique: ["meow()"] },
    cow: { name: "Cow", unique: ["moo()"] }
  };

  var CHILDREN = ["dog", "cat", "cow"];

  function render(root) {
    var refs = OOP.conceptPage(root, {
      accent: "violet",
      eyebrow: "Pillar 02 · Inheritance",
      title: "Inheritance",
      lede: "Every animal has a name, an age, and can eat and sleep. Instead of writing that four times, we write it once in Animal " +
        "and let Dog, Cat and Cow inherit it — then each adds its own trick.",
      metaSteps: "6 guided steps",
      metaTime: "About 3 minutes",
      metaHint: "Click any animal to inspect it",
      code:
        'class Animal {\n' +
        '  constructor(name) {\n' +
        '    this.name = name;\n' +
        '  }\n' +
        '  eat() { ... }\n' +
        '  sleep() { ... }\n' +
        '}\n' +
        '\n' +
        'class Dog extends Animal {   // gets name, age, eat(), sleep()\n' +
        '  bark() {\n' +
        '    return "Woof!";\n' +
        '  }\n' +
        '}',
      takeaway: "A child class inherits everything the parent already does, then adds only what is new. Write once, reuse often."
    });

    var canvas = refs.canvas;

    function childCard(kind) {
      var a = ANIMALS[kind];
      return (
        '<div class="tree-child">' +
          '<button class="class-card class-card--child accent-violet" type="button" data-animal="' + kind + '" aria-pressed="false">' +
            '<span class="class-card__tag">Child class</span>' +
            '<span class="class-card__name"><span class="animal-avatar">' + OOP.animalSvg(kind) + "</span>" + a.name + "</span>" +
            '<span class="prop-chips">' +
              PROPS.map(function (p) {
                return '<span class="prop-chip prop-chip--inherited" data-shared="' + p.key + '">' + esc(p.label) + "</span>";
              }).join("") +
              '<span class="prop-chip prop-chip--unique">' + esc(a.unique[0]) + "</span>" +
            "</span>" +
          "</button>" +
        "</div>"
      );
    }

    canvas.innerHTML =
      '<div class="inh-scene">' +
        '<div class="tree">' +
          '<div class="class-card class-card--parent" data-animal="animal">' +
            '<span class="class-card__tag">' + icon("layers", 11) + " Parent class</span>" +
            '<span class="class-card__name">' + icon("book", 17) + " Animal</span>" +
            '<span class="prop-chips">' +
              PROPS.map(function (p) {
                return '<span class="prop-chip" data-prop="' + p.key + '">' + esc(p.label) + "</span>";
              }).join("") +
            "</span>" +
          "</div>" +
          '<span class="tree-stem" aria-hidden="true"></span>' +
          '<div class="tree-branch">' +
            '<span class="tree-bus" aria-hidden="true"></span>' +
            CHILDREN.map(childCard).join("") +
          "</div>" +
        "</div>" +
        '<aside class="inspector" data-ref="inspector" aria-live="polite"></aside>' +
      "</div>";

    OOP.hydrateIcons(canvas);

    var scene = OOP.qs(".inh-scene", canvas);
    var inspector = OOP.qs('[data-ref="inspector"]', canvas);
    var parentCard = OOP.qs('.class-card--parent', canvas);
    var childCards = OOP.qsa(".class-card--child", canvas);

    var selected = "animal";
    var timers = [];

    function later(fn, ms) {
      timers.push(window.setTimeout(fn, ms));
    }

    function clearTimers() {
      timers.forEach(function (id) {
        window.clearTimeout(id);
      });
      timers = [];
    }

    function inspectorHtml(kind) {
      var a = ANIMALS[kind];
      var isParent = kind === "animal";
      var avatar = isParent ? icon("layers", 24) : OOP.animalSvg(kind);

      var inheritedGroup = "";
      if (!isParent) {
        inheritedGroup =
          '<div class="inherit-group">' +
            "<h4>" + icon("check", 12) + " Inherited from Animal</h4>" +
            '<div class="inherit-list">' +
              PROPS.map(function (p) {
                return '<span class="inherit-item is-inherited">' + icon("check", 10) + esc(p.label) + "</span>";
              }).join("") +
            "</div>" +
          "</div>";
      }

      return (
        '<div class="inspector__head">' +
          '<span class="animal-avatar">' + avatar + "</span>" +
          "<div>" +
            '<div class="inspector__name">' + esc(a.name) + "</div>" +
            '<div class="inspector__sub">' + (isParent ? "Parent class · the blueprint" : "Child class · extends Animal") + "</div>" +
          "</div>" +
        "</div>" +
        (isParent
          ? '<div class="inherit-group">' +
              "<h4>" + icon("layers", 12) + " Defined in Animal</h4>" +
              '<div class="inherit-list">' +
                PROPS.map(function (p) {
                  return '<span class="inherit-item">' + esc(p.label) + "</span>";
                }).join("") +
              "</div>" +
            "</div>" +
            '<p class="inherit-note">Every animal starts with these four members. The children below add one speciality each.</p>'
          : inheritedGroup +
            '<div class="inherit-group">' +
              "<h4>" + icon("sparkles", 12) + " Unique to " + esc(a.name) + "</h4>" +
              '<div class="inherit-list">' +
                a.unique.map(function (u) {
                  return '<span class="inherit-item is-unique">' + icon("check", 10) + esc(u) + "</span>";
                }).join("") +
              "</div>" +
            "</div>" +
            '<p class="inherit-note"><b>' + esc(a.name) + "</b> writes none of the four shared members again. It reuses them and adds <b>" +
              esc(a.unique[0]) + "</b>.</p>")
      );
    }

    function select(kind, focus) {
      selected = kind;
      parentCard.classList.toggle("is-selected", kind === "animal");
      childCards.forEach(function (card) {
        var isSelf = card.dataset.animal === kind;
        card.classList.toggle("is-selected", isSelf);
        card.setAttribute("aria-pressed", isSelf ? "true" : "false");
        card.classList.toggle("is-dim", !!focus && !isSelf);
      });
      inspector.innerHTML = inspectorHtml(kind);
      OOP.hydrateIcons(inspector);
    }

    function setPending(pending) {
      OOP.qsa("[data-shared]", canvas).forEach(function (chip) {
        chip.classList.toggle("is-pending", pending);
        if (!pending) chip.classList.remove("is-new");
      });
    }

    function removeFlyers() {
      OOP.qsa(".fly-chip", scene).forEach(function (el) {
        el.remove();
      });
      OOP.qsa(".is-new", canvas).forEach(function (el) {
        el.classList.remove("is-new");
      });
    }

    function flyChip(fromEl, toEl, delay) {
      var a = fromEl.getBoundingClientRect();
      var b = toEl.getBoundingClientRect();
      var base = scene.getBoundingClientRect();
      if (!a.width || !b.width) {
        // Layout unavailable (hidden tab, print, headless): inherit instantly.
        toEl.classList.remove("is-pending");
        return;
      }

      var clone = document.createElement("span");
      clone.className = "prop-chip prop-chip--inherited fly-chip";
      clone.textContent = fromEl.textContent;
      clone.style.position = "absolute";
      clone.style.left = a.left - base.left + "px";
      clone.style.top = a.top - base.top + "px";
      clone.style.zIndex = "30";
      clone.style.pointerEvents = "none";
      scene.appendChild(clone);

      var dx = b.left - a.left;
      var dy = b.top - a.top;

      OOP.motion.fromTo(
        clone,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.18, delay: delay, ease: "back.out(2)" }
      );
      OOP.motion.to(clone, {
        x: dx,
        y: dy,
        duration: 0.85,
        delay: delay + 0.12,
        ease: "power2.inOut",
        onComplete: function () {
          clone.remove();
          toEl.classList.remove("is-pending");
          toEl.classList.remove("is-new");
          void toEl.offsetWidth;
          toEl.classList.add("is-new");
        }
      });

      if (!OOP.motion.available()) {
        // No tween: reveal the destination immediately.
        toEl.classList.remove("is-pending");
      }
    }

    function transfer() {
      removeFlyers();
      setPending(true);

      var parentChips = {};
      OOP.qsa("[data-prop]", canvas).forEach(function (chip) {
        if (chip.closest(".class-card--parent")) parentChips[chip.dataset.prop] = chip;
      });

      CHILDREN.forEach(function (kind, childIndex) {
        var card = OOP.qs('.class-card--child[data-animal="' + kind + '"]', canvas);
        if (!card) return;

        PROPS.forEach(function (p, propIndex) {
          var from = parentChips[p.key];
          var to = OOP.qs('[data-shared="' + p.key + '"]', card);
          if (from && to) {
            flyChip(from, to, 0.1 + propIndex * 0.1 + childIndex * 0.24);
          }
        });
      });

      later(function () {
        setPending(false);
      }, 2200);
    }

    childCards.forEach(function (card) {
      card.addEventListener("click", function () {
        select(card.dataset.animal, false);
        OOP.toast(ANIMALS[card.dataset.animal].name + " selected", "git-branch");
      });
    });

    parentCard.addEventListener("click", function () {
      select("animal", false);
    });

    /* --------------------------------------------------------------- steps */
    var steps = [
      {
        label: "The blueprint",
        title: "Start with what is shared",
        body: "Animal holds four things every animal has: a name, an age, and the abilities to eat and sleep. " +
          "It is a blueprint, not a specific pet yet.",
        hints: ["name and age are data.", "eat() and sleep() are behaviours."],
        apply: function () {
          clearTimers();
          removeFlyers();
          setPending(true);
          select("animal", false);
        }
      },
      {
        label: "Properties travel",
        title: "The children receive it all",
        body: "Watch the four members move from Animal into each child. Dog, Cat and Cow did not retype them — " +
          "they inherited them. Each child then adds one unique ability.",
        hints: ["Purple chips are inherited.", "Green chips are unique to that child."],
        apply: function () {
          clearTimers();
          select("animal", false);
          transfer();
        }
      },
      {
        label: "Dog",
        title: "Dog adds bark()",
        body: "Dog gets name, age, eat() and sleep() from Animal, then adds bark(). A dog is still an animal — " +
          "that is why an Animal variable can hold a Dog.",
        hints: ["Four inherited members, one new one.", "Click the other animals to compare."],
        apply: function () {
          clearTimers();
          removeFlyers();
          setPending(false);
          select("dog", true);
        }
      },
      {
        label: "Cat",
        title: "Cat adds meow()",
        body: "Cat inherits exactly the same four members, then adds meow(). Same parent, same inheritance, different speciality.",
        hints: ["Shared members are identical across children.", "Only the added method changes."],
        apply: function () {
          clearTimers();
          removeFlyers();
          setPending(false);
          select("cat", true);
        }
      },
      {
        label: "Cow",
        title: "Cow adds moo()",
        body: "Cow follows the same pattern: reuse the parent, add moo(). No child rewrites what the parent already solved.",
        hints: ["Three children, one blueprint.", "Inheritance removes duplication."],
        apply: function () {
          clearTimers();
          removeFlyers();
          setPending(false);
          select("cow", true);
        }
      },
      {
        label: "Why it matters",
        title: "Change once, benefit everywhere",
        body: "If Animal gains a new method, all three children receive it automatically. That is the real value: " +
          "one place to fix, many places improved. Click any animal to explore its inherited and unique members.",
        hints: ["extends means “is a kind of”.", "A Dog is an Animal; a Cat is an Animal.", "Children can add, not just copy."],
        apply: function () {
          clearTimers();
          removeFlyers();
          setPending(false);
          select("animal", false);
        }
      }
    ];

    var stepper = OOP.createStepper({
      steps: steps,
      refs: refs,
      viewId: "inheritance",
      delay: 6200,
      onReset: function () {
        clearTimers();
        removeFlyers();
        setPending(true);
        select("animal", false);
      }
    });

    return function cleanup() {
      if (stepper) stepper.destroy();
      clearTimers();
      OOP.motion.kill(canvas.querySelectorAll("*"));
    };
  }

  OOP.views = OOP.views || {};
  OOP.views.inheritance = {
    id: "inheritance",
    title: "Inheritance",
    render: render
  };
})(window, document);
