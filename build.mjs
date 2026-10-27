// Wraps index.html (authored as a page fragment for the Claude artifact host)
// in a full HTML document and writes it to dist/ for static hosting.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const page = readFileSync(new URL("./index.html", import.meta.url), "utf8");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0c0d10">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230c0d10'/%3E%3Ctext x='16' y='23' font-family='Georgia,serif' font-size='20' text-anchor='middle' fill='%23d4b57a'%3EV%3C/text%3E%3C/svg%3E">
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${page}
</body>
</html>
`;

mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("./dist/index.html", import.meta.url), html);
console.log("Built dist/index.html");

// Print edition: every view stacked on its own pages, nav turned into in-document links.
// Render with: node build.mjs --pdf  (prints build/print.html to Vanta.pdf via headless Chrome)
const printExtras = `
<style>
@page { size: 1280px 1810px; margin: 0; }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; animation: none !important; transition: none !important; }
.nav, .side, .topbar { position: static !important; backdrop-filter: none !important; }
.side { height: auto !important; }
.app { min-height: 0 !important; break-before: page; }
#view-goals, #view-insights { break-before: page; padding-top: 32px; }
.toast, .tip, .skip, .chart-hint, .side-foot, [data-table-toggle], .search kbd { display: none !important; }
.panel, .kpis, .insight, .goal { break-inside: avoid; }
</style>
<script>
(() => {
  const root = document.documentElement;
  root.dataset.theme = "dark";
  document.getElementById("landing").hidden = false;
  document.getElementById("app").hidden = false;
  ["overview", "goals", "insights"].forEach(v => {
    const sec = document.getElementById("view-" + v);
    sec.hidden = false;
    const a = document.createElement("a"); a.id = v; sec.prepend(a);
  });
  document.getElementById("landing").insertAdjacentHTML("afterbegin", '<a id="top"></a>');
  document.querySelectorAll('a[href="#"]').forEach(a => a.setAttribute("href", "#top"));
  document.querySelectorAll(".side-nav [data-view]").forEach(b => {
    const a = document.createElement("a"); a.href = "#" + b.dataset.view; a.innerHTML = b.innerHTML;
    a.className = "pdf-link"; a.style.cssText = "display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;color:var(--fg-2);font-size:14px;text-decoration:none";
    b.replaceWith(a);
  });
  document.querySelector('[data-act="drift"]')?.click();
  window.vantaDrawAll();
})();
</script>`;
writeFileSync(new URL("./dist/print.html", import.meta.url), html.replace("</body>", printExtras + "\n</body>"));

if (process.argv.includes("--pdf")) {
  const { existsSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const puppeteer = (await import("puppeteer-core")).default;
  const executablePath = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome"
  ].find(existsSync);
  if (!executablePath) throw new Error("Chrome or Edge is needed to print the PDF.");
  const out = fileURLToPath(new URL("./Vanta.pdf", import.meta.url));
  const browser = await puppeteer.launch({ executablePath, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1810 });
  await page.goto(new URL("./dist/print.html", import.meta.url).href, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready.then(() => window.vantaDrawAll()));
  await page.pdf({ path: out, width: "1280px", height: "1810px", printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log("Printed " + out);
}
