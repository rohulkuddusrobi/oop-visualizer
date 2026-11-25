/* ==========================================================================
   OOP Lab — Abstraction (car dashboard)
   The driver gets a key and a gauge. The engine bay holds five hidden steps.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP;
  var icon = OOP.icon;

  var PIPELINE = [
    { icon: "fuel", label: "Fuel pump", copy: "Fuel pump: sends petrol from the tank to the engine." },
    { icon: "key", label: "Ignition", copy: "Ignition: the spark timing circuit wakes up." },
    { icon: "zap", label: "Spark plugs", copy: "Spark plugs: ignite the fuel and air mixture." },
    { icon: "cog", label: "Engine cycle", copy: "Engine cycle: pistons turn, the crankshaft spins." },
    { icon: "wind", label: "Wheels turn", copy: "Wheels: the gearbox passes the turning force to the road." }
  ];

  function render(root) {
    var refs = OOP.conceptPage(root, {
      accent: "emerald",
      eyebrow: "Pillar 04 · Abstraction",
      title: "Abstraction",
      lede: "A driver gets a dashboard, a pedal and a start button. Fuel lines, ignition timing and piston cycles stay out of sight. " +
        "Abstraction is choosing what to show and what to hide.",
      metaSteps: "6 guided steps",
      metaTime: "About 3 minutes",
      metaHint: "Press the start button, open the hood",
      code:
        'class Car {\n' +
        '  start() {              // the simple public control\n' +
        '    this.#pumpFuel();\n' +
        '    this.#ignite();\n' +
        '    this.#spinEngine();\n' +
        '    return "Engine running";\n' +
        '  }\n' +
        '\n' +
        '  #pumpFuel() { ... }    // hidden details\n' +
        '  #ignite() { ... }\n' +
        '  #spinEngine() { ... }\n' +
        '}\n' +
        '\n' +
        'const car = new Car();\n' +
        'car.start();             // that is all you call',
      takeaway: "Expose the essential control, hide the complicated machinery. Abstraction lets people use a system without knowing every part."
    });

    var canvas = refs.canvas;

    canvas.innerHTML =
      '<div class="car-scene" data-ref="scene">' +
        '<div class="dash">' +
          '<div class="dash__cluster">' +
            '<div class="speedo">' +
              '<svg viewBox="0 0 160 160" role="img" aria-label="Speedometer">' +
                "<defs>" +
                  '<linearGradient id="speedGrad" x1="0" y1="1" x2="1" y2="0">' +
                    '<stop offset="0" stop-color="#22d3ee"/>' +
                    '<stop offset=".6" stop-color="#34d399"/>' +
                    '<stop offset="1" stop-color="#fbbf24"/>' +
                  "</linearGradient>" +
                "</defs>" +
                '<path d="M26 126a54 54 0 1 1 108 0" fill="none" stroke="#1e293b" stroke-width="9" stroke-linecap="round"/>' +
                '<path d="M26 126a54 54 0 0 1 27-46.8" fill="none" stroke="url(#speedGrad)" stroke-width="9" stroke-linecap="round" opacity=".85"/>' +
                '<path d="M80 26v7M132 62l-6 3.5M28 62l6 3.5M80 134h-7" stroke="#475569" stroke-width="2" stroke-linecap="round"/>' +
                '<g class="speedo__needle"><line x1="80" y1="80" x2="80" y2="42" stroke="#f87171" stroke-width="3" stroke-linecap="round"/><circle cx="80" cy="80" r="5" fill="#f87171"/></g>' +
              "</svg>" +
              '<div class="speedo__readout"><b data-ref="speedValue" data-value="0">0</b><span>km/h</span></div>' +
            "</div>" +
            '<div class="dash__info">' +
              '<div class="dash__title">CITY HATCHBACK<small>driver view</small></div>' +
              '<div class="gauges">' +
                '<div class="mini-gauge">' + icon("fuel", 12) + "<b>62%</b></div>" +
                '<div class="mini-gauge">' + icon("cog", 12) + 'Gear <b data-ref="gear">P</b></div>' +
              "</div>" +
              '<div class="lights" aria-label="Dashboard lights">' +
                '<span class="light light--battery" title="Battery">' + icon("zap", 12) + "</span>" +
                '<span class="light light--oil" title="Oil pressure">' + icon("flame", 12) + "</span>" +
              "</div>" +
            "</div>" +
          "</div>" +
          '<div class="dash__controls">' +
            '<div class="start-wrap">' +
              '<button class="start-btn" data-ref="startBtn" type="button" aria-pressed="false" aria-label="Start or stop the engine">' +
                '<span class="ico">' + icon("key", 22) + "</span><b>ENGINE</b>" +
              "</button>" +
            "</div>" +
            '<p class="start-caption" data-ref="startCaption">Press to start</p>' +
          "</div>" +
        "</div>" +

        '<div class="road-strip" aria-hidden="true">' +
          '<div class="road-dashes"></div>' +
          '<span class="road-label" data-ref="roadLabel">Parked</span>' +
        "</div>" +

        '<div class="engine-drawer" data-ref="drawer">' +
          '<button class="engine-drawer__head" data-ref="drawerBtn" type="button" aria-expanded="false" aria-controls="engineBody">' +
            icon("cog", 16) +
            '<span class="ed-text"><b>Hidden internals</b><small>The driver never touches these</small></span>' +
            '<span class="engine-drawer__toggle"><span data-ref="drawerLabel">Show</span>' +
              '<span class="ico" data-ref="drawerChev">' + icon("chevron-down", 14) + "</span></span>" +
          "</button>" +
          '<div class="engine-body" id="engineBody">' +
            '<div class="engine-body__inner">' +
              '<div class="engine-grid">' +
                "<div>" +
                  '<ol class="pipeline">' +
                    PIPELINE.map(function (p) {
                      return '<li class="pipe-step" data-proc="' + p.label + '"><span class="ico">' +
                        icon(p.icon, 12) + "</span>" + p.label + "</li>";
                    }).join("") +
                  "</ol>" +
                  '<p class="engine-caption" data-ref="engineCaption">Engine off. No hidden process is running.</p>' +
                "</div>" +
                '<div class="pistons" aria-hidden="true">' +
                  "<span class=\"piston\"></span><span class=\"piston\"></span><span class=\"piston\"></span><span class=\"piston\"></span>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>";

    OOP.hydrateIcons(canvas);

    var scene = OOP.qs('[data-ref="scene"]', canvas);
    var startBtn = OOP.qs('[data-ref="startBtn"]', canvas);
    var startCaption = OOP.qs('[data-ref="startCaption"]', canvas);
    var speedValue = OOP.qs('[data-ref="speedValue"]', canvas);
    var gear = OOP.qs('[data-ref="gear"]', canvas);
    var roadLabel = OOP.qs('[data-ref="roadLabel"]', canvas);
    var needle = OOP.qs(".speedo__needle", canvas);
    var drawer = OOP.qs('[data-ref="drawer"]', canvas);
    var drawerBtn = OOP.qs('[data-ref="drawerBtn"]', canvas);
    var drawerLabel = OOP.qs('[data-ref="drawerLabel"]', canvas);
    var engineCaption = OOP.qs('[data-ref="engineCaption"]', canvas);
    var pipeSteps = OOP.qsa(".pipe-step", canvas);

    var running = false;
    var procTimers = [];
    var seqToken = 0;

    function clearProcTimers() {
      procTimers.forEach(function (id) {
        window.clearTimeout(id);
      });
      procTimers = [];
    }

    function resetPipeline() {
      seqToken++;
      clearProcTimers();
      pipeSteps.forEach(function (el) {
        el.classList.remove("is-active", "is-done");
      });
    }

    function runSequence() {
      seqToken++;
      var token = seqToken;
      clearProcTimers();
      pipeSteps.forEach(function (el) {
        el.classList.remove("is-active", "is-done");
      });

      PIPELINE.forEach(function (item, i) {
        procTimers.push(
          window.setTimeout(function () {
            if (token !== seqToken) return;
            pipeSteps.forEach(function (el, j) {
              el.classList.toggle("is-active", j === i);
              el.classList.toggle("is-done", j < i);
            });
            engineCaption.textContent = item.copy;

            if (i === PIPELINE.length - 1) {
              procTimers.push(
                window.setTimeout(function () {
                  if (token !== seqToken) return;
                  pipeSteps.forEach(function (el) {
                    el.classList.remove("is-active");
                    el.classList.add("is-done");
                  });
                  engineCaption.textContent = "All five processes are running. The driver only pressed one button.";
                }, 850)
              );
            }
          }, 220 + i * 660)
        );
      });
    }

    function setDrawer(open) {
      drawer.classList.toggle("is-open", open);
      drawerBtn.setAttribute("aria-expanded", open ? "true" : "false");
      drawerLabel.textContent = open ? "Hide" : "Show";
    }

    function setRunning(on, options) {
      options = options || {};
      if (running === on && !options.force) return;
      running = on;

      scene.classList.toggle("is-running", on);
      startBtn.setAttribute("aria-pressed", on ? "true" : "false");
      startCaption.textContent = on ? "Running · press to stop" : "Press to start";
      gear.textContent = on ? "D" : "P";
      roadLabel.textContent = on ? "Driving" : "Parked";
      roadLabel.classList.toggle("is-on", on);
      if (needle) needle.style.transform = on ? "rotate(-46deg)" : "rotate(-120deg)";

      OOP.countUp(speedValue, on ? 48 : 0, {
        duration: 900,
        format: function (v) {
          return String(Math.round(v));
        }
      });

      if (on) {
        runSequence();
      } else {
        resetPipeline();
        engineCaption.textContent = "Engine off. No hidden process is running.";
      }
    }

    startBtn.addEventListener("click", function () {
      setRunning(!running, { force: true });
    });

    drawerBtn.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("is-open"));
    });

    /* --------------------------------------------------------------- steps */
    var steps = [
      {
        label: "Driver's view",
        title: "Only the controls you need",
        body: "This is the whole interface: a speedometer, a fuel gauge and one start button. The driver does not see fuel lines, " +
          "spark timing or piston positions — and does not need to.",
        hints: ["Simple controls on the surface.", "Everything else is an implementation detail."],
        apply: function () {
          setDrawer(false);
          setRunning(false, { force: true });
        }
      },
      {
        label: "One button",
        title: "Press start, and the car handles it",
        body: "You press one button. Under the dashboard, the car begins a sequence you never manage: fuel, ignition, sparks, " +
          "engine cycle, wheels. The interface stayed simple.",
        hints: ["One public action.", "The details begin behind it."],
        apply: function () {
          setDrawer(false);
          setRunning(true, { force: true });
        }
      },
      {
        label: "Behind the panel",
        title: "The machinery is still there",
        body: "Open the hood and the complexity appears. Abstraction did not delete it — it selected what belongs on the surface " +
          "and what belongs underneath.",
        hints: ["Hidden does not mean absent.", "The dashboard is a deliberate boundary."],
        apply: function () {
          setDrawer(true);
          setRunning(true, { force: true });
        }
      },
      {
        label: "The hidden chain",
        title: "Five steps, one button press",
        body: "Watch the chain: the fuel pump feeds the engine, ignition wakes the spark, the pistons turn, the wheels move. " +
          "Each step is necessary, and none of it needs to be a button on the dashboard.",
        hints: ["The order matters.", "The driver sees only the result."],
        apply: function () {
          setDrawer(true);
          setRunning(true, { force: true });
        }
      },
      {
        label: "Back to the driver",
        title: "Why hiding it is a feature",
        body: "Close the hood and the car is usable again. A driver who had to monitor every internal step could not drive. " +
          "Abstraction buys simplicity at the point of use.",
        hints: ["Hide complexity, keep control.", "A good interface reduces decisions."],
        apply: function () {
          setDrawer(false);
          setRunning(true, { force: false });
        }
      },
      {
        label: "Summary",
        title: "Simple outside, sophisticated inside",
        body: "Abstraction exposes essential functionality and hides the rest. You can start the engine yourself — or open the hood " +
          "and watch what the button actually began.",
        hints: ["Public: start()", "Private: pumpFuel(), ignite(), spinEngine()", "The boundary is the design."],
        apply: function () {
          setDrawer(false);
          setRunning(true, { force: false });
        }
      }
    ];

    var stepper = OOP.createStepper({
      steps: steps,
      refs: refs,
      viewId: "abstraction",
      delay: 6200,
      onReset: function () {
        setDrawer(false);
        setRunning(false, { force: true });
        resetPipeline();
        engineCaption.textContent = "Engine off. No hidden process is running.";
      }
    });

    return function cleanup() {
      if (stepper) stepper.destroy();
      clearProcTimers();
      OOP.motion.kill(canvas.querySelectorAll("*"));
    };
  }

  OOP.views = OOP.views || {};
  OOP.views.abstraction = {
    id: "abstraction",
    title: "Abstraction",
    render: render
  };
})(window, document);
