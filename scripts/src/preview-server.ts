import fs from "node:fs/promises";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { parse as urlParse, UrlWithStringQuery } from "node:url";
import yargs from "yargs";
import { defineCommand } from "./lib/util";

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
      const file = path.normalize(
        path.resolve(dist, ...normalize(url.pathname).split("/"))
      );

      if (!file.startsWith(root)) {
        res.statusCode = 404;
        res.end();
        return;
      }

      const stat = await fs.stat(file).catch(() => {});

      if (!stat) {
        res.statusCode = 404;
        res.end();
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Length", stat.size);
      res.setHeader("Content-Type", mimetype(file));

      const fd = await fs.open(file, "r");
      const stream = fd.createReadStream({ autoClose: true });

      res.flushHeaders();
      stream.pipe(res);
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

function builder(yargs: yargs.Argv) {
  return yargs
    .options("dir", {
      alias: "d",
      type: "string",
      description: "static file root directory",
      default: ".",
      requiresArg: true,
    })
    .options("host", {
      alias: "H",
      type: "string",
      description: "listen host default",
      default: "localhost",
      requiresArg: true,
    })
    .options("port", {
      alias: "p",
      type: "number",
      description:
        "listen host default. that in directory of specify by '--dir'",
      default: 3000,
      requiresArg: true,
    })
    .options("404", {
      alias: "404",
      type: "string",
      description: "404 error html file",
      requiresArg: true,
    });
}

type MainArgs = ReturnType<typeof builder> extends yargs.Argv<infer T>
  ? T
  : never;

async function handler(args: MainArgs) {
  const handlers = [contactHandler(), sendFileHandler(args.dir)];

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

  return await new Promise<void>((resolve) => {
    server
      .listen(args.port, args.host, () => {
        console.log(
          `
${"-".repeat(50)}
Server Listen On  : ${args.host}:${args.port}
Static Files Root : ${args.dir}
${"-".repeat(50)}`.trimStart()
        );
      })
      .on("close", () => {
        resolve();
      });
  });
}

const problem = defineCommand({
  command: "preview",
  describe: "generate preview server",
  builder,
  handler,
});

export async function main() {
  yargs
    .locale("en")
    .help()
    .alias("h", "help")
    .command({ ...problem, aliases: "$0" })
    .parse();
}

export default problem;

main();
