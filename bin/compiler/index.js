import { tokenizer } from './lexer.js' 
import { parser } from './parser.js'
import {utilDataGenerator, varDataGenerator} from './generator.js'

function cssDocCompiler(input) {
  const tokens = tokenizer(input)
  console.log(tokens)
  const ast = parser(tokens)
  return ast
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