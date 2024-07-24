let source = ''
let tokens = []

let current = 0
let start = 0
let line = 1

class Token {
  type
  text
  line
  constructor(type, text, line) {
    this.type = type
    this.text = text
    this.line = line
  }
}

function scanTokens(input) {
  source = input
  while (!isAtEnd()) {
    start = current // We are at the beginning of the next lexeme.
    scanToken()
  }
  tokens.push(new Token('EOF', "", ++line))
  return tokens
}

function scanToken() {
  const c = advance()
  switch (c) {
    case '(': addToken('LEFT_PAREN'); break
    case ')': addToken('RIGHT_PAREN'); break
    case '{': addToken('LEFT_BRACE'); break
    case '}': addToken('RIGHT_BRACE'); break
    case '[': addToken('LEFT_BRACKET'); break
    case ']': addToken('RIGHT_BRACKET'); break
    case ',': addToken('COMMA'); break
    case ';': addToken('SEMICOLON'); break
    case '=': addToken('EQUAL'); break
    case '"': addToken('DOUBLE_QUOTE'); break
    case '%': addToken('PERCENT'); break
    case '&': addToken('AND'); break
    case ':': scanPseudoSelector(); break
    case '.': scanClassSelector(); break
    case '*': scanComment(); break
    case '/': scanComment(); break
    case '@': scanAtRule(); break
    case '-': scanVariable(); break
    case ' ':
    case '\r':
    case '\t': break // Ignore whitespace.
    case '\n': line++; break
    default:
      // Handle text strings
      if (/[a-zA-Z]/.test(c)) {
        scanText()
        break
      }
      // Handle numbers
      if (/\d/.test(c)) {
        scanNumber()
        break
      }
      throw new Error(`
        ln ${ line }: Unknown character ${ c } in >>>
        "${ source.substring(current - 20, current + 20) }"
      `)
  }
}

function scanVariable() {
  if (match('-')) {
    while (/[\w\d\-]/.test(peek()) && !isAtEnd()) {
      advance()
    }
    addToken('CSS_VARIABLE')
  } else {
    addToken('DASH')
  }
}

function scanAtRule() {
  while (/\S/.test(peek()) && !isAtEnd()) {
    advance()
  }
  const value = source.substring(start, current)
  if (value.length > 1) {
    addToken('AT_RULE')
  } else {
    addToken('DASH')
  }
}

function scanComment() {
  while (/\/|\*/.test(peek()) && !isAtEnd()) {
    advance()
  }
  const value = source.substring(start, current)
  switch(value) {
    case '//': addToken('COMMENT'); break
    case '/*':
    case '/**': addToken('COMMENT_OPEN'); break
    case '*/': addToken('COMMENT_CLOSE'); break
    case '/': addToken('SLASH'); break
    case '*': addToken('STAR'); break
    default: addToken('TEXT')
  }
}

function scanText() {
  while(/[\w\-]/.test(peek()) && !isAtEnd()) {
    advance()
  }
  addToken('TEXT')
}

function scanNumber() {
  while(/\d|\./.test(peek()) && !isAtEnd()) {
    advance()
  }
  addToken('NUMBER')
}

function scanClassSelector() {
  while(/[a-zA-Z0-9\-]/.test(peek()) && !isAtEnd()) {
    advance()
  }
  const value = source.substring(start, current)
  if (/\.[a-zA-Z0-9\-]+/.test(value)) {
    addToken('CSS_SELECTOR')
  } else if (value === '.') {
    addToken('DOT')
  } else {
    addToken('TEXT')
  }
}

function scanPseudoSelector() {
  while(/[\w\-]/.test(peek()) && !isAtEnd()) {
    advance()
  }
  const value = source.substring(start, current)
  switch(value) {
    case ':root': addToken('PSEUDO_SELECTOR'); break
    case ':not': addToken('PSEUDO_SELECTOR'); break
    case ':hover': addToken('PSEUDO_SELECTOR'); break
    case ':active': addToken('PSEUDO_SELECTOR'); break
    case ':link': addToken('PSEUDO_SELECTOR'); break
    case ':focus': addToken('PSEUDO_SELECTOR'); break
    case '::after': addToken('PSEUDO_SELECTOR'); break
    case '::before': addToken('PSEUDO_SELECTOR'); break
    case ':first-child': addToken('PSEUDO_SELECTOR'); break
    case ':last-child': addToken('PSEUDO_SELECTOR'); break
    case ':has': addToken('PSEUDO_SELECTOR'); break
    case ':is': addToken('PSEUDO_SELECTOR'); break
    case ':nth-child': addToken('PSEUDO_SELECTOR'); break
    default:
      if (value === ':') {
        addToken('COLON')
      } else {
        addToken('TEXT')
      }
  }
}

function isAtEnd() {
  return current >= source.length
} 

function peek() {
  if (isAtEnd()) {
    return '\0'
  } else {
    return source[current]
  }
}

function match(expected) {
  if (isAtEnd()) {
    return false
  }
  if (source[current] !== expected) {
    return false
  }
  current++
  return true
}

function advance() {
  return source[current++]
}

function addToken(type) {
  const text = source.substring(start, current)
  tokens.push(new Token(type, text, line))
}

export {
  scanTokens
}