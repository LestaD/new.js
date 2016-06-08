
const inquirer = require('inquirer');
const gitConfig = require('git-config');
const validatePackageName = require('validate-npm-package-name');
const validateLicense = require('validate-npm-package-license');
const { assign } = require('lodash');

const defaults = require('./defaults');


function make(qHash) {
  return Object.keys(qHash)
    .map(key => assign({ name: key }, qHash[key]));
}

const questions = (conf) => make({
  name: {
    message: 'Package name',
    default: conf.name,
    validate: name => validatePackageName(name).validForNewPackages,
  },
  description: {
    message: 'Short description',
    default: conf.description,
  },
  version: {
    message: 'Initial version',
    default: conf.version,
    validate: version => !!version.match(/^v?\d+\.\d+\.\d+(\-[a-z\.\d]+[\da-z])?$/i),
  },
  repo: {
    message: 'Repository',
    default: conf.repo,
  },
  license: {
    message: 'Select license from SPDX list',
    default: conf.license,
    validate: license => validateLicense(license).validForNewPackages,
  },
  keywords: {
    message: 'Keywords',
    filter: words => words.replace(/,/g, '').replace(/\s+/g, ' ').split(' '),
  },
  nodever: {
    message: 'Node minimum version',
    default: conf.nodever,
    validate: ver => !!ver.match(/^\d+(\.\d+(\.\d+)?)?$/i),
  },
  bin: {
    type: 'confirm',
    message: 'Create exec file in ./bin/',
    default: conf.bin,
  },
  main: {
    type: 'confirm',
    message: 'Create main file in ./lib/',
    default: conf.main,
  },
  dependencies: {
    message: 'Your dependencies (separated by space)',
    filter: list => list.replace(/\s+/g, ' ').replace(/\s+$/, '').replace(/^\s+/, '').split(' '),
  },
  devDpendencies: {
    message: 'Development dependencies',
    filter: list => list.replace(/\s+/g, ' ').replace(/\s+$/, '').replace(/^\s+/, '').split(' '),
  },
  git: {
    type: 'confirm',
    message: 'Init git repository',
    default: conf.git,
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


exports.init =
function init(config) {
  return Promise.resolve(config);
}


exports.askUser =
function askUser(initialConfig) {
  let newConfig = {};

  return inquirer.prompt(questions(initialConfig))
  .then(answers => assign(initialConfig, answers));
}
