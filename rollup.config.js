import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'

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
      babel({
        babelrc: false,
        presets: ['@babel/preset-env']
      }),
      ,
      terser()
    ]
  }
]
