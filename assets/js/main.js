(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const supports = (property, value) => window.CSS && CSS.supports(property, value);

  const html = document.documentElement;
  const storageKey = "rn-theme";

  const storage = {
    get() {
      try {
        return localStorage.getItem(storageKey);
      } catch {
        return null;
      }
    },
    set(value) {
      try {
        localStorage.setItem(storageKey, value);
      } catch {
        /* Ignore private browsing and file permission storage failures. */
      }
    },
  };

  function setTheme(theme, animate = false) {
    const apply = () => {
      html.dataset.theme = theme;
      storage.set(theme);
    };

    if (animate && document.startViewTransition) {
      document.startViewTransition(apply);
      return;
    }

    apply();
  }

  function initTheme() {
    const savedTheme = storage.get();
    const systemTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = savedTheme || systemTheme;

    setTheme(theme);

    $("#themeBtn")?.addEventListener("click", () => {
      setTheme(html.dataset.theme === "dark" ? "light" : "dark", true);
    });
  }

  function initNavigation() {
    const hamburger = $("#hamburger");
    const navMenu = $("#navMenu");
    const navLinks = $$(".nav-link");
    const mobileQuery = matchMedia("(max-width: 720px)");

    if (!hamburger || !navMenu) return;

    const menuLinks = $$("a", navMenu);

    const closeNav = () => {
      navMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    };

    const toggleNav = () => {
      const isOpen = navMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    };

    hamburger.addEventListener("click", toggleNav);

    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("open")) return;

      const clickTarget = event.target;
      if (clickTarget instanceof Node && !hamburger.contains(clickTarget) && !navMenu.contains(clickTarget)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", closeNav);
    } else {
      mobileQuery.addListener(closeNav);
    }

    menuLinks.forEach((link) => link.addEventListener("click", closeNav));

    const sections = $$("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
            if (isCurrent) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initReveal() {
    const revealItems = $$(".reveal");

    if (supports("animation-timeline", "view()")) {
      revealItems.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function initProgress() {
    const bar = $(".progress-bar");
    if (!bar) return;

    if (supports("animation-timeline", "scroll()")) {
      bar.dataset.cssDriven = "";
      return;
    }

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      bar.style.setProperty("--progress", `${progress}%`);
    };

    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
  }

  function initGallery() {
    const track = $("#galleryTrack");
    const dots = $("#galleryDots");
    if (!track || !dots) return;

    const slides = $$(".gallery-slide", track);
    if (!slides.length) return;

    let current = 0;

    const syncDots = () => {
      $$(".gallery-dot", dots).forEach((dot, index) => {
        const active = index === current;
        dot.classList.toggle("active", active);
        dot.setAttribute("aria-selected", String(active));
      });
    };

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      slides[current].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      syncDots();
    };

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `gallery-dot${index === 0 ? " active" : ""}`;
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slide ${index + 1}`);
      dot.setAttribute("aria-selected", String(index === 0));
      dot.addEventListener("click", () => goTo(index));
      dots.appendChild(dot);
    });

    $(".gallery-arrow.prev")?.addEventListener("click", () => goTo(current - 1));
    $(".gallery-arrow.next")?.addEventListener("click", () => goTo(current + 1));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          current = slides.indexOf(entry.target);
          syncDots();
        });
      },
      { root: track, threshold: 0.55 },
    );

    slides.forEach((slide) => observer.observe(slide));

    document.addEventListener("keydown", (event) => {
      if (!document.activeElement?.closest("#gallery")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(current - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(current + 1);
      }
    });
  }

  function initBackToTop() {
    const backTop = $("#backTop");
    if (!backTop) return;

    const update = () => backTop.classList.toggle("visible", scrollY > 400);
    addEventListener("scroll", update, { passive: true });
    update();
  }

  initTheme();
  initNavigation();
  initReveal();
  initProgress();
  initGallery();
  initBackToTop();
})();
