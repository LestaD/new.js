const chalk = require('chalk')

const Package = require('../package.json')
const { Logger } = require('./logger')
const { QuestionManager } = require('./question-manager')


class Core {
  /**
   * @param {Object} options
   */
  constructor(options) {
    this.name = Package.name
    this.targetDir = ''

    this.packageInfo = null
    this.dependencies = {}
    this.devDependencies = {}

    this.log = new Logger(this.name, options.verbose)
    this.question = new QuestionManager(this)

    /**
     * @type {{ action: Function, name: string }[]}
     */
    this.actionList = []
  }

  /**
   * Update target dir
   * @param {string} dir
   */
  setTargetDir(dir) {
    this.log.verbose('setTargetDir()', dir)
    this.targetDir = dir
  }

  /**
   * Update info about package
   * @param {Object} object
   */
  setPackageInfo(object) {
    // eslint-disable-next-line no-magic-numbers
    this.log.verbose('setPackageInfo()', JSON.stringify(object, 2, 2))
    this.packageInfo = object
  }

  /**
   * Add action to queue
   * @param {Function} action
   * @param {string} about
   * @return {number}
   */
  pushAction(name, action) {
    return this.actionList.push({ action, name })
  }

  /**
   * Execute actions in list
   * @return {Promise<void>}
   */
  /* eslint-disable guard-for-in */
  async enqueueActions() {
    for (const index in this.actionList) {
      const { action, name } = this.actionList[index]

      try {
        this.log.info(name)
        await action(this)
      }
      catch (error) {
        this.log.error(`Task failed ${error.message}`, error.stack)
        return false
      }
    }

    return true
  }
  /* eslint-enable guard-for-in */
}

module.exports = {
  Core,
}
