import { DSLogo } from './logo.js'

/** Displays a loading animation */
export class Spinner extends HTMLElement {

  // Properties
  style = `
    @keyframes logoanimation {
      0% {
        transform: scaleX(0%);
        filter: brightness(1);
      }
      25% {
        transform: scaleX(105%);
        filter: brightness(1);
      }
      50% {
        transform: scaleX(0%);
        filter: brightness(1);
      }
      51% {
        transform: scaleX(0%);
        filter: brightness(0.6);
      }
      75% {
        transform: scaleX(105%);
        filter: brightness(0.6);
      }
      100% {
        transform: scaleX(0%);
        filter: brightness(0.6);
      }
    }

    @keyframes logosled {
      from {
        rotate: 0deg;
      }
      to {
        rotate: 359deg;
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
      position: relative;
      /* animation: logoanimation 3s ease-in-out infinite; */
    }

    ds-spinner ds-logo::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border-top: solid medium var(--color);
      transform-origin: 50% 50%;
      animation: logosled 2s ease-out infinite;
      border-radius: 50%;
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
    if (!customElements.get('ds-logo')) {
      customElements.define('ds-logo', DSLogo)
    }
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
