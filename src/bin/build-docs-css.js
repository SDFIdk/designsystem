import { open, readdir } from 'node:fs/promises'

import { writeToFile, readHTML } from './shared.js'

// Build HTML

const docs_dir = 'src/html'
let markup = ''

markup += await readHTML('src/html/_header.html')

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

markup += await readHTML('src/html/_footer.html')

await writeToFile(markup, './docs/css.html')

console.log('Done 👍')
