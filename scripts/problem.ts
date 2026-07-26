import { defineCommand, runMain } from './_util/cli.ts'
import aozoraUtaDL from './problem/aozora-uta-dl.ts'
import ekiCorporationsDL from './problem/eki-corporations-dl.ts'
import ekiLsProblems from './problem/eki-ls-problems.ts'
import ekiWordDL from './problem/eki-word-dl.ts'
import ekiWordsDL from './problem/eki-words-dl.ts'
import generate from './problem/generate.ts'

const command = defineCommand({
  meta: {
    name: 'problem',
    description: 'problem utilities',
  },
  subCommands: {
    generate,
    aozoraUtaDL,
    ekiCorporationsDL,
    ekiLsProblems,
    ekiWordDL,
    ekiWordsDL,
  },
})

runMain(command)
