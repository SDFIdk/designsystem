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
