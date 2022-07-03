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

function joinWords(pages: Data["words"][]) {
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
  return words;
}

async function loadInfoData({ file }: { file: string }) {
  const content = await readFile(file, { flag: "r" });
  return {
    id: path.basename(file, path.extname(file)),
    file,
    text: content.toString(),
    data: JSON.parse(content.toString()),
  } as InfoData;
}

async function fetchWords({
  infoData,
  key,
}: {
  infoData: InfoData;
  key: string;
}) {
  const urlbase = `https://api.ekispert.jp/v1/json/station?key=${key}`;
  const cds = String(infoData.data.optional.cd).split(",");
  const fetchs = cds.map(async (cd) => {
    const page = await httpFetch(`${urlbase}&operationLineCode=${cd}`);
    const points = JSON.parse(page.data.toString()).ResultSet.Point as any[];
    return points.map((p: any) => ({
      info: p.Station.Name.replace(`(${p.Prefecture.Name})`, "") as string,
      info2: p.Station.Yomi as string,
    }));
  });

  return joinWords(await Promise.all(fetchs));
}

async function outProcess({
  infoData,
  dryRun,
}: {
  infoData: InfoData;
  dryRun: boolean;
}) {
  const { id, file, text, data } = infoData;
  const json = prettier.format(JSON.stringify(data), {
    parser: "json",
  });

  if (dryRun) {
    console.log(`${text === json ? "-" : "+"} ${id} ${data.title} ${file}`);
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
}

export default defineCommand({
  command: "eki-words-dl",
  describe: "eki words data download from api",
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
      .option("pattern", {
        alias: "P",
        type: "string",
        description: "target file pattern",
        demandOption: false,
        requiresArg: true,
      })
      .option("dry-run", {
        type: "boolean",
        describe: "dry run show stdout",
        demandOption: false,
        requiresArg: false,
      })
      .coerce("pattern", (p) => RegExp(p)),
  handler: async ({ dataDir, pattern, dryRun, ekispertApiKey: key }) => {
    (await readdir(dataDir, { withFileTypes: true }))
      .filter((item) => item.isFile())
      .filter((item) => (pattern ? pattern.test(item.name) : true))
      .map((item) => path.join(dataDir, item.name))
      .map(async (file) => {
        const infoData = await loadInfoData({ file });
        if (infoData.data.tags.includes("駅名") && infoData.data.optional?.cd) {
          infoData.data.words = await fetchWords({ infoData, key });
          outProcess({ infoData, dryRun });
        }
      });
  },
});
