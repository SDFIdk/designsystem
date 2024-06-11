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
          display: inline-block;
        }
        :host(.black) ds-logo {
          --ds-logo-color: var(--hvid);
          --ds-logo-outline-color: var(--sort);
          --ds-logo-background-color: var(--sort);
        }
        :host(.white) ds-logo {
          --ds-logo-color: var(--sort);
          --ds-logo-outline-color: var(--hvid);
          --ds-logo-background-color: var(--hvid);
        }
        :host(.transparent) ds-logo {
          --ds-logo-color: var(--ds-logo-theme-color);
          --ds-logo-outline-color: var(--ds-logo-theme-color);
          --ds-logo-background-color: transparent;
        }  
        .logo-title-wrapper {
          height: 100%;
          min-height: 4rem;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: flex-start;
          gap: var(--space-sm);
        }
        ds-logo {
          height: 4rem;
          width: 4rem;
          margin-left: -0.8rem;
        }
        p {
          margin: 0.75rem 0 0;
          padding: 0;
        }
        .single-line {
          margin-top: 1.33rem;
          font-weight: 370;
          font-size: 1.125rem;
          line-height: 1.33;
        }
        strong {
          font-size: 1.188rem;
          font-weight: 500;
          line-height: 1.10;
          letter-spacing: 0.01rem;
        }
        small {
          display: inline-block;
          font-size: 0.875rem;
          font-weight: 390;
          line-height: 1.21;
          padding-bottom: var(--space-xs);
        }

        :host(.small) .logo-title-wrapper {
          min-height: 2rem;
          gap: var(--space-xs);
        }
        :host(.small) ds-logo {
          height: 1.5rem;
          width: 1.5rem;
          margin-left: -0.33rem;
        }
        :host(.small) p {
          margin-top: var(--space-xs);
        }
        :host(.small) .single-line {
          margin-top: var(--space-xs);
        }
        :host(.small) .single-line,
        :host(.small) strong {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.14;
          letter-spacing: 0.02rem;
        }
        :host(.small) small {
          font-size: 0.875rem;
          font-weight: 390;
          line-height: 1.21;
        }
      </style>
      <div class="logo-title-wrapper">
        <ds-logo></ds-logo>
        ${ this.formatLogoText(this.title, this.getAttribute('byline'))}
      </div>
    `
  }

  formatLogoText(title, byline) {
    let txt = ''
    if (title && byline) {
      txt = `<p><strong>${ title }</strong><br><small>${ byline }</small></p>`
    } else if (title && !byline) {
      txt = `<p class="single-line">${ title }</p>`
    } else {
      txt = `<p class="single-line">Styrelsen for Dataforsyning og Infrastruktur</p>`
    }
    return txt
  }

}
