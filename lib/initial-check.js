const { resolve } = require('path')
const chalk = require('chalk')

const pify = require('pify')
const { existsSync, readFile } = pify(require('fs'))
const mkdirp = pify(require('mkdirp'))

// eslint-disable-next-line no-useless-escape
const packageNameRegexp = /^@?[a-zA-Z][a-zA-Z0-9\-\_\.\s]+[a-zA-Z0-9]$/

const dirNameValidate = value => packageNameRegexp.test(value)
  || 'Please, enter correct directory name'

const dirNameFilter = value => value.replace(/\s+/, '-').toLowerCase()


async function initialCheck(core) {
  const cwd = process.cwd()

  // If user not provided package name in cmd arg ask for it
  if (!core.options.targetDir) {
    const { dirName } = await core.question.input(
      'dirName',
      'Enter package directory name:', {
        validate: dirNameValidate,
        filter: dirNameFilter,
      }
    )
    core.setTargetDir(resolve(cwd, dirName))
  }
  else {
    core.setTargetDir(resolve(cwd, core.options.targetDir))
  }

  const dirExists = existsSync(core.targetDir)

  // Check if target directory exists
  // If no exists ask to create
  if (!dirExists) {
    const { doesCreate } = await core.question.confirm(
      'doesCreate',
      `Create directory ${chalk.green(core.targetDir)} ?`,
      { default: true }
    )

    if (!doesCreate) {
      return false
    }

    core.pushAction(
      `create directory ${core.targetDir}`,
      () => mkdirp(core.targetDir),
    )
  }

  const packageJsonPath = resolve(core.targetDir, 'package.json')
  if (dirExists && existsSync(packageJsonPath)) {
    const { continueWithExists } = await core.question.confirm(
      'continueWithExists',
      `Directory already has ${chalk.blue('package.json')} Continue?`,
      { default: true }
    )

    if (!continueWithExists) {
      return false
    }

    core.pushAction(
      'Read package.json',
      async (cr) => {
        const content = await readFile(packageJsonPath, { charset: 'utf-8' })
        cr.setPackageInfo(JSON.parse(content))
      },
    )
  }

  return true
}

module.exports = {
  initialCheck,
}
