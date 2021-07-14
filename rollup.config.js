import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: [{ file: 'builds/timezone-soft.mjs', format: 'esm' }],
    plugins: []
  },
  {
    input: 'src/index.js',
    output: [{ file: 'builds/timezone-soft.cjs', format: 'umd', name: 'timezoneSoft' }],
    plugins: []
  },
  {
    input: 'src/index.js',
    output: [{ file: 'builds/timezone-soft.min.cjs', format: 'umd', name: 'timezoneSoft' }],
    plugins: [terser()]
  }
]
