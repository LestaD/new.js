#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const Package = require('../package.json');

const defaults = require('../lib/defaults');
const commandLine = require('../lib/commandline');
const config = require('../lib/config');
const questions = require('../lib/questions');
const generates = require('../lib/generates');


Promise.resolve(defaults)
.then(def => config(def, commandLine(def)))
// .then(conf => pipe(conf, 'Generate from:', conf))
.then(questions)
.then(conf => pipe(conf, chalk.gray('Create generators!')))
.then(generates)
.catch(err => console.error(err));




function pipe(first, text, arg1, arg2, arg3) {
  console.log.apply(console, [text, arg1, arg2, arg3]);
  return first;
}
