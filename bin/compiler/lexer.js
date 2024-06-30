function tokenizer(input) {
  const skippableRgx = /[\s\{\}\(\)\[\]\|–<>`"',+=&]/
  const commentRgx = /[\/\*]/
  const classRgx = /[\.\:]/
  const classNameRgx = /[\:\.\w\d\-]/
  const tokens = []
  let current = 0

  while (current < input.length) {
    let char = input[current]

    if (skippableRgx.test(char)) {
      current++
      continue
    }

    if (char === '@') {
      let value = ''
      while (/[\w@]/.test(char)) {
        value += char
        char = input[++current]
      }
      if (value === '@var') {
        tokens.push({
          type: 'variablePrefix',
          value: value
        })
      }
      current++
      continue
    }

    // Identify variables
    if (char === '-') {
      let value = ''
      while (/[\-\w\d]/.test(char)) {
        value += char
        char = input[++current]
      }
      if (/--/.test(value)) {
        tokens.push({
          type: 'cssVariable',
          value: value
        })
      }
      current++
      continue
    }

    // Identify comments
    if (commentRgx.test(char)) {
      let value = ''
      while (commentRgx.test(char)) {
        value += char
        char = input[++current]
      }
      if (value !== '/') {
        tokens.push({
          type: 'commentMarker',
          value: value
        })
      }
      current++
      continue
    }
    
    // Identify textnodes
    if (/\w/.test(char)) {
      let value = ''
      while (/[\w:;]/.test(char)) {
        value += char
        char = input[++current]
      }
      if (/[\w\-]+:/.test(value)) {
        tokens.push({
          type: 'cssRuleKey',
          value: value
        })
      } else if (/.+;/.test(value)) {
        tokens.push({
          type: 'cssRuleValue',
          value: value
        })
      } else {
        tokens.push({
          type: 'textNode',
          value: value
        })
      }
      current++
      continue
    }
    
    // Identify classnames
    if (classRgx.test(char)) {
      let value = ''
      while (classNameRgx.test(char)) {
        value += char
        char = input[++current]
      }
      tokens.push({
        type: 'className',
        value: value
      })
      current++
      continue
    }

    throw new TypeError(`Unknown char: '${char}'`)
  }
  return tokens
}

export {
  tokenizer
}