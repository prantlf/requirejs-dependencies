# reqiurejs-dependencies

Finds direct and indirect dependencies of a RequireJS module. Can be used to find common dependencies of two root modules, for example:

```
comm -12 <(requirejs-dependencies -r src -c src/config.js src/lister | sort) \
  <(requirejs-dependencies -r src -c src/config.js src/viewer | sort)
```

## Synopsis

```
$ requirejs-dependencies -r src -c src/config.js src/main
src/main.js
src/utils.js
src/main traced in 5.742ms
```

```js
import trace from 'reqiurejs-dependencies'
const { traced } = await trace({
  module: 'src/main', rootDir: 'src', config: 'src/config.js'
})
for (const { id } of traced) console.log(id)
// Prints src/main.js and src/utils.js
```

## Installation

If you want to use the command-line tool, install this package globally using your package manager:

```
npm i -g reqiurejs-dependencies
yarn global add reqiurejs-dependencies
pnpm i -g reqiurejs-dependencies
```

If you want to use this package programmatically, install it locally using your package manager:

```
npm i reqiurejs-dependencies
yarn add reqiurejs-dependencies
pnpm i reqiurejs-dependencies
```

## API

### trace(options: Object): Promise<Object>

Finds direct and indirect dependencies of a RequireJS module.

```js
import trace from 'reqiurejs-dependencies'
const { traced, time } = await trace({
  module: 'src/main', rootDir: 'src', config: 'src/config.js'
})
for (const { id, path, dependents } of traced) { ... }
```

Available options:

|  name     |  type    | description                                     |
|-----------|----------|-------------------------------------------------|
| `module`  | `string` | module path recognized by RequireJS (mandatory) |
| `rootDir` | `string` | source root directory (mandatory)               |
| `config`  | `string` | configuration file for RequireJS (optional)     |

Promised result properties:

|  name     |  type           | description                                |
|-----------|-----------------|--------------------------------------------|
| `traced`  | `Array<Object>` | list of dependencies                       |
| `time`    | `number`        | time needed to trace the dependencies [ms] |

Properties of a dependency:

|  name        |  type           | description                                   |
|--------------|-----------------|-----------------------------------------------|
| `id`         | `string`        | module name used in `define()` or `require()` |
| `path`       | `string`        | path to the module in the file system         |
| `dependents` | `Array<string>` | array of dependents of the module (optional)  |

## Command-line

```
$ requirejs-dependencies -h

Prints direct and indirect dependencies of a RequireJS module.

Usage: requirejs-dependencies [option...] <module>

Options:
  -r|--rootdir <path>  source root directory
  -c|--config <path>   configuration file for RequireJS
  -V|--version         print version number
  -h|--help            print usage instructions

Examples:
  requirejs-dependencies -r src -c src/config.js src/main
```

## License

MIT
