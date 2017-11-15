const optimist = require('optimist')
const Package = require('../package')

/* eslint-disable unicorn/no-process-exit */

module.exports =
function libCommandLine(defaults) {
  const args = optimist
    .usage('Usage: new [options]\n       new.js [options]\n       npm-new [options]')

    .describe('h', 'Show help and usage information')
    .alias('h', 'help')
    .boolean('h')

    .describe('v', 'Show new.js version')
    .alias('v', 'ver')
    .boolean('v')

    .describe('f', 'Non interactive, use defaults')
    .alias('f', 'force')
    .boolean('f')

    .describe('name', 'Set package name')
    .string('name')

    .describe('version', 'Set initial package version')
    .string('version')
    .default('version', defaults.version)

    .describe('repo', 'Git repository (lestad/new.js)')
    .string('repo')

    .describe('bin', 'Create binary file ./bin/$name.js')
    .boolean('bin')
    .alias('bin', 'b')
    .default('bin', defaults.bin)

    .describe('main', 'Create library main file')
    .boolean('main')
    .alias('main', 'm')
    .default('main', defaults.main)

    .describe('test', 'Create dummy test file')
    .boolean('test')
    .alias('test', 't')
    .default('test', defaults.test)

    .describe('lic', 'Select license')
    .alias('lic', 'license')
    .default('lic', defaults.license)

    .describe('git', 'Initialize git repository')
    .boolean('git')
    .alias('git', 'g')

    .argv


  if (args.help) {
    optimist.showHelp()
    process.exit(0)
  }

  if (args.ver) {
    console.log(`${Package.name} v${Package.version}`) // eslint-disable-line no-console
    process.exit(0)
  }

  return args
}
