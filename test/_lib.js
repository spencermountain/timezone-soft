/* eslint-disable no-console */
const production = process.env.TESTENV === 'prod'
const { default: lib } = await import(production ? '../builds/timezone-soft.js' : '../src/index.js')
if (production) {
  console.log('== production build test 🚀 ==')
}
export default lib
