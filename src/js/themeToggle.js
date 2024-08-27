/**
 * Custom web component that enables user to switch between light and dark modes
 * @fires themechange - An event where event.detail contains a string "light" or "dark" for the respective mode chosen by the user.
 */
export class ThemeToggle extends HTMLElement {

  localstorageKey = 'Klimadatastyrelsen-theme-choice'
  buttonDark
  buttonLight
  style = `
    button[data-toggle="light"] {
      background-color: var(--white);
      padding-left: var(--space-sm);
    }
    button[data-toggle="light"]:hover,
    button[data-toggle="light"]:active {
      background-color: var(--c2);
      border-color: var(--c2);
    }
    button[data-toggle="light"] > svg {
      --ds-icon-color: var(--black);
    }
    button[data-toggle="dark"] {
      background-color: var(--c7);
    }
    button[data-toggle="dark"]:hover,
    button[data-toggle="dark"]:active {
      background-color: var(--c6);
      border-color: var(--c6);
    }
    button[data-toggle="dark"] > svg {
      --ds-icon-color: var(--white);
    }
  `
  iconSun = `
    <svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">
        <path d="M0.5 14.5H3.5M25.5 14.5L28.5 14.5M14.49 0.5V3.5M14.5 25.5V28.5M4.6 24.4L6.72 22.28M22.28 6.72L24.4 4.6M4.59 4.61L6.72 6.73M22.28 22.28L24.4 24.4M22.5 14.5C22.5 18.92 18.92 22.5 14.5 22.5C10.08 22.5 6.5 18.92 6.5 14.5C6.5 10.08 10.08 6.5 14.5 6.5C18.92 6.5 22.5 10.08 22.5 14.5Z"></path>
      </g>
    </svg>
  `

  constructor() {
    super()
  }

  render() {
    
    if (!document.head.querySelector('.ds-theme-toggle-style')) {
      const styleTag = document.createElement('style')
      styleTag.className = "ds-theme-toggle-style"
      styleTag.innerHTML = this.style
      document.head.append(styleTag)
    }

    this.innerHTML = `
      <div class="ds-theme-toggle ds-button-group">
        <button title="Lys" data-toggle="light">
          ${ this.iconSun }
        </button>
        
        <button title="Mørk" data-toggle="dark">
          ${ this.iconSun }
        </button>
      </div>
    `
  }

  goDarkHandler() {
    this.changeTheme('dark')
  }

  goLightHandler() {
    this.changeTheme('light')
  }

  changeTheme(theme) {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(this.localstorageKey, theme)
    this.dispatchEvent(new CustomEvent('themechange', {detail: theme, bubbles: true, composed: true}))
  }

  checkPreference() {
    const preference = localStorage.getItem(this.localstorageKey)
    if (preference === 'dark') {
      document.documentElement.dataset.theme = 'dark'
    } else if (preference === 'light') {
      document.documentElement.dataset.theme = 'light'
    }
  }

  connectedCallback() {
    this.checkPreference()
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
