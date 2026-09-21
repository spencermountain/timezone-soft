# Retired maintenance scripts

`add-metas.js.txt` preserves the former metazone import experiment, including local
edits made before this cleanup. It depended on the absent `data/meta-zones.js` and
is retained as reference text, not an executable maintenance command.

The supported workflow is to edit `data/metas.js` and zone references, then run
`npm run validate:data` and `npm run check`. Old unused `byOffset.js` guesses and
the duplicate root version file were removed; runtime version data is generated
from `package.json` into `src/generated/version.js`.
