import { defineCommand, runMain } from './_util/cli'
import aozoraUtaDL from './problem/aozora-uta-dl'
import ekiCorporationsDL from './problem/eki-corporations-dl'
import ekiLsProblems from './problem/eki-ls-problems'
import ekiWordDL from './problem/eki-word-dl'
import ekiWordsDL from './problem/eki-words-dl'
import generate from './problem/generate'

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
