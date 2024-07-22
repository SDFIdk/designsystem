let current
let tokens
let context

function isAtEnd() {
  return current >= tokens.length ? true : false
}

function match(typeArr) {
  for (const type of typeArr) {
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

function peek() {
  return tokens[current]
}

function previous() {
  return tokens[current - 1]
}

function advance() {
  if (!isAtEnd()) {
    current++
  }
  return previous()
}

function walk() {

  if (peek().type === 'commentStart') {
    context = 'comment'
    let node = {
      type: 'comment',
      body: []
    }
    while (peek().type !== 'commentEnd') {
      advance()
      node.body.push(walk())
    }
    return node
  }

  if (peek().type === 'commentEnd') {
    context = null
    return 'EOL'
  }

  if (context === 'comment' || peek().type === 'unknown') {
    advance()
    return peek().value
  }

  if (peek().type === 'cssRulesStart') {
    context = 'cssRules'
    let node = {
      type: 'cssRules',
      body: []
    }
    while (peek().type !== 'cssRulesEnd') {
      advance()
      node.body.push(walk())
    }
    return node
  }

  if (context === 'cssRules') {

  }

  if (peek().type === 'cssRulesEnd') {
    context = null
    return 'EOL'
  }
  
  throw new TypeError(`Unexpected token: ${peek().type}, ${peek().value}`)
}

function walkCssRules() {
  let node = {
    type: 'cssRules',
    body: []
  }
  return node
}

function parser(tokenArr) {

  current = 0
  tokens = tokenArr
  console.log(tokens.length, current)
  const ast = {
    type: 'ast',
    body: []
  }
  while (!isAtEnd()) {
    ast.body.push(walk())
    advance()
  }
  return ast
}

export {
  parser
}