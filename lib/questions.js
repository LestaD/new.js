
const chalk = require('chalk')
const inquirer = require('inquirer')
const changeCase = require('change-case')
const semver = require('semver')
const validatePackageName = require('validate-npm-package-name')
const validateLicense = require('validate-npm-package-license')
const gitInfo = require('hosted-git-info')
const { availableLicenses } = require('license.js')
const { assign } = require('lodash')

const defaults = require('./defaults')
const { createDummyPackageJson } = require('./utils')


function resolveAnswers(config, answers) {
  const correcter = {
    main: answers.apptype.includes('main'),
    bin: answers.apptype.includes('bin'),
    test: answers.apptype.includes('test'),
  }

  return assign(config, answers, correcter)
}

const make = qHash =>
  Object.keys(qHash)
    .map(key => assign({ name: key }, qHash[key]))

const packageName = (answers) => {
  const [scope, name] = answers.name.split('/')
  return name || scope
}

function completeVersion(version) {
  const parts = version.split('.')
  if (parts.length === 1) {
    return `${parts[0]}.0.0`
  }
  else if (parts.length === 2) { // eslint-disable-line no-magic-numbers
    return `${parts.join('.')}.0`
  }

  return version
}

const createLocation = answers =>
  `${process.cwd()}/${changeCase.paramCase(answers.name)}`

const questions = conf => make({
  name: {
    message: 'Package name:',
    validate: name => validatePackageName(name).validForNewPackages
                      || 'Please, enter valid NPM-package name',
    default: conf.name || undefined,
  },

  description: {
    message: 'Short description:',
  },

  version: {
    message: 'Initial version:',
    default: conf.version,
    validate: version => semver.valid(version)
      ? true
      : 'Please, enter correct semver-like version',
    filter: completeVersion,
  },

  author: {
    message: 'Author:',
    default: conf.author || 'John Dou <john.dou@mail.com> (http://johngou.name)',
  },

  git: {
    type: 'list',
    message: 'Git repository:',
    default: 'init',
    choices: answers => [
      { value: 'init', name: 'Initialize new git repository', short: 'Initialize new' },
      { value: 'skip', name: '' },
    ],
  },

  repo: {
    message: 'Repository:',
    default: (answers) => {
      const [scope, name] = answers.name.split('/')
      if (name) {
        return `github:${scope.replace('@', '')}/${name}`
      }
      return conf.repo + answers.name
    },
    filter: (repo) => {
      const ginf = gitInfo.fromUrl(repo)
      if (ginf) {
        return ginf.https()
      }
      return repo
    },
    when: answers => answers.git === 'init',
  },

  gitignore: {
    type: 'confirm',
    message: 'Create gitignore file from gitignore.io',
    default: true,
    when: answers => answers.git === 'init',
  },

  license: {
    message: 'License:',
    type: 'list',
    default: conf.license,
    choices: () => availableLicenses().sort(),
  },
  keywords: {
    message: 'Keywords:',
    filter: words => words.replace(/,+/g, '').replace(/\s+/g, ' ').split(' '),
  },

  nodever: {
    message: 'Node minimum version:',
    default: conf.nodever,
    validate: ver => semver.valid(ver)
      ? true
      : 'Version should be a correct semver-version',
    filter: completeVersion,
  },

  apptype: {
    type: 'checkbox',
    message: 'Create files for:',
    choices: answers => [
      { value: 'bin', name: ` binary:   bin/${packageName(answers)}.js`, short: 'Binary' },
      { value: 'main', name: ` library:  lib/${packageName(answers)}.js`, short: 'Library' },
      { value: 'test', name: ` test:     test/${packageName(answers)}.js`, short: 'Test' },
    ],
    default: () => {
      const res = []
      if (conf.bin) res.push('bin')
      if (conf.main) res.push('main')
      if (conf.test) res.push('test')
      return res
    },
    validate: (input, answers) => {
      if (input.length === 0) {
        return 'Module can be library or binary'
      }
      if (input.length === 1 && input[0] === 'test') {
        return 'Package cannot be with tests only'
      }
      return true
    },
  },

  fileMain: {
    type: 'input',
    message: 'Library main file:',
    default: answers => `./lib/${packageName(answers)}.js`,
    when: answers => answers.apptype.includes('main'),
  },

  fileBin: {
    type: 'input',
    message: 'Library binary file:',
    default: answers => `./bin/${packageName(answers)}.js`,
    when: answers => answers.apptype.includes('bin'),
  },

  fileTest: {
    type: 'input',
    message: 'Library test file:',
    default: answers => `./tests/${packageName(answers)}.test.js`,
    when: answers => answers.apptype.includes('test'),
  },

  testRunner: {
    type: 'list',
    message: 'Test runner:',
    choices: [
      'mocha',
      'jasmine',
      'ava',
      'jest',
      new inquirer.Separator(),
      { value: false, name: 'Setup later' },
    ],
    default: false,
    when: answers => answers.apptype.includes('test'),
  },

  assertLibrary: {
    type: 'list',
    message: answers => `Assert library for ${answers.testRunner}:`,
    choices: [
      'should',
      'expect',
      'chai',
      'must',
      'tap',
      new inquirer.Separator(),
      { value: false, name: 'Setup later' },
    ],
    default: false,
    when: answers => ['mocha', 'jasmine'].includes(answers.testRunner),
  },

  dependencies: {
    message: 'Common dependencies (separated by space):',
    filter: list => list
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(e => !!e),
  },

  devDependencies: {
    message: 'Development dependencies:',
    // filter: (deps) => {
    //   if (answers.testRunner) {
    //     deps.push(answers.testRunner)
    //   }
    //   if (answers.assertLibrary) {
    //     deps.push(answers.assertLibrary)
    //   }
    //   return deps
    // },
    filter: list => list
      .trim()
      .split(/\s+/g)
      .filter(e => !!e),
  },

  readme: {
    type: 'list',
    message: 'Readme template:',
    default: 'simple',
    choices: [
      {
        name: 'Skip:        Do not create readme.md',
        value: false,
        short: 'Skip',
      },
      {
        name: 'Simple:      Installation and usage sections',
        value: 'simple',
        short: 'Simple',
      },
      {
        name: 'Extended:    Full description and badges',
        value: 'extended',
        short: 'Extended',
      },
    ],
  },

  locationConfirm: {
    type: 'confirm',
    message: answers => `Package will be created at: ${createLocation(answers)}/package.json`,
  },

  customLocation: {
    type: 'input',
    message: 'Enter package.json location:',
    default: createLocation,
    when: answers => Boolean(answers.locationConfirm) === false,
  },

  latestConfirm: {
    type: 'confirm',
    message: answers => `File ${answers.locationConfirm ? createLocation(answers) : answers.customLocation} will be created: \n\n${createDummyPackageJson(answers)}\n`,
    default: true,
  },

})

module.exports =
function libQuestions(initialConfig) {
  // eslint-disable-next-line no-console
  console.log(chalk.gray('[new.js] '), chalk.blue('Let\'s create new package!\n'))

  return inquirer.prompt(questions(initialConfig))
    .then(answers => resolveAnswers(initialConfig, answers))
}

