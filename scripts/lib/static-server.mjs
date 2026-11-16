// Minimal static file server for screenshots and tests (no extra dependency).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

// `mounts` maps a URL prefix to another folder (tests serve fixtures this way).
export function startStaticServer(rootDir, mounts = {}) {
  const root = normalize(rootDir + sep);
  const server = createServer(async (request, response) => {
    const path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const mount = Object.keys(mounts).find((prefix) => path.startsWith(prefix));
    const base = mount ? normalize(mounts[mount] + sep) : root;
    const relativePath = mount ? path.slice(mount.length) : path;
    const file = normalize(join(base, relativePath.endsWith("/") || relativePath === "" ? `${relativePath}index.html` : relativePath));
    if (!file.startsWith(base)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      response.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
      response.end(body);
    } catch {
      response.writeHead(404).end("not found");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ origin: `http://127.0.0.1:${port}`, close: () => new Promise((done) => server.close(done)) });
    });
  });
}
