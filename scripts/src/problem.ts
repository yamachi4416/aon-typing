import generate from "./problem/generate";
import aozoraUtaDL from "./problem/aozora-uta-dl";
import yargs from "yargs";

yargs
  .locale("en")
  .command(generate)
  .command(aozoraUtaDL)
  .demandCommand(1)
  .strictCommands()
  .help()
  .alias("h", "help").argv;
