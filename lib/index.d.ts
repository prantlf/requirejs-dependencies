declare module requirejsDependencies {
  interface Dependency {
    id: string
    path?: string
    deps?: string[]
    dependents?: string[]
  }

  interface SingleOptions {
    module: string
    rootDir: string
    config?: string | object
  }

  interface SingleResult {
    traced: Dependency[]
    time: number
  }

  interface ManyOptions {
    modules: string[]
    rootDir: string
    config?: string | object
  }

  interface ManyResult {
    traced: { [key: string]: Dependency[] }
    time: number
  }

  type TracedInput = Dependency[][] | { [key: string]: Dependency[] }

  export function traceSingle (options: SingleOptions): Promise<SingleResult>
  export function traceMany (options: ManyOptions): Promise<ManyResult>
  export function getUnion (traced: TracedInput): Dependency[]
  export function getIntersection (traced: TracedInput): Dependency[]
  export function shrinkBundleDependencies (traced: TracedInput): TracedInput
}
