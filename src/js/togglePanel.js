import iconChoose from '../../assets/icons/choose.svg'

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
    const externalToggleButton = this.parentElement.querySelector(`button[for="${ this.id }"]`)
    if (externalToggleButton) {
      // If a button was designed with the `for` attribute, use it
      externalToggleButton.id = `ds-toggle-button-${ this.componentId }`
      externalToggleButton.setAttribute('aria-controls', `ds-toggle-panel-${ this.componentId}`)
      return ''
    } else {
      // Return HTML for at standard toggle button
      return `
        <button id="ds-toggle-button-${ this.componentId}" aria-controls="ds-toggle-panel-${ this.componentId}" class="ds-toggle-button" title="${ this.componentTitle }">
          ${ iconChoose }
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
