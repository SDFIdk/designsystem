import { open } from 'node:fs/promises'

function filenameToId(filename) {
  const regex1 = /\.svg|icon/gi
  const regex2 = /^_|^-/g
  const regex3 = /__|_|--/g
  return filename.replaceAll(regex1, '').replace(regex2, '').replace(regex3, '-').toLowerCase()
}

async function writeToFile(content, outputfile) {
  let filehandle
  try {
    filehandle = await open(outputfile, 'w')
    filehandle.writeFile(content, 'utf8').then(function() {
      // File was written
    })
  } catch (error) {
    console.error('there was an error:', error.message)
  } finally {
    await filehandle?.close()
  }
}

async function readHTML(path) {
  let filehandle
  let html = ''
  try {
    filehandle = await open(path, 'r+')
    filehandle.readFile('utf8').then(function(contents) {
      html += contents
    })
  } catch (error) {
    console.error('there was an error:', error.message)
  } finally {
    await filehandle?.close()
    return html
  }
}

export {
  filenameToId,
  writeToFile,
  readHTML
}
