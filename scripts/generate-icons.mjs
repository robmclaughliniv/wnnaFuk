import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const OUT = join(root, "public", "icons");
const FONT_PATH = join(
  root,
  "node_modules/@fontsource/bangers/files/bangers-latin-400-normal.woff",
);

mkdirSync(OUT, { recursive: true });

const LABEL = "wf?";
const font = opentype.loadSync(FONT_PATH);

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

/** Build path from individual glyphs — avoids opentype.js bidi/ccmp on Bangers. */
function buildLabelPath(fontSize) {
  const path = new opentype.Path();
  let x = 0;
  const scale = fontSize / font.unitsPerEm;

  for (const char of LABEL) {
    const glyph = font.charToGlyph(char);
    const glyphPath = glyph.getPath(x, 0, fontSize);
    path.commands.push(...glyphPath.commands);
    x += glyph.advanceWidth * scale;
  }

  return path;
}

const PROBE_FONT_SIZE = 100;
const PADDING_REGULAR = 0.08;
const PADDING_MASKABLE = 0.1;

function fitFontSize(size, maskable) {
  const padding = maskable ? PADDING_MASKABLE : PADDING_REGULAR;
  const target = size * (1 - 2 * padding);
  const probe = buildLabelPath(PROBE_FONT_SIZE);
  const bb = probe.getBoundingBox();
  const scale = Math.min(
    target / (bb.x2 - bb.x1),
    target / (bb.y2 - bb.y1),
  );

  return PROBE_FONT_SIZE * scale;
}

function glyphPathLayout(size, maskable) {
  const fontSize = fitFontSize(size, maskable);
  const path = buildLabelPath(fontSize);
  const bb = path.getBoundingBox();

  return {
    pathData: path.toPathData(),
    tx: size / 2 - (bb.x1 + bb.x2) / 2,
    ty: size / 2 - (bb.y1 + bb.y2) / 2,
  };
}

function svg(size, maskable, bg, fg) {
  const { pathData, tx, ty } = glyphPathLayout(size, maskable);

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <path d="${pathData}" fill="${fg}" transform="translate(${tx} ${ty})"/>
</svg>`);
}

for (const { suffix, bg, fg } of variants) {
  for (const { name, size, maskable } of sizes) {
    const filename = `${name}${suffix}.png`;
    await sharp(svg(size, maskable, bg, fg)).png().toFile(join(OUT, filename));
    console.log(`Wrote ${filename}`);
  }
}
