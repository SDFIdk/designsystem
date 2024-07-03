import iconSun from '../../assets/icons/sun.svg'

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
          ${ iconSun }
        </button>
        
        <button title="Mørk" data-toggle="dark">
          ${ iconSun }
        </button>
      </div>
    `
  }

  goDarkHandler(event) {
    document.documentElement.dataset.theme = 'dark'
    localStorage.setItem(this.localstorageKey, 'dark')
  }

  goLightHandler(event) {
    document.documentElement.dataset.theme = 'light'
    localStorage.setItem(this.localstorageKey, 'light')
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
