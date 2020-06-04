declare module requirejsDependencies {
  interface Dependency {
    id: string
    path?: string
    deps?: string[]
    dependents?: string[]
  }

  interface TraceSingleOptions {
    module: string
    rootDir: string
    config?: string | object
  }

  interface TraceSingleResult {
    traced: Dependency[]
    time: number
  }

  interface TraceManyOptions {
    modules: string[]
    rootDir: string
    config?: string | object
  }

  interface TraceManyResult {
    traced: { [key: string]: Dependency[] }
    time: number
  }

  type TracedInput = Dependency[][] | { [key: string]: Dependency[] }

  interface BundleImplodingOptions {
    traced: TracedInput
    bundles: { [key: string]: string[] }
    explodeBundles?: string[]
    implodeCurrentBundle?: boolean
    tracedBundle?: string
  }

  export function traceSingle (options: TraceSingleOptions): Promise<TraceSingleResult>
  export function traceMany (options: TraceManyOptions): Promise<TraceManyResult>
  export function getUnion (traced: TracedInput): Dependency[]
  export function getIntersection (traced: TracedInput): Dependency[]
  export function implodeBundleDependencies (options: BundleImplodingOptions): TracedInput
  export function loadConfig (path: string): object
  export function formatMilliseconds (duration: number): string
}
