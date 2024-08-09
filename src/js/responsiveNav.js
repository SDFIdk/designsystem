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
      display: block;
      overflow: auto;
      min-width: calc(var(--button-base-height) + 0.25rem);
      min-height: var(--button-base-height);
    }
    .menu-container {
      width: 100%;
      height: 100%;
    }
    .menu-toggle {
      display: none;
    }
    .menu-container.compact .menu-toggle {
      display: inline-block;
    }
    .menu-container.compact .menu-items {
      display: none;
    }
    .menu-container.compact .menu-items.expanded {
      display: block;
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
        <div class="menu-items">
          <slot></slot>
        </div>
      </div>
    `

    this.shadowRoot.querySelector('.menu-toggle').addEventListener('click', this.toggleMenu.bind(this))
  }

  toggleMenu(event) {
    event.stopPropagation()
    const menu = this.shadowRoot.querySelector('.menu-items')
    this.classList.toggle('expanded')
    menu.classList.toggle('expanded')
  }

  updateMenu() {
    
    const container = this.shadowRoot.querySelector('.menu-container')
    const items = this.shadowRoot.querySelector('.menu-items')

    const menuWidth = container.scrollWidth
    const containerWidth = this.offsetWidth
    // offsetWidth, clientWidth, scrollWidth

    console.log('widths')
    console.log(this.offsetWidth, this.scrollWidth)
    console.log(container.offsetWidth, container.scrollWidth)
    console.log(items.offsetWidth, items.scrollWidth)

    if (menuWidth > containerWidth) {
      this.classList.add('compact')
      container.classList.add('compact')
    } else {
      this.classList.remove('compact')
      container.classList.remove('compact')
    }
  }
}