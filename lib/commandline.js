const optimist = require('optimist');

module.exports =
function libCommandLine(defaults) {
  const argv = optimist
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

    .describe('bin', 'Create exec file ./bin/$name.js')
    .boolean('bin')
    .alias('bin', 'b')
    .default('bin', defaults.bin)

    .describe('main', 'Create library main file')
    .boolean('main')
    .alias('main', 'm')
    .default('main', defaults.main)

    .describe('lic', 'Select license')
    .alias('lic', 'license')
    .default('lic', defaults.license)

    .describe('git', 'Initialize git repository')
    .boolean('git')
    .alias('git', 'g')

    .argv;


  if (argv.help) {
    optimist.showHelp();
    process.exit(0);
  }

  if (argv.ver) {
    console.log(`${Package.name} v${Package.version}`);
    process.exit(0);
  }

  return argv;
}
