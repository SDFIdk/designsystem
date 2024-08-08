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
async function optimizeSVG(docs_dir, options) {
  try {
    const files = await readdir(docs_dir)
    for (const file of files) {
      if (/\.svg/.test(file)) {
        const svgContent = await readHTML(`${ docs_dir }/${ file }`)
        if (options.dryRun) {
          console.log(`---- Comparing ${ file } ----`)
          console.log(`---- before ----`)
          console.log(svgContent)
          console.log(`---- after ----`)
          console.log(shortenDigits(svgContent))
        } else {
          await writeToFile(shortenDigits(svgContent), `${ docs_dir }/${ file }`)
        }
      }
    }
  } catch (err) {
    console.error(err)
  }

  console.log(`Done optimizing SVG files in ${ docs_dir } 👍`)
}

optimizeSVG('assets/icons', {dryRun: true})