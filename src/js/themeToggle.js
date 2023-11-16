export class ThemeToggle extends HTMLElement {

  buttonDark
  buttonLight
  style = `
    .ds-theme-toggle {
      display: inline-flex;
      flex-flow: row nowrap;
      align-items: center;
      width: auto;
    }
    button[data-toggle="light"] {
      background-color: var(--c1);
    }
    button[data-toggle="light"] > svg {
      --ds-icon-color: var(--c10);
    }
    button[data-toggle="dark"] {
      background-color: var(--c6);
    }
    button[data-toggle="dark"] > svg {
      --ds-icon-color: var(--c1);
    }
  `

  constructor() {
    super()
  }

  render() {
    const styleTag = document.createElement('style')
    styleTag.innerText = this.style
    document.head.append(styleTag)

    this.innerHTML = `
      <div class="ds-theme-toggle ds-button-group">
        <button title="Lys" data-toggle="light">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" stroke="var(--ds-icon-color, black)" fill="none"/>
            <path d="M3 12L5 12M19 12L21 12" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M12 3L12 5M12 19L12 21" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M18.3638 5.63672L16.9496 7.05093M7.05006 16.9504L5.63585 18.3646" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M18.3638 18.3633L16.9496 16.9491M7.05006 7.04957L5.63585 5.63536" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
          </svg>
        </button>
        
        <button title="Mørk" data-toggle="dark">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" stroke="var(--ds-icon-color, black)" fill="none"/>
            <path d="M3 12L5 12M19 12L21 12" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M12 3L12 5M12 19L12 21" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M18.3638 5.63672L16.9496 7.05093M7.05006 16.9504L5.63585 18.3646" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M18.3638 18.3633L16.9496 16.9491M7.05006 7.04957L5.63585 5.63536" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `
  }

  goDarkHandler(event) {
    document.documentElement.dataset.theme = 'dark'
  }

  goLightHandler(event) {
    document.documentElement.dataset.theme = 'light'
  }

  connectedCallback() {
    this.render()
    this.buttonDark = this.querySelector('button[data-toggle="dark"]')
    this.buttonLight = this.querySelector('button[data-toggle="light"]')
    this.buttonDark.addEventListener('click', this.goDarkHandler.bind(this))
    this.buttonLight.addEventListener('click', this.goLightHandler.bind(this))
  }

  disconnectedCallback() {
    this.buttonDark.removeEventListener('click', this.goDarkHandler)
    this.buttonLight.removeEventListener('click', this.goLightHandler)
  }
}

customElements.define('ds-theme-toggle', ThemeToggle)
