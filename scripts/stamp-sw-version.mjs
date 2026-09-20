import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outPath = join(process.cwd(), "out", "sw.js");

let version;
try {
  version = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
} catch {
  version = Date.now().toString(36);
}

const source = readFileSync(outPath, "utf8");
const stamped = source.replace(/__SW_VERSION__/g, version);
writeFileSync(outPath, stamped);
console.log(`Stamped sw.js with CACHE_VERSION=${version}`);
