/* eslint-disable no-console */
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'node:fs'

const pkg = JSON.parse(fs.readFileSync('./package.json').toString())
console.log('\n 📦  - running rollup..\n')

const banner = `/* spencermountain/${pkg.name} ${pkg.version} ${pkg.license} */`

const onwarn = (warning, warn) => {
  if (warning.code === 'UNRESOLVED_IMPORT' || warning.code === 'MISSING_GLOBAL_NAME') {
    throw new Error(warning.message)
  }
  warn(warning)
}

export default [
  {
    input: 'src/index.js',
    output: [{ banner, file: 'builds/timezone-soft.mjs', format: 'esm' }],
    plugins: [nodeResolve()]
  },
  {
    input: 'src/index.js',
    output: [{ banner, file: 'builds/timezone-soft.cjs', format: 'umd', name: 'timezoneSoft' }],
    plugins: [nodeResolve()]
  },
  {
    input: 'src/index.js',
    output: [{ banner, file: 'builds/timezone-soft.min.cjs', format: 'umd', name: 'timezoneSoft' }],
    plugins: [nodeResolve(), terser()]
  }
].map(config => ({ ...config, onwarn }))
