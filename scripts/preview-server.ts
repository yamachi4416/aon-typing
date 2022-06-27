import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { default as path } from "node:path";
import { parse as urlParse, UrlWithStringQuery } from "node:url";
import { default as fs } from "node:fs/promises";

type Hanlder = {
  match: (url: UrlWithStringQuery, req: IncomingMessage) => boolean;
  handle: (
    url: UrlWithStringQuery,
    req: IncomingMessage,
    res: ServerResponse
  ) => Promise<void>;
};

function defineHandler(handler: Hanlder) {
  return handler;
}

function contactHandler() {
  return defineHandler({
    match(url, req) {
      return (
        req.method.toLowerCase() === "post" &&
        url.pathname === "/api/contact" &&
        /^application\/json/i.test(req.headers["content-type"])
      );
    },
    async handle(url, req, res) {
      const buffers = [];
      for await (const buffer of req) {
        buffers.push(buffer);
      }

      const data = Buffer.concat(buffers).toJSON();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      res.statusCode = 200;
      res.end();
    },
  });
}

function sendFileHandler(dist: string) {
  const root = path.normalize(path.resolve(dist));

  return defineHandler({
    match(url, req) {
      return req.method.toLowerCase() === "get";
    },
    async handle(url, req, res) {
      try {
        const file = path.normalize(
          path.resolve(dist, ...normalize(url.pathname).split("/"))
        );

        if (!file.startsWith(root)) {
          res.statusCode = 404;
          res.end();
          return;
        }

        const stat = await fs.stat(file);

        res.statusCode = 200;
        res.setHeader("Content-Length", stat.size);
        res.setHeader("Content-Type", mimetype(file));

        const fd = await fs.open(file, "r");
        const stream = fd.createReadStream({ autoClose: true });

        res.flushHeaders();
        stream.pipe(res);
      } catch (e) {
        if (e.code === "ENOENT") {
          res.statusCode = 404;
          res.end();
        } else {
          throw e;
        }
      }
    },
  });

  function normalize(pathname: string) {
    if (pathname.endsWith("/")) {
      return `${pathname}index.html`;
    } else if (!/\.[^./]+$/.test(pathname)) {
      return `${pathname}/index.html`;
    }
    return pathname;
  }

  function mimetype(filename: string) {
    return (
      {
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".css": "text/css",
        ".htm": "text/html",
        ".html": "text/html",
        ".xml": "text/xml",
        ".png": "image/png",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".ico": "image/vnd.microsoft.icon",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".pdf": "application/pdf",
      }[path.extname(filename)?.toLocaleLowerCase() ?? ""] ??
      "application/octet-stream"
    );
  }
}

function optparse() {
  const opts: Record<string, string> = {};
  const args: string[] = [];

  for (let i = 2; i < process.argv.length; i++) {
    const o = process.argv[i];
    if (o.startsWith("-")) {
      opts[o] = process.argv[++i];
    } else {
      args.push(o);
    }
  }

  return [opts, args] as [typeof opts, typeof args];
}

function logging(req: IncomingMessage, res: ServerResponse) {
  res.once("close", () => {
    try {
      const date = new Date().toISOString();
      const status = res.statusCode;
      const message = res.statusMessage;
      const headers = JSON.stringify(res.getHeaders());
      console.log(`${date} : ${status} ${message} ${headers}`);
    } catch (e) {
      console.error(e);
    }
  });

  const date = new Date().toISOString();
  console.log(`${date} : ${req.method} ${req.url}`);
}

function main() {
  const [opts, args] = optparse();

  const dist = opts["--dist"] ?? args[args.length - 1] ?? ".";
  const host = opts["--host"] ?? opts["-h"] ?? "localhost";
  const port = Number(opts["--port"] ?? opts["-p"] ?? "3000");

  const handlers = [contactHandler(), sendFileHandler(dist)];

  const server = createServer(async (req, res) => {
    try {
      logging(req, res);
      const url = urlParse(req.url);
      const handler = handlers.find((handler) => handler.match(url, req));
      if (handler) {
        handler.handle(url, req, res);
      }
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.end();
    }
  });

  console.log(
    `
${"-".repeat(50)}
Server Listen On  : ${host}:${port}
Static Files Root : ${dist}
${"-".repeat(50)}`.trimStart()
  );

  server.listen(port, host);
}

main();
