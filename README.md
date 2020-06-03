# requirejs-dependencies

[![npm](https://img.shields.io/npm/v/requirejs-dependencies)](https://www.npmjs.com/package/requirejs-dependencies#top)
[![Dependency Status](https://david-dm.org/prantlf/requirejs-dependencies.svg)](https://david-dm.org/prantlf/requirejs-dependencies)
[![devDependency Status](https://david-dm.org/prantlf/requirejs-dependencies/dev-status.svg)](https://david-dm.org/prantlf/requirejs-dependencies#info=devDependencies)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Finds direct and indirect dependencies of a RequireJS module. Can be used to find all or only common dependencies of more modules, for example:

```
requirejs-dependencies -r src -c src/config.js --common src/store src/shell
```

## Synopsis

```
$ requirejs-dependencies -r src -c src/config.js src/main
src/main.js
src/utils.js
src/main traced in 5.742ms
```

```js
import { traceSingle } from 'requirejs-dependencies'
const { traced } = await traceSingle({
  module: 'src/main', rootDir: 'src', config: 'src/config.js'
})
for (const { id } of traced) console.log(id)
// Prints src/main.js and src/utils.js
```

## Installation

If you want to use the command-line tool, install this package globally using your package manager:

```
npm i -g requirejs-dependencies
yarn global add requirejs-dependencies
pnpm i -g requirejs-dependencies
```

If you want to use this package programmatically, install it locally using your package manager:

```
npm i requirejs-dependencies
yarn add requirejs-dependencies
pnpm i requirejs-dependencies
```

## API

### traceSingle(options: object): Promise\<object\>

Finds direct and indirect dependencies of a RequireJS module.

```js
import { traceSingle } from 'requirejs-dependencies'
const { traced, time } = await traceSingle({
  module: 'src/main', rootDir: 'src', config: 'src/config.js'
})
for (const { id, path, dependents } of traced) { ... }
```

Available options:

|  name     |  type    | description                                     |
|-----------|----------|-------------------------------------------------|
| `module`  | `string` | module name recognized by RequireJS (mandatory) |
| `rootDir` | `string` | source root directory (mandatory)               |
| `config`  | `string` | configuration file for RequireJS (optional)     |

Promised result properties:

|  name     |  type      | description                                |
|-----------|------------|--------------------------------------------|
| `traced`  | `object[]` | list of dependencies                       |
| `time`    | `number`   | time needed to trace the dependencies [ms] |

Properties of a dependency:

|  name        |  type      | description                                   |
|--------------|------------|-----------------------------------------------|
| `id`         | `string`   | module name used in `define()` or `require()` |
| `path`       | `string`   | path to the module in the file system         |
| `dependents` | `string[]` | array of dependents of the module (optional)  |

### traceMany(options: object): Promise\<object\>

Finds direct and indirect dependencies for more a RequireJS modules.

```js
import { traceMany } from 'requirejs-dependencies'
const { traced, time } = await traceMany({
  modules: ['src/store', 'src/shell'], rootDir: 'src', config: 'src/config.js'
})
for (const { id, path, dependents } of traced['src/store']) { ... }
for (const { id, path, dependents } of traced['src/shell']) { ... }
```

Available options:

|  name     |  type      | description                                      |
|-----------|------------|--------------------------------------------------|
| `modules` | `string[]` | module names recognized by RequireJS (mandatory) |

Other options are the same as for [`traceSingle`], except for the missing `module`.

Promised result properties:

|  name     |  type    | description                                |
|-----------|----------|--------------------------------------------|
| `traced`  | `object` | map of module names and their dependencies |
| `time`    | `number` | time needed to trace the dependencies [ms] |

The `traced` object contains input module names as keys and arrays of their dependencies as values. The array of the dependencies is the same as `traced` from the promised properties from [`traceSingle`].

### getUnion (manyModules: object[][]): object[]

Returns an array of distinct dependencies after dropping duplicates from the array of arrays of dependencies. A single array of the dependencies is the same as `traced` from the promised properties from [`traceSingle`].

```js
import { traceMany } from 'requirejs-dependencies'
let { traced, time } = await traceMany({
  modules: ['src/store', 'src/shell'], rootDir: 'src', config: 'src/config.js'
})
traced = getUnion(Object.values(traced))
for (const { id, path, dependents } of traced) { ... }
```

### getIntersection (manyModules: object[][]): object[]

Returns an array of dependencies that each input module include in its depednents, directly or indirectly. A single array of the dependencies is the same as `traced` from the promised properties from [`traceSingle`].

```js
import { traceMany } from 'requirejs-dependencies'
let { traced, time } = await traceMany({
  modules: ['src/store', 'src/shell'], rootDir: 'src', config: 'src/config.js'
})
traced = getIntersection(Object.values(traced))
for (const { id, path, dependents } of traced) { ... }
```

## Command-line

```
$ requirejs-dependencies -h

Prints direct and indirect dependencies of one or more RequireJS modules.

Usage: requirejs-dependencies [option...] <module>...

Options:
  -r|--rootdir <path>  source root directory
  -c|--config <path>   configuration file for RequireJS
  --common             print only common dependencies for more modules
  -V|--version         print version number
  -h|--help            print usage instructions

Examples:
  requirejs-dependencies -r src -c src/config.js src/main
  requirejs-dependencies -r src --common src/store src/shell
```

## License

Copyright (c) 2020 Ferdinand Prantl

Licensed under the MIT license.
