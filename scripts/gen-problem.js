import path from 'path'
import fs from 'fs'
import url from 'url'
import jaChars from '../libs/TypingJapaneseChars.js'

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

    const dist = path.resolve(problemsDist, path.basename(p))
    fs.writeFileSync(dist, JSON.stringify(problem, null, 2))

    return problem
  })

  const summary = {
    problems: problems.map((p) => ({
      id: p.id,
      path: `/${p.id}`,
      title: p.title,
      type: p.type,
      words: p.words.length,
      chars: p.words.reduce((s, w) => s + w.word.length, 0),
    })),
  }

  fs.writeFileSync(
    path.join(apiDir, 'problems.json'),
    JSON.stringify(summary, null, 2)
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
