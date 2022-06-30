import esbuild from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import yargs from "yargs";

(async function main() {
  const basedir = path.dirname(url.fileURLToPath(import.meta.url));
  const outdir = path.resolve(basedir, "dist");
  const srcdir = path.resolve(basedir, "src");

  const scripts = await fs
    .readdir(srcdir, { withFileTypes: true })
    .then((items) => items.filter((item) => item.isFile()));

  const builders = scripts.reduce(
    (builders, script) => ({
      ...builders,
      [path.basename(script.name, path.extname(script.name))]: {
        outdir,
        entryPoints: [path.resolve(srcdir, script.name)],
        bundle: true,
        platform: "node",
        external: ["yargs", "jsdom"],
      },
    }),
    {}
  );

  yargs(process.argv.splice(2))
    .locale("en")
    .command(
      ["$0 [build..]"],
      "build script file",
      (yargs) =>
        yargs.positional("build", {
          choices: ["all", ...Object.keys(builders)],
          describe: "select build target",
          default: ["all"],
        }),
      async (argv) => {
        const build = [...new Set(argv.build)];
        const targets = build.includes("all")
          ? Object.values(builders)
          : build.map((name) => builders[name]);
        return await Promise.all(
          targets.map((builder) =>
            esbuild.build(builder).then((result) =>
              console.log({
                entryPoints: builder.entryPoints,
                ...result,
              })
            )
          )
        );
      }
    )
    .command("clean", "clean outdir", {}, async (argv) => {
      await fs.rm(outdir, { recursive: true });
    })
    .strictCommands()
    .help()
    .alias("h", "help").argv;
})();
