// Copies browser libraries from node_modules into player/vendor/ so presentations run offline.
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const GSAP_FILES = [
  "gsap.min.js",
  "CustomEase.min.js",
  "DrawSVGPlugin.min.js",
  "Flip.min.js",
  "MorphSVGPlugin.min.js",
  "MotionPathPlugin.min.js",
  "SplitText.min.js",
  "TextPlugin.min.js",
];

const COPIES = GSAP_FILES.map((file) => ({
  from: join("node_modules", "gsap", "dist", file),
  to: join("player", "vendor", "gsap", file),
}));

for (const { from, to } of COPIES) {
  await mkdir(dirname(join(ROOT, to)), { recursive: true });
  await copyFile(join(ROOT, from), join(ROOT, to));
  console.log(`vendor: ${to}`);
}
