interface ServerOptions {
  host?: string
  port?: number
  rootDir: string
  config?: string | object
}

interface ServerResult {
  host: string
  port: number
}

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

interface Tree { [key: string]: string[] }

interface ClusterOptions {
  bgcolor?: string
  layout?: 'dot' | 'neato' | 'fdp' | 'sfdp' | 'twopi' | 'circo' | 'osage' | 'patchwork'
  overlap?: boolean
  pad?: number
  rankdir?: 'LR' | 'RL' | 'TB' | 'BT'
  style?: 'solid' | 'dashed' | 'dotted' | 'bold' | 'rounded' | 'filled' | 'striped'
}

interface ShapeOptions {
  color?: string
}

interface NodeOptions extends ShapeOptions {
  color?: string
  fontcolor?: string
  fontname?: string
  fontsize?: 14
  height?: number
  shape?: 'box' | 'polygon' | 'ellipse' | 'oval' | 'circle' | 'point' |
  'egg' | 'triangle' | 'plaintext' | 'plain' | 'diamond' | 'trapezium' |
  'parallelogram' | 'house' | 'pentagon' | 'hexagon' | 'septagon' |
  'octagon' | 'doublecircle' | 'doubleoctagon' | 'tripleoctagon' |
  'invtriangle' | 'invtrapezium' | 'invhouse' | 'Mdiamond' | 'Msquare' |
  'Mcircle' | 'rect' | 'rectangle' | 'square' | 'star' | 'none' |
  'underline' | 'cylinder' | 'note' | 'tab' | 'folder' | 'box3d' |
  'component' | 'promoter' | 'cds' | 'terminator' | 'utr' | 'primersite' |
  'restrictionsite' | 'fivepoverhang' | 'threepoverhang' | 'noverhang' |
  'assembly' | 'signature' | 'insulator' | 'ribosite' | 'rnastab' |
  'proteasesite' | 'proteinstab' | 'rpromoter' | 'rarrow' | 'larrow' | 'lpromoter'
  style?: 'solid' | 'dashed' | 'dotted' | 'bold' | 'rounded' | 'diagonals' |
  'filled' | 'striped' | 'wedged'
}

interface EdgeOptions extends ShapeOptions{
  style?: 'solid' | 'dashed' | 'dotted' | 'bold'
}

interface GraphOptions {
  G?: ClusterOptions
  N?: NodeOptions
  E?: EdgeOptions
  emphasizeDirects?: boolean
  clusterDirects?: boolean
}

interface Graph {
  to_dot: () => string
}

interface RenderResult {
  dot: string
  image: string
}

interface Endpoint {
  host: string
  port: number
}

export function startServer (options: ServerOptions): Promise<ServerResult>
export function traceSingle (options: TraceSingleOptions): Promise<TraceSingleResult>
export function traceMany (options: TraceManyOptions): Promise<TraceManyResult>
export function getUnion (traced: TracedInput): Dependency[]
export function getIntersection (traced: TracedInput): Dependency[]
export function excludePluginDependencies (traced: TracedInput, plugins: string[]): TracedInput
export function implodeBundleDependencies (options: BundleImplodingOptions): TracedInput
export function createTree (traced: Dependency[]): Tree
export function generateGraph (tree: Tree, options?: GraphOptions): Graph
export function renderGraph (graph: Graph, imagePath?: string): Promise<RenderResult>
export function loadConfig (path: string): object
export function printList (dependencies: Dependency[]): void
export function printTree (dependencies: Tree): void
export function printTiming (modules: string[], time: number): void
export function printEndpoint(endpoint: Endpoint): void
export function formatMilliseconds (duration: number): string
export function splitList (string: string): string[]
