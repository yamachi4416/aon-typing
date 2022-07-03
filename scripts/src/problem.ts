import generate from "./problem/generate";
import aozoraUtaDL from "./problem/aozora-uta-dl";
import ekiListProblems from "./problem/eki-ls-problems";
import ekiWordsDL from "./problem/eki-words-dl";
import yargs from "yargs";

yargs
  .locale("en")
  .command(generate)
  .command(aozoraUtaDL)
  .command(ekiListProblems)
  .command(ekiWordsDL)
  .demandCommand(1)
  .strictCommands()
  .help()
  .config()
  .alias("h", "help").argv;
