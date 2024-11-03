import { readdir } from 'node:fs/promises'
import { writeToFile, readHTML } from './shared.js'
import { cssCommentsCompiler } from './compiler/index.js'

const cssCommentRegex = /\/\*\*[\s\w\*'@\-\.,()<>/]+\*\/\s&?\.[\w\-\,\.\s]+\{/g

function parseVar(str) {
  let varStr = ''
  let varMatch = str.match(/\@var[\-\w\s]+\*/g)
  if (varMatch) {
    varStr = varMatch[0].substring(4).replace('*', '')
  }
  return varStr
}

function parseClass(str) {
  let classStr = ''
  let match = str.match(/\.[\w\-\,\.\s]+\{/g)
  if (match) {
    classStr = match[0].replace('{', '')
  }
  return classStr
}

function parseDesc(str) {
  let descStr = ''
  let match = str.match(/\*\*[\s\w\*\'\-\.\,]+(\*\/|\@)/g)
  if (match) {
    descStr = match[0].replace(/[\@\/\*]/g,'')
  }
  return descStr
}

function parser(string) {

  //const parsedParts = cssCommentsCompiler(string)

  let parsed = []
  let matches = string.matchAll(cssCommentRegex)
  for (let m of matches) {
    const desc = parseDesc(m[0])
    const varStr = parseVar(m[0])
    const classStr = parseClass(m[0])
    parsed.push({
      description: desc,
      variable: varStr,
      class: classStr
    })
  }
  return parsed
}

function extractFilename(filestring) {
  const filenameMatch = filestring.match(/\w+\.css/g)
  const filename = filenameMatch[0].substring(0, filenameMatch[0].length - 5)
  return filename
}

// Build CSS utility classes doc
export async function buildCSSUtilDoc() {
  const docs_dir = 'src/css'
  let markup = ''

  markup += await readHTML('src/html/blocks/header.html')
  markup += `
    <main class="ds-container">
      <h2>CSS utility classes</h2>
      <p>Utility classes gør det nemt at ændre specifikke dele af stylingen på elementer, så det stadig sker i overrensstemmelse med designguiden.</p>
      <table><thead><tr><th>CSS selector(s)</th><th>Beskrivelse</th><th>Anvender CSS property</th></tr></thead><tbody>
  `

  try {
    const files = await readdir(docs_dir, {recursive: true})
    let parsed = []
    for (const file of files) {
      if (file.match(/css/g)) {
        const cssSource = await readHTML(`${ docs_dir }/${ file }`)
        //console.log('processing', file)
        const commentsFound = parser(cssSource)
        if (commentsFound.length < 1) {
          continue
        }
        parsed.push({file: extractFilename(file), output: commentsFound})
      }
    }
    for (const p of parsed) {
      markup += `<tr><th colspan="3">${ p.file }</th></tr>`
      for (const o of p.output) {
        markup += `<tr><td>${ o.class }</td><td>${ o.description }</td><td>${ o.variable }</td></tr>`
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