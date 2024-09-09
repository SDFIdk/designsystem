import { readdir } from 'node:fs/promises'
import { writeToFile, readHTML } from './shared.js'

function replaceFunc(replaceVal) {
  return new String(Math.round( new Number(replaceVal) * 100 ) / 100)
}

function shortenDigits(svg) {
  let newSvg = svg.replaceAll(/\d\.\d{3,}/g, replaceFunc)
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
    }
    
  } catch (err) {
    console.error(err)
  }

  console.log(`Done optimizing SVG files 👍`)
}

optimizeSVG({dir: false, file: 'assets/icons/quote.svg', dryRun: true})