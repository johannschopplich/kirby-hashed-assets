import 'dotenv/config.js'
import fg from 'fast-glob'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const inputDir = 'src/js'
const inputFiles = []
const outputDir = 'public/assets/js'
const templateDir = 'templates'

const production = !process.env.ROLLUP_WATCH
const sourcemap = !production ? 'inline' : false

for (const path of fg.sync([
  '*.js',
  `${templateDir}/*.js`
], { cwd: inputDir })) {
  inputFiles.push(path)
}

/**
 * Create Rollup outout options for a specific file
 *
 * @param {string} path Path to handle
 * @returns {object} Rollup option for the script
 */
const createOutput = path => {
  const isTemplate = path.startsWith(templateDir)

  return {
    input: `${inputDir}/${path}`,
    output: {
      dir: isTemplate ? `${outputDir}/${templateDir}` : outputDir,
      format: 'es',
      sourcemap
    },
    preserveEntrySignatures: false,
    plugins: [
      replace({
        __DEV__: !production,
        __PROD__: production,
        __MODE__: production ? 'production' : 'development'
      }),
      resolve(),
      commonjs(),
      production && terser()
    ]
  }
}

/**
 * Create the Rollup export array of objects
 *
 * @returns {Array} The Rollup export
 */
const createExport = () => inputFiles.map(i => createOutput(i))

export default createExport()
