import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "public", "icons");
mkdirSync(OUT, { recursive: true });

const sizes = [
  { name: "apple-touch-icon.png", size: 180, maskable: false },
  { name: "icon-192.png", size: 192, maskable: false },
  { name: "icon-512.png", size: 512, maskable: false },
  { name: "icon-512-maskable.png", size: 512, maskable: true },
];

function svg(size, maskable) {
  const pad = maskable ? Math.round(size * 0.1) : 0;
  const inner = size - pad * 2;
  const fontSize = Math.round(inner * 0.55);
  const cx = size / 2;
  const cy = size / 2 + fontSize * 0.08;

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#FFF8E7"/>
  <rect x="${pad + 4}" y="${pad + 4}" width="${inner - 8}" height="${inner - 8}" fill="#FFD60A" stroke="#0D0D0D" stroke-width="${Math.max(4, size * 0.02)}"/>
  <text x="${cx}" y="${cy}" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="${fontSize}" font-weight="900" fill="#0D0D0D">?</text>
</svg>`);
}

for (const { name, size, maskable } of sizes) {
  await sharp(svg(size, maskable)).png().toFile(join(OUT, name));
  console.log(`Wrote ${name}`);
}
