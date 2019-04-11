const path = require('path')
const fs = require('fs-extra')
const mime = require('mime-types')
const testSuites = require('../lib/basic-file-access.json')

const errorCb = (err) => {
  if (err) throw err
}

for (const suite of testSuites) {
  for (const request of suite.requests) {
    const file = request.target || request
    const type = mime.contentType(file)
    let content = {
      'Content-Type': type || null,
      'Content-Encoding': null
    }
    if (suite.default && suite.default.responseHeaders) {
      content = Object.assign(content, suite.default.responseHeaders)
    }
    if (request.responseHeaders) {
      content = Object.assign(content, request.responseHeaders)
    }
    fs.outputJsonSync(`fixtures/${file}`, content)
  }
}

for (const folder of ['/', '.well-known/', '.well-known/test/']) {
  fs.outputFile(`fixtures/${folder}.hidden_directory/test.html`, '', errorCb)
}

fs.copy(path.join(__dirname, 'pre-fixtures'), 'fixtures', errorCb)
