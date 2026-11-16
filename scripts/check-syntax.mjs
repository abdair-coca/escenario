// Syntax check for every JS module and every inline scene script (no linter dependency).
import { readdir, readFile } from "node:fs/promises";
import { join, relative, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FOLDERS = ["player/src", "scripts", "tests", "library", "presentations"];
// Classic inline scripts only: external files are checked on their own, modules need import support.
const SCRIPT_TAG = /<script(?![^>]*\b(?:src|type)=)[^>]*>([\s\S]*?)<\/script>/g;

let failures = 0;
for (const folder of FOLDERS) {
  for (const file of await listFiles(join(ROOT, folder))) {
    const extension = extname(file);
    if (extension === ".js" || extension === ".mjs") checkModule(file);
    if (extension === ".html") await checkSceneScripts(file);
  }
}
console.log(failures ? `${failures} file(s) with syntax errors` : "syntax ok");
process.exit(failures ? 1 : 0);

function checkModule(file) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) fail(file, result.stderr);
}

async function checkSceneScripts(file) {
  const html = await readFile(file, "utf8");
  for (const [, code] of html.matchAll(SCRIPT_TAG)) {
    try {
      new vm.Script(code, { filename: file });
    } catch (error) {
      fail(file, error.message);
    }
  }
}

function fail(file, message) {
  failures += 1;
  console.error(`✗ ${relative(ROOT, file)}\n${message}`);
}

async function listFiles(folder) {
  let entries;
  try {
    entries = await readdir(folder, { withFileTypes: true, recursive: true });
  } catch {
    return [];
  }
  return entries.filter((entry) => entry.isFile()).map((entry) => join(entry.parentPath, entry.name));
}
