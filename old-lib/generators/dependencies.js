const npm = require('npm')


const load = () => new Promise((resolve, reject) => {
  npm.load({}, (err, data) => err ? reject(err) : resolve(data))
})
const install = (where, deps) => new Promise((resolve, reject) => {
  npm.commands.install(where, deps, (err, data) => err ? reject(err) : resolve(data))
})


async function installDependencies(answers, params) {
  // const beforeCwd = process.cwd()
  // process.chdir(params.targetDir)

  const lnpm = await load({})
  // lnpm.config.set('only', 'production')
  // await install(params.targetDir, answers.dependencies)

  // console.log('base deps installed')


  lnpm.config.set('only', 'dev')
  await install(params.targetDir, answers.devDependencies)

  console.log('dev deps installed')

  // process.chdir(beforeCwd)
}


module.exports = {
  installDependencies,
}
