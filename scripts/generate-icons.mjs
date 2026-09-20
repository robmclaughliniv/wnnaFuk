import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "public", "icons");
mkdirSync(OUT, { recursive: true });

const YELLOW = "#FFD60A";
const INK = "#0D0D0D";

const variants = [
  { suffix: "", bg: YELLOW, fg: INK },
  { suffix: "-dark", bg: INK, fg: YELLOW },
];

const sizes = [
  { name: "apple-touch-icon", size: 180, maskable: false },
  { name: "icon-192", size: 192, maskable: false },
  { name: "icon-512", size: 512, maskable: false },
  { name: "icon-512-maskable", size: 512, maskable: true },
];

function svg(size, maskable, bg, fg) {
  // Full-bleed fill — the OS squircle is the shape. Maskable only shrinks the glyph.
  const glyphScale = maskable ? 0.8 : 1;
  const fontSize = Math.round(size * 0.3 * glyphScale);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Arial Black, Impact, sans-serif" font-size="${fontSize}" font-weight="900" fill="${fg}">wf?</text>
</svg>`);
}

for (const { suffix, bg, fg } of variants) {
  for (const { name, size, maskable } of sizes) {
    const filename = `${name}${suffix}.png`;
    await sharp(svg(size, maskable, bg, fg)).png().toFile(join(OUT, filename));
    console.log(`Wrote ${filename}`);
  }
}
