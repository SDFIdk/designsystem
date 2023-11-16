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
      <pre><code class="language-html" style="border-radius: 0 0.25rem 0.25rem 0.25rem;"></code></pre>
    </div>
  `

  constructor() {
    super()
  }

  render() {
    const styleTag = document.createElement('style')
    styleTag.innerText = this.styles
    document.head.append(styleTag)
    this.innerHTML = this.template
  }

  connectedCallback() {
    let snippet = document.getElementById(this.dataset.snip).cloneNode(true).innerHTML
    this.render()
    this.querySelector('code').textContent = snippet//.replaceAll(regex, '')
  }
}

customElements.define('code-view', CodeView)
