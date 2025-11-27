const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

async function run() {
  const outDir = path.resolve(__dirname, "..", "screenshots");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

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

  console.log(
    "Launching browser (this will download Chromium on first install)"
  );
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    for (const p of pages) {
      const url = host + "/" + encodeURI(p);
      const name = p.replace(/[\\/:?"<>|\s]/g, "_");
      const outPath = path.join(outDir, `${name}.png`);
      console.log(`Opening ${url}`);
      try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        // give any dynamic JS a moment to render
        await new Promise((r) => setTimeout(r, 500));
        await page.screenshot({ path: outPath, fullPage: true });
        console.log(`Saved ${outPath}`);
      } catch (e) {
        console.error(`Failed to capture ${url}:`, e.message);
      }
    }
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
