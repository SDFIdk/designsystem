let current
let tokens

function walk() {

  if (current >= tokens.length) {
    return 'eof'
  }
  
  console.log('past')

  let token = tokens[current]

  if (token.type === 'divider') {
    let node = {
      type: 'block',
      body: []
    }
    let dividerEndSymbol
    switch(token.value) {
      case '/*':
        dividerEndSymbol = '*/'
        break
      case '//':
        dividerEndSymbol = '\n'
        break
      case '/**':
        dividerEndSymbol = '*/'
      case '{':
        dividerEndSymbol = '}'
      default:
        console.log('default divider action')
        current++
        return 'none'
    }
    current++
    while (token.value !== dividerEndSymbol) {
      node.body.push(walk())
    }
    return node
  }

  if (token.type === 'textNode' || token.type === 'symbol') {
    let node = {
      type: 'text',
      body: [token.value]
    }
    current++
    while (token.type === 'textNode' || token.type === 'symbol') {
      token = tokens[current]
      node.body.push(token.value)
      current++
    }
    return node
  }

  if (token.type === 'newLine') {
    current++
    return 'newLine'
  }

  if (token.type === 'cssSelector') {
    current++
    return {
      type: 'cssSelector',
      value: token.value
    }
  }

  if (token.type === 'cssRulesMarker' && token.value === '{') {
    let node = {
      type: 'cssRules',
      body: []
    }
    current++
    while (token.type !== 'cssRulesMarker' && token.value !== '}') {
      node.body.push(walk())
    }
    return node
  }

  if (token.type === 'cssRulesMarker' && token.value === '}') {
    current++
    return ''
  }

  if (token.type === 'cssRuleName') {
    current++
    return token.value
  }

  if (token.type === 'cssRuleValue') {
    current++
    return token.value
  }

  if (token.type === 'cssVariable') {
    current++
    return {
      type: 'cssVar',
      body: token.value
    }
  }

  if (token.type === 'atRule') {
    let node = {
      type: 'atRule',
      body: [token.value]
    }
    current++
    while (token && token.type !== 'divider' && token.value !== ';') {
      node.body.push(walk())
    }
    return node
  }

  throw new TypeError(`Unexpected token: ${token.type}, ${token.value}`)
}

function parser(tokenArr) {

  current = 0
  tokens = tokenArr
  console.log(tokens.length, current)
  const ast = {
    type: 'root',
    body: [walk()] 
  }  
  console.log('parser output', ast)
  
  return ast
}

export {
  parser
}