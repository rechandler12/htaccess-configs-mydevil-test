import { group } from 'k6'
import { options, prepare, test } from './abstract-test.js'

import * as forbiddenFiles from './forbidden-files.js'
import * as ssl from './ssl.js'

const basicFileAccess = JSON.parse(open('./basic-file-access.json'))
const cacheBusting = JSON.parse(open('./cache-busting.json'))
const rewrites = JSON.parse(open('./rewrites.json'))

export { options }

export function setup () {
  const suites = [
    {
      id: 'basic-file-access',
      name: 'check file access',
      setup: prepare(basicFileAccess)
    },
    {
      id: 'cache-busting',
      name: 'check file features',
      setup: prepare(cacheBusting)
    },
    {
      id: 'forbidden-files',
      name: 'check file access',
      setup: forbiddenFiles.setup(),
      fn: 'forbiddenFiles'
    },
    {
      id: 'rewrites',
      name: 'check rewrites',
      setup: prepare(rewrites)
    },
    {
      id: 'ssl',
      name: 'check security',
      setup: ssl.setup(),
      fn: 'ssl'
    }
  ]
  if (__ENV.TESTS) {
    const filter = __ENV.TESTS.split(/[:;,]/).map(test => test.trim())
    return suites.filter(suite => filter.includes(suite.id))
  }
  return suites
}

export default function (units) {
  for (const lib of units) {
    // k6 do not know how to store function in object yet
    // https://github.com/loadimpact/k6/issues/855
    // eslint-disable-next-line no-eval
    group(lib.name, () => (lib.fn ? eval(lib.fn).default : test)(lib.setup))
  }
}
