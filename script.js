(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  // Highlight active nav section while scrolling
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const map = new Map();
    navLinks.forEach(function (link) {
      const id = link.getAttribute("href").slice(1);
      if (id) map.set(id, link);
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const link = map.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) {
              l.classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      if (map.has(section.id)) observer.observe(section);
    });
  }

  /* ============================================
     Motion: entrance, reveals, count-up, parallax
     ============================================ */

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    document.documentElement.classList.add("reduce-motion");
  }

  function formatCount(n) {
    return n.toLocaleString("en-US");
  }

  function setFinalStat(el) {
    const target = Number(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    if (!Number.isFinite(target)) return;
    el.textContent = formatCount(target) + suffix;
  }

  function animateCount(el, duration) {
    const target = Number(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    if (!Number.isFinite(target)) return;

    const start = performance.now();
    const from = 0;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      el.textContent = formatCount(value) + suffix;
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = formatCount(target) + suffix;
      }
    }

    requestAnimationFrame(frame);
  }

  function runHeroEntrance() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    if (reduceMotion) {
      hero.classList.add("is-ready");
      hero.querySelectorAll(".hero-enter").forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    // Double rAF so initial opacity:0 paints before transitioning in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add("is-ready");
        hero.querySelectorAll(".hero-enter").forEach(function (el) {
          el.classList.add("is-in");
        });
      });
    });
  }

  function initRevealsAndStats() {
    const revealEls = document.querySelectorAll(".reveal");
    const statsRow = document.querySelector('.hero-stats[data-animate="stats"]');
    const countEls = document.querySelectorAll(".stat-value[data-count]");

    if (reduceMotion) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
      countEls.forEach(setFinalStat);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
      countEls.forEach(setFinalStat);
      return;
    }

    // Start countables at 0 until animated
    countEls.forEach(function (el) {
      const suffix = el.getAttribute("data-suffix") || "";
      el.textContent = "0" + suffix;
    });

    let statsAnimated = false;

    function triggerStats() {
      if (statsAnimated) return;
      statsAnimated = true;
      countEls.forEach(function (el) {
        animateCount(el, 1100);
      });
    }

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

    if (statsRow && countEls.length) {
      const statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            triggerStats();
            // Also ensure stagger items visible
            statsRow.querySelectorAll(".reveal").forEach(function (el) {
              el.classList.add("is-visible");
            });
            statsObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.35 }
      );
      statsObserver.observe(statsRow);
    }

    // Eagerly reveal anything already in (or near) the viewport.
    // Covers above-the-fold content and environments where IO is delayed.
    function revealIfInView(el) {
      if (el.classList.contains("is-visible")) return false;
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      if (rect.top < vh * 0.92 && rect.bottom > vh * 0.02) {
        el.classList.add("is-visible");
        revealObserver.unobserve(el);
        return true;
      }
      return false;
    }

    requestAnimationFrame(function () {
      revealEls.forEach(revealIfInView);
      if (statsRow && !statsAnimated) {
        var rect = statsRow.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight || 0;
        if (rect.top < vh * 0.9 && rect.bottom > 0) {
          triggerStats();
          statsRow.querySelectorAll(".reveal").forEach(function (el) {
            el.classList.add("is-visible");
          });
        }
      }
    });
  }

  function initParallax() {
    if (reduceMotion) return;

    const wraps = Array.prototype.slice.call(
      document.querySelectorAll("[data-parallax]")
    );
    if (!wraps.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight || 1;

      for (var i = 0; i < wraps.length; i++) {
        var wrap = wraps[i];
        var target = wrap.querySelector(".parallax-target") || wrap;
        var strength = parseFloat(wrap.getAttribute("data-parallax")) || 0.1;
        var rect = wrap.getBoundingClientRect();

        // Only update when near viewport
        if (rect.bottom < -80 || rect.top > vh + 80) continue;

        var mid = rect.top + rect.height / 2;
        var progress = (mid - vh / 2) / vh; // ~ -0.5 .. 0.5 when centered
        var offset = progress * strength * -40; // subtle px range
        target.style.setProperty("--parallax-y", offset.toFixed(2) + "px");
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  // Boot motion after DOM is ready (script is at end of body)
  runHeroEntrance();
  initRevealsAndStats();
  initParallax();
})();
