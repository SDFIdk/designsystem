# SDFI Designsystem

Common design system for SDFI with CSS, icons, UI components, and logo images.

## Read the documentation

1. Clone this repo or import as noted above.
2. Navigate to folder `designsystem` or `node_modules/@dataforsyningen/designsystem`
3. Open file `index.html` in a browser.

## Build the project yourself

Assuming you have **Node.js** and NPM installed:

First, install dependencies:
```
npm install
```

Then, run this script to build the project:
```
npm run build
```
New files will appear in the `assets` folder.

## How to use in your JS project

### With NPM

Add `@dataforsyningen/designsystem` to your package.json:
```
"dependencies": {
  ...
  "@dataforsyningen/designsystem": "SDFIdk/designsystem"
}
```
(Will publish an NPM package later)

### With esbuild (Javascript/NPM)

Assuming you installed **@dataforsyningen/designsystem** with NPM, you can import various parts of designsystem into your esbuild-project.

#### Stylesheets

Include and build stylesheets in your esbuild script like this:
```
require('esbuild').buildSync({
  entryPoints: ['@dataforsyningen/designsystem/designsystem.css'],
  bundle: true,
  outfile: 'mystyles.css',
})
```

#### Javascript

Import designsystem Javascript like you would import any other script. Example with ShowToast:
```
import { showToast } from '@dataforsyningen/designsystem'

showToast('Hello! I am a toast.')
```

#### SVG icons

Esbuild needs to support loading SVG files. You can setup the `file` loader in your esbuild script like this:
```
require('esbuild').buildSync({
  ...
  loader: { '.svg': 'file' },
  ...
})
```

Then you can import a reference to the svg sprites file and use them in your .js files.
```
import svgIcon from '@dataforsyningen/designsystem/designsystem-icons.svg'

// Using the **notification** icon
const templateString = `
  <svg><use href="${ svgIcon }#notification" /></svg>
`
```
