let input
let current
let tokens

function walk(testRgx) {
  let char = input[current]
  let value = ''
  while (testRgx.test(char)) {
    value += char
    current++
    char = input[current]
  }
  return value
}

function previous() {
  return tokens[tokens.length - 2]
}

function tokenizer(inputStr) {

  tokens = []
  input = inputStr
  current = 0

  while (current < input.length) {
    let char = input[current]

    // Skip whitespace and newlines
    if (/[\s\n]/.test(char)) {
      current++
      continue
    }

    // Identify dividers
    if (char === '{') {
      tokens.push({
        type: 'cssRulesStart',
        value: char
      })
      current++
      continue
    }
    if (char === '}') {
      tokens.push({
        type: 'cssRulesEnd',
        value: char
      })
      current++
      continue
    }

    // Identify pseudo selectors
    if (char === ':') {
      const value = walk(/[:\w\-]/)
      if (value.length === 1) {
        tokens.push({
          type: 'divider',
          value: value
        })
      } else {
        tokens.push({
          type: 'cssSelector',
          value: value
        })
      }
      current++
      continue
    }

    // Identify css vars
    if (char === '-') {
      const value = walk(/[\-\w\d]/)
      if (/^\-{2}[\-\w\d]+/.test(value)) {
        tokens.push({
          type: 'cssVariable',
          value: value
        })
      } else {
        tokens.push({
          type: 'unknown',
          value: value
        })
      }
      current++
      continue
    }

    // Identify @ directives
    if (char === '@') {
      const value = walk(/\S/)
      tokens.push({
        type: 'atRule',
        value: value
      })
      current++
      continue
    }

    // Identify comment markers
    if (char === '/') {
      const value = walk(/[\*\/]/)
      if (value === '/**' || value === '/*' || value === '//') {
        tokens.push({
          type: 'commentStart',
          value: value
        })
      } else {
        tokens.push({
          type: 'unknown',
          value: value
        })
      }
      current++
      continue
    }
    if (char === '*') {
      const value = walk(/[\*\/]/)
      if (value === '*/') {
        tokens.push({
          type: 'commentEnd',
          value: value
        })
      } else {
        tokens.push({
          type: 'unknown',
          value: value
        })
      }
      current++
      continue
    }

    // Identify classnames
    if (char === '.') {
      const value = walk(/[\.a-z0-9\-]/)
      if (value === '.') {
        tokens.push({
          type: 'unknown',
          value: value
        })
      } else {
        tokens.push({
          type: 'cssSelector',
          value: value
        })
      }
      current++
      continue
    }

    // Identify CSS rules 
    if (/[\w\"\'\<\>\&\[\]\|\-\–`\+!\(\)]/.test(char)) {

      const value = walk(/\S/)
      if (/.+:$/.test(value)) {
        tokens.push({
          type: 'cssRuleName',
          value: value.substring(0, value.length -1 )
        })
        tokens.push({
          type: 'cssRuleValueStart',
          value: ':'
        })
      } else if (/.+;$/.test(value)) {
        tokens.push({
          type: 'cssRuleValue',
          value: value.substring(0, value.length -1 )
        })
        tokens.push({
          type: 'cssRuleValueEnd',
          value: ';'
        })
      } else {
        tokens.push({
          type: 'unknown',
          value: value
        })
      }
      current++
      continue
    }

    if (char === '#') {
      const value = walk(/[\#a-fA-F0-9]/)
      if (/\#[a-fA-F0-9]{3,6}/.test(value)) {
        tokens.push({
          type: 'hexColor',
          value: value
        })
      } else {
        tokens.push({
          type: 'unknown',
          value: value
        })
      }
      current++
      continue
    }

    // Various symbols 
    if (/[\,\<\>\&\[\]\|\-\–`\+!\(\)]/.test(char)) {
      tokens.push({
        type: 'unknown',
        value: char
      })
      current++
      continue
    }

    throw new TypeError(`Unknown char: '${char}' in ${ input.slice(current - 20, current + 20)}`)
  }

  return tokens
}

export {
  tokenizer
}