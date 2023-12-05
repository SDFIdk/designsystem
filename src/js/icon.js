import svgSrc from '../../assets/designsystem-icons.svg'

export class DSIcon extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    console.log(svgSrc)
    this.style = '--ds-icon-width: 3rem; width: var(--ds-icon-width); height: var(--ds-icon-width); display: inline-block;'
    this.innerHTML = `<svg style="width: 100%; height: 100%;"><use href="../../assets/designsystem-icons.svg#${ this.className }"/></svg>`
  }
}

customElements.define('ds-icon', DSIcon)
