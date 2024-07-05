let input
let line
let current
let tokens

function walkString(testRgx) {
  let char = input[current]
  let value = ''
  while (testRgx.test(char)) {
    value += char
    char = input[++current]
  }
  return value
}

function tokenizer(inputStr) {

  tokens = []
  input = inputStr
  current = 0
  line = 1

  while (current < input.length) {
    let char = input[current]

    // Count lines
    if (char === '\n') {
      line++
      tokens.push({
        type: 'newLine',
        value: char
      })
      current++
      continue
    }

    if (/[\{\};,]/.test(char)) {
      tokens.push({
        type: 'divider',
        value: char
      })
      current++
      continue
    }

    // Identify pseudo selectors
    if (char === ':') {
      const value = walkString(/[:\w\-]/)
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
      const value = walkString(/[\-\w\d]/)
      if (/^\-\-[\-\w\d]+/.test(value)) {
        tokens.push({
          type: 'cssVariable',
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

    // Identify @ directives
    if (char === '@') {
      const value = walkString(/^\s/)
      tokens.push({
        type: 'atRule',
        value: value
      })
      current++
      continue
    }

    // Identify comment markers
    if (char === '/' || char === '*') {
      const value = walkString(/[\/\*]/)
      if (value.length < 2) {
        tokens.push({
          type: 'textNode',
          value: value
        })
      } else {
        tokens.push({
          type: 'divider',
          value: value
        })
      }
      current++
      continue
    }

    // Identify classnames
    if (char === '.') {
      const value = walkString(/[\.a-z0-9\-]/)
      if (value === '.') {
        tokens.push({
          type: 'textNode',
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

      const value = walkString(/[^\s]/)
      if (/.+:$/.test(value)) {
        tokens.push({
          type: 'cssRuleName',
          value: value.substring(0, value.length -1 )
        })
      } else if (/.+;$/.test(value)) {
        tokens.push({
          type: 'cssRuleValue',
          value: value.substring(0, value.length -1 )
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

    if (char === '#') {
      const value = walkString(/[\#a-fA-F0-9]/)
      if (/\#[a-fA-F0-9]{3,6}/.test(value)) {
        tokens.push({
          type: 'hexColor',
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

    // Various symbols 
    if (/[\,\<\>\&\[\]\|\-\–`\+!\(\)]/.test(char)) {
      tokens.push({
        type: 'textNode',
        value: char
      })
      current++
      continue
    }

    // Skip whitespace
    if (/\s/.test(char)) {
      current++
      continue
    }

    throw new TypeError(`ln ${ line }: Unknown char: '${char}' in ${ input.slice(current - 20, current + 20)}`)
  }
  console.log(tokens)
  return tokens
}

export {
  tokenizer
}