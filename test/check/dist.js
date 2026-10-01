/* eslint-disable no-console */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { rollup } from 'rollup'
import soft from 'timezone-soft'
import config from '../../rollup.config.js'

const require = createRequire(import.meta.url)
const check = (lib, label) => {
  assert.equal(typeof lib, 'function', label)
  assert.equal(lib('milwaukee')[0].iana, 'America/Chicago', label)
  assert.equal(lib('UTC+0')[0].standard.offset, 0, label)
  assert.equal(lib('UTC+14')[0].standard.offset, 14, label)
  assert.equal(lib('UTC-5')[0].long, '(UTC-05:00) Coordinated Universal Time', label)
  assert.equal(lib('Toronto')[0].daylight.abbr, 'EDT', label)
  assert.equal(lib('Asia/Kolkata')[0].daylight, null, label)
  assert.equal(lib('not a timezone').length, 0, label)
  assert.equal(lib('Springfield, Missouri')[0].iana, 'America/Chicago', label)
  assert.equal(lib('CST China')[0].iana, 'Asia/Shanghai', label)
  console.log(`✓ ${label}`)
}

check(soft, 'package ESM import')
check(require('timezone-soft'), 'package CommonJS require')
for (const filename of ['timezone-soft.min.js']) {
  const context = {}
  runInNewContext(readFileSync(new URL(`../../builds/${filename}`, import.meta.url), 'utf8'), context)
  check(context.timezoneSoft, `standalone browser ${filename}`)
}

// Exercise Rollup itself to ensure unresolved imports cannot silently ship.
await assert.rejects(() => rollup({
  ...config,
  input: 'virtual-entry',
  plugins: [{
    name: 'unresolved-import-fixture',
    resolveId: id => id === 'virtual-entry' ? id : null,
    load: id => id === 'virtual-entry' ? "import missing from 'missing-dependency-fixture'; export default missing" : null
  }]
}), /missing-dependency-fixture/)

const bundle = await rollup({
  ...config,
  input: 'virtual-entry',
  external: ['missing-global-fixture'],
  plugins: [{
    name: 'missing-global-fixture',
    resolveId: id => id === 'virtual-entry' ? id : null,
    load: id => id === 'virtual-entry' ? "export { default } from 'missing-global-fixture'" : null
  }]
})
try {
  await assert.rejects(() => bundle.generate({ format: 'umd', name: 'fixture' }), /missing-global-fixture/)
} finally {
  await bundle.close()
}
for (const output of config.output) {
  const source = readFileSync(new URL(`../../${output.file}`, import.meta.url), 'utf8')
  assert.match(source, /^\/\*! spencermountain\/timezone-soft .* MIT \*\//, `${output.file} license banner`)
}
console.log('✓ unresolved imports, missing globals, and license banners')
