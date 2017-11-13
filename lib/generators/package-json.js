const { resolve } = require('path')
const pify = require('pify')
const { writeFile } = pify(require('graceful-fs'))


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
    scripts: {
    },
  }
  // TODO: infer bugs.url and homepage

  if (answers.repo && answers.git !== 'skip') {
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

async function generatePackageJson(answers, params) {
  const packageJson = createBasePackage(answers)
  const fileContent = JSON.stringify(packageJson, 2, 2) // eslint-disable-line no-magic-numbers

  const filePath = resolve(params.targetDir, 'package.json')

  await writeFile(filePath, fileContent, { charset: 'utf-8' })
}

module.exports = {
  generatePackageJson,
}
