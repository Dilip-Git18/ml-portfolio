// =============================================================================
// script.js — Handles the neural-network hero animation, typing effect,
// animated stat counters, theme toggle, skill filters, expandable project
// cards, scroll progress, nav highlighting, reveal animations, and the
// back-to-top button.
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     1. THEME TOGGLE (dark / light)
     Reads any saved preference first, falls back to the visitor's OS
     setting, and remembers whatever the visitor picks.
     --------------------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeIcon.textContent = theme === "dark" ? "\u2600" : "\u263D"; // sun / moon
    localStorage.setItem("portfolio-theme", theme);
  }

  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  /* ---------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     --------------------------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinksList = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinksList.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinksList.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------------------
     3. SCROLL PROGRESS BAR
     Fills from 0% to 100% as the visitor scrolls down the page.
     --------------------------------------------------------------------- */
  const scrollProgress = document.getElementById("scrollProgress");

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + "%";
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------------------------------------------------------------------
     4. ACTIVE NAVIGATION HIGHLIGHTING
     --------------------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));

  /* ---------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (staggered)
     Elements fade/slide in as they enter the viewport. Siblings inside
     the same parent get a small incremental delay for a staggered feel.
     --------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblingIndex = Array.from(el.parentElement.children).indexOf(el);
          const delay = prefersReducedMotion ? 0 : Math.min(siblingIndex * 60, 300);
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     6. TYPING EFFECT FOR HERO ROLE
     Cycles through Dilip's two roles, typing and deleting each one.
     --------------------------------------------------------------------- */
  const typedRoleEl = document.getElementById("typedRole");
  const roles = ["Machine Learning Developer", "Full-Stack Developer", "Problem Solver"];

  if (!prefersReducedMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        if (charIndex > currentRole.length) {
          deleting = true;
          setTimeout(typeLoop, 1400); // pause at full word
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }

      typedRoleEl.textContent = currentRole.slice(0, charIndex);
      setTimeout(typeLoop, deleting ? 35 : 65);
    }

    // Start from a fully-typed first role, then loop
    setTimeout(() => {
      deleting = true;
      typeLoop();
    }, 1400);
  }

  /* ---------------------------------------------------------------------
     7. ANIMATED STAT COUNTERS
     Counts each hero stat up from 0 once it scrolls into view.
     --------------------------------------------------------------------- */
  const statValues = document.querySelectorAll(".stat-value");

  const statObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const isDecimal = el.dataset.decimal === "true";
        const duration = prefersReducedMotion ? 0 : 1200;
        const startTime = performance.now();

        function tick(now) {
          const progress = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const value = target * eased;
          el.textContent = (isDecimal ? (value / 100).toFixed(2) : Math.round(value)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  statValues.forEach((el) => statObserver.observe(el));

  /* ---------------------------------------------------------------------
     8. SKILL FILTERS
     Toggling a pill filters the skill grid by data-category.
     --------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      skillCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !matches);
      });
    });
  });

  /* ---------------------------------------------------------------------
     9. EXPANDABLE PROJECT CARDS
     Clicking a project's summary reveals its Problem / Solution / Outcome.
     --------------------------------------------------------------------- */
  document.querySelectorAll(".project-summary").forEach((summary) => {
    const body = summary.nextElementSibling;

    summary.addEventListener("click", () => {
      const isOpen = body.classList.contains("open");
      body.classList.toggle("open", !isOpen);
      summary.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ---------------------------------------------------------------------
     10. COPY EMAIL TO CLIPBOARD
     --------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const emailLabel = document.getElementById("emailLabel");

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = copyEmailBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        const original = emailLabel.textContent;
        emailLabel.textContent = "Copied!";
        setTimeout(() => {
          emailLabel.textContent = original;
        }, 1800);
      } catch (err) {
        // Clipboard API unavailable — fall back to opening a mail client
        window.location.href = "mailto:" + email;
      }
    });
  }

  /* ---------------------------------------------------------------------
     11. BACK TO TOP BUTTON
     --------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------------------------------------------------------------------
     12. FOOTER YEAR
     --------------------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     13. SIGNATURE ELEMENT: NEURAL NETWORK CANVAS
     Draws a small, slow-moving network of nodes and connecting lines
     behind the hero text — a nod to the neural networks Dilip works with,
     rather than a generic decorative background.
     --------------------------------------------------------------------- */
  const canvas = document.getElementById("neuralCanvas");

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width, height, nodes;

    function getThemeColor() {
      // Reads the current --color-primary so the network matches light/dark mode
      return getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() || "#2563EB";
    }

    function resize() {
      const hero = document.getElementById("home");
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;

      // Density scales with area, capped so mobile stays light-weight
      const nodeCount = Math.min(Math.round((width * height) / 22000), 70);
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const color = getThemeColor();
      const maxDist = Math.min(width, height) * 0.16;

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      // Draw connecting lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.globalAlpha = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      ctx.globalAlpha = 0.7;
      nodes.forEach((n) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

});