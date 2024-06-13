import { readdir } from 'node:fs/promises'

import { writeToFile, readHTML } from './shared.js'

// Build HTML
export async function buildExamples() {

  const docs_dir = 'src/html/examples'
  let head = await readHTML('src/html/blocks/example-header.html')
  let foot = await readHTML('src/html/blocks/example-footer.html')

  try {
    const files = await readdir(docs_dir)
    for (const file of files) {
      
      const htmlbody = await readHTML(`${ docs_dir }/${ file }`)

      const html = head + htmlbody + foot

      await writeToFile(html, `./docs/examples/${ file }`)
    }
  } catch (err) {
    console.error(err)
  }

  console.log('Done building examples 👍')
}
