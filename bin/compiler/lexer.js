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
    // We are at the beginning of the next lexeme.
    start = current
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
    case ':': addToken('COLON'); break
    case '=': addToken('EQUAL'); break
    case '"': addToken('DOUBLE_QUOTE'); break
    case '%': addToken('PERCENT'); break
    case '&': addToken('AND'); break
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
      if (/\w/.test(c)) {
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
    // A comment goes until the end of the line.
    while (/[\w\d\-]/.test(peek())) {
      advance()
    }
    addToken('CSS_VARIABLE')
  } else {
    addToken('DASH')
  }
}

function scanAtRule() {
  while (/\S/.test(peek())) {
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
  while (/\/|\*/.test(peek())) {
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
  while(/\S/.test(peek()) && !isAtEnd()) {
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
  while(/\S/.test(peek()) && peek() !== ',') {
    advance()
  }
  const value = source.substring(start, current)
  if (/\.[a-zA-Z0-9\-]+/.test(value)) {
    addToken('CSS_SELECTOR')
  } else {
    addToken('DOT')
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