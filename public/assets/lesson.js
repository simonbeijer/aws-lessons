// Delat script för alla lektioner: quiz, klickbara val (picker) och kopiera-knappar.
//
// Quiz:
//   <div class="quiz-q">
//     <p class="q">Fråga</p>
//     <div class="options">
//       <button class="opt" data-why="Varför fel.">Svar</button>
//       <button class="opt" data-correct data-why="Varför rätt.">Svar</button>
//     </div>
//     <p class="feedback" aria-live="polite"></p>
//   </div>
//
// Picker (klicka på en knapp, se en panel):
//   <div class="picker">
//     <div class="picker-buttons"><button class="chip" data-target="p1">Val</button></div>
//     <div class="picker-panel" id="p1">...</div>
//   </div>
//
// Kopiera: alla <pre> får en knapp. Inline: <code class="copyable">text</code>.

(function () {
  function setupQuiz() {
    document.querySelectorAll(".quiz-q").forEach(function (q) {
      var opts = q.querySelectorAll(".opt");
      var fb = q.querySelector(".feedback");
      opts.forEach(function (opt) {
        opt.type = "button";
        opt.addEventListener("click", function () {
          opts.forEach(function (o) { o.classList.remove("right", "wrong"); });
          var ok = opt.hasAttribute("data-correct");
          opt.classList.add(ok ? "right" : "wrong");
          if (fb) {
            fb.className = "feedback " + (ok ? "right" : "wrong");
            fb.innerHTML = "";
            var s = document.createElement("strong");
            s.textContent = ok ? "Rätt. " : "Fel. ";
            fb.appendChild(s);
            fb.appendChild(document.createTextNode(opt.getAttribute("data-why") || ""));
          }
        });
      });
    });
  }

  function setupPickers() {
    document.querySelectorAll(".picker").forEach(function (p) {
      var chips = p.querySelectorAll(".chip[data-target]");
      chips.forEach(function (chip) {
        chip.type = "button";
        chip.setAttribute("aria-pressed", "false");
        chip.addEventListener("click", function () {
          chips.forEach(function (c) {
            c.setAttribute("aria-pressed", "false");
            var panel = document.getElementById(c.getAttribute("data-target"));
            if (panel) panel.classList.remove("active");
          });
          chip.setAttribute("aria-pressed", "true");
          var target = document.getElementById(chip.getAttribute("data-target"));
          if (target) target.classList.add("active");
        });
      });
    });
  }

  function copyText(text, btn) {
    function done() {
      var old = btn.textContent;
      btn.textContent = "Kopierat";
      setTimeout(function () { btn.textContent = old; }, 1500);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    } else {
      fallback(text);
      done();
    }
  }

  function fallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* inget att göra */ }
    document.body.removeChild(ta);
  }

  function makeBtn(getText) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Kopiera";
    btn.addEventListener("click", function () { copyText(getText(), btn); });
    return btn;
  }

  function setupCopy() {
    document.querySelectorAll("pre").forEach(function (pre) {
      var wrap = document.createElement("div");
      wrap.className = "copy-wrap";
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.appendChild(makeBtn(function () { return pre.innerText.replace(/\n$/, ""); }));
    });
    document.querySelectorAll(".copyable").forEach(function (el) {
      el.insertAdjacentElement("afterend", makeBtn(function () { return el.innerText; }));
    });
  }

  // Klick på "Nästa: ..." markerar den här lektionen som klar på startsidan.
  // Samma nyckel och format som index.html.
  function setupDoneOnNext() {
    var KEY = "aws-lektioner-klara";
    var file = "lessons/" + location.pathname.split("/").pop();
    document.querySelectorAll("a").forEach(function (a) {
      if (!/^\s*Nästa:/.test(a.textContent)) return;
      a.addEventListener("click", function () {
        try {
          var state = JSON.parse(localStorage.getItem(KEY)) || {};
          state.lessons = state.lessons || {};
          state.lessons[file] = true;
          localStorage.setItem(KEY, JSON.stringify(state));
        } catch (e) {}
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupQuiz();
    setupPickers();
    setupCopy();
    setupDoneOnNext();
  });
})();
