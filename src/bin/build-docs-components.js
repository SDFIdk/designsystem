import { readdir } from 'node:fs/promises'

import { writeToFile, readHTML } from './shared.js'

// Build HTML
export async function buildComponentDoc() {
  const docs_dir = 'src/html/articles/components'
  let markup = ''

  markup += await readHTML('src/html/blocks/header.html')
  markup += '<main>'
  markup += await readHTML('src/html/blocks/toc-components.html')

  try {
    const files = await readdir(docs_dir)
    for (const file of files) {
      if (file.substring(0,1) !== '_') { // Don't read layout HTML files
        markup += await readHTML(`${ docs_dir }/${ file }`)
      }
    }
  } catch (err) {
    console.error(err)
  }

  markup += '</main>'

  markup += await readHTML('src/html/blocks/footer.html')

  await writeToFile(markup, './docs/components.html')

  console.log('Done 👍')
}
