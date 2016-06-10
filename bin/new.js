#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const { pick, assign } = require('lodash');

const Package = require('../package.json');
const commandLine = require('../lib/commandline');
const defaults = require('../lib/defaults');
const questions = require('../lib/questions');
const generates = require('../lib/generates');

const argv = commandLine(defaults);

const normalizedArgs = pick(argv, [
  'name',
  'version',
  'repo',
  'bin',
  'main',
  'license',
  'git'
]);
let config = assign({}, defaults, normalizedArgs);

Promise.resolve(config)
.then(argv.force ? a => a : questions)
// .then(config => console.log('Generate from:', config))
.then(generates);
