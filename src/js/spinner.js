import { DSLogo } from './logo.js'

/** Displays a loading animation */
export class Spinner extends HTMLElement {


  // Properties
  style = `
    @keyframes logoanimation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    ds-spinner {
      width: 10rem;
      height: auto;
      aspect-ratio: 1;
      display: inline-block;
    }

    ds-spinner ds-logo {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: logoanimation 2s ease-in-out infinite; 
    }
  `
  template = `
    <style>${ this.style }</style>
    <ds-logo></ds-logo>
  `

  // Getters
  static get observedAttributes() { 
    return [
      'hidden'
    ]
  }
  
  // Constructor
  constructor() {
    super()
  }

  // Methods
  createDOM() {
    this.innerHTML = this.template
  }

  // Lifecycle
  connectedCallback() {
    this.createDOM()
  }

}
