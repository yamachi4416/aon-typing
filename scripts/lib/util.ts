import http from "http";
import https from "https";

export function optparse() {
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

  return { opts, args };
}

interface HttpRequestOptions {
  method?: string;
  headers?: http.OutgoingHttpHeaders;
  body?: string;
}

interface HttpResponse {
  data: Buffer;
  response: http.IncomingMessage;
}

export async function httpFetch(url: string, options: HttpRequestOptions = {}) {
  return await new Promise<HttpResponse>((resolve, reject) => {
    const h = url.startsWith("https") ? https : http;

    const req = h.request(url, (res) => {
      const buffers = [];
      res.on("data", (buffer) => {
        buffers.push(buffer);
      });
      res.on("end", () => {
        resolve({ data: Buffer.concat(buffers), response: res });
      });
      res.on("error", (error) => reject(error));
    });

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, val]) => {
        req.setHeader(key, val);
      });
    }

    if (!req.getHeader("user-agent")) {
      req.setHeader(
        "user-agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62"
      );
    }

    if (options.body) {
      req.method = options.method?.toUpperCase() ?? "POST";
      req.write(options.body);
    } else {
      req.method = options.method?.toUpperCase() ?? "GET";
    }

    req.end();
  });
}
