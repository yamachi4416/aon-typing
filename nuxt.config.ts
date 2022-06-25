import { readFileSync } from "node:fs";
import { defineNuxtConfig } from "nuxt";
import { createResolver } from "@nuxt/kit";
import { NuxtPage } from "@nuxt/schema";
import { NitroConfig } from "nitropack";

const resolver = createResolver(import.meta.url);

export const routes = (() => {
  const { problems } = JSON.parse(
    String(readFileSync("./assets/api/problems.json"))
  ) as { problems: { id: string }[] };

  const tags = Object.values(
    JSON.parse(String(readFileSync("./assets/api/tags.json")))
  ) as { id: string }[];

  return () => [
    "/sitemap.xml",
    "/problems",
    "/game",
    "/game/play",
    "/game/menu",
    "/about",
    "/policy",
    "/contact",
    "/contents/keymap",
    ...problems.map((problem) => `/problems/${problem.id}`),
    ...tags.map((tag) => `/problems/tags/${tag.id}`),
    "/api/problems.json",
    "/api/problems/news.json",
    "/api/tags.json",
    ...problems.map((problem) => `/api/problems/${problem.id}.json`),
    ...tags.map((tag) => `/api/tags/${tag.id}.json`),
  ];
})();

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  components: true,
  css: ["~/assets/css/main.scss"],
  ssr: true,
  target: "static",

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "ja",
      },
      meta: [
        {
          name: "description",
          content: "あぉ～ん タイピングは無料のタイピング練習サイトです。",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        ...googleFont(),
      ],
    },
  },

  runtimeConfig: {
    public: {
      gtagId: process.env.APP_G_TAGID,
      baseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
      contactUrl: process.env.APP_CONTACT_URL || "/api/contact",
    },
  },

  nitro: {
    prerender: {
      routes: routes(),
    },
  },

  hooks: {
    "pages:extend"(pages: NuxtPage[]) {
      pages.push({
        name: "error404",
        path: "/404.html",
        file: resolver.resolve("error.vue"),
      });
    },
    "nitro:config"(config: NitroConfig) {
      config.prerender.routes = config.prerender.routes.filter(
        (route) => route !== "/404" && route !== "/200"
      );
      config.prerender.routes.push("/404.html");
    },
  },
});

function googleFont() {
  return [
    {
      rel: "dns-prefetch",
      href: "https://fonts.gstatic.com/",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com/",
      crossorigin: "",
    },
    {
      rel: "preload",
      as: "style",
      href: "https://fonts.googleapis.com/css2?family=Itim&family=Noto+Sans+JP:wght@400&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Itim&family=Noto+Sans+JP:wght@400&display=swap",
    },
  ];
}
