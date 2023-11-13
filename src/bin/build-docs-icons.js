import { open, readdir } from 'node:fs/promises'
import { filenameToId, writeToFile, readHTML } from './shared.js'

async function generateDocContent(svg_dir) {
  let filehandle
  let html = ''
  let toc = '<nav id="toc-icons">'
  let index_css = ''
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
      // Update index CSS
      index_css += addCSStoIndex(file)
    }
  } catch (err) {
    console.error(err)
  } finally {
    toc += '</nav>'
    return [html, toc, index_css]
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
        <h3 class="h5">SVG sprite</h3>
        <pre><code>&lt;svg>&lt;use href="PATH/designsystem-icons.svg#${ shortname }">&lt;/svg></code></pre>
        <p><em>Husk at ændre PATH til din egen opsætning.</em></p>
        <h3 class="h5">SVG embed</h3>
        <pre><code>${ svg.replaceAll('<', '&lt;') }</code></pre>
        <h3 class="h5">CSS</h3>
        <pre><code>@import "@dataforsyningen/icons/css/${ shortname }.css";</code></pre>
        <p>Brug i HTML:</p>
        <pre><code>&lt;span class="ds-icon-${ shortname }">&lt;/span></code></pre>
        <p>CSS custom property:</p>
        <pre><code>--ds-icon-${ shortname }</code></pre>
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
    <a href="#${ shortname }"><svg><use href="../assets/designsystem-icons.svg#${ shortname }"></svg></a>
  `
  return html
}

async function writeCSSsnippet(filename, svg) {
  const shortname = filenameToId(filename)
  const escaped_svg = encodeURIComponent(svg.replace(/(\r\n)+/gi, ''))
  const css = `
    :root {
      --ds-icon-${ shortname }: url('data:image/svg+xml;utf8,${ escaped_svg }');
    }
    .ds-icon-${ shortname }::before {
      background-image: var(--ds-icon-${ shortname });
    }
  `
  let filehandle
  try {
    filehandle = await open(`./assets/css/${ filenameToId(filename) }.css`, 'w')
    filehandle.writeFile(css, 'utf8')
  } catch (error) {
    console.error('there was an error:', error.message)
  } finally {
    await filehandle?.close()
  }
}

function addCSStoIndex(filename) {
  return `
@import "assets/css/${ filenameToId(filename) }.css";
  `
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
  const classRegex = /class=".+"/g
  const viewBoxAttr = svg.match(viewBoxRegex)
  const classAttr = svg.match(classRegex)
  const newSvg = svg.replaceAll(svgRegex, '')
  return `<symbol id="${ id }" width="100%" height="100%"${ viewBoxAttr ? ' ' + viewBoxAttr[0] : '' }${ classAttr ? ' ' + classAttr[0] : '' }>${ newSvg }</symbol>`
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
  markup += await readHTML('./src/html/blocks/footer.html')
  markup += '</main>'

  // Write HTML file
  await writeToFile(markup, './docs/icons.html')

  // Write new index CSS file
  const index_css = icon_content[2]
  await writeToFile(index_css, './assets/designsystem-icons.css')

  console.log('Done building icon docs 👍')
}
