const path = require('path')
const fs = require('fs')
const fg = require('fast-glob')
const crypto = require('crypto')

const indexPath = fs.existsSync('public') ? 'public/' : ''
const assetsDir = `${indexPath}assets`
const assetFiles = fg.sync(`${assetsDir}/{css,js}/**/*.{css,js}`)
const manifest = {}
const hashedFilenameRegExp = /\w{8}\.(css|js)$/

/**
 * Returns a 8-digit hash for a given file
 *
 * @param {string} path Path to the file
 * @returns {string} The generated hash
 */
function createHash (path) {
  const buffer = fs.readFileSync(path)
  const sum = crypto.createHash('sha256').update(buffer)
  const hex = sum.digest('hex')
  return hex.substr(0, 8)
}

/**
 * Trim the index dir from a given path
 *
 * @param {string} path Path to the file
 * @returns {string} Cleaned path
 */
function trimIndex (path) {
  return path.replace(new RegExp(`^${indexPath}`), '')
}

for (const filePath of assetFiles) {
  const dirname = path.dirname(filePath)
  const extension = path.extname(filePath)
  const filename = path.basename(filePath)

  // Make sure file hasn't been hashed already
  if (hashedFilenameRegExp.test(filename)) continue

  const hash = createHash(filePath)
  const newFilename = `${filename.substring(0, filename.indexOf(extension))}.${hash}${extension}`
  const newFilePath = `${dirname}/${newFilename}`
  fs.renameSync(filePath, newFilePath)

  manifest[trimIndex(filePath)] = trimIndex(newFilePath)
}

fs.writeFileSync(`${assetsDir}/manifest.json`, JSON.stringify(manifest, null, 2))
