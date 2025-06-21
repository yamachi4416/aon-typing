/**
 * @param {string} msg
 * @param {Error} err
 * @param {import('yargs').Argv} yargs
 */
export function yargsFailHandler(msg, err, yargs) {
  if (msg) {
    console.error(msg)
    console.error()
    yargs.showHelp()
  }

  if (err) {
    console.error(err)
  }

  process.exit(1)
}
