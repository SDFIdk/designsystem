export class CodeView extends HTMLElement {

  // public properties
  template = `
    <label style="display: inline-block; border-radius: 1rem 1rem 0 0; margin: 1rem 0 0; background-color: var(--grey1); color: var(--black); padding: 0.75rem 1rem 0.25rem;">Kode</label>
    <pre><code class="language-html" style="border-radius: 0 0.25rem 0.25rem 0.25rem;"></code></pre>
  `

  constructor() {
    super()
  }

  connectedCallback() {
    let snippet = document.getElementById(this.dataset.snip).cloneNode(true).innerHTML
    const regex = /\u0020{2,}/g;
  
    const container = document.createElement('div')
    container.innerHTML = this.template
    this.append(container)
    this.querySelector('code').textContent = snippet//.replaceAll(regex, '')
  }
}

customElements.define('code-view', CodeView)
