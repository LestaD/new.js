const optimist = require('optimist')
const Package = require('../package.json')


/* eslint-disable unicorn/no-process-exit */

function getArguments() {
  const cmd = optimist
    .usage('Usage: new [options] [preset]')

    .describe('preset', 'Create with preset')
    .alias('preset', 'p')
    .string('preset')

    .describe('help', 'Show that help')
    .alias('help', 'h')
    .boolean('help')

    .describe('version', 'Show new.js version')
    .alias('version', 'v')
    .boolean('version')

    .describe('verbose', 'Show more logs')
    .alias('verbose', 'V')
    .boolean('verbose')

  const args = cmd.argv

  if (args.help) {
    cmd.showHelp()
    process.exit(0)
  }

  if (args.version) {
    // eslint-disable-next-line no-console
    console.log(`${Package.name}: ${Package.version}`)
    process.exit(0)
  }

  const [targetDir] = args._

  return {
    targetDir,
    preset: args.preset,
    verbose: args.verbose,
    raw: args,
  }
}


module.exports = {
  getArguments,
}
