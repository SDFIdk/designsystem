let tokens
let current = 0
let context

/* Type functions */

function commentOpen() {
  const node = {type: 'COMMENT', body: []}
  while (!isAtEnd() && peek().type !== 'COMMENT_END') {
    advance()
    node.body.push(walk())
  }
  return node
}

/* Core parser functions */

function match(...types) {
  for (const type of types) {
    if (check(type)) {
      advance()
      return true
    }
  }
  return false
}

function check(type) {
  if (isAtEnd()) {
    return false
  } else {
    return peek().type === type
  }
}

function advance() {
  if (!isAtEnd()) {
    current++
  }
  return previous()
}

function isAtEnd() {
  return current >= tokens.length
}

function peek() {
  return tokens[current]
}

function previous() {
  return tokens[current - 1]
}

function walk() {
  switch(peek().type) {
    case 'COMMENT_OPEN':
      return commentOpen()
    default:
      throw new TypeError(`Unexpected token: ${peek().type}, ${peek().value}`)
  }
}

function parser(tokenArr) {
  current = 0
  tokens = tokenArr
  console.log(tokens.length, current)
  const ast = {
    type: 'ast',
    body: []
  }
  try {
    while (!isAtEnd()) {
      ast.body.push(walk())
      advance()
    }
    return ast
  } 
  catch(err) {
    console.log('Parsing aborted:', err)
  }
}

export {
  parser
}