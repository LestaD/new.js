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


async function main() {
  try {
    const options = config(defaults, commandLine(defaults))
    const answers = await questions(options)
    const results = await generates(answers)
  }
  catch (error) {
    console.error(chalk.red(error.message))
    console.error(chalk.yellow(error.stack))
  }
}

main()
