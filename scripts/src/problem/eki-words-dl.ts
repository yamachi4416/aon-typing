import { defineCommand, httpFetch } from "../lib/util";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";

type Data = {
  title: string;
  tags: string[];
  optional?: {
    cd: string[] | string;
  };
  words: { info: string; info2: string }[];
};

type InfoData = {
  id: string;
  file: string;
  text: string;
  data: Data;
};

export default defineCommand({
  command: "eki-words-dl",
  describe: "eki words data download from api",
  builder: (argv) =>
    argv
      .option("in", {
        alias: "i",
        type: "string",
        describe: "input data directory",
        demandOption: true,
        requiresArg: true,
      })
      .option("key", {
        alias: "k",
        type: "string",
        describe: "api key",
        demandOption: true,
        requiresArg: true,
      })
      .option("pattern", {
        alias: "P",
        type: "string",
        description: "target file pattern",
        demandOption: false,
        requiresArg: true,
      })
      .option("dry", {
        alias: "d",
        type: "boolean",
        describe: "dry run show stdout",
        demandOption: false,
        requiresArg: false,
      }),
  handler: async (args) => {
    const dir = path.resolve(args.in);
    const pattern = args.pattern ? RegExp(args.pattern) : undefined;
    const files = await readdir(args.in, { withFileTypes: true }).then(
      (items) =>
        items
          .filter((item) => item.isFile())
          .filter((item) => (pattern ? pattern.test(item.name) : true))
          .map((item) => path.join(dir, item.name))
    );

    const dataset = await Promise.all(
      files.map((file) =>
        readFile(file, { flag: "r" }).then(
          (b) =>
            ({
              id: path.basename(file, path.extname(file)),
              file,
              text: b.toString(),
              data: JSON.parse(b.toString()),
            } as InfoData)
        )
      )
    );

    const urlbase = `https://api.ekispert.jp/v1/json/station?key=${args.key}`;
    const problems = await Promise.all(
      dataset
        .filter(({ data: { tags } }) => tags.includes("駅名"))
        .filter(({ data: { optional } }) => String(optional.cd ?? ""))
        .map(async (info) => {
          const cds = String(info.data.optional.cd).split(",");
          const pages = await Promise.all(
            cds.map(async (cd) => {
              const page = await httpFetch(
                `${urlbase}&operationLineCode=${cd}`
              );
              const points = JSON.parse(page.data.toString()).ResultSet
                .Point as any[];
              return points.map((p: any) => ({
                info: p.Station.Name.replace(
                  `(${p.Prefecture.Name})`,
                  ""
                ) as string,
                info2: p.Station.Yomi as string,
              }));
            })
          );

          let words = [...pages[0]];

          for (let i = 1; i < pages.length; i++) {
            const page = pages[i];
            const pstart = page.shift();
            const plast = page.pop();
            const wstart = words[0];
            const wlast = words[words.length - 1];
            if (wstart.info === pstart.info) {
              words.unshift(...page, plast);
            } else if (wlast.info === plast.info) {
              words.push(...page, plast);
            } else if (wstart.info === plast.info) {
              words = [pstart, ...page, ...words];
            } else if (pstart.info === wlast.info) {
              words = [...words, ...page, plast];
            } else {
              throw `mismatch stations [${wstart.info}...${wlast.info}] [${pstart.info}...${plast.info}]`;
            }
          }

          info.data.words = words;

          return info;
        })
    );

    await Promise.all(
      problems.map(async ({ id, file, text, data }) => {
        const json = prettier.format(JSON.stringify(data), {
          parser: "json",
        });

        if (args.dry) {
          console.log(
            `${text === json ? "-" : "+"} ${id} ${data.title} ${file}`
          );
          if (text !== json) {
            console.log(json);
          }
        } else {
          if (text === json) {
            console.log(`skip: ${id} ${data.title} ${file}`);
          } else {
            await writeFile(file, json);
            console.log(`write: ${id} ${data.title} ${file}`);
          }
        }
      })
    );
  },
});
