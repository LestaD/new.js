const initPackage = require('init-package-json')
// const observatory = require('observatory')
const chalk = require('chalk')
const npm = require('npm')


function createBasePackage(answers) {
  const packageJson = {
    name: answers.name,
    description: answers.description || '',
    version: answers.version,
    author: answers.author,
    license: answers.license,
    keywords: answers.keywords,
    engines: {
      node: `>=${answers.nodever}`,
    },
  }
  // TODO: infer bugs.url and homepage

  if (answers.repo) {
    packageJson.repository = {
      type: 'git',
      url: answers.repo,
    }
  }

  if (answers.fileMain) {
    packageJson.main = answers.fileMain
  }

  if (answers.fileBin) {
    packageJson.bin = {}
    packageJson.bin[packageJson.name] = answers.fileBin
  }

  return packageJson
}

function npmLoad() {
  return new Promise(resolve => npm.load({}, resolve))
}

function npmInstall(deps, dev = false) {
  return new Promise((resolve) => {
    npm.commands.install([dev ? '--save-dev' : '--save'].concat(deps), resolve)
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
    // if all right
    // TODO: change destination
    if (false) {
      await npmLoad()
      await npmInstall(answers.dependencies)
      await npmInstall(answers.devDependencies, true)
    }
  }
}
