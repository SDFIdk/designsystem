export class DSTogglePanel extends HTMLElement {

  toggleButton
  togglePanel
  componentId = Math.floor(Math.random() * 1000)
  componentTitle
  styles = `
    ds-toggle-panel {
      display: block;
    }
    ds-toggle-panel.slide .ds-toggle-panel {
      display: block;
      position: fixed;
      z-index: 100;
      top: 0;
      bottom: 0;
      left: 0;
      transform: translate(0,0);
      background-color: var(--bg1);
      padding: var(--padding);
      box-shadow: 0 0 0.25rem 0 hsla(0,0%,50%,0.5);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    ds-toggle-panel.slide .ds-toggle-panel[hidden] {
      box-shadow: none;
      display: block;
      transform: translate(-100%,0);
    }
  `

  constructor() {
    super()
  }

  connectedCallback() {
    this.componentTitle = this.title ? this.title : 'Vis mere'

    this.innerHTML = `
      <style>
        ${ this.styles }
      </style>
      ${ this.renderToggleButton() }
      <div id="ds-toggle-panel-${ this.componentId}" class="ds-toggle-panel" hidden aria-labelledby="ds-toggle-button-${ this.componentId}">
        ${ this.innerHTML }
      </div>
    `
    this.toggleButton = document.querySelector(`#ds-toggle-button-${ this.componentId }`)
    this.togglePanel = this.querySelector('.ds-toggle-panel')

    this.toggleButton.addEventListener('click', this.toggleHandler.bind(this))
  }

  renderToggleButton() {
    const externalToggleButton = document.querySelector(`button[for="${ this.id }"]`)
    if (externalToggleButton) {
      externalToggleButton.id = `ds-toggle-button-${ this.componentId }`
      externalToggleButton.setAttribute('aria-controls', `ds-toggle-panel-${ this.componentId}`)
      return ''
    } else {
      return `
        <button id="ds-toggle-button-${ this.componentId}" aria-controls="ds-toggle-panel-${ this.componentId}" class="ds-toggle-button" title="${ this.componentTitle }">
          <svg><use href="../assets/designsystem-icons.svg#hentdata-choose" /></svg>
        </button>
      `
    }
  }

  toggleHandler() {
    this.togglePanel.hidden = !this.togglePanel.hidden
  }

}

customElements.define('ds-toggle-panel', DSTogglePanel)
