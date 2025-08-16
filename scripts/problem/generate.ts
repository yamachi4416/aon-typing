import fs from 'node:fs/promises'
import path from 'node:path'
import { toTypeJapaneseChars } from '~~/libs/TypingUtil'
import type {
  ProblemDetail,
  ProblemListItem,
  ProblemTagSummary,
  RailwayCorporation,
} from '~~/types/problems'
import { isPathExists, readJson, writeJson } from '../_util'
import { defineCommand } from '../_util/cli'

type ProblemDetailData = Omit<ProblemDetail, 'tags'> & { tags: string[] }

async function listJsonFiles(dir: string) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  return files
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.resolve(dir, entry.name))
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

  const tags = await readJson<
    Record<string, { id: string, count?: number, problems: ProblemListItem[] }>
  >(tagsFile, {})

  let tagId = Object.values(tags).length + 1
  Object.values(tags).forEach((tag) => (tag.problems = []))

  const problems = await Promise.all(
    (await listJsonFiles(path.join(dataDir, 'problems'))).map(async (file) => {
      const dataObj = await readJson<ProblemDetailData>(file)

      const problem: ProblemDetail = {
        ...{ id: path.basename(file, '.json') },
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

      const dist = path.resolve(problemsDist, path.basename(file))
      await writeJson(dist, problem)

      return {
        ...problem,
        birthtime: (await fs.stat(file)).birthtimeMs,
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
        chars: p.words.reduce((s, { word }) => s + word.length, 0),
        tags: p.tags || [],
      }

      problem.tags.forEach(({ name }) => tags[name]!.problems.push(problem))

      return problem
    }),
  })

  await fs.rm(tagsDist, { recursive: true }).catch(() => {})
  await fs.mkdir(tagsDist, { recursive: true })

  const tagSummary = await Promise.all(
    Object.keys(tags).map(async (name) => {
      const { id, problems } = tags[name]!
      await writeJson(path.join(tagsDist, `${id}.json`), { id, name, problems })
      return { id, name, count: problems.length } satisfies ProblemTagSummary
    }),
  )

  await writeJson(
    tagsFile,
    Object.fromEntries(
      tagSummary
        .sort((a, b) => (a.id < b.id ? -1 : 1))
        .map(({ name, id, count }) => [name, { id, count }]),
    ),
  )

  await writeJson(newProblemsFile, async () => {
    const getCompareByExists = async () => {
      if (!(await isPathExists(newProblemsFile))) return () => 0
      const problems = await readJson<{ id: string }[]>(newProblemsFile)
      const indexMap = new Map(problems.map(({ id }, i) => [id, i + 1]))
      return (a: string, b: string) =>
        (indexMap.get(a) ?? -Number.MAX_SAFE_INTEGER)
        - (indexMap.get(b) ?? -Number.MAX_SAFE_INTEGER)
    }

    const compareByExists = await getCompareByExists()

    return problems
      .toSorted(
        (a, b) => compareByExists(a.id, b.id)
          || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          || b.birthtime - a.birthtime,
      )
      .map(({ id, title, type, words, tags = [] }) => ({
        id,
        title,
        type,
        words: words.length,
        chars: words.reduce((s, { word }) => s + word.length, 0),
        tags,
      }))
  })

  await fs.rm(railwayDist, { recursive: true }).catch(() => {})
  await fs.mkdir(railwayDist, { recursive: true })
  await writeJson(railwayCorporationsFile, async () => {
    const corporations = await readJson<RailwayCorporation[]>(
      path.join(dataDir, 'railway', 'corporations.json'),
    )

    const lineMap = new Map<string, { id: string, count: number }>()
    for (const { id, optional: { cd: cds = [] } = {} } of problems) {
      if (!id.startsWith('1010')) continue
      for (const cd of cds) {
        const exists = lineMap.get(cd)
        const line = { id, count: cds.length }
        if (!exists || line.count < exists.count) {
          lineMap.set(cd, line)
        }
      }
    }

    return corporations.map(({ operationLines, ...corporation }) => ({
      ...corporation,
      operationLines: operationLines.map((line) => ({
        id: lineMap.get(line.code)?.id,
        ...line,
      })),
    }))
  })
}

export default defineCommand({
  meta: {
    name: 'generate',
    description: 'typing problem json sets',
  },
  args: {
    dataDir: {
      alias: 'i',
      type: 'string',
      description: 'input data directory',
      required: true,
    },
    apiDir: {
      alias: 'o',
      type: 'string',
      description: 'output directory',
      required: true,
    },
  },
  async run({ args }) {
    await generateProblemData(args)
  },
})
