import { showToast } from "./toast.js"

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
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>Kopiér</title>
            <path d="M7.30769 15H6.53846C6.13044 15 5.73912 14.8379 5.4506 14.5494C5.16209 14.2609 5 13.8696 5 13.4615V6.53846C5 6.13044 5.16209 5.73912 5.4506 5.4506C5.73912 5.16209 6.13044 5 6.53846 5H13.4615C13.8696 5 14.2609 5.16209 14.5494 5.4506C14.8379 5.73912 15 6.13044 15 6.53846V7.30769M10.5385 9.00001H17.4615C18.3112 9.00001 19 9.6888 19 10.5385V17.4615C19 18.3112 18.3112 19 17.4615 19H10.5385C9.68879 19 9 18.3112 9 17.4615V10.5385C9 9.6888 9.68879 9.00001 10.5385 9.00001Z" stroke="var(--ds-icon-color, black)" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
          </svg>
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
