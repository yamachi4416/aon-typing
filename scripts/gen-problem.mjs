import path from 'path'
import fs from 'fs'
import url from 'url'
import jaChars from '../libs/TypingJapaneseChars.mjs'

const listJsonFiles = (dir) => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.resolve(dir, entry.name))
}

const generateProblemData = (dataDir, apiDir) => {
  const problemsDist = path.resolve(apiDir, 'problems', 'details')

  if (fs.existsSync(problemsDist)) {
    fs.rmSync(problemsDist, { recursive: true })
  }
  fs.mkdirSync(problemsDist, { recursive: true })

  const tagsFile = path.join(apiDir, 'tags.json')
  const tags = fs.existsSync(tagsFile)
    ? JSON.parse(fs.readFileSync(tagsFile))
    : {}
  let tagId = Object.values(tags).length + 1
  Object.values(tags).forEach((m) => {
    m.problems = []
  })

  const problems = listJsonFiles(dataDir).map((p) => {
    const dataObj = JSON.parse(fs.readFileSync(p))
    const problem = {
      id: path.basename(p, '.json'),
      ...dataObj,
    }

    if (problem.type === 'japanese') {
      for (const word of problem.words) {
        word.word = jaChars.typeJapaneseChars(word.info2)
      }
    }

    problem.tags = problem.tags.map((name) => {
      if (!tags[name]) {
        tags[name] = {
          id: ('' + tagId++).padStart(5, '0'),
          problems: [],
        }
      }

      return { id: tags[name].id, name }
    })

    const dist = path.resolve(problemsDist, path.basename(p))
    fs.writeFileSync(dist, JSON.stringify(problem, null, 2))

    problem.stat = fs.statSync(p)

    return problem
  })

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
      }

      problem.tags.forEach((m) => {
        tags[m.name].problems.push(problem)
      })

      return problem
    }),
  }

  fs.writeFileSync(
    path.join(apiDir, 'problems.json'),
    JSON.stringify(summary, null, 2)
  )

  const tagsDist = path.resolve(apiDir, 'tags')

  if (fs.existsSync(tagsDist)) {
    fs.rmSync(tagsDist, { recursive: true })
  }
  fs.mkdirSync(tagsDist, { recursive: true })

  const tagSummary = {}
  for (const tagName of Object.keys(tags)) {
    const tag = tags[tagName]
    tagSummary[tagName] = {
      id: tag.id,
      count: tag.problems.length,
    }
    const tagProblemsFile = path.join(tagsDist, `${tag.id}.json`)
    fs.writeFileSync(
      tagProblemsFile,
      JSON.stringify({
        id: tag.id,
        name: tagName,
        problems: tag.problems,
      })
    )
  }

  fs.writeFileSync(tagsFile, JSON.stringify(tagSummary, null, 2))

  const newProblems = Array.from(problems)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime() ||
        a.stat.birthtimeMs - b.stat.birthtimeMs
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
    }))
  fs.writeFileSync(
    path.join(apiDir, 'newProblems.json'),
    JSON.stringify(newProblems, null, 2)
  )
}

const main = () => {
  const args = process.argv.slice(2)

  if (args.length) {
    const dirname = path.dirname(url.fileURLToPath(import.meta.url))
    const apiDir = path.resolve(dirname, '..', 'static', 'api')
    const dataDir = args[0]
    generateProblemData(dataDir, apiDir)
  }
}

main()
