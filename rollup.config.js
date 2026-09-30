import sizeCheck from 'rollup-plugin-filesize-check'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'node:fs'

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

const banner = `/*! spencermountain/${pkg.name} ${pkg.version} ${pkg.license} */`

export default {
  input: 'src/index.js',
  plugins: [nodeResolve()],
  onwarn(warning, warn) {
    if (warning.code === 'UNRESOLVED_IMPORT' || warning.code === 'MISSING_GLOBAL_NAME') {
      throw new Error(warning.message)
    }
    warn(warning)
  },
  output: [
    {
      banner,
      file: 'builds/timezone-soft.js',
      format: 'esm'
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
      name: 'timezoneSoft',
      plugins: [
        terser({ format: { comments: /^!/ } }),
        sizeCheck({
          expect: 87, // sizes in kb
          warn: 10, // acceptable change (+/-)
          throw: 25 // unacceptable change (+/-)
        })
      ]
    }
  ]
}
