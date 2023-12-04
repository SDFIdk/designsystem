import { DSTogglePanel } from "./togglePanel.js"

/** A content panel that can be hidden/displayed by a toggle */
export class DSSlide extends HTMLElement {

  // Properties
  style = `
    :host([hidden]) {
      display: block !important;
      transform: translate(-100%);
    }
    :host {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      max-width: 100%;
      background-color: var(--background-color);
      padding: var(--padding);
      transition: transform 0.3s;
      transform: translate(0);
    }
  `

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <style>${ this.style }</style>
      <ds-toggle-panel>
        ${ this.innerHTML }
      </ds-toggle-panel>
    `
  }

}

customElements.define('ds-slide', DSSlide)
