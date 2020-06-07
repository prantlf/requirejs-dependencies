# Microbenchmarks

Compare graph generation implementations. Either executing a new process, or calling a WASM assembly.

```
$ pnpm i
$ npm test

generate-graph:
  exec x 3.20 ops/sec ±1.01% (20 runs sampled)
  wasm x 451 ops/sec ±96.00% (81 runs sampled)
  fastest is wasm
```
