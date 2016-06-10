
const git = require('git-config').sync();

module.exports = {
  name: '',
  description: '',
  version: '0.1.0',
  author: git.user ? git.user.name + (git.user.email ? ' <' + git.user.email + '>' : '') : '',
  repo: 'github:' + (git.user ? git.user.name : 'example') + '/',
  bin: false,
  main: true,
  nodever: '4.0.0',
  license: 'MIT',
  git: false,
};
