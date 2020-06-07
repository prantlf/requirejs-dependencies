# requirejs-dependencies

[![npm](https://img.shields.io/npm/v/requirejs-dependencies)](https://www.npmjs.com/package/requirejs-dependencies#top)
[![Dependency Status](https://david-dm.org/prantlf/requirejs-dependencies.svg)](https://david-dm.org/prantlf/requirejs-dependencies)
[![devDependency Status](https://david-dm.org/prantlf/requirejs-dependencies/dev-status.svg)](https://david-dm.org/prantlf/requirejs-dependencies#info=devDependencies)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Finds direct and indirect dependencies of a RequireJS module. Can be used to find all or only common dependencies of more modules, for example:

```
requirejs-dependencies -r src -c src/config.js --common src/store src/shell
```

This package supports RequireJS specifics like plugins and bundles. If multiple bundles are used, dependencies between bundles can be represented by imploding modules from a single bundle to the single bundle name in the traced output.

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
for (const { id, path, deps, dependents } of traced) { ... }
```

Available options:

|  name             |  type    | description                                     |
|-------------------|----------|-------------------------------------------------|
| `module`          | `string` | module name recognized by RequireJS (mandatory) |
| `rootDir`         | `string` | source root directory (mandatory)               |
| `config`          | `string` | configuration file for RequireJS (optional)     |

Promised result properties:

|  name     |  type      | description                                |
|-----------|------------|--------------------------------------------|
| `traced`  | `object[]` | list of dependencies                       |
| `time`    | `number`   | time needed to trace the dependencies [ms] |

Properties of a dependency:

|  name        |  type      | description                                    |
|--------------|------------|------------------------------------------------|
| `id`         | `string`   | module name used in `define()` or `require()`  |
| `path`       | `string`   | path to the module in the file system          |
| `deps`       | `string[]` | dependencies of the module (optional)          |
| `dependents` | `string[]` | dependents of the module (optional)            |

### traceMany(options: object): Promise\<object\>

Finds direct and indirect dependencies for more a RequireJS modules.

```js
import { traceMany } from 'requirejs-dependencies'
const { traced, time } = await traceMany({
  modules: ['src/store', 'src/shell'], rootDir: 'src', config: 'src/config.js'
})
for (const { id, path, deps, dependents } of traced['src/store']) { ... }
for (const { id, path, deps, dependents } of traced['src/shell']) { ... }
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

### getUnion (manyModules: object[][] | object{[key: string]: object[]}): object[]

Returns an array of distinct dependencies after dropping duplicates from the input. The input can be either array of arrays of dependencies, or an object, where keys are module names and values arrays of dependencies. A single array of the dependencies is the same as `traced` from the promised properties from [`traceSingle`].

```js
import { traceMany } from 'requirejs-dependencies'
let { traced, time } = await traceMany({
  modules: ['src/store', 'src/shell'], rootDir: 'src', config: 'src/config.js'
})
for (const { id, path, deps, dependents } of getUnion(traced)) { ... }
```

### getIntersection (manyModules: object[][] | object{[key: string]: object[]}): object[]

Returns an array of modles that each input module depends on, directly or indirectly. The input can be either array of arrays of dependencies, or an object, where keys are module names and values arrays of dependencies. A single array of the dependencies is the same as `traced` from the promised properties from [`traceSingle`].

```js
import { traceMany } from 'requirejs-dependencies'
let { traced, time } = await traceMany({
  modules: ['src/store', 'src/shell'], rootDir: 'src', config: 'src/config.js'
})
for (const { id, path, dependents } of getIntersection(traced)) { ... }
```

### implodeBundleDependencies (options: object): object[]

Replaces module names in module dependencies with parent bundle names of the particular modules. Then the dependencies are pruned so that each bundle occurs only once there. An array of the dependencies is the same as `traced` from the promised properties from [`traceSingle`]. The parameter `bundles` is in the same format as the bundle configuration for RequireJS. The parameter `tracedBundle` is necessary if the parameter `traced` is just an array of traced dependencies without information what is the current bundle.

Available options:

|  name                  |  type                                        | description                  |
|------------------------|----------------------------------------------|-----------------------------|
| `traced`               | `object[] | object{[key: string]: object[]}` | output of `traceSingle` or `traceMany` |
| `bundles`              | `object{[key: string]: string[]}`            | bundle configuration for RequireJS  |
| `explodeBundles`       | `string[]` | bundles that should be exploded to modules (optional) |
| `implodeCurrentBundle` | `boolean`  | hide module dependencies from the same bundle (optional) |
| `tracedBundle`         | `string`   | parent bundle of plain array of traced modules (optional) |

```js
import { traceSingle } from 'requirejs-dependencies'
let { traced, config, time } = await traceSingle({
  module: 'src/store', rootDir: 'src', config: 'src/config.js'
})
traced = implodeBundleDependencies({
  traced, bundles: config.bundles, tracedBundle: 'src/data'
})
for (const { id, path, dependents } of traced) { ... }
```

### function loadConfig (path: string): object

Returns the RequiteJS configuration as an object. The configuration is usually set by a `require.config` statement in a separate file. It is not exported from the file. This method extracts it without applying it to global RequireJS.

```js
import trace from 'amodro-trace'
import { loadConfig } from 'requirejs-dependencies'
const config = loadConfig(config)
const { traced } = await trace({ id, rootDir }, config)
for (const { id } of traced) console.log(id)
```

### function formatMilliseconds (duration: number): string

Formats a number of milliseconds to a readable duration as a string.

```js
import { traceSingle, formatMilliseconds } from 'requirejs-dependencies'
const { traced, time } = await traceSingle({
  module: 'src/main', rootDir: 'src', config: 'src/config.js'
})
for (const { id } of traced) console.log(id)
console.log(`"src/main" traced in ${formatMilliseconds(time)}`)
```

## Command-line

```
$ requirejs-dependencies -h

Prints direct and indirect dependencies of one or more RequireJS modules.

Usage: requirejs-dependencies [option...] <module>...

Options:
  -r|--rootdir <path>       source root directory
  -c|--config <path>        configuration file for RequireJS
  --serve                   start server for interactive module inspection
  --implode-bundles         print bundles as dependencies instead of modules
  --explode-bundles <list>  specify bundles which modules will remain listed
  --implode-current-bundle  do not list dependencies from the same bundle
  -l|--layout layout        graph layout (dot,neato,fdp,twopi,circo,osage)
  --emphasize-directs       render direct dependencies with different colour
  --cluster-directs         cluster direct dependencies together
  --common                  print only common dependencies for more modules
  --tree                    print module dependencies as a tree
  --image <path>            generate image with dependency graph
  -V|--version              print version number
  -h|--help                 print usage instructions

If you enable the option implode-bundles, you need to include bundles
in your config, so that relations module <--> bundle can be built.

If no arguments are provided, usage instructions will be printed out.
Errors and timing are printed on standard error. Dependencies, usage
instructions and version number are printed on standard output.

A non-zero exit code is returned in case of error.

Examples:
  requirejs-dependencies -r src -c src/config.js src/main
  requirejs-dependencies -r src --common src/store src/shell
```

## License

Copyright (c) 2020 Ferdinand Prantl

Licensed under the MIT license.
