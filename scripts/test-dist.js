/* eslint-disable no-console */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { runInNewContext } from 'node:vm'
import { rollup } from 'rollup'
import soft from 'timezone-soft'
import configs from '../rollup.config.js'

const require = createRequire(import.meta.url)
const check = (lib, label) => {
  assert.equal(typeof lib, 'function', label)
  assert.equal(lib('milwaukee')[0].iana, 'America/Chicago', label)
  assert.equal(lib('UTC+0')[0].standard.offset, 0, label)
  assert.equal(lib('UTC+14')[0].standard.offset, 14, label)
  assert.equal(lib('UTC-5')[0].long, '(UTC-5:00) Coordinated Universal Time', label)
  assert.equal(lib('Toronto')[0].daylight.abbr, 'EDT', label)
  assert.equal(lib('Asia/Kolkata')[0].daylight, null, label)
  assert.equal(lib('not a timezone').length, 0, label)
  console.log(`✓ ${label}`)
}

check(soft, 'package ESM import')
check(require('timezone-soft'), 'package CommonJS require')
check(require('../builds/timezone-soft.min.cjs'), 'minified CommonJS require')
for (const filename of ['timezone-soft.cjs', 'timezone-soft.min.cjs']) {
  const context = {}
  runInNewContext(readFileSync(new URL(`../builds/${filename}`, import.meta.url), 'utf8'), context)
  check(context.timezoneSoft, `standalone browser ${filename}`)
}

// Exercise Rollup itself to ensure unresolved imports cannot silently ship.
for (const config of configs) {
  await assert.rejects(() => rollup({
    ...config,
    input: 'virtual-entry',
    plugins: [{
      name: 'unresolved-import-fixture',
      resolveId: id => id === 'virtual-entry' ? id : null,
      load: id => id === 'virtual-entry' ? "import missing from 'missing-dependency-fixture'; export default missing" : null
    }]
  }), /missing-dependency-fixture/)
}
console.log('✓ unresolved imports fail every build configuration')
