

const createDummyPackageJson = config => JSON.stringify({
  name: config.name,
  version: config.version,
  description: config.description,
  author: config.author,
  repository: config.git
    ? {
      type: 'git',
      url: config.repo,
    }
    : null,
  license: config.license,
  keywords: config.keywords,
  engines: {
    node: `^${config.nodever}`,
  },
  bin: config.apptype.includes('bin')
    ? config.fileBin
    : null,
  main: config.apptype.includes('main')
    ? config.fileMain
    : null,
}, 2, 2) // eslint-disable-line no-magic-numbers

module.exports = {
  createDummyPackageJson,
}
