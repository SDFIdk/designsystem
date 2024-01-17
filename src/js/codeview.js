export class CodeView extends HTMLElement {
  
  styles = `
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
    }
  `
  template = `
    <div class="ds-code-view">
      <label>Kode</label>
      <pre><code></code></pre>
    </div>
  `

  constructor() {
    super()
  }

  render() {

    if (!document.head.querySelector('.ds-code-view-style')) {
      const styleTag = document.createElement('style')
      styleTag.className = "ds-code-view-style"
      styleTag.innerHTML = this.styles
      document.head.append(styleTag)
    }

    this.innerHTML = this.template
  }

  connectedCallback() {
    this.render()
    this.querySelector('code').textContent = document.getElementById(this.dataset.snip).cloneNode(true).innerHTML
  }
}

customElements.define('code-view', CodeView)
