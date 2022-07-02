import generate from "./problem/generate";
import aozoraUtaDL from "./problem/aozora-uta-dl";
import lsEkiProblems from "./problem/ls-eki-problems"
import yargs from "yargs";

yargs
  .locale("en")
  .command(generate)
  .command(aozoraUtaDL)
  .command(lsEkiProblems)
  .demandCommand(1)
  .strictCommands()
  .help()
  .alias("h", "help").argv;
