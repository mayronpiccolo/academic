/* Shared behavior: mobile nav, reveal-on-scroll, home hero wave. */
(function () {
  "use strict";

  var REDUCED =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(window.location.search).has("static");
  window.__REDUCED_MOTION__ = REDUCED;

  /* ---------------- mobile nav ---------------- */
  (function mobileNav() {
    var header = document.querySelector(".site-nav");
    var toggle = document.querySelector(".nav-toggle");
    if (!header || !toggle) return;
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  })();

  /* ---------------- sticky-nav height var ---------------- */
  (function navOffset() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;
    var set = function () {
      document.documentElement.style.setProperty("--navh", nav.offsetHeight + "px");
    };
    set();
    window.addEventListener("resize", set);
    window.addEventListener("load", set);
  })();

  /* ---------------- reveal on scroll ---------------- */
  (function reveals() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (REDUCED || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- home hero wave ---------------- */
  (function heroWave() {
    var p1 = document.getElementById("wavepath");
    var p2 = document.getElementById("wavepath2");
    if (!p1 || !p2) return;
    var svg = p1.closest("svg");
    var t = 0, visible = false, raf = null;
    function draw() {
      var d1 = "M0 75", d2 = "M0 75";
      for (var x = 0; x <= 460; x += 6) {
        var env = Math.sin((x / 460) * Math.PI);
        d1 += " L" + x + " " + (75 + Math.sin(x * 0.045 + t) * 26 * env);
        d2 += " L" + x + " " + (75 + Math.sin(x * 0.03 - t * 0.7 + 1.4) * 34 * env);
      }
      p1.setAttribute("d", d1);
      p2.setAttribute("d", d2);
      raf = null;
      if (!REDUCED && visible) { t += 0.02; raf = requestAnimationFrame(draw); }
    }
    draw();
    if (!REDUCED && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && raf === null) raf = requestAnimationFrame(draw);
      }).observe(svg);
    }
  })();
})();
