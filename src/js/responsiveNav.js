import { DSTogglePanel } from './togglePanel.js'

export class DSNav extends HTMLElement {

  navElement
  toggleElement
  hiddenNavElements

  constructor() {
    super()
    if (!customElements.get('ds-toggle-panel')) {
      customElements.define('ds-toggle-panel', DSTogglePanel)
    }
  }

  connectedCallback() {
    this.hiddenNavElements = this.cloneNodes(this.querySelectorAll('ds-nav > *'))
    this.render()
    window.addEventListener("resize", this.render.bind(this))
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.render)
    window.removeEventListener("click", this.closeToggle)
  }

  cloneNodes(nodeList) {
    let nodes = []
    nodeList.forEach((node) => {
      nodes.push(node.cloneNode(true))
    })
    return nodes
  }

  render() {
    this.innerHTML = ''
    this.renderNav()
    this.renderToggle()
  }

  renderNav() {
    this.navElement = document.createElement('nav')
    this.append(this.navElement)
    for (const e in this.hiddenNavElements) {
      this.navElement.append(this.hiddenNavElements[e].cloneNode(true))
      const navWidth = this.navElement.offsetWidth + 43
      if (navWidth > this.clientWidth) {
        this.navElement.childNodes[this.navElement.childNodes.length - 1].remove()
        break
      }
    }
  }

  renderToggle() {
    if (this.navElement.childNodes.length === this.hiddenNavElements.length) {
      this.classList.remove('toggle')
    } else {
      this.classList.add('toggle')
      this.toggleElement = document.createElement('ds-toggle-panel')
      this.hiddenNavElements.forEach((node) => {
        this.toggleElement.append(node)
      })
      this.append(this.toggleElement)
      window.addEventListener("click", this.closeToggle.bind(this))
    }
  }

  closeToggle() {
    this.toggleElement.close()
  }

}
 
export class DSNavResponsive extends HTMLElement {

  #style = `
    :host {
      max-width: 100%;
      display: block;
    }
    .menu-container {
      position: relative;
    }
    .menu-toggle {
      display: none;
    }
    .menu-items {
      max-width: 100%;
      overflow: scroll;
      display: flex;
      flex-flow: row nowrap;
    }
    .compact .menu-toggle {
      display: inline-block;
    }
    .compact .menu-items {
      position: absolute;
      display: flex;
      flex-flow: row wrap;
      top: var(--space);
      left: 0;
      z-index: 100;
      gap: var(--space-sm);
      background-color: var(--background-color);
      padding: var(--gap-lg);
      box-shadow: var(--space-xs) var(--space-xs) var(--space-sm) var(--shadow-2);
    }
    .compact .menu-items.collapsed {
      display: none;
    }
  `

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
    window.addEventListener('resize', this.updateMenu.bind(this))
    window.addEventListener('click', this.toggleMenu.bind(this))
    this.updateMenu();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.updateMenu)
    window.removeEventListener('click', this.toggleMenu)
  }

  render() {
    this.shadowRoot.innerHTML += `
      <style>
        ${ this.#style }
      </style>
      <div class="menu-container">
        <slot name="toggle" class="menu-toggle"></slot>
        <nav class="menu-items">
          <slot></slot>
        </nav>
      </div>
    `

    this.shadowRoot.querySelector('.menu-toggle').addEventListener('click', this.toggleMenu.bind(this))
  }

  toggleMenu(event) {
    event.stopPropagation()
    const menu = this.shadowRoot.querySelector('.menu-items')
    menu.classList.toggle('collapsed')
  }

  updateMenu() {
    const container = this.shadowRoot.querySelector('.menu-container')
    const items = this.shadowRoot.querySelector('.menu-items')

    const menuWidth = items.scrollWidth
    const containerWidth = this.clientWidth

    if (menuWidth > containerWidth) {
      items.classList.add('collapsed')
      container.classList.add('compact')
    } else {
      container.classList.remove('compact')
      items.classList.remove('collapsed')
    }
  }
}