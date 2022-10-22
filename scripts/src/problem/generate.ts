import fs from 'node:fs/promises'
import path from 'node:path'
import * as prettier from 'prettier'
import { defineCommand } from '../lib/util'
import { typeJapaneseChars } from '~~/libs/TypingJapaneseChars'

async function listJsonFiles (dir: string) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  return files
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => path.resolve(dir, entry.name))
}

async function writeJson (file: string, data: any) {
  return await fs.writeFile(
    file,
    prettier.format(JSON.stringify(data), {
      parser: 'json'
    })
  )
}

async function generateProblemData ({
  dataDir,
  apiDir
}: {
  dataDir: string
  apiDir: string
}) {
  const problemsDist = path.resolve(apiDir, 'problems')
  const problemsFile = path.join(apiDir, 'problems.json')
  const newProblemsFile = path.join(apiDir, 'newProblems.json')
  const tagsFile = path.join(apiDir, 'tags.json')
  const tagsDist = path.resolve(apiDir, 'tags')

  await fs.rm(problemsDist, { recursive: true }).catch(() => {})
  await fs.mkdir(problemsDist, { recursive: true })

  const tags = await fs
    .readFile(tagsFile, { flag: 'r' })
    .then(buf => JSON.parse(buf.toString()))
    .catch(() => ({}))

  let tagId = Object.values(tags).length + 1
  Object.values(tags).forEach((m: any) => {
    m.problems = []
  })

  const problems = await Promise.all(
    (
      await listJsonFiles(dataDir)
    ).map(async (p) => {
      const dataObj = JSON.parse((await fs.readFile(p)).toString())
      const problem = {
        id: path.basename(p, '.json'),
        ...dataObj
      }

      if (problem.type === 'japanese') {
        for (const word of problem.words) {
          word.word = typeJapaneseChars(word.info2)
        }
      }

      problem.tags = problem.tags.map((name) => {
        if (!tags[name]) {
          tags[name] = {
            id: String(tagId++).padStart(5, '0'),
            problems: []
          }
        }

        return { id: tags[name].id, name }
      })

      const dist = path.resolve(problemsDist, path.basename(p))
      await writeJson(dist, problem)
      problem.stat = await fs.stat(p)

      return problem
    })
  )

  await writeJson(problemsFile, {
    problems: problems.map((p) => {
      const problem = {
        id: p.id,
        title: p.title,
        type: p.type,
        words: p.words.length,
        chars: p.words.reduce((s: number, w: { word: string }) => s + w.word.length, 0),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        tags: p.tags || []
      }

      problem.tags.forEach((m) => {
        tags[m.name].problems.push(problem)
      })

      return problem
    })
  })

  await fs.rm(tagsDist, { recursive: true }).catch(() => {})
  await fs.mkdir(tagsDist, { recursive: true })

  const tagSummary = await Promise.all(
    Object.keys(tags).map(async (tagName) => {
      const tag = tags[tagName]
      await writeJson(path.join(tagsDist, `${tag.id as string}.json`), {
        id: tag.id,
        name: tagName,
        problems: tag.problems
      })
      return {
        name: tagName,
        id: tag.id,
        count: tag.problems.length
      }
    })
  )

  await writeJson(
    tagsFile,
    tagSummary
      .sort((a, b) => (a.id < b.id ? -1 : 1))
      .reduce(
        (summary, { name, id, count }) => ({
          ...summary,
          [name]: { id, count }
        }),
        {}
      )
  )

  await writeJson(
    newProblemsFile,
    problems
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ||
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() ||
          b.stat.birthtimeMs - a.stat.birthtimeMs
      )
      .slice(0, 6)
      .map(p => ({
        id: p.id,
        title: p.title,
        type: p.type,
        words: p.words.length,
        chars: p.words.reduce((s: number, w: { word: string }) => s + w.word.length, 0),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        tags: p.tags || []
      }))
  )
}

export default defineCommand({
  command: 'generate',
  describe: 'typing problem json sets',
  builder (yargs) {
    return yargs
      .options('data-dir', {
        alias: 'i',
        type: 'string',
        description: 'input data directory',
        demandOption: true,
        requiresArg: true
      })
      .options('api-dir', {
        alias: 'o',
        type: 'string',
        description: 'output directory',
        demandOption: true,
        requiresArg: true
      })
  },
  async handler ({ dataDir, apiDir }) {
    await generateProblemData({
      dataDir,
      apiDir
    })
  }
})
