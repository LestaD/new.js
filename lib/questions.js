
const chalk = require('chalk');
const inquirer = require('inquirer');
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
    validate: version => !!version.match(/^v?\d+\.\d+\.\d+(\-[a-z\.\d]+[\da-z])?$/i)
                            ? true
                            : 'Please, enter correct semver-like version',
  },
  author: {
    message: 'Author:',
    default: conf.author || 'John Dou <john.dou@mail.com> (http://johngou.name)'
  },
  repo: {
    message: 'Repository:',
    default: answers => conf.repo + answers.name,
    filter: repo => {
      const ginf = gitInfo.fromUrl(repo);
      if (ginf) {
        return ginf.shortcut();
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
    filter: words => words.replace(/,/g, '').replace(/\s+/g, ' ').split(' '),
  },
  nodever: {
    message: 'Node minimum version:',
    default: conf.nodever,
    validate: ver => !!ver.match(/^\d+(\.\d+(\.\d+)?)?$/i),
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
  },
  dependencies: {
    message: 'Your dependencies (separated by space):',
    filter: list => list.replace(/\s+/g, ' ').replace(/\s+$/, '').replace(/^\s+/, '').split(' '),
  },
  devDpendencies: {
    message: 'Development dependencies:',
    filter: list => list.replace(/\s+/g, ' ').replace(/\s+$/, '').replace(/^\s+/, '').split(' '),
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
