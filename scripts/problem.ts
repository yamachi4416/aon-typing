import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { yargsFailHandler } from './lib/util'
import aozoraUtaDL from './problem/aozora-uta-dl'
import ekiCorporationsDL from './problem/eki-corporations-dl'
import ekiListProblems from './problem/eki-ls-problems'
import ekiWordDL from './problem/eki-word-dl'
import ekiWordsDL from './problem/eki-words-dl'
import generate from './problem/generate'

yargs(hideBin(process.argv))
  .locale('en')
  .fail(yargsFailHandler)
  .command(generate)
  .command(aozoraUtaDL)
  .command(ekiListProblems)
  .command(ekiWordDL)
  .command(ekiWordsDL)
  .command(ekiCorporationsDL)
  .demandCommand(1)
  .strictCommands()
  .help()
  .config()
  .alias('h', 'help')
  .parse()
