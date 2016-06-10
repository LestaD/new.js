
const initPackage = require('init-package-json');
const observatory = require('observatory');
const chalk = require('chalk');
const { enqueue } = require('./queue');


module.exports =
function libGenerates(configuration) {

  return enqueue([])
    .then(_ => console.log(chalk.green("\n Generate complete!")))
    .error(_ => console.error(chalk.red("\n Generate failed! :(")));
}
