
const { pick, assign } = require('lodash');


module.exports =
function libConfig(defaults, argv) {
  const normalizedArgs = pick(argv, [
    '_',
    'name',
    'version',
    'repo',
    'bin',
    'main',
    'license',
    'git',
  ]);

  return assign({}, defaults, normalizedArgs);
}
