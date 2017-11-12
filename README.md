# new.js

> Package now in development!

Easy generates the skeleton of your new NPM-package.

[![](https://asciinema.org/a/48638.png)](https://asciinema.org/a/48638)


## Installation

```bash
npm install --global new.js
# or
npm i -g new.js
```

## Usage

```bash
new --help
#or
new.js -h
#or
npm-new -h
```

```bash
new -bmtg --name=hello-world --version=0.0.1 --lic=GPL-3.0
```

## Requirements

- Node.js >= 6.0.0


## Roadmap

- Add question to crate man and doc files https://github.com/npm/npm/blob/fb28e5868a9dbbe21a15f23fe8cf8b3703e8adf2/package.json#L28
- Plugins (questions, generators)
- Restart previous generation (`new --previous`)
- Continue from break (`new --continue`)


### Plugins

```bash
npm install --global new-react-app.js
new react-app
```

### Presets (bundled)

```bash
npm install --global new.js
new flow # create with flow boilerplate
new babel # babel plugins and presets
```


<!-- ## Questions

- name
- description
- version
- author
- repository
- keywords
- license
- node minimum version
- init git
- dependencies
- devDependencies
- executive or/and library, tests
- readme selector

Add license header to demo files (main, bin, test)

-->
