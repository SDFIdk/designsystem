import { tokenizer } from './lexer.js' 

function parser(tokens) {
  return tokens
}

function dataGenerator(ast) {
  return {
    description: 'desc',
    variable: 'varStr',
    class: 'classStr'
  }
}

function cssCommentsCompiler(input) {
  const tokens = tokenizer(input)
  console.log(tokens)
  const ast = parser(tokens)
  const output = dataGenerator(ast)
  return output
}

export {
  cssCommentsCompiler
}