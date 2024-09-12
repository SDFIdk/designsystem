import { readdir } from 'node:fs/promises'
import { writeToFile, readHTML } from './shared.js'

function replaceFunc(replaceVal) {
  return Math.round(new Number(replaceVal) * 100) / 100
}

function shortenDigits(svg) {
  let newSvg = svg.replaceAll(/\d+\.\d{3,}/g, replaceFunc)
  return newSvg
}

/** 
 * Goes through a folder of SVG files and shortens all numbers therein to a max of 2 digits.
 * Set the `{dryRun: true}` option to only display proposed changes. (Does not write to file.) */
async function optimizeSVG(options) {
  try {

    if (options.dir) {
      const files = await readdir(options.dir)
      for (const file of files) {
        if (/\.svg/.test(file)) {
          const svgContent = await readHTML(`${ options.dir }/${ file }`)
          if (options.dryRun) {
            console.log(`---- Comparing ${ file } ----`)
            console.log(`---- before ----`)
            console.log(svgContent)
            console.log(`---- after ----`)
            console.log(shortenDigits(svgContent))
          } else {
            await writeToFile(shortenDigits(svgContent), `${ options.dir }/${ file }`)
          }
        }
      }
    } else if (options.file) {
      if (/\.svg/.test(options.file)) {
        const svgContent = await readHTML(`${ options.file }`)
        if (options.dryRun) {
          console.log(`---- Comparing ${ options.file } ----`)
          console.log(`---- before ----`)
          console.log(svgContent)
          console.log(`---- after ----`)
          console.log(shortenDigits(svgContent))
        } else {
          await writeToFile(shortenDigits(svgContent), `${ options.file }`)
        }
      }
    } else if (options.string) {
      console.log(`---- Converting string ----`)
      console.log(`---- before ----`)
      console.log(options.string)
      console.log(`---- after ----`)
      console.log('')
      console.log(shortenDigits(options.string))
      console.log('')
    }
    
  } catch (err) {
    console.error(err)
  }

  console.log(`Done optimizing SVG files 👍`)
}

// Handle command line options
const args = process.argv.slice(2)
const options = {dryRun: null, dir: null, file: null, string: null}

if (args.find((arg) => arg === '--dryrun')) {
  options.dryRun = true
}
const fileOptionIdx = args.findIndex((arg) => arg === '--file')
const dirOptionIdx = args.findIndex((arg) => arg === '--dir')
const stringOptionIdx = args.findIndex((arg) => arg === '--string')
if (fileOptionIdx >= 0) {
  options.file = args[fileOptionIdx + 1]
} else if (dirOptionIdx >= 0) {
  options.dir = args[dirOptionIdx + 1]
} else if (stringOptionIdx >= 0) {
  options.string = args[stringOptionIdx + 1]
}

if (!options.file && !options.dir && !options.string) {
  console.log('---')
  console.log('optimize-svg.js: Utility to optimize SVG files by shortening decimal values.')
  console.log(`
    Usage: node optimize-svg.js [args] [file|dir] 

    --help    Get an overview of the possible commands
    --file    Optimize SVG file. Must be followed by path to file
    --dir     Optimize SVG files in directory. Must be followed by directory path
    --string   Optimize a single string of numbers and characters. Must be followed by string
    --dryrun  Output optimizations to console but do not write to file
  `)
} else {
  optimizeSVG({dir: options.dir, file: options.file, dryRun: options.dryRun, string: options.string})
}