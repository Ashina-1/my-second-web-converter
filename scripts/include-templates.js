// include-templates.js
// Simple client-side include loader for static pages.
(async function () {
  const includes = document.querySelectorAll("[data-include]");
  for (const el of includes) {
    const url = el.getAttribute("data-include");
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Failed to fetch include:", url, res.status);
        continue;
      }
      const html = await res.text();
      el.innerHTML = html;
      // Initialize header behaviors if header was inserted
      if (url.endsWith("header.html")) {
        // Load header.js dynamically (so it runs after insertion)
        const s = document.createElement("script");
        s.src = "scripts/header.js";
        s.defer = true;
        document.body.appendChild(s);
      }
    } catch (e) {
      console.error("include fetch error", url, e);
    }
  }
})();
