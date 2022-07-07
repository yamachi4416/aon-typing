import { defineCommand, fmtDate, prompt } from "../lib/util";
import path from "node:path";
import fs from "node:fs";
import { fetchOperationLine, fetchStations } from "./ekispert/api";
import prettier from "prettier";

type Data = {
  title: string;
  type: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  optional?: {
    cd: string[] | string;
  };
  words: { info: string; info2: string }[];
};

export default defineCommand({
  command: "eki-word-dl",
  describe: "eki word data download from api",
  builder: (argv) =>
    argv
      .option("data-dir", {
        alias: "i",
        type: "string",
        describe: "input data directory",
        demandOption: true,
        requiresArg: true,
      })
      .option("ekispert-api-key", {
        alias: "k",
        type: "string",
        describe: "api key",
        demandOption: true,
        requiresArg: true,
      })
      .option("operation-line-code", {
        alias: "c",
        type: "array",
        describe: "operation Line Codes",
        demandOption: true,
        requiresArg: true,
      })
      .option("dry-run", {
        type: "boolean",
        describe: "dry run show stdout",
        demandOption: false,
        requiresArg: false,
      })
      .option("overwrite", {
        alias: "f",
        type: "boolean",
        describe: "overwrite if exists",
        demandOption: false,
        requiresArg: false,
      })
      .coerce("operation-line-code", (cds) => String(cds).split(",")),
  handler: async ({
    dataDir,
    operationLineCode: cds,
    dryRun,
    ekispertApiKey: key,
    overwrite,
  }) => {
    const id = `1010${cds[0].padStart(3, "0")}`;
    const file = path.join(dataDir, `${id}.json`);
    const date = fmtDate(({ yyyy, MM, dd }) => `${yyyy}-${MM}-${dd}`);

    const data = await fs.promises
      .readFile(file)
      .then((buf) => JSON.parse(buf.toString()) as Data)
      .catch(
        () =>
          ({
            title: "",
            type: "japanese",
            tags: ["日本語", "地理", "駅名"],
            createdAt: date,
            updatedAt: date,
            optional: { cd: cds.length === 1 ? cds[0] : cds },
            words: [{ info: "", info2: "" }],
          } as Data)
      );

    if (!data.title) {
      const titles = await Promise.all(
        cds.map((code) =>
          fetchOperationLine({ key, code }).then((op) => op.Line[0]?.Name)
        )
      );
      data.title = `${titles[0]}の駅いちらん`;
    }

    data.words = await fetchStations({
      key,
      operationLineCodes: cds,
    }).then(({ words }) => words);

    const json = prettier.format(JSON.stringify(data), {
      parser: "json",
    });

    if (dryRun) {
      console.log(data.title, file);
      console.log(data);
    } else {
      if (!overwrite) {
        if (
          await fs.promises
            .access(file, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false)
        ) {
          for (;;) {
            const ans = await prompt(
              `file "${file}" is exists.\noverwrite? [Y/n] > `
            );
            if (ans === "Y") break;
            if (ans === "n" || ans === "N") return;
          }
        }
      }
      await fs.promises.writeFile(file, json);
      console.log(data.title, file);
    }
  },
});
