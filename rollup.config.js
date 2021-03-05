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
        file: 'builds/timezone-soft.mjs',
        format: 'esm'
      }
    ],
    plugins: [
      resolve(),
      json(),
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      })
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/timezone-soft.js',
        format: 'umd',
        sourcemap: true,
        name: 'timezoneSoft'
      }
    ],
    plugins: [
      resolve(),
      json(),
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      })
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'builds/timezone-soft.min.js',
        format: 'umd',
        name: 'timezoneSoft'
      }
    ],
    plugins: [
      resolve(),
      json(),
      commonjs(),
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      }),
      ,
      terser()
    ]
  }
]
