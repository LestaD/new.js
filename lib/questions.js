
const inquirer = require('inquirer');
const validatePackageName = require('validate-npm-package-name');
const validateLicense = require('validate-npm-package-license');
const chalk = require('chalk');
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
    message: 'Author name:',
    default: conf.author || 'John Dou <john.dou@mail.com> (http://johngou.name)'
  },
  repo: {
    message: 'Repository:',
    default: answers => conf.repo + answers.name,
  },
  license: {
    message: 'Select license:',
    type: 'list',
    default: conf.license,
    choices: () => availableLicenses(),
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
  // bin: {
  //   type: 'confirm',
  //   message: 'Create exec file in ./bin/:',
  //   default: conf.bin,
  // },
  // main: {
  //   type: 'confirm',
  //   message: 'Create main file in ./lib/:',
  //   default: conf.main,
  // },
  apptype: {
    type: 'checkbox',
    message: 'Select required fields:',
    choices: answers => [
      { value: 'main', name: 'lib/'+answers.name+'.js', short: 'library' },
      { value: 'bin', name: 'bin/'+answers.name+'.js', short: 'binary' },
    ],
    default: () => {
      const res = [];
      if (conf.bin) res.push('bin');
      if (conf.main) res.push('main');
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
      { value: 'y', name: 'Initialize git repository', short: 'Yes' },
      { value: 'n', name: 'Skip', short: 'No' },
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
      },
      {
        name: 'Simple: installation and usage sections',
        value: 'simple'
      },
      {
        name: 'Extended: full description and badges',
        value: 'extended'
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
  };

  return assign(config, answers, correcter);
}
