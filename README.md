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

## How to use in your project

### Simple setup / buildless

#### Stylesheets

You can find designsystem stylesheets in [assets/designsystem.css](./assets/designsystem.css). Copy it to your project and include the stylesheet by add a reference in the `head` section of your HTML pages.
```
<head>
  ...
  <link rel="stylesheet" href="YOUR_PATH/designsystem.css">
  ...
<head>
```

#### Icons (SVG)

You can find all designsystem icons in [assets/icons](./assets/icons). You can copy and use them individually or use the entire icon set as a single SVG file: [assets/designsystem-icons.svg](./assets/designsystem-icons.svg)

When using the single SVG, you just add an `svg` element to your markup and display your icon of choice with `use`.
Here is an example where we display the `notification` icon:
```
<svg><use href="YOUR_PATH/designsystem-icons.svg#notification" /></svg>
```

#### Javascript

You can find designsystem Javascript in [assets/designsystem.js](./assets/designsystem.js). Copy it to your project and include the script by adding a reference in the `body` section of your HTML pages.

Here is an example where we import all of designsystem Javascript:
```
<body>
  ...
  <script type="module" src="YOUR_PATH/designsystem.js"></script>
<body>
```

Here is an example where we import the `Tabs` component from designsystem Javascript:
```
<body>
  ...
  <script type="module">
    import { Tabs } from YOUR_PATH/designsystem.js
  </script>
<body>
```

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

#### Icons (SVG)

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

#### Javascript

Import designsystem Javascript like you would import any other script. Example with ShowToast:
```
import { showToast } from '@dataforsyningen/designsystem'

showToast('Hello! I am a toast.')
```
