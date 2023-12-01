import { readdir } from 'node:fs/promises'
import { writeToFile, readHTML } from './shared.js'

export async function buildLogoDoc() {

  const docs_dir = 'src/html/articles/logos'
  let markup = ''

  markup += await readHTML('src/html/blocks/header.html')
  markup += '<main class="ds-container">'

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

  await writeToFile(markup, './docs/logos.html')

  console.log('Done building logo docs 👍')
}
