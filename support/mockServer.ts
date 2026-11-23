import { createServer, Server } from "node:http";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { AddressInfo } from "node:net";

let started: Promise<{ server: Server; url: string }> | undefined;

/** Starts (once per process) a local server that serves the pinned fixture. */
export function startMockServer(): Promise<string> {
  started ??= new Promise((resolve, reject) => {
    const body = readFileSync(join(process.cwd(), "fixtures", "media.json"));
    const server = createServer((req, res) => {
      if (req.method !== "GET") {
        res.writeHead(405, { Allow: "GET" }).end();
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=30, public"
      });
      res.end(body);
    });
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, url: `http://127.0.0.1:${port}/api/RMSTest/media` });
    });
  });
  return started.then((s) => s.url);
}

export async function stopMockServer(): Promise<void> {
  if (!started) return;
  const { server } = await started;
  started = undefined;
  await new Promise<void>((resolve) => server.close(() => resolve()));
}
