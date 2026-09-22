/* eslint-disable no-console */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const temp = mkdtempSync(join(tmpdir(), 'timezone-soft-package-'))
try {
  const packed = JSON.parse(execFileSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', temp, '--cache', join(temp, 'cache')], { cwd: root, encoding: 'utf8' }))[0]
  const files = new Set(packed.files.map(file => file.path))
  for (const file of ['builds/timezone-soft.mjs', 'builds/timezone-soft.cjs', 'builds/timezone-soft.min.cjs', 'types/index.d.ts', 'types/index.d.cts', 'README.md', 'LICENSE']) {
    assert.ok(files.has(file), `Missing package file: ${file}`)
  }
  const target = join(temp, 'node_modules', 'timezone-soft')
  mkdirSync(target, { recursive: true })
  execFileSync('tar', ['-xzf', join(temp, packed.filename), '--strip-components=1', '-C', target], { env: { ...process.env, LC_ALL: 'C' } })
  // Legacy Node10 resolution pairs main/types and ignores conditional exports.
  const manifest = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8'))
  assert.equal('./' + manifest.main, manifest.exports['.'].require.default)
  assert.equal('./' + manifest.types, manifest.exports['.'].require.types)
  writeFileSync(join(temp, 'package.json'), '{"type":"module"}\n')
  // No dependencies are installed here: every distribution must be self-contained.
  const probe = `
    import assert from 'node:assert/strict'
    import { createRequire } from 'node:module'
    import { readFileSync } from 'node:fs'
    import { runInNewContext } from 'node:vm'
    import soft from 'timezone-soft'
    const require = createRequire(import.meta.url)
    const pkg = JSON.parse(readFileSync('./node_modules/timezone-soft/package.json', 'utf8'))
    const check = lib => {
      assert.equal(lib('milwaukee')[0].iana, 'America/Chicago')
      assert.equal(lib('UTC+0')[0].standard.offset, 0)
      assert.equal(lib.version, pkg.version)
      assert.throws(() => lib(null), /expects a string/)
    }
    check(soft)
    check(require('timezone-soft'))
    for (const file of ['timezone-soft.cjs', 'timezone-soft.min.cjs']) {
      const context = {}
      runInNewContext(readFileSync('./node_modules/timezone-soft/builds/' + file, 'utf8'), context)
      check(context.timezoneSoft)
    }
  `
  writeFileSync(join(temp, 'consumer.mjs'), probe)
  execFileSync(process.execPath, ['consumer.mjs'], { cwd: temp, stdio: 'pipe' })
  for (const file of ['consumer.ts', 'consumer.cts', 'tsconfig.json', 'tsconfig.bundler.json']) {
    copyFileSync(join(root, 'test/types', file), join(temp, file))
  }
  for (const config of ['tsconfig.json', 'tsconfig.bundler.json']) {
    execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(temp, config)], { cwd: temp, stdio: 'pipe' })
  }
  console.log(`✓ ${packed.filename}: isolated ESM, CommonJS, browser, and TypeScript consumers`)
} finally {
  rmSync(temp, { recursive: true, force: true })
}
