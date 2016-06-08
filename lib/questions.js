
const inquirer = require('inquirer');
const gitConfig = require('git-config');
const { assign } = require('lodash');

const defaults = require('./defaults');


module.exports.askUser =
function askUser(initialConfig) {
  let newConfig = {};

  return assign(initialConfig, newConfig);
}
