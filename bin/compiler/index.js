import { scanTokens } from './lexer.js' 
import { parser } from './parser.js'
import { utilDataGenerator, varDataGenerator } from './generator.js'

function cssDocCompiler(input) {
  const tokens = scanTokens(input)
  const ast = parser(tokens)
  return ast
}

export {
  cssDocCompiler
}