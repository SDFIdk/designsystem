import { DSTogglePanel } from './togglePanel.js'

export class DSNav extends HTMLElement {

  navElement
  toggleElement
  hiddenNavElements
  debounceTimer

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
    this.updateMenu()
    window.addEventListener('resize', this.updateMenu.bind(this))
    window.addEventListener('click', this.closeMenu.bind(this))
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.updateMenu)
    window.removeEventListener('click', this.closeMenu)
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
    this.shadowRoot.querySelector('.menu-toggle').addEventListener('click', this.openMenu.bind(this))
  }

  openMenu(event) {
    event.stopPropagation()
    const menu = this.shadowRoot.querySelector('.menu-items')
    this.classList.add('expanded')
    menu.classList.add('expanded')
  }

  closeMenu(event) {
    const menu = this.shadowRoot.querySelector('.menu-items')
    this.classList.remove('expanded')
    menu.classList.remove('expanded')
  }

  updateMenu() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = setTimeout(this.setClassBySize.bind(this), 100)
  }

  setClassBySize() {
    const container = this.shadowRoot.querySelector('.menu-container')
    const items = this.shadowRoot.querySelector('.menu-items')
  
    this.classList.remove('compact')
    container.classList.remove('compact')

    if (items.scrollWidth > items.clientWidth) {
      this.classList.add('compact')
      container.classList.add('compact')
    }

  }
}

export class DSNavScrollable extends HTMLElement {

  debounceTimer
  style = `
    :host {
      display: block;
      position: relative;
    }
    .btn-scroll-right,
    .btn-scroll-left {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      width: calc(var(--space) * 4);
      height: 100%;
      padding: 0;
      border: none;
    }
    .btn-scroll-left {
      text-align: left;
      left: 0;
      background: linear-gradient(to right, var(--background-color) 33%, transparent);
    }
    .btn-scroll-right {
      text-align: right;
      right: 0;
      background: linear-gradient(to left, var(--background-color) 33%, transparent);
    }
    .btn-scroll-right svg,
    .btn-scroll-left svg {
      height: auto;
      width: var(--space);
    }
    slot {
      display: block;
      width: 100%;
      overflow-x: auto;
      scrollbar-width: none;
      scroll-snap-type: x mandatory;
    }
  `

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.shadowRoot.innerHTML += `
      <style>
        ${ this.style }
      </style>
      <button class="btn-scroll-left" title="Scroll mod venstre">
        <svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">
            <path d="M22 27L5.41 15.16C4.85 14.72 4.86 14.02 5.43 13.59L22 2"/>
          </g>
        </svg>
      </button>
      <slot></slot>
      <button class="btn-scroll-right" title="Scroll mod højre">
        <svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">
            <path d="M6 2L22.59 13.84C23.15 14.28 23.14 14.98 22.57 15.41L6 27"/>
          </g>
        </svg>
      </button>
    `
    this.updateButtons()
    this.shadowRoot.querySelector('slot').addEventListener('scroll', this.scrollHandler.bind(this))
    this.shadowRoot.querySelector('.btn-scroll-left').addEventListener('click', this.scrollLeftHandler.bind(this))
    this.shadowRoot.querySelector('.btn-scroll-right').addEventListener('click', this.scrollRightHandler.bind(this))
  }

  scrollHandler() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = setTimeout(this.updateButtons.bind(this), 100)
  }

  scrollLeftHandler() {
    const scrollableElement = this.shadowRoot.querySelector('slot')
    this.scrollBtnHandler(scrollableElement.scrollLeft - 200)
  }

  scrollRightHandler() {
    const scrollableElement = this.shadowRoot.querySelector('slot')
    this.scrollBtnHandler(scrollableElement.scrollLeft + 200)
  }

  scrollBtnHandler(position) {
    this.shadowRoot.querySelector('slot').scroll({
      top: 0,
      left: position,
      behavior: "smooth",
    })
  }

  updateButtons() {
    console.log('update btns')
    const scrollableElement = this.shadowRoot.querySelector('slot')
    const leftBtn = this.shadowRoot.querySelector('.btn-scroll-left')
    const rightBtn = this.shadowRoot.querySelector('.btn-scroll-right')

    const scrolled = scrollableElement.scrollLeft
    const visibleWidth = scrollableElement.clientWidth
    const totalWidth = scrollableElement.scrollWidth

    if (scrolled > 0) {
      leftBtn.style.display = 'block'
    } else {
      leftBtn.style.display = 'none'
    }

    if (visibleWidth > totalWidth || (scrolled + visibleWidth ) >= totalWidth ) {
      rightBtn.style.display = 'none'
    } else {
      rightBtn.style.display = 'block'
    }
  }
}