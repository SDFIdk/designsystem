import { buildIconDoc, buildIconSVG } from './build-docs-icons.js'
import { buildCSSDoc } from './build-docs-css.js'
import { buildComponentDoc } from './build-docs-components.js'
import { buildLogoDoc } from './build-docs-logos.js'
import { buildExamples } from './build-examples.js'
import { buildCSSUtilDoc } from './build-docs-css-util.js'

buildCSSDoc()
buildIconDoc()
buildIconSVG()
buildComponentDoc()
buildLogoDoc()
buildExamples()
buildCSSUtilDoc()