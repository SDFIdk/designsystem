export class DSTogglePanel extends HTMLElement {

  toggleButton
  togglePanel
  componentId = Math.floor(Math.random() * 1000)
  componentTitle

  constructor() {
    super()
  }

  connectedCallback() {
    this.componentTitle = this.title ? this.title : 'Vis mere'

    this.innerHTML = `
      ${ this.renderToggleButton() }
      <div id="ds-toggle-panel-${ this.componentId}" class="ds-toggle-panel" hidden aria-labelledby="ds-toggle-button-${ this.componentId}">
        ${ this.innerHTML }
      </div>
    `
    this.toggleButton = document.querySelector(`#ds-toggle-button-${ this.componentId }`)
    this.togglePanel = this.querySelector('.ds-toggle-panel')

    this.toggleButton.addEventListener('click', this.toggle.bind(this))
  }

  renderToggleButton() {
    const externalToggleButton = document.querySelector(`button[for="${ this.id }"]`)
    if (externalToggleButton) {
      // If a button was designed with the `for` attribute, use it
      externalToggleButton.id = `ds-toggle-button-${ this.componentId }`
      externalToggleButton.setAttribute('aria-controls', `ds-toggle-panel-${ this.componentId}`)
      return ''
    } else {
      // Return HTML for at standard toggle button
      return `
        <button id="ds-toggle-button-${ this.componentId}" aria-controls="ds-toggle-panel-${ this.componentId}" class="ds-toggle-button" title="${ this.componentTitle }">
          <svg width="24" height="24" viewBox="0 0 24 24" class="ds-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Flere muligheder</title>
            <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" fill="var(--ds-icon-color, black)"></path>
            <path d="M19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12Z" fill="var(--ds-icon-color, black)"></path>
            <path d="M7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" fill="var(--ds-icon-color, black)"></path>
            <path d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" stroke="var(--ds-icon-color, black)"></path>
            <path d="M19 12C19 12.5523 18.5523 13 18 13C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11C18.5523 11 19 11.4477 19 12Z" stroke="var(--ds-icon-color, black)"></path>
            <path d="M7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z" stroke="var(--ds-icon-color, black)"></path>
          </svg>
        </button>
      `
    }
  }

  toggle(event) {
    event.stopPropagation()
    this.togglePanel.hidden = !this.togglePanel.hidden
  }

  open() {
    this.togglePanel.hidden = false
  }

  close() {
    this.togglePanel.hidden = true
  }

}
