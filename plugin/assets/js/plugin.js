/* =====================================================================
   Tado Slider — Plugin Marketing Site
   Vanilla ES6. Lenis smooth scroll + GSAP ScrollTrigger reveals + hamburger.
   Loaded with `defer`; GSAP, ScrollTrigger and Lenis are loaded before this.
   ===================================================================== */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mark JS active so reveal base-state CSS applies (progressive enhancement)
  doc.documentElement.classList.add("js-ready");

  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";
  var lenis = null;

  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  /* ---------------------------------------------------------------
     Lenis smooth scroll (synced to GSAP ticker)
     --------------------------------------------------------------- */
  function initLenis() {
    if (!hasLenis || prefersReduced) return;
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });

    if (hasGSAP) {
      lenis.on("scroll", function () { if (hasST) window.ScrollTrigger.update(); });
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(t) { lenis.raf(t); requestAnimationFrame(raf); });
    }
  }

  /* ---------------------------------------------------------------
     Sticky header
     --------------------------------------------------------------- */
  function initHeader() {
    var header = doc.querySelector(".tp-header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add("is-stuck");
      else header.classList.remove("is-stuck");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     Hamburger menu
     --------------------------------------------------------------- */
  function initMenu() {
    var burger = doc.querySelector(".tp-burger");
    var menu = doc.querySelector(".tp-menu");
    if (!burger || !menu) return;

    var open = function () {
      body.classList.add("tp-menu-open");
      burger.setAttribute("aria-expanded", "true");
      if (lenis) lenis.stop();
    };
    var close = function () {
      body.classList.remove("tp-menu-open");
      burger.setAttribute("aria-expanded", "false");
      if (lenis) lenis.start();
    };
    var toggle = function () {
      body.classList.contains("tp-menu-open") ? close() : open();
    };

    burger.addEventListener("click", toggle);
    // Close on link click
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    // Close on ESC
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("tp-menu-open")) close();
    });
    // Close on outside click
    doc.addEventListener("click", function (e) {
      if (!body.classList.contains("tp-menu-open")) return;
      if (!menu.contains(e.target) && !burger.contains(e.target)) close();
    });
    // Reset state when resizing to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 991 && body.classList.contains("tp-menu-open")) close();
    });
  }

  /* ---------------------------------------------------------------
     Anchor links → Lenis scrollTo
     --------------------------------------------------------------- */
  function initAnchors() {
    doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = doc.querySelector(id);
      if (!target) return;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: -80 });
        else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      });
    });
  }

  /* ---------------------------------------------------------------
     Scroll reveals
     --------------------------------------------------------------- */
  function initReveals() {
    var els = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));
    if (!els.length) return;

    if (!hasST || prefersReduced) {
      // No GSAP or reduced motion → just show everything
      els.forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
      return;
    }

    var gsap = window.gsap;
    // Group reveals by their parent section for nice stagger
    els.forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        delay: parseFloat(el.getAttribute("data-reveal-delay")) || 0
      });
    });
  }

  /* ---------------------------------------------------------------
     Hero entrance + parallax
     --------------------------------------------------------------- */
  function initHero() {
    var hero = doc.querySelector(".tp-hero");
    if (!hero) return;

    if (hasGSAP && !prefersReduced) {
      var gsap = window.gsap;
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      var copy = hero.querySelectorAll(".tp-hero__copy > *");
      tl.from(copy, { y: 40, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.15);
      var figs = hero.querySelectorAll(".tp-hero__mosaic figure");
      if (figs.length) tl.from(figs, { y: 30, opacity: 0, scale: 0.96, duration: 0.7, stagger: 0.1 }, 0.4);

      // Parallax on the background image
      var bg = hero.querySelector(".tp-hero__bg");
      if (bg && hasST) {
        gsap.to(bg, {
          yPercent: 14, ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
        });
      }
    }
  }

  /* ---------------------------------------------------------------
     Boot
     --------------------------------------------------------------- */
  function boot() {
    initLenis();
    initHeader();
    initMenu();
    initAnchors();
    initHero();
    initReveals();
    if (hasST) window.ScrollTrigger.refresh();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.addEventListener("load", function () { if (hasST) window.ScrollTrigger.refresh(); });
})();
