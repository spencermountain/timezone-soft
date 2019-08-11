import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/spacetime-informal.mjs',
        format: 'esm'
      }
    ],
    plugins: [resolve(), json(), commonjs()]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/spacetime-informal.js',
        format: 'umd',
        sourcemap: true,
        name: 'informal'
      }
    ],
    plugins: [resolve(), json(), commonjs(), babel()]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/spacetime-informal.min.js',
        format: 'umd',
        name: 'informal'
      }
    ],
    plugins: [resolve(), json(), commonjs(), babel(), terser()]
  }
]
