import { open, readdir } from 'node:fs/promises'
import { filenameToId, writeToFile, readHTML } from './shared.js'

async function generateDocContent(svg_dir) {
  let filehandle
  let html = ''
  let toc = '<nav id="toc-icons">'
  try {
    const files = await readdir(svg_dir)
    for (const file of files) {

      try {
        filehandle = await open(`${ svg_dir }/${ file }`, 'r+')
        filehandle.readFile('utf8').then(async function(svg) {

          // This is where the magic happens
          html += await buildHTMLsnippet(file, svg)
          toc += await buildTOCsnippet(file)
        })
      } catch (error) {
        console.error('there was an error:', error.message)
      } finally {
        await filehandle?.close()
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    toc += '</nav>'
    return [html, toc]
  }
}

async function buildHTMLsnippet(filename, svg) {
  const shortname = filenameToId(filename)
  const html = `
  <article id="${ shortname }" class="icon-details">
    <h2>
      <span class="display-svg">${ svg }</span> <span>${ shortname }</span>
    </h2> 
    <div class="icon-container">  
      <div>
        <code-view title="SVG sprite">
<svg><use href="PATH/designsystem-icons.svg#${ shortname }" /></svg>
        </code-view>
        <p><em>Husk at angive korrekt PATH til <code>designsystem-icons.svg</code></em></p>
        <code-view title="SVG embed">
${ svg }
        </code-view>
        <!--
        <h3>ds-icon web component</h3>
        <ds-icon class="${ shortname }"></ds-icon>
        <pre><code>&lt;ds-icon class="${ shortname }">&lt;/ds-icon></code></pre>
        -->
      </div>
    </div>
    <p><a href="#content-top">Til oversigt</a></p>
  </article>
  `
  return html
}

async function buildTOCsnippet(filename) {
  const shortname = filenameToId(filename)
  const html = `
    <a href="#${ shortname }" title="Icon ${ shortname }"><svg><title>Icon ${ shortname }</title><use href="../assets/designsystem-icons.svg#${ shortname }" /></svg></a>
  `
  return html
}

async function generateSVGContent(svg_dir) {
  let filehandle
  let symbols = ''
  try {
    const files = await readdir(svg_dir)
    for (const file of files) {

      try {
        filehandle = await open(`${ svg_dir }/${ file }`, 'r+')
        filehandle.readFile('utf8').then(async function(svgContent) {

          // This is where the magic happens
          symbols += await buildSVGsnippet(svgContent, file)
        })
      } catch (error) {
        console.error('there was an error:', error.message)
      } finally {
        await filehandle?.close()
      }
    }
  } catch (err) {
    console.error(err)
  } finally {
    let finalSvg = '<svg class="ds-svg-icon" xmlns="http://www.w3.org/2000/svg">'
    finalSvg += symbols
    finalSvg += '</svg>'
    return finalSvg
  }
}

async function buildSVGsnippet(svg, filename) {
  const id = filenameToId(filename)
  const svgRegex = /<svg.*?>|<\/svg>|\t|\n|\r/g
  const viewBoxRegex = /viewBox="[\d\s]+"/
  const viewBoxAttr = svg.match(viewBoxRegex)
  const newSvg = svg.replaceAll(svgRegex, '')
  return `<symbol id="${ id }" height="100%" width="100%" ${ viewBoxAttr ? ' ' + viewBoxAttr[0] : '' } fill="none">${ newSvg }</symbol>`
}

export async function buildIconSVG() {
  console.log('Building SVG sprites')

  // Build SVG
  let markup = await generateSVGContent('./assets/icons')

  // Write SVG file
  await writeToFile(markup, './assets/designsystem-icons.svg')

  console.log('Done building SVG sprite 👍')
}


export async function buildIconDoc() {
  console.log('Building documentation')

  // Build HTML
  let markup = ''
  let icon_content = await generateDocContent('./assets/icons')

  markup += await readHTML('./src/html/blocks/header.html')
  markup += '<main class="ds-container" id="content-top">'
  markup += '<h2>Ikoner</h2>'
  markup += icon_content[1]
  markup += await readHTML('./src/html/articles/icons/icon_instructions.html')
  markup += icon_content[0]
  markup += '</main>'
  markup += await readHTML('./src/html/blocks/footer.html')

  // Write HTML file
  await writeToFile(markup, './docs/icons.html')

  console.log('Done building icon docs 👍')
}
