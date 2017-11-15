const chalk = require('chalk')


class Logger {
  constructor(name, verbose = false) {
    this.name = name
    this.verboseMode = verbose
  }

  /**
   * Log to console
   * @param {string[]} args
   */
  info(...args) {
    // eslint-disable-next-line no-console
    console.log(chalk.green(`[${this.name}]`), ...args)
  }

  /**
   * Prints red
   * @param {string} reason
   * @param {string[]} args
   */
  error(reason, ...args) {
    // eslint-disable-next-line no-console
    console.log(chalk.red(`[${this.name}] ${reason}`), ...args)
  }

  /**
   * Print log only where --verbose or -V is set
   * @param {string[]} args
   */
  verbose(...args) {
    if (this.verboseMode) {
      // eslint-disable-next-line no-console
      console.log(chalk.gray(`[${this.name} verbose]`), chalk.gray(...args))
    }
  }
}

module.exports = {
  Logger,
}
