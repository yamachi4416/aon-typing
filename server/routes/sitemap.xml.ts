import { routes } from "~/nuxt.config";

export default defineEventHandler(({ res }) => {
  res.setHeader("Content-Type", "text/xml");

  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl as string;
  const urlset = [...new Set(["/", ...routes()])]
    .filter((route) => !/\.\w+$/.test(route))
    .map((route) => `${baseUrl}${route}`)
    .sort();

  return `
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlset
  .map((url) =>
    `
  <url>
    <loc>${url}</loc>
  </url>`.replace(/^\n/, "")
  )
  .join("\n")}
</urlset>`.trim();
});
