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
