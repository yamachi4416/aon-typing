import * as path from "path";
import * as fs from "fs";
import * as jaChars from "../libs/TypingJapaneseChars";

const listJsonFiles = (dir) => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.resolve(dir, entry.name));
};

const generateProblemData = (dataDir, apiDir) => {
  const problemsDist = path.resolve(apiDir, "problems");

  if (fs.existsSync(problemsDist)) {
    fs.rmSync(problemsDist, { recursive: true });
  }
  fs.mkdirSync(problemsDist, { recursive: true });

  const tagsFile = path.join(apiDir, "tags.json");
  const tags = fs.existsSync(tagsFile)
    ? JSON.parse(String(fs.readFileSync(tagsFile)))
    : {};
  let tagId = Object.values(tags).length + 1;
  Object.values(tags).forEach((m: any) => {
    m.problems = [];
  });

  const problems = listJsonFiles(dataDir).map((p) => {
    const dataObj = JSON.parse(String(fs.readFileSync(p)));
    const problem = {
      id: path.basename(p, ".json"),
      ...dataObj,
    };

    if (problem.type === "japanese") {
      for (const word of problem.words) {
        word.word = jaChars.typeJapaneseChars(word.info2);
      }
    }

    problem.tags = problem.tags.map((name) => {
      if (!tags[name]) {
        tags[name] = {
          id: ("" + tagId++).padStart(5, "0"),
          problems: [],
        };
      }

      return { id: tags[name].id, name };
    });

    const dist = path.resolve(problemsDist, path.basename(p));
    fs.writeFileSync(dist, JSON.stringify(problem, null, 2));

    problem.stat = fs.statSync(p);

    return problem;
  });

  const summary = {
    problems: problems.map((p) => {
      const problem = {
        id: p.id,
        title: p.title,
        type: p.type,
        words: p.words.length,
        chars: p.words.reduce((s, w) => s + w.word.length, 0),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        tags: p.tags || [],
      };

      problem.tags.forEach((m) => {
        tags[m.name].problems.push(problem);
      });

      return problem;
    }),
  };

  fs.writeFileSync(
    path.join(apiDir, "problems.json"),
    JSON.stringify(summary, null, 2)
  );

  const tagsDist = path.resolve(apiDir, "tags");

  if (fs.existsSync(tagsDist)) {
    fs.rmSync(tagsDist, { recursive: true });
  }
  fs.mkdirSync(tagsDist, { recursive: true });

  const tagSummary = {};
  for (const tagName of Object.keys(tags)) {
    const tag = tags[tagName];
    tagSummary[tagName] = {
      id: tag.id,
      count: tag.problems.length,
    };
    const tagProblemsFile = path.join(tagsDist, `${tag.id}.json`);
    fs.writeFileSync(
      tagProblemsFile,
      JSON.stringify(
        {
          id: tag.id,
          name: tagName,
          problems: tag.problems,
        },
        null,
        2
      )
    );
  }

  fs.writeFileSync(tagsFile, JSON.stringify(tagSummary, null, 2));

  const newProblems = Array.from(problems)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ||
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() ||
        b.stat.birthtimeMs - a.stat.birthtimeMs
    )
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      words: p.words.length,
      chars: p.words.reduce((s, w) => s + w.word.length, 0),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      tags: p.tags || [],
    }));

  fs.writeFileSync(
    path.join(apiDir, "newProblems.json"),
    JSON.stringify(newProblems, null, 2)
  );
};

const main = () => {
  const args = process.argv.slice(2);

  if (args.length) {
    const dirname = path.dirname(__filename);
    const apiDir = path.resolve(dirname, "..", "assets", "api");
    const dataDir = args[0];
    generateProblemData(dataDir, apiDir);
  }
};

main();
