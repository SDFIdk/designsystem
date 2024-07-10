import { tokenizer } from './lexer.js' 
import { parser } from './parser.js'
import {utilDataGenerator, varDataGenerator} from './generator.js'

function cssDocCompiler(input) {
  const tokens = tokenizer(input)
  const ast = parser(tokens)
  /*
  return {
    utilClassList: utilDataGenerator(ast), 
    varList: varDataGenerator(ast)
  }
  */
}

export {
  cssDocCompiler
}