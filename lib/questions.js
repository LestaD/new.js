
const chalk = require('chalk');
const inquirer = require('inquirer');
const changeCase = require('change-case')
const semver = require('semver')
const validatePackageName = require('validate-npm-package-name');
const validateLicense = require('validate-npm-package-license');
const gitInfo = require('hosted-git-info');
const { available: availableLicenses } = require('license.js');
const { assign } = require('lodash');

const defaults = require('./defaults');


function make(qHash) {
  return Object.keys(qHash)
    .map(key => assign({ name: key }, qHash[key]));
}

const packageName = answers => {
  const [scope, name] = answers.name.split('/')
  return name || scope
}

const completeVersion = version => {
  const parts = version.split('.')
  if (parts.length == 1) {
    return `${parts[0]}.0.0`
  }
  else if (parts.length == 2) {
    return `${parts.join('.')}.0`
  }

  return version
}

const questions = (conf) => make({
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
    default: conf.author || 'John Dou <john.dou@mail.com> (http://johngou.name)'
  },
  repo: {
    message: 'Repository:',
    default: answers => {
      const [scope, name] = answers.name.split('/')
      if (name) {
        return `github:${scope.replace('@', '')}/${name}`
      }
      return conf.repo + answers.name
    },
    filter: repo => {
      const ginf = gitInfo.fromUrl(repo);
      if (ginf) {
        return ginf.https();
      }
      return repo;
    },
  },
  license: {
    message: 'Select license:',
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
    validate: ver => !!semver.valid(ver)
              ? true
              : 'Version should be a correct semver-version'
    ,
    filter: completeVersion,
  },
  apptype: {
    type: 'checkbox',
    message: 'Create files for:',
    choices: answers => [
      { value: 'main', name: ' library:    lib/'+answers.name+'.js', short: 'library' },
      { value: 'bin', name:  ' binary:     bin/'+answers.name+'.js', short: 'binary' },
      { value: 'test', name: ' test:       test/'+answers.name+'.js', short: 'test' },
    ],
    default: () => {
      const res = [];
      if (conf.bin) res.push('bin');
      if (conf.main) res.push('main');
      if (conf.test) res.push('test');
      return res;
    },
    validate: (input, answers) => {
      if (!input.length) {
        return 'Module can be library or binary'
      }
      if (input.length == 1 && input[0] == 'test') {
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
    message: 'Select test runner:',
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
    message: answers => `Select assert library for ${answers.testRunner}:`,
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
    message: 'Your dependencies (separated by space):',
    filter: list => list
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(e => !!e),
  },
  devDependencies: {
    message: 'Development dependencies:',
    default: answers => {
      let def = ''
      if (answers.testRunner) {
        def += `${answers.testRunner} `
      }
      if (answers.assertLibrary) {
        def += `${answers.assertLibrary} `
      }
      return def
    },
    filter: list => list
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(e => !!e),
  },
  git: {
    type: 'list',
    message: 'Git repository:',
    default: conf.git ? 'y' : 'n',
    choices: [
      { value: 'y', name: 'Initialize git repository', short: 'Initialize' },
      { value: 'n', name: 'Skip' },
    ],
    filter: answer => answer === 'y',
  },
  readme: {
    type: 'list',
    message: 'README type:',
    choices: [
      {
        name: 'Do not create README.md',
        value: false,
        short: 'skip',
      },
      {
        name: 'Simple: installation and usage sections',
        value: 'simple',
        short: 'simple',
      },
      {
        name: 'Extended: full description and badges',
        value: 'extended',
        short: 'extended',
      }
    ],
    default: 'simple',
  },
});

module.exports =
function libQuestions(initialConfig) {
  console.log(chalk.gray('[new.js] '), chalk.blue('Let\'s create new package!\n'));

  return inquirer.prompt(questions(initialConfig))
  .then(answers => resolveAnswers(initialConfig, answers));
}


function resolveAnswers(config, answers) {
  const correcter = {
    main: answers.apptype.includes('main'),
    bin: answers.apptype.includes('bin'),
    test: answers.apptype.includes('test'),
  };

  delete answers.apptype;

  return assign(config, answers, correcter);
}
