// import svgSrc from '../../assets/icons.svg'

export class DSIcon extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    this.style = '--ds-icon-width: 3rem; width: var(--ds-icon-width); height: var(--ds-icon-width); display: inline-block;'
    this.innerHTML = `<svg style="width: 100%; height: 100%;"><use href="../../assets/icons.svg#${ this.className }"/></svg>`
  }
}
