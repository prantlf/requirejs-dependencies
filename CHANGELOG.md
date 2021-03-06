# [0.1.1](https://github.com/prantlf/requirejs-dependencies/compare/v0.1.0...v0.1.1) (2020-07-03)

### Bug Fixes

* Add canvas and graphviz-webcomponent as peer dependencies for optional functionality ([c1cdec6](https://github.com/prantlf/requirejs-dependencies/commit/c1cdec66f26588d14ff72954e5d2895fb3af20e4))
* Do not modify input arguments of functions excluding modules and imploding bundles ([fc303a3](https://github.com/prantlf/requirejs-dependencies/commit/fc303a38097851130753342b0d13364fb26141bd))

# [0.1.0](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.11...v0.1.0) (2020-06-22)

### Features

* Integrate graphviz-builder, graphviz-cli and graphviz-webcomponent to handle graph image generation ([f27c148](https://github.com/prantlf/requirejs-dependencies/commit/f27c148f341ad2fe609c2ad1ee08e22710fb72d6))

## [0.0.11](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.10...v0.0.11) (2020-06-08)

### Bug Fixes

* Remove @aduh95/viz.js as a peer dependency ([828aa89](https://github.com/prantlf/requirejs-dependencies/commit/828aa8993eb5bdbde191798e370e673d87179418))

## [0.0.10](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.9...v0.0.10) (2020-06-08)

### Bug Fixes

* Re-add @aduh95/viz.js as a direct dependency ([7d5b464](https://github.com/prantlf/requirejs-dependencies/commit/7d5b4646120539d9f312c497edeb6f9500ea8dea))

## [0.0.9](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.8...v0.0.9) (2020-06-08)

### Bug Fixes

* Make of @aduh95/viz.js a peer dependency ([e389076](https://github.com/prantlf/requirejs-dependencies/commit/e3890769cf7cade013aa354a39d5f9bb4e556714))

* Fix including the web worker.
* Remove dependency on @hpcc-js/wasm.

## [0.0.8](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.7...v0.0.8) (2020-06-08)

### Features

* Introduce an interactive web application, generate images ([e722e23](https://github.com/prantlf/requirejs-dependencies/commit/e722e236e03de628038d65e72c539417236db82d))

* Serve a web page for inspecting module dependencies.
* Allow specifying graph layout.
* Allow emphasizing direct dependencies by a different colour.
* Allow putting direct dependencies together to a cluster.
* Print the dependencies on the console as a two-level tree.
* Generate images by Graphviz.
* Add performance tests of using Graphviz as WASM.

## [0.0.7](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.6...v0.0.7) (2020-06-05)

### Features

* Recognize plugins without a module to point to as a sole dependency ([b73174c](https://github.com/prantlf/requirejs-dependencies/commit/b73174c0965ba166b5fe3dfa40ce6541fa962b93))

## [0.0.6](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.5...v0.0.6) (2020-06-05)

### Bug Fixes

* Fix usage of deps (depandencies) and dependents in the traced output, export loadConfig and formatMilliseconds ([2a85303](https://github.com/prantlf/requirejs-dependencies/commit/2a853038b2a041d11182ce3fb0c58db86fd53e32))

### Features

* Export loadConfig and formatMilliseconds ([2a85303](https://github.com/prantlf/requirejs-dependencies/commit/2a853038b2a041d11182ce3fb0c58db86fd53e32))
* Optionally explode specified bundles or implode the bundle of the main tracked module ([3d05eb9](https://github.com/prantlf/requirejs-dependencies/commit/3d05eb943d9f5d5107ad2b3363d19a4dfee59dc4))

BREAKING CHANGE: Only named exports are available, some identifiers were renamed.

* Remove non-named export of traceSingle
* Rename function shrinkBundleDependencies to implodeBundleDependencies
* Rename option between-bundles to implode-bundles

## [0.0.5](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.4...v0.0.5) (2020-06-04)

### Bug Fixes

* Fix package dependencies ([a9b7a16](https://github.com/prantlf/requirejs-dependencies/commit/a9b7a169eb21b1ba20cd9709b5517023bf8f1b92))

## [0.0.4](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.3...v0.0.4) (2020-06-04)

### Bug Fixes

* Fix exporting format-millisconds ([d44049e](https://github.com/prantlf/requirejs-dependencies/commit/d44049e1c92cf836b35c60cea866a95552f0e464))

## [0.0.3](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.2...v0.0.3) (2020-06-04)

### Features

* Show inter-bundle dependencies ([2b92290](https://github.com/prantlf/requirejs-dependencies/commit/2b92290ec95747e146279f2f9d4a16d3d8a26f1b))

## [0.0.2](https://github.com/prantlf/requirejs-dependencies/compare/v0.0.1...v0.0.2) (2020-06-03)

### Features

* Track dependencies of more RequreJS modules ([8687f68](https://github.com/prantlf/requirejs-dependencies/commit/8687f68befe05cd3ac76240073b8c97893ed3892))

## 0.0.1 (2020-05-27)

Initial release. Tracks dependencies of a RequireJS module.
