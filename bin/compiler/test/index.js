import { readHTML } from '../../shared.js'
import { cssDocCompiler } from '../index.js'

const scssSource = await readHTML('../../src/scss/layout/_container.scss')
console.log(cssDocCompiler(scssSource))