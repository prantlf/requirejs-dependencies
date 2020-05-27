declare module requirejsDependencies {
  interface Options {
    module: string
    rootDir: string
    config?: string | object
  }

  interface Result {
    traced: Dependency[]
    time: number
  }

  interface Dependency {
    id: string
    path: string
    dependents?: string[]
  }

  export function traceDependencies (options: Options): Promise<Result>
}
