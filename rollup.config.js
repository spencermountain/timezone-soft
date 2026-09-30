import sizeCheck from 'rollup-plugin-filesize-check'
import terser from '@rollup/plugin-terser'
import fs from 'node:fs'

const pkg = JSON.parse(fs.readFileSync('./package.json').toString())

const banner = `/* spencermountain/${pkg.name} ${pkg.version} ${pkg.license} */`

export default {
  input: 'src/index.js',
  output: [
    {
      banner,
      file: 'builds/timezone-soft.js',
      format: 'esm',
      plugins: [terser()]
    },
    {
      banner,
      file: 'builds/timezone-soft.cjs',
      format: 'cjs'
    },
    {
      banner,
      file: 'builds/timezone-soft.min.js',
      format: 'umd',
      name: 'timezone-soft',
      plugins: [
        terser(),
        sizeCheck({
          expect: 45, // sizes in kb
          warn: 10, // acceptable change (+/-)
          throw: 25 // unacceptable change (+/-)
        })
      ]
    }
  ]
}
