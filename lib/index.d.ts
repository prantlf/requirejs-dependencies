declare module requirejsDependencies {
  interface Dependency {
    id: string
    path: string
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

  export function traceSingle (options: SingleOptions): Promise<SingleResult>
  export function traceMany (options: ManyOptions): Promise<ManyResult>
  export function getUnion (traced: Dependency[][]): Dependency[]
  export function getIntersection (traced: Dependency[][]): Dependency[]
}
