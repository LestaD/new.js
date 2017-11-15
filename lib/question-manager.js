const Inquirer = require('inquirer')


class QuestionManager {
  constructor(core) {
    this.core = core
    this.prompt = Inquirer.createPromptModule()
  }

  ask(type, base, extended) {
    return this.prompt([
      Object.assign({ type }, base, extended),
    ])
  }

  input(name, message, extended = {}) {
    return this.ask('input', {
      name,
      message,
    }, extended)
  }

  confirm(name, message, extended = {}) {
    return this.ask('confirm', {
      name,
      message,
    }, extended)
  }
}

module.exports = {
  QuestionManager,
}
