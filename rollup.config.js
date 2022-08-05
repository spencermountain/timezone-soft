import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
export default [
  {
    input: 'src/index.js',
    output: [{ file: 'builds/timezone-soft.mjs', format: 'esm' }],
    plugins: [nodeResolve()]
  },
  {
    input: 'src/index.js',
    output: [{ file: 'builds/timezone-soft.cjs', format: 'umd', name: 'timezoneSoft' }],
    plugins: [nodeResolve()]
  },
  {
    input: 'src/index.js',
    output: [{ file: 'builds/timezone-soft.min.cjs', format: 'umd', name: 'timezoneSoft' }],
    plugins: [nodeResolve(), terser()]
  }
]
