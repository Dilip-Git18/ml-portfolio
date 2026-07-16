// =============================================================================
// script.js — Handles mobile menu, active nav highlighting, scroll reveal
// animations, and the back-to-top button.
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------------------
     1. MOBILE MENU TOGGLE
     Opens/closes the nav links on small screens and closes the menu
     automatically after a link is clicked.
     --------------------------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinksList = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinksList.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  // Close the mobile menu whenever a nav link is clicked
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinksList.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------------------
     2. ACTIVE NAVIGATION HIGHLIGHTING
     Uses IntersectionObserver to detect which section is currently in
     view and highlights the matching nav link.
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
    {
      // Trigger when a section is roughly in the middle of the viewport
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => navObserver.observe(section));

  /* ---------------------------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS
     Fades and slides ".reveal" elements into place as they enter the
     viewport, using IntersectionObserver so it's not tied to scroll
     event listeners (better performance).
     --------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Stop observing once revealed, no need to keep checking
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     4. BACK TO TOP BUTTON
     Shows the button after scrolling down a bit, and scrolls smoothly
     back to the top when clicked.
     --------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------------------------------------------------
     5. FOOTER YEAR
     Keeps the copyright year current without manual edits.
     --------------------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();

});
