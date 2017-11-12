const { resolve } = require('path')
// const initPackage = require('init-package-json')
const changeCase = require('change-case')
// const observatory = require('observatory')
const chalk = require('chalk')
const npm = require('npm')
const pify = require('pify')
const mkdirp = pify(require('mkdirp'))

const { generatePackageJson } = require('./generators/package-json')


function npmLoad() {
  return new Promise(res => npm.load({}, res))
}

function npmInstall(deps, dev = false) {
  return new Promise((res) => {
    npm.commands.install([dev ? '--save-dev' : '--save'].concat(deps), res)
  })
}

// function npmUninstall(deps, dev = false) {
//   return new Promise((resolve) => {
//     npm.commands.uninstall([dev ? '--save-dev' : '--save'].concat(deps), resolve)
//   })
// }

module.exports =
async function libGenerates(answers) {
  if (!answers.latestConfirm) {
    return null
  }

  const params = {
    targetDir: resolve(process.cwd(), changeCase.paramCase(answers.name)),
  }

  await mkdirp(params.targetDir)
  await generatePackageJson(answers, params)


  // if all right
  // TODO: change destination
  if (false) {
    await npmLoad()
    await npmInstall(answers.dependencies)
    await npmInstall(answers.devDependencies, true)
  }

  return null
}
