// header.js
// Initialize header behaviors; safe to call after dynamic insertion
function initHeader(root = document) {
  const header = root.querySelector("header");
  if (!header) return;

  const menuIcon = header.querySelector("#menuIcon");
  const headerRight = header.querySelector(".header-right");
  const toolsBtn = header.querySelector(".tools-btn");
  const toolsSub = header.querySelector(".nav-tools .submenu");

  function closeAll() {
    header.classList.remove("open");
    if (toolsSub) {
      toolsSub.classList.remove("open");
      const tb = header.querySelector(".tools-btn");
      if (tb) tb.setAttribute("aria-expanded", "false");
      toolsSub.setAttribute("aria-hidden", "true");
    }
    if (menuIcon) menuIcon.setAttribute("aria-expanded", "false");
  }

  // Toggle mobile header (adds .open to header)
  if (menuIcon) {
    menuIcon.addEventListener("click", (e) => {
      const opened = header.classList.toggle("open");
      menuIcon.setAttribute("aria-expanded", opened ? "true" : "false");
      // reflect visible state on the icon for CSS animation
      try {
        menuIcon.classList.toggle("open", !!opened);
      } catch (err) {
        /* ignore if classList not supported */
      }
      if (opened) {
        const a = header.querySelector(".header-right a, .header-right button");
        if (a) a.focus();
      }
    });
  }

  // Close mobile header when any header link clicked (helpful on small screens)
  if (headerRight) {
    headerRight.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => header.classList.remove("open"));
    });
  }

  // Tools submenu toggle with ARIA updates
  if (toolsBtn && toolsSub) {
    toolsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const opened = toolsSub.classList.toggle("open");
      toolsBtn.setAttribute("aria-expanded", opened ? "true" : "false");
      toolsSub.setAttribute("aria-hidden", opened ? "false" : "true");
      if (opened) {
        // focus first menuitem
        const first = toolsSub.querySelector("[role=menuitem]");
        if (first) first.focus();
      }
    });

    // keyboard support for tools menu
    toolsBtn.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        toolsBtn.click();
      }
    });

    // close submenu on outside click
    document.addEventListener("click", (ev) => {
      if (!header.contains(ev.target)) return;
      const withinTools = ev.target.closest(".nav-tools");
      if (!withinTools && toolsSub.classList.contains("open")) {
        toolsSub.classList.remove("open");
        toolsBtn.setAttribute("aria-expanded", "false");
        toolsSub.setAttribute("aria-hidden", "true");
      }
    });
  }

  // global keyboard handler: Escape closes menus
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" || ev.key === "Esc") {
      // if submenu open, close it; else close header if open
      if (toolsSub && toolsSub.classList.contains("open")) {
        toolsSub.classList.remove("open");
        if (toolsBtn) toolsBtn.setAttribute("aria-expanded", "false");
        toolsSub.setAttribute("aria-hidden", "true");
        return;
      }
      if (header.classList.contains("open")) {
        header.classList.remove("open");
        if (menuIcon) {
          menuIcon.setAttribute("aria-expanded", "false");
          try {
            menuIcon.classList.remove("open");
          } catch (err) {}
        }
      }
    }
  });
}

// auto-init if header already present
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initHeader(document));
} else {
  initHeader(document);
}

// Export for dynamic initialization if include script inserts header later
if (typeof module !== "undefined") {
  module.exports = { initHeader };
}
