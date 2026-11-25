/* ==========================================================================
   OOP Lab — Encapsulation (ATM)
   The balance is private. Deposit and withdraw are the only doors in.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var OOP = window.OOP;
  var icon = OOP.icon;
  var esc = OOP.esc;
  var fmtMoney = OOP.fmtMoney;

  var START_BALANCE = 1200;

  function keypad() {
    var keys = "";
    for (var i = 0; i < 11; i++) keys += '<span class="key"></span>';
    keys += '<span class="key key--accent"></span>';
    return keys;
  }

  function render(root) {
    var refs = OOP.conceptPage(root, {
      accent: "cyan",
      eyebrow: "Pillar 01 · Encapsulation",
      title: "Encapsulation",
      lede: "An ATM holds your money and your balance. You can deposit and withdraw, but you can never reach inside and rewrite the number. " +
        "That single rule — protected data, controlled access — is encapsulation.",
      metaSteps: "6 guided steps",
      metaTime: "About 3 minutes",
      metaHint: "Try the deposit and withdraw buttons",
      code:
        'class Account {\n' +
        '  #balance = 1200;          // private data\n' +
        '\n' +
        '  deposit(amount) {         // public method\n' +
        '    this.#balance += amount;\n' +
        '    return this.#balance;\n' +
        '  }\n' +
        '\n' +
        '  withdraw(amount) {\n' +
        '    if (amount > this.#balance) {\n' +
        '      return "Not enough money";\n' +
        '    }\n' +
        '    this.#balance -= amount;\n' +
        '    return this.#balance;\n' +
        '  }\n' +
        '}',
      takeaway: "Keep the data protected, and let methods be the only way in. Encapsulation means data plus the rules that guard it."
    });

    var canvas = refs.canvas;

    canvas.innerHTML =
      '<div class="atm-scene">' +
        '<div class="atm-bay">' +
          '<div class="atm" data-ref="atm">' +
            '<div class="atm__top">' +
              '<span class="atm__brand">' + icon("banknote", 12) + " NOVA BANK</span>" +
              '<span class="atm__lamp" aria-hidden="true"></span>' +
            "</div>" +
            '<div class="atm__screen">' +
              '<div class="atm-screen__row">' +
                '<span class="atm-screen__label">Private balance</span>' +
                '<span class="lock-badge">' + icon("lock", 10) + " private</span>" +
              "</div>" +
              '<div class="atm-balance" data-ref="balance" data-value="1200">$1,200</div>' +
              '<p class="atm-screen__msg" data-ref="msg" role="status" aria-live="polite">Ready. Choose an action.</p>' +
            "</div>" +
            '<div class="atm__slots">' +
              '<div class="slot slot--cash" data-ref="cashSlot"><span>Cash</span></div>' +
              '<div class="slot slot--card"><span>Card</span></div>' +
            "</div>" +
            '<div class="atm__keypad" aria-hidden="true">' + keypad() + "</div>" +
          "</div>" +
        "</div>" +

        '<div class="atm-side">' +
          '<div class="guard-card">' +
            "<h3>What is allowed?</h3>" +
            '<div class="access-row access-row--private"><span>balance</span><span class="tag tag--no">private</span></div>' +
            '<div class="access-row access-row--public"><span>deposit()</span><span class="tag tag--yes">public</span></div>' +
            '<div class="access-row access-row--public"><span>withdraw()</span><span class="tag tag--yes">public</span></div>' +
            '<button class="hack-btn" data-ref="hackBtn" type="button">atm.balance = 999999</button>' +
            '<p class="micro" data-ref="hackMsg">Try it. The number will not move.</p>' +
          "</div>" +

          '<div class="amount-card">' +
            '<label for="amountInput">Amount <span class="muted" style="font-weight:500">$100 – $5,000</span></label>' +
            '<div class="amount-row">' +
              "<span>$</span>" +
              '<input id="amountInput" data-ref="amountInput" type="number" min="100" max="5000" step="100" value="500" inputmode="numeric" aria-label="Amount in dollars" />' +
            "</div>" +
            '<div class="amount-chips">' +
              '<button class="amount-chip" type="button" data-amount="200">$200</button>' +
              '<button class="amount-chip" type="button" data-amount="500">$500</button>' +
              '<button class="amount-chip" type="button" data-amount="1000">$1,000</button>' +
            "</div>" +
            '<div class="btn-row">' +
              '<button class="btn btn--soft btn-sheen" data-ref="depositBtn" type="button">' + icon("banknote", 15) + " Deposit</button>" +
              '<button class="btn btn--withdraw" data-ref="withdrawBtn" type="button">' + icon("wallet", 15) + " Withdraw</button>" +
            "</div>" +
          "</div>" +

          '<p class="atm-shield-hint">' + icon("shield-check", 15) + " Only public methods can touch the balance.</p>" +
        "</div>" +
      "</div>";

    OOP.hydrateIcons(canvas);

    /* --------------------------------------------------------------- refs */
    var scene = OOP.qs(".atm-scene", canvas);
    var atm = OOP.qs('[data-ref="atm"]', canvas);
    var balanceEl = OOP.qs('[data-ref="balance"]', canvas);
    var msgEl = OOP.qs('[data-ref="msg"]', canvas);
    var cashSlot = OOP.qs('[data-ref="cashSlot"]', canvas);
    var hackBtn = OOP.qs('[data-ref="hackBtn"]', canvas);
    var hackMsg = OOP.qs('[data-ref="hackMsg"]', canvas);
    var amountInput = OOP.qs('[data-ref="amountInput"]', canvas);
    var depositBtn = OOP.qs('[data-ref="depositBtn"]', canvas);
    var withdrawBtn = OOP.qs('[data-ref="withdrawBtn"]', canvas);

    var balance = START_BALANCE;
    var busy = false;
    var timers = [];
    var balanceToken = 0;

    function later(fn, ms) {
      var id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    }

    function clearTimers() {
      timers.forEach(function (id) {
        window.clearTimeout(id);
      });
      timers = [];
    }

    function msg(text, state) {
      msgEl.textContent = text;
      atm.classList.toggle("is-active", state === "ok");
      atm.classList.toggle("is-blocked", state === "bad");
    }

    function paintBalance(animate, from) {
      var token = ++balanceToken;
      balanceEl.dataset.value = String(balance);
      var fromValue = from == null ? balance : from;

      if (!animate || OOP.motion.reduced) {
        balanceEl.textContent = fmtMoney(balance);
        return;
      }

      var duration = 850;
      var startAt = null;
      function tick(now) {
        if (token !== balanceToken) return;
        if (startAt == null) startAt = now;
        var p = Math.min(1, (now - startAt) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        balanceEl.textContent = fmtMoney(fromValue + (balance - fromValue) * eased);
        if (p < 1) window.requestAnimationFrame(tick);
        else balanceEl.textContent = fmtMoney(balance);
      }
      window.requestAnimationFrame(tick);
    }

    function clearTransient() {
      clearTimers();
      busy = false;
      OOP.qsa(".fly-note, .block-chip", scene).forEach(function (el) {
        el.remove();
      });
      atm.classList.remove("anim-shake", "anim-flash-bad", "anim-flash-good");
      cashSlot.classList.remove("is-hit");
    }

    function flashSlot(el) {
      el.classList.add("is-hit");
      later(function () {
        el.classList.remove("is-hit");
      }, 650);
    }

    function blockChip(text) {
      var chip = document.createElement("div");
      chip.className = "block-chip";
      chip.textContent = text;
      scene.appendChild(chip);
      OOP.motion.from(chip, { opacity: 0, y: -8, scale: 0.9, duration: 0.28, ease: "back.out(2)" });
      later(function () {
        OOP.motion.to(chip, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          onComplete: function () {
            chip.remove();
          }
        });
      }, 1500);
    }

    function shakeAtm() {
      atm.classList.remove("anim-shake", "anim-flash-bad");
      // reflow so the animation can be replayed immediately
      void atm.offsetWidth;
      atm.classList.add("anim-shake", "anim-flash-bad");
      later(function () {
        atm.classList.remove("anim-shake", "anim-flash-bad");
      }, 900);
    }

    function flyNote(fromEl, toEl, out, delay) {
      var src = fromEl.getBoundingClientRect();
      var dst = toEl.getBoundingClientRect();
      var base = scene.getBoundingClientRect();
      if (!src.width || !dst.width) return;

      var note = document.createElement("div");
      note.className = "fly-note" + (out ? " is-out" : "");
      note.style.left = src.left - base.left + src.width / 2 - 17 + "px";
      note.style.top = src.top - base.top + src.height / 2 - 10 + "px";
      note.style.opacity = "0";
      scene.appendChild(note);

      var dx = dst.left + dst.width / 2 - (src.left + src.width / 2);
      var dy = dst.top + dst.height / 2 - (src.top + src.height / 2);

      OOP.motion.fromTo(
        note,
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.22,
          delay: delay || 0,
          ease: "back.out(2)"
        }
      );
      OOP.motion.to(note, {
        x: dx,
        y: dy,
        scale: out ? 0.82 : 0.9,
        opacity: 0.15,
        duration: 0.95,
        delay: (delay || 0) + 0.2,
        ease: "power2.inOut",
        onComplete: function () {
          note.remove();
        }
      });
    }

    function flashGood() {
      atm.classList.remove("anim-flash-good");
      void atm.offsetWidth;
      atm.classList.add("anim-flash-good");
      later(function () {
        atm.classList.remove("anim-flash-good");
      }, 1000);
    }

    /* ------------------------------------------------------------ actions */
    function deposit(amount, options) {
      options = options || {};
      amount = Math.round(Number(amount));

      if (!isFinite(amount) || amount < 100) {
        msg("Enter an amount between $100 and $5,000.", "bad");
        return false;
      }
      if (amount > 5000) {
        msg("This machine accepts up to $5,000 per action.", "bad");
        return false;
      }
      if (busy) return false;

      busy = true;
      var previous = balance;
      balance += amount;

      msg("deposit(" + fmtMoney(amount) + ") called → method updates the private balance.", "ok");

      for (var i = 0; i < 3; i++) {
        flyNote(depositBtn, cashSlot, false, i * 0.1);
      }
      later(function () {
        flashSlot(cashSlot);
      }, 250);
      paintBalance(true, previous);
      flashGood();

      later(function () {
        msg("Deposit accepted. The method changed the data — nothing else could.", "ok");
        busy = false;
      }, 1250);

      if (options.demo) {
        later(function () {
          msg("Balance is now " + fmtMoney(balance) + ". Still private, still guarded.", "ok");
        }, 2400);
      }
      return true;
    }

    function withdraw(amount, options) {
      options = options || {};
      amount = Math.round(Number(amount));

      if (!isFinite(amount) || amount < 100) {
        msg("Enter an amount between $100 and $5,000.", "bad");
        return false;
      }
      if (busy) return false;

      if (amount > balance) {
        busy = true;
        msg("withdraw(" + fmtMoney(amount) + ") refused: the balance is only " + fmtMoney(balance) + ".", "bad");
        blockChip("Insufficient balance · request refused");
        shakeAtm();
        later(function () {
          msg("Nothing changed. The method checked first, then said no.", "bad");
          busy = false;
        }, 2200);
        return false;
      }

      busy = true;
      var previous = balance;
      balance -= amount;

      msg("withdraw(" + fmtMoney(amount) + ") called → the method checks, then releases cash.", "ok");

      for (var i = 0; i < 3; i++) {
        flyNote(cashSlot, withdrawBtn, true, i * 0.1);
      }
      later(function () {
        flashSlot(cashSlot);
      }, 250);
      paintBalance(true, previous);
      flashGood();

      later(function () {
        msg("Cash released. The same method lowered the private balance.", "ok");
        busy = false;
      }, 1250);

      if (options.demo) {
        later(function () {
          msg("Balance is now " + fmtMoney(balance) + ". Try withdrawing more than that.", "ok");
        }, 2400);
      }
      return true;
    }

    function directAccessAttempt() {
      clearTransient();
      msg("Attempting to write atm.balance directly…", "bad");
      blockChip("Access denied · balance is private");
      shakeAtm();
      hackMsg.textContent = "Blocked. balance is private — no method, no access.";
      hackMsg.classList.add("is-bad");

      later(function () {
        msg("Access denied. The field is private; only methods may change it.", "bad");
      }, 700);
      later(function () {
        hackMsg.textContent = "Try it. The number will not move.";
        hackMsg.classList.remove("is-bad");
      }, 2800);
    }

    /* --------------------------------------------------------- interactions */
    function readAmount() {
      var value = Number(amountInput.value);
      if (!isFinite(value) || value <= 0) {
        msg("Type an amount between $100 and $5,000.", "bad");
        amountInput.focus();
        return null;
      }
      return value;
    }

    depositBtn.addEventListener("click", function () {
      var value = readAmount();
      if (value != null) deposit(value);
    });

    withdrawBtn.addEventListener("click", function () {
      var value = readAmount();
      if (value != null) withdraw(value);
    });

    hackBtn.addEventListener("click", directAccessAttempt);

    OOP.qsa(".amount-chip", canvas).forEach(function (chip) {
      chip.addEventListener("click", function () {
        amountInput.value = chip.dataset.amount;
        amountInput.focus();
      });
    });

    amountInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        var value = readAmount();
        if (value != null) deposit(value);
      }
    });

    /* --------------------------------------------------------------- steps */
    var steps = [
      {
        label: "The machine",
        title: "A balance you cannot see",
        body: "The ATM knows your balance, but there is no button labelled “show the raw data”. The number lives inside the machine and is marked private. " +
          "The screen can read it, because the machine reads it from the inside.",
        hints: ["The screen is a view, not the storage.", "You can only ask the machine to act."],
        apply: function () {
          clearTransient();
          balance = START_BALANCE;
          paintBalance(false);
          msg("Ready. The balance is stored inside the machine.", "ok");
        }
      },
      {
        label: "Direct access",
        title: "Why you cannot reach in",
        body: "Imagine typing atm.balance = 999999 from outside. An encapsulated design refuses that line. " +
          "The balance belongs to the machine, and the outside world gets no direct handle on it.",
        hints: ["Private data cannot be written from outside.", "The lock is the point, not an obstacle."],
        apply: function () {
          directAccessAttempt();
        }
      },
      {
        label: "Deposit",
        title: "A method with permission",
        body: "You call deposit(500). That public method checks the amount, changes the private balance, and reports back. " +
          "The data changed — but only through code the machine owns.",
        hints: ["Watch the notes travel into the cash slot.", "The method, not the visitor, writes the number."],
        apply: function () {
          clearTransient();
          balance = START_BALANCE;
          paintBalance(false);
          msg("Calling deposit(500)…", "ok");
          later(function () {
            deposit(500, { demo: true });
          }, 320);
        }
      },
      {
        label: "Withdraw",
        title: "The same rule applies outward",
        body: "withdraw(300) asks the machine for money. The method checks the balance first, then releases the cash and lowers the stored number. " +
          "Nothing is exposed; everything is requested.",
        hints: ["Money leaves, the private balance changes.", "The method is still the only door."],
        apply: function () {
          clearTransient();
          balance = START_BALANCE + 500;
          paintBalance(false);
          msg("Calling withdraw(300)…", "ok");
          later(function () {
            withdraw(300, { demo: true });
          }, 320);
        }
      },
      {
        label: "The guard",
        title: "Methods can say no",
        body: "Now the account holds $1,400 and someone asks for $5,000. The method refuses before anything changes. " +
          "That refusal is not a bug — it is the protection doing its job.",
        hints: ["The check lives inside withdraw().", "A failed request leaves the data untouched."],
        apply: function () {
          clearTransient();
          balance = START_BALANCE + 500 - 300;
          paintBalance(false);
          msg("Calling withdraw(5000)…", "ok");
          later(function () {
            withdraw(5000, { demo: true });
          }, 320);
        }
      },
      {
        label: "Summary",
        title: "One small door, carefully guarded",
        body: "Encapsulation keeps data and the code that uses it in one place. Outside code gets a few public methods, never the private number itself. " +
          "Try your own deposit or withdrawal — the balance only moves through the machine.",
        hints: ["Private: balance", "Public: deposit(), withdraw()", "The guard is the design."],
        apply: function () {
          clearTransient();
          balance = START_BALANCE + 500 - 300;
          paintBalance(false);
          msg("Protected data, controlled access. Try the buttons yourself.", "ok");
          atm.classList.add("is-active");
        }
      }
    ];

    var stepper = OOP.createStepper({
      steps: steps,
      refs: refs,
      viewId: "encapsulation",
      delay: 6200,
      onReset: function () {
        clearTransient();
        balance = START_BALANCE;
        paintBalance(false);
        hackMsg.textContent = "Try it. The number will not move.";
        hackMsg.classList.remove("is-bad");
        msg("Ready. Choose an action.", null);
      }
    });

    return function cleanup() {
      if (stepper) stepper.destroy();
      clearTimers();
      OOP.motion.kill(canvas.querySelectorAll("*"));
    };
  }

  OOP.views = OOP.views || {};
  OOP.views.encapsulation = {
    id: "encapsulation",
    title: "Encapsulation",
    render: render
  };
})(window, document);
