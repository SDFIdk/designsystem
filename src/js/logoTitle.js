import { DSLogo } from "./logo.js"

export class DSLogoTitle extends HTMLElement {

  constructor() {
    super()
    
    // Define the ds-logo component, if it isn't already
    if (!customElements.get('ds-logo')) {
      customElements.define('ds-logo', DSLogo)
    }
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" })
    this.shadow.innerHTML = `
      <style>
        :host {
          width: 100%;
          height: 4rem;
          display: flex;
          position: relative;
          
          flex-flow: row nowrap;
          container-type: size;
        }
        ds-logo {
          height: 100%;
          width: auto;
          margin: 0 0.75rem 0 -0.75rem;
          flex: 0 0 auto;
        }
        div {
          flex: 0 1 100%;
          padding-top: 1.33rem;
        }
        strong,
        span {
          display: block;
        }
        strong {
          font-weight: 600;
          font-size: 1rem;
        }
        span {
          font-size: .9rem;
        }

        @container (max-height: 3.9rem) {
          :host {
            margin-left: -0.5rem;
          }
          ds-logo {
            margin: 0 0.6rem 0 -0.6rem;
          }
          div {
            padding-top: 0.4rem;
          }
        }
      </style>
      <ds-logo></ds-logo>
      <div>
        <strong>${ this.title ? this.title : 'SDFI' }</strong>
        <span>${ this.getAttribute('byline') ? this.getAttribute('byline') : 'Styrelsen for Dataforsyning og Infrastruktur' }</span>
      </div>
    `
  }

}
