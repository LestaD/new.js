#!/usr/bin/env node

const chalk = require('chalk')
const { Core } = require('../lib/core')

const { getArguments } = require('../lib/command-line')
const { initialCheck } = require('../lib/initial-check')


async function main() {
  try {
    const args = getArguments()
    const core = new Core(args)

    const wrapAborted = (result) => {
      if (!result) {
        core.log.info('Aborted')
        process.exit(0)
      }
    }

    core.log.info('Let\'s get started!\n')

    wrapAborted(await initialCheck(core))

    await core.enqueueActions()
  }
  catch (error) {
    /* eslint-disable no-console */
    console.error(chalk.red(error.message))
    console.error(chalk.yellow(error.stack))
    /* eslint-enable no-console */
    process.exit(1)
  }
}

main()
