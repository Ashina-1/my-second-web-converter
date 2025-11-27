const puppeteer = require("puppeteer");

async function check() {
  const host = process.env.SCREENSHOT_HOST || "http://127.0.0.1:8080";
  const pages = [
    "index.html",
    "fishing-log.html",
    "fishing-log2.html",
    "fishing-log2-detail.html",
    "profile.html",
    "pe-converter.html",
    "pe(tanatoru4)-converter.html",
  ];

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    for (const p of pages) {
      const url = `${host}/${encodeURI(p)}`;
      console.log(`\n=== ${p} ===`);
      try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      } catch (e) {
        console.error("goto failed:", e.message);
        continue;
      }

      // initial minimal result (kept for compatibility in case page structure differs)
      const initial = await page.evaluate(() => {
        const out = {};
        out.body_bg =
          getComputedStyle(document.body).background ||
          getComputedStyle(document.body).backgroundColor;
        const header = document.querySelector("header");
        out.header_exists = !!header;
        out.header_bg = header
          ? getComputedStyle(header).backgroundColor
          : null;
        // check presence of linked stylesheets
        out.link_hrefs = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]')
        ).map((l) => l.getAttribute("href"));
        // count inline svg icons
        out.svg_count = document.querySelectorAll("svg").length;
        return out;
      });

      const selectors = [
        { name: "body", sel: "body" },
        { name: "header", sel: "header" },
        { name: "top-wrapper", sel: ".top-wrapper" },
        { name: "card", sel: ".card, .site-card" },
        { name: "btn", sel: ".btn, button" },
        { name: "home-btn", sel: ".home-btn" },
      ];

      const detailed = await page.evaluate((selectors) => {
        function pickComputed(el, props) {
          const cs = getComputedStyle(el);
          const out = {};
          props.forEach((p) => {
            out[p] = cs.getPropertyValue(p);
          });
          return out;
        }

        const out = {};
        out.link_hrefs = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]')
        ).map((l) => l.getAttribute("href"));
        out.images = Array.from(document.images || []).map((i) => ({
          src: i.src,
          status: i.complete,
        }));
        out.missing_images = out.images
          .filter((i) => !i.status)
          .map((i) => i.src);
        out.resources = Array.from(
          document.querySelectorAll('link[rel="stylesheet"], script[src]')
        ).map((n) => ({ tag: n.tagName.toLowerCase(), src: n.href || n.src }));
        out.svg_count = document.querySelectorAll("svg").length;
        out.elements = {};
        selectors.forEach((s) => {
          const el = document.querySelector(s.sel);
          if (!el) {
            out.elements[s.name] = { exists: false };
          } else {
            out.elements[s.name] = {
              exists: true,
              computed: pickComputed(el, [
                "background-color",
                "color",
                "display",
                "font-family",
                "position",
                "width",
              ]),
            };
          }
        });
        return out;
      }, selectors);

      // merge initial + detailed for reporting
      const result = Object.assign({}, initial, detailed);

      console.log("linked stylesheets (order):", result.link_hrefs);
      if (result.missing_images && result.missing_images.length)
        console.log("missing images (not loaded):", result.missing_images);
      console.log("svg count:", result.svg_count);
      for (const [k, v] of Object.entries(result.elements)) {
        if (!v.exists) {
          console.log(`${k}: MISSING`);
        } else {
          console.log(`${k}:`, v.computed);
        }
      }
    }
  } finally {
    await browser.close();
  }
}

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
