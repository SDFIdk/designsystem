import { showToast } from "./toast.js"
import iconCopy from '../../assets/icons/copy.svg'

export class CodeView extends HTMLElement {
  
  styles = `
    .ds-code-view {
      position: relative;
    }
    .ds-code-view label {
      background-color: var(--code-background-color);
      display: inline-block; 
      border-radius: 1rem 1rem 0 0; 
      margin: 1rem 0 0; 
      padding: 0.75rem 1rem 0.25rem;
    }
    .ds-code-view pre {
      display: block;
      max-width: 100%;
      overflow: auto;
      background-color: var(--code-background-color);
      padding: var(--space-sm) var(--space);
    }
    .ds-code-view-copy {
      position: absolute;
      top: var(--space);
      right: 0;
    }
  `
  _content
  _label

  constructor() {
    super()
  }

  render() {
    this.innerHTML = `
      <div class="ds-code-view">
        <label>${ this._label }</label>
        <pre><code></code></pre>
        <button class="ds-code-view-copy quiet" title="Kopiér">
          ${ iconCopy }
        </button>
      </div>
    `
    this.querySelector('code').textContent = this._content
  }

  connectedCallback() {
    if (!document.head.querySelector('.ds-code-view-style')) {
      const styleTag = document.createElement('style')
      styleTag.className = "ds-code-view-style"
      styleTag.innerHTML = this.styles
      document.head.append(styleTag)
    }

    if (this.dataset.snip) {
      this._content = document.getElementById(this.dataset.snip).cloneNode(true).innerHTML
    } else {
      this._content = this.innerHTML
    }

    if (this.title) {
      this._label = this.title
    } else {
      this._label = 'Kode'
    }
    
    this.render()

    this.querySelector('.ds-code-view-copy').addEventListener('click', this._copyHandler.bind(this))
  }

  _copyHandler(event) {
    navigator.clipboard.writeText(this._content.trim())
    .then((success) => {
      showToast({
        message: 'Kode kopieret',
        duration: 2000
      })
    })
    .catch((err) => {
      console.error(err.message);
    })
  }
}
