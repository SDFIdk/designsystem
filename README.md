# Klimadatastyrelsen Designsystem

Common design system for Klimadatastyrelsen with CSS, icons, UI components, and logo images.

## Read the documentation

Documentation is available at [sdfidk.github.io/designsystem/](https://sdfidk.github.io/designsystem/)

You can also build and read the docs locally.

1. Clone this repo.
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

You can load the styles directly from CDN. 
```html
<head>
  ...
  <link rel="stylesheet" href="https://cdn.dataforsyningen.dk/assets/designsystem/v8/designsystem.css">
  ...
<head>
```

Or you can find the designsystem stylesheet in [assets/designsystem.css](./assets/designsystem.css). Copy it to your project and include the stylesheet by add a reference in the `head` section of your HTML pages.
```html
<head>
  ...   
  <link rel="stylesheet" href="YOUR_PATH/designsystem.css">
  ...
<head>
```

#### Icons (SVG)

You can find all designsystem icons in [assets/icons](./assets/icons). You can copy and use them individually or use the entire icon set as a single SVG file: [assets/icons.svg](./assets/icons.svg)

When using the single SVG, you just add an `svg` element to your markup and display your icon of choice with `use`.
Here is an example where we display the `notification` icon:
```html
<svg><use href="YOUR_PATH/icons.svg#notification" /></svg>
```

Icons are also available via CDN. **Note that custom styling is not available this way.**
```html
<img src="https://cdn.dataforsyningen.dk/assets/designsystem/v8/icons/notification.svg" alt="">
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

```
npm i @dataforsyningen/designsystem --save
```

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
import svgIcon from '@dataforsyningen/designsystem/icons.svg'

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