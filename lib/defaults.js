
const git = require('git-config').sync();

module.exports = {
  name: '',
  version: '0.1.0',
  author: git.user ? git.user.name + (git.user.email ? ' <' + git.user.email + '>' : '') : '',
  repo: 'github:' + (git.user ? git.user.name : 'example') + '/',
  description: '',
  bin: false,
  main: true,
  nodever: '4.0.0',
  license: 'MIT',
  git: false,
};
