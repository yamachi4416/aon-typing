import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { defineCommand } from "../lib/util";

type Data = {
  id: string;
  file: string;
  title: string;
  tags: string[];
  optional?: {
    cd: string[] | string;
  };
};

export default defineCommand({
  command: "ls-eki",
  describe: "list eki info",
  builder: (argv) =>
    argv
      .option("in", {
        alias: "i",
        type: "string",
        describe: "input data directory",
        demandOption: true,
        requiresArg: true,
      })
      .option("stdout", {
        alias: "s",
        type: "boolean",
        describe: "output stdout",
        default: false,
      }),
  async handler(args) {
    const dir = path.resolve(args.in);
    const files = await readdir(args.in, { withFileTypes: true }).then(
      (items) =>
        items
          .filter((item) => item.isFile())
          .map((item) => path.join(dir, item.name))
    );

    const dataset = await Promise.all(
      files.map((file) =>
        readFile(file, { flag: "r" }).then(
          (b) =>
            ({
              id: path.basename(file, path.extname(file)),
              file,
              ...JSON.parse(b.toString()),
            } as Data)
        )
      )
    );

    const lines = dataset
      .filter((data) => data.tags.includes("駅名"))
      .sort((a, b) => Number(a.id) - Number(b.id))
      .map((d) =>
        [d.id, d.title, String(d.optional?.cd ?? ""), d.file].join("\t")
      );

    if (args.stdout) {
      console.log(lines.join("\n"));
    } else {
      const outdir = await mkdtemp(path.join(tmpdir(), "ls-eki"));
      const outfile = path.resolve(outdir, "out.tsv");
      await writeFile(outfile, lines.join("\n"));
      console.log(`write: ${outfile}`);
    }
  },
});
