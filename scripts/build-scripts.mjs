import esbuild from "esbuild";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { default as yargs } from "yargs";

/**
 * @param {Array<esbuild.BuildOptions & { name: string }>} options
 */
function defineBuilders(...options) {
  const basedir = dirname(fileURLToPath(import.meta.url));
  const builders = options.reduce((b, { name, ...option }) => {
    return {
      ...b,
      [name]: () =>
        esbuild.build({
          outdir: resolve(basedir, "dist"),
          entryPoints: [resolve(basedir, "src", `${name}.ts`)],
          bundle: true,
          platform: "node",
          ...option,
        }),
    };
  }, {});

  return {
    ...builders,
    all() {
      return Promise.all(
        Object.keys(builders)
          .filter((k) => k !== "all" && typeof builders[k] === "function")
          .map(async (k) => builders[k]())
      );
    },
  };
}

const builders = defineBuilders(
  {
    name: "gen-problem",
    external: ["yargs"],
  },
  {
    name: "aozora-uta-dl",
    external: ["yargs", "jsdom"],
  },
  {
    name: "preview-server",
    external: ["yargs"],
  }
);

yargs(process.argv.splice(2))
  .command(
    ["$0 [build]"],
    "",
    (yargs) =>
      yargs.positional("build", {
        choices: Object.keys(builders),
        default: "all",
      }),
    (argv) => builders[argv.build]()
  )
  .help()
  .alias("h", "help").argv;
