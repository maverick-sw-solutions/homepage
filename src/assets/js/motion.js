/* ================================================================
   MSS site — motion layer
   GSAP/ScrollTrigger (reveals, marquee, header) driving reveal and
   decorative motion on top of the browser's own native scroll — no
   scroll-smoothing library, so wheel/touch/trackpad all stay 1:1.
   Degrades gracefully: if the CDN scripts fail to load, motion-ready
   is removed so every [data-anim]/[data-mask] element stays visible.
   ================================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* Mobile menu toggle — independent of GSAP so it always works */
  function initMenu() {
    var burger = document.querySelector("[data-menu-toggle]");
    if (!burger) return;

    function close() {
      document.body.classList.remove("menu-open", "is-locked");
      burger.setAttribute("aria-expanded", "false");
    }

    burger.addEventListener("click", function () {
      var open = !document.body.classList.contains("menu-open");
      document.body.classList.toggle("menu-open", open);
      document.body.classList.toggle("is-locked", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.querySelectorAll(".mmenu a").forEach(function (a) {
      a.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) close();
    });
  }

  initMenu();

  /* Without GSAP/ScrollTrigger the site must render fully visible */
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove("motion-ready");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function headerOffset() {
    return parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 80;
  }

  /* Native scrollTo — the browser handles wheel/touch/trackpad itself, this
     just adds the fixed-header offset the browser can't infer on its own. */
  function scrollTo(target) {
    var offset = -(headerOffset() + 12);
    var el = typeof target === "string" ? document.querySelector(target) : target;
    var top = el ? el.getBoundingClientRect().top + window.scrollY + offset : 0;
    window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
  }

  /* Anchor links get the header-height compensation native scroll can't infer on its own */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.remove("menu-open", "is-locked");
        scrollTo(el);
      });
    });
  }

  /* ---- Reveals ---- */
  var entranceTweens = [];
  var maskReveals = [];

  function initReveals() {
    /* The mask line-reveal is a plain CSS transition (see site.css) driven by
       an .is-revealed class toggle — not a GSAP yPercent tween. Percentage
       transforms need the browser to measure the element's own height at
       animation time, which isn't reliably available on every device; the
       browser's own layout engine handles a CSS transition natively instead. */
    gsap.utils.toArray("[data-mask]").forEach(function (el) {
      var masks = el.querySelectorAll(".mask");
      var reveal = function () { masks.forEach(function (m) { m.classList.add("is-revealed"); }); };
      maskReveals.push(reveal);
      /* Above-the-fold on load (e.g. the hero title): play immediately as an
         intro, don't gate it behind ScrollTrigger — a fixed header's height
         settling after web-font load can shift the trigger's start point and
         cause the reveal to never fire for content that was visible on paint 1. */
      if (el.getBoundingClientRect().top < window.innerHeight) {
        setTimeout(reveal, 150);
      } else {
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: reveal });
      }
    });

    gsap.utils.toArray("[data-anim]").forEach(function (el) {
      var kind = el.getAttribute("data-anim");
      var delay = parseFloat(el.getAttribute("data-delay") || 0);
      var to = { duration: 1, ease: "expo.out", delay: delay };
      if (kind === "rise") { to.opacity = 1; to.y = 0; }
      else if (kind === "fade") { to.opacity = 1; }
      /* Same above-the-fold guard as the mask reveal above */
      if (el.getBoundingClientRect().top < window.innerHeight) {
        to.delay = delay + 0.15;
      } else {
        to.scrollTrigger = { trigger: el, start: "top 90%", once: true };
      }
      entranceTweens.push(gsap.to(el, to));
    });

    gsap.utils.toArray("[data-stagger]").forEach(function (group) {
      entranceTweens.push(gsap.from(group.children, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "expo.out",
        stagger: parseFloat(group.getAttribute("data-stagger")) || 0.08,
        scrollTrigger: { trigger: group, start: "top 86%", once: true }
      }));
    });
  }

  /* Defensive safety net: if a browser/device never advances these one-shot
     entrance tweens (e.g. a throttled rAF loop on an unfocused/backgrounded
     tab), snap them to their finished state so content is never stuck
     invisible. Scroll-scrubbed animations (marquee, arsenal wall, manifesto
     scrub) are intentionally excluded — their progress is meant to track
     scroll position, not "finish". */
  function safetyRevealFallback() {
    entranceTweens.forEach(function (t) {
      if (t.scrollTrigger && !t.scrollTrigger.isActive && t.progress() === 0) return;
      if (t.progress() < 1) t.progress(1);
    });
    maskReveals.forEach(function (reveal) { reveal(); });
  }

  /* Manifesto — words light up in sync with scroll */
  function initManifesto() {
    var el = document.querySelector("[data-scrub-words]");
    if (!el) return;

    var accent = (el.getAttribute("data-accent") || "")
      .split("|").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);

    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";

    words.forEach(function (w, i) {
      var span = document.createElement("span");
      span.className = "w";
      var clean = w.toLowerCase().replace(/[^0-9a-zà-ú]/gi, "");
      if (accent.indexOf(clean) > -1) span.classList.add("hi");
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });

    var spans = el.querySelectorAll(".w");
    var lastOn = -1;

    ScrollTrigger.create({
      trigger: el,
      start: "top 78%",
      end: "bottom 62%",
      scrub: 0.5,
      onUpdate: function (self) {
        var n = Math.round(self.progress * spans.length);
        if (n === lastOn) return;
        for (var i = 0; i < spans.length; i++) spans[i].classList.toggle("on", i < n);
        lastOn = n;
      }
    });
  }

  /* Capacidades — the tech wall lights up token by token while scrolling */
  function initArsenal() {
    var wall = document.querySelector(".wall");
    if (!wall) return;
    var toks = wall.querySelectorAll(".tok");
    gsap.set(toks, { opacity: 0, yPercent: 50 });
    gsap.to(toks, {
      opacity: 1,
      yPercent: 0,
      ease: "none",
      stagger: { each: 0.04, from: "start" },
      scrollTrigger: { trigger: wall, start: "top 85%", end: "bottom 75%", scrub: 0.6 }
    });
  }

  /* Marquee loop — skipped under reduced motion (a moving ticker is a common trigger) */
  function initMarquee() {
    if (reduced) return;
    gsap.utils.toArray(".marquee-track").forEach(function (track) {
      var dir = track.getAttribute("data-dir") === "rtl" ? 1 : -1;
      var speed = parseFloat(track.getAttribute("data-speed")) || 30;
      if (dir === 1) gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: speed, ease: "none", repeat: -1 });
      else gsap.to(track, { xPercent: -50, duration: speed, ease: "none", repeat: -1 });
    });
  }

  /* Header hide-on-scroll-down / stuck background */
  function initHeader() {
    var hdr = document.querySelector(".site-header");
    if (!hdr) return;
    ScrollTrigger.create({
      start: "top -80",
      end: "max",
      onUpdate: function (self) {
        hdr.classList.toggle("is-stuck", self.scroll() > 80);
        if (document.body.classList.contains("menu-open")) { hdr.classList.remove("is-hidden"); return; }
        hdr.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 320);
      }
    });
  }

  /* Magnetic pull on CTA buttons */
  function initMagnetic() {
    if (coarse || reduced) return;
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      var yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      el.addEventListener("mouseleave", function () { xTo(0); yTo(0); });
    });
  }

  function boot() {
    initAnchors();
    initReveals();
    initManifesto();
    initArsenal();
    initMarquee();
    initHeader();
    initMagnetic();
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    setTimeout(safetyRevealFallback, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
