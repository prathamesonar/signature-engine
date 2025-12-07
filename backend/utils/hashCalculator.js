const crypto = require('crypto')

function calculateHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

module.exports = { calculateHash }