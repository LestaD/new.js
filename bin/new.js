#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const inquirer = require('inquirer');
const chalk = require('chalk');
const gitConfig = require('git-config');
const optimist = require('optimist');
const { merge } = require('lodash');

const Package = require('../package.json');


const argv = optimist
  .usage('Usage: new [options]\n       npm-new [options]')

  .describe('h', 'Show help and usage information')
  .alias('h', 'help')
  .boolean('h')

  .describe('v', 'Show new.js version')
  .alias('v', 'version')
  .alias('v', 'ver')
  .boolean('v')

  .describe('name', 'Set package name')
  .string('name')

  .describe('version', 'Set initial package version')
  .string('version')
  .default('version', '0.1.0')

  .describe('repo', 'Git repository')
  .string('repo')

  .describe('author', 'Your name and email: John Snow <john.snow@nord.net>')
  .string('author')

  .describe('keywords', '')

  .describe('exec', 'Create exec file ./bin/$name.js')
  .boolean('exec')

  .describe('no-lib', 'Do not create library main file')
  .boolean('no-lib')

  .describe('lic', 'Select license')
  .default('lic', 'MIT')

  .describe('skip-git', 'Do not initialize git repository')
  .boolean('skip-git')

  .argv;



if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}

if (argv.version) {
  console.log(`${Package.name} v${Package.version}`);
  process.exit(0);
}


console.log(argv);
