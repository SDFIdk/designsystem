import { readdir } from 'node:fs/promises'

import { writeToFile, readHTML } from './shared.js'

// Build CSS utility classes doc
export async function buildCSSUtilDoc() {
  const docs_dir = 'src/scss'
  const cssCommentRegex = /\/\*{2}[\s\w\*@'\-]+\*\/\s\.[\w-\d]+/g
  let markup = ''

  markup += await readHTML('src/html/blocks/header.html')
  markup += '<main class="ds-container"><h2>CSS utility classes</h2><table><thead><tr><th>class</th><th>Beskrivelse</th><th>Relateret CSS var</th></tr></thead><tbody>'

  try {
    const files = await readdir(docs_dir, {recursive: true})
    for (const file of files) {
      if (file.match(/scss/g)) {
        const scssSource = await readHTML(`${ docs_dir }/${ file }`)
        let matches = scssSource.matchAll(cssCommentRegex)
        for (const m of matches) {
          const parsed = m[0].split(/\/\*\*\s+|\*\s+|\*\/\s+/g)
          const infoArr = ['', '', '']
          markup += '<tr>'
          for (const p of parsed) {
            if (p.match(/\.\w/g)) {
              infoArr[0] = p
            } else if (p.match(/@var/g)) {
              infoArr[2] += p.substring(5)
            } else if (p) {
              infoArr[1] += p
            }
          }
          infoArr.forEach((i) => {
            markup += `<td>${ i }</td>`
          })
          markup += '</tr>'
        }
      }
    }
  } catch (err) {
    console.error(err)
  }

  markup += '</tbody></table></main>'
  markup += await readHTML('src/html/blocks/footer.html')

  await writeToFile(markup, './docs/css-util.html')

  console.log('Done building CSS utilities docs 👍')
}