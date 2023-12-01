export class DSNav extends HTMLElement {

  toggled = false
  navElements

  constructor() {
    super()
  }

  connectedCallback() {
    this.navElements = this.innerHTML
    this.render()
    window.addEventListener("resize", this.render.bind(this))
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.render)
  }

  render() {
    this.innerHTML = `
      <nav class="ds-nav-wrapper">
        ${ this.navElements }
      </nav>
    `
    if (this.navIsContained()) {
      this.renderToggleButton()
    }
  }

  renderToggleButton() {
    const toggle = document.createElement('button')
    toggle.title = 'Vis flere'
    toggle.className = 'ds-nav-toggle secondary'
    toggle.innerHTML = '<svg><use href="../assets/designsystem-icons.svg#hentdata-choose" /></svg>'
    this.append(toggle)
    toggle.addEventListener('click', this.navToggleHandler.bind(this))
  }

  navToggleHandler() {
    this.toggled = !this.toggled
    this.classList.toggle('expanded')
  }

  navIsContained() {
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
