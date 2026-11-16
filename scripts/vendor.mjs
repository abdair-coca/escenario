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

const FONT_FILES = {
  "bricolage-grotesque": ["latin-500-normal.woff2", "latin-700-normal.woff2"],
  "jetbrains-mono": ["latin-400-normal.woff2", "latin-700-normal.woff2"],
};

const COPIES = [
  ...GSAP_FILES.map((file) => ({
    from: join("node_modules", "gsap", "dist", file),
    to: join("player", "vendor", "gsap", file),
  })),
  ...Object.entries(FONT_FILES).flatMap(([family, files]) => [
    ...files.map((file) => ({
      from: join("node_modules", "@fontsource", family, "files", `${family}-${file}`),
      to: join("player", "vendor", "fonts", `${family}-${file}`),
    })),
    {
      from: join("node_modules", "@fontsource", family, "LICENSE"),
      to: join("player", "vendor", "fonts", `${family}-LICENSE.txt`),
    },
  ]),
];

for (const { from, to } of COPIES) {
  await mkdir(dirname(join(ROOT, to)), { recursive: true });
  await copyFile(join(ROOT, from), join(ROOT, to));
  console.log(`vendor: ${to}`);
}
