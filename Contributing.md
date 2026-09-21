# Contributing

## Setup

Use Node 24 (`nvm use`), or Node 22.13+ on 22.x / Node 24+. CI checks Node 22, 24,
and 26. npm is the primary package manager and `package-lock.json` is the CI
installation source. The existing pnpm lockfile is retained for contributors
using pnpm; synchronize both lockfiles when changing dependencies.

```sh
npm ci
npm run check
```

`check` runs lint, data validation and generation during the build, source and
built-ESM tests, distribution smoke tests, TypeScript consumer compilation, and
isolated tests of an actual npm tarball. It does not publish anything.

## Layout

```text
data/
  zones/              editable regional zone records
  index.js            shared regional aggregate
  aliases.js          special aliases that cannot be packed normally
  metas.js            display names, abbreviations, standard/daylight offsets
  dst-patterns.js     approximate recurring DST descriptions
src/
  generated/          packed zone data and package version; do not hand-edit
  data/               runtime unpacking and synthetic GMT zones
  find/               input normalization and lookup
  display/            result formatting
scripts/              build, validation, distribution, and package checks
  archive/            retired maintenance-script reference material
test/
  fixtures/           dated snapshots, legacy references, ranking expectations
  types/              ESM, CommonJS, and bundler consumer fixtures
types/                published ESM and CommonJS declarations
builds/               published bundles, committed with relevant changes
```

## Add an alias

1. Find the zone under `data/zones/` and add the lowercase spelling to `names`.
   Use `data/aliases.js` only for strings that do not round-trip through the packer.
2. Add a focused case in `test/find.test.js`. Test ambiguous or easily confused
   inputs as well as the new spelling.
3. Run `npm run check`. Inspect any changes to the `CST`, `IST`, or `BST` ranking
   fixtures; do not automatically regenerate them to dismiss a failure.
4. Include regenerated `src/generated/` and `builds/` files with the source change.

Alias counts affect ranking. A change that reorders candidates is observable API
behavior and should be explained in the changelog and review description.

## Add or update a zone

Read [data/README.md](data/README.md) first. Add the regional record, verify its
metazone and any DST pattern, and include the source URL and source release/date
in the change description. Test all returned candidates, offsets, abbreviations,
and ambiguity introduced by the new record. Add new IDs to the historical
compatibility tests only when appropriate; do not rename an old snapshot to imply
that it contains current data.

The runtime Intl test checks the installed Node/ICU timezone list and prints its
versions. New omissions fail the suite. Two existing omissions are explicitly
listed in `test/fixtures/intl-known-gaps.js` and the README; remove an exception
when its record is implemented. This tests name coverage, not DST correctness.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run validate:data` | Check editable record shapes and references |
| `npm run pack` | Validate and regenerate packed zone data |
| `npm run build` | Generate data/version and rebuild all bundles |
| `npm test` | Source tests |
| `npm run testb` | Built-ESM tests |
| `npm run test:dist` | ESM, CJS, browser, and warning-enforcement checks |
| `npm run test:types` | Compile TypeScript consumers |
| `npm run test:package` | Pack and test an isolated release artifact |
| `npm run check` | All of the above plus lint |

`npm run pack` is the data generator; `npm pack` creates a release tarball.
`test:package` needs the `tar` command and removes its own temporary directory.

## Release process

1. Update the Unreleased changelog entry and select the release version. Run
   `npm version <version> --no-git-tag-version` to update npm metadata; synchronize
   the pnpm lockfile if dependency specifications changed.
2. Run `npm run check` and review the regenerated version, packed data, and builds.
   Commit generated files with their source changes. CI rejects stale generated
   artifacts after rebuilding them.
3. Run `npm pack` and inspect the file list. Its `prepack` hook rebuilds the
   bundles; the package tests use `--ignore-scripts` to avoid recursive checks.
4. After CI passes and the release is approved, publish with `npm publish`, then
   tag the release. `prepublishOnly` runs the full check before a source publish.
   Publishing a previously created tarball requires separately validating that
   exact artifact; npm lifecycle checks on the source are not a substitute.

Publishing is a manual maintainer action. The CI workflow has read-only repository
permissions and no publishing credentials.
