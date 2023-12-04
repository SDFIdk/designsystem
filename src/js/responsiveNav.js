import { DSTogglePanel } from "./togglePanel.js"

export class DSNav extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
    window.addEventListener("resize", this.render.bind(this))
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.render)
  }

  render() {
    this.innerHTML = `
      <ds-toggle-panel>
        ${ this.innerHTML }
      </ds-toggle-panel>
    `
    if (this.navSizeCheck()) {
      //this.renderToggleButton()
    }
  }

  navSizeCheck() {
    let elementsWidth = 0
    const navElements = this.querySelectorAll('.ds-nav-wrapper > *')
    navElements.forEach((element) => {
      elementsWidth += element.offsetWidth + 16
    })
    if (elementsWidth < this.clientWidth) {
      this.classList.add('fully')
      return false
    } else {
      this.classList.remove('fully')
      return true
    }
  }

}

customElements.define('ds-nav', DSNav)
