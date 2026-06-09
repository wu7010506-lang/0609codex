import { readdirSync, readFileSync } from "node:fs";

const files = ["index.html", ...readdirSync("pages").filter((file) => file.endsWith(".html")).map((file) => `pages/${file}`)];
let jsonLdCount = 0;

for (const file of files) {
  const html = readFileSync(file, "utf8");
  if (!html.includes('rel="canonical"')) throw new Error(`${file} missing canonical`);
  if (!html.includes("<title>")) throw new Error(`${file} missing title`);
  if (!html.includes('name="description"')) throw new Error(`${file} missing description`);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  if (!blocks.length) throw new Error(`${file} missing JSON-LD`);
  for (const block of blocks) {
    JSON.parse(block[1]);
    jsonLdCount += 1;
  }
}

const sitemap = readFileSync("sitemap.xml", "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>/g)].length;
if (sitemapUrls !== files.length) throw new Error(`sitemap has ${sitemapUrls} URLs, expected ${files.length}`);

console.log(`HTML_FILES=${files.length}`);
console.log(`JSON_LD_BLOCKS=${jsonLdCount}`);
console.log(`SITEMAP_URLS=${sitemapUrls}`);
