import fs from 'node:fs/promises'
import path from 'node:path'
import { format as prettier } from 'prettier'
import { toTypeJapaneseChars } from '~~/libs/TypingUtil'
import { isFunction } from '~~/libs/Util'
import type {
  ProblemDetail,
  ProblemListItem,
  ProblemTagSummary,
  RailwayCorporation,
  RailwayProblemDetail,
  TagInfo,
} from '~~/types/problems'
import { defineCommand, isPathExists } from '../lib/util'

type ProblemDetailData = Omit<ProblemDetail, 'tags'> & { tags: string[] }

async function listJsonFiles(dir: string) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  return files
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.resolve(dir, entry.name))
}

async function writeJson(file: string, input: unknown) {
  const data = isFunction<() => Promise<void>>(input) ? await input() : input
  await fs.writeFile(
    file,
    await prettier(JSON.stringify(data), {
      parser: 'json',
    }),
  )
}

async function generateProblemData({
  dataDir,
  apiDir,
}: {
  dataDir: string
  apiDir: string
}) {
  const problemsDist = path.resolve(apiDir, 'problems')
  const problemsFile = path.join(apiDir, 'problems.json')
  const newProblemsFile = path.join(apiDir, 'newProblems.json')

  const tagsFile = path.join(apiDir, 'tags.json')
  const tagsDist = path.resolve(apiDir, 'tags')

  const railwayDist = path.join(apiDir, 'railway')
  const railwayCorporationsFile = path.join(railwayDist, 'corporations.json')

  await fs.rm(problemsDist, { recursive: true }).catch(() => {})
  await fs.mkdir(problemsDist, { recursive: true })

  const tags: Record<
    string,
    { id: string; count?: number; problems: ProblemListItem[] }
  > = await fs
    .readFile(tagsFile, { flag: 'r' })
    .then((buf) => JSON.parse(buf.toString()))
    .catch(() => ({}))

  let tagId = Object.values(tags).length + 1
  Object.values(tags).forEach((m) => {
    m.problems = []
  })

  const problems = await Promise.all(
    (await listJsonFiles(path.join(dataDir, 'problems'))).map(async (p) => {
      const dataObj: ProblemDetailData = JSON.parse(
        (await fs.readFile(p)).toString(),
      )

      const problem: ProblemDetail = {
        ...{ id: path.basename(p, '.json') },
        ...dataObj,
        tags: [],
      }

      if (problem.type === 'japanese') {
        for (const word of problem.words) {
          word.word = toTypeJapaneseChars(word.info2)
        }
      }

      problem.tags = dataObj.tags.map((name) => {
        if (!tags[name]) {
          tags[name] = {
            id: String(tagId++).padStart(5, '0'),
            problems: [],
          }
        }

        return { id: tags[name].id, name }
      })

      const dist = path.resolve(problemsDist, path.basename(p))
      await writeJson(dist, problem)

      return {
        ...problem,
        birthtime: (await fs.stat(p)).birthtimeMs,
      }
    }),
  )

  await writeJson(problemsFile, {
    problems: problems.map((p) => {
      const problem: ProblemListItem = {
        id: p.id,
        title: p.title,
        type: p.type,
        words: p.words.length,
        chars: p.words.reduce<number>(
          (s, w: { word: string }) => s + w.word.length,
          0,
        ),
        tags: p.tags || [],
      }

      problem.tags.forEach((m) => {
        tags[m.name]!.problems.push(problem)
      })

      return problem
    }),
  })

  await fs.rm(tagsDist, { recursive: true }).catch(() => {})
  await fs.mkdir(tagsDist, { recursive: true })

  const tagSummary: ProblemTagSummary[] = await Promise.all(
    Object.keys(tags).map(async (tagName) => {
      const tag = tags[tagName]!
      const tagInfo: TagInfo = {
        id: tag.id,
        name: tagName,
        problems: tag.problems,
      }

      await writeJson(path.join(tagsDist, `${tag.id as string}.json`), tagInfo)

      return {
        name: tagName,
        id: tag.id,
        count: tag.problems.length,
      }
    }),
  )

  await writeJson(
    tagsFile,
    tagSummary
      .sort((a, b) => (a.id < b.id ? -1 : 1))
      .reduce<Record<string, { id: string; count: number }>>(
        (summary, { name, id, count }) => ({
          ...summary,
          [name]: { id, count },
        }),
        {},
      ),
  )

  const compareNewProblemsByExists = await (async () => {
    if (await isPathExists(newProblemsFile)) {
      const buffer = await fs.readFile(newProblemsFile)
      const problems = JSON.parse(buffer.toString()) as { id: string }[]
      const indexMap = new Map(problems.map(({ id }, i) => [id, i + 1]))
      return (a: string, b: string) => {
        const ai = indexMap.get(a)
        const bi = indexMap.get(b)
        if (ai && bi) return ai - bi
        if (!ai) return -1
        if (!bi) return 1
        return 0
      }
    }
    return () => 0
  })()

  await writeJson(
    newProblemsFile,
    problems
      .sort(
        (a, b) =>
          compareNewProblemsByExists(a.id, b.id) ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ||
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() ||
          b.birthtime - a.birthtime,
      )
      .map((p) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        words: p.words.length,
        chars: p.words.reduce(
          (s: number, w: { word: string }) => s + w.word.length,
          0,
        ),
        tags: p.tags || [],
      })),
  )

  await fs.rm(railwayDist, { recursive: true }).catch(() => {})
  await fs.mkdir(railwayDist, { recursive: true })
  await writeJson(railwayCorporationsFile, async () => {
    const corporations = JSON.parse(
      await fs
        .readFile(path.join(dataDir, 'railway', 'corporations.json'))
        .then((b) => b.toString()),
    ) as RailwayCorporation[]
    const railwayProblemMap = new Map<string, string>(
      problems
        .filter(({ id }) => id.startsWith('1010'))
        .flatMap(
          (p: RailwayProblemDetail) =>
            p.optional?.cd?.map((cd: string) => [cd, p.id]) ?? [],
        ),
    )
    return corporations.map((corporation) => {
      corporation.operationLines = corporation.operationLines.map((line) => {
        return {
          id: railwayProblemMap.get(line.code) ?? undefined,
          ...line,
        }
      })
      return corporation
    })
  })
}

export default defineCommand({
  command: 'generate',
  describe: 'typing problem json sets',
  builder(yargs) {
    return yargs
      .options('data-dir', {
        alias: 'i',
        type: 'string',
        description: 'input data directory',
        demandOption: true,
        requiresArg: true,
      })
      .options('api-dir', {
        alias: 'o',
        type: 'string',
        description: 'output directory',
        demandOption: true,
        requiresArg: true,
      })
  },
  async handler({ dataDir, apiDir }) {
    await generateProblemData({
      dataDir,
      apiDir,
    })
  },
})
