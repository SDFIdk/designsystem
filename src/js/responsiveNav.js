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

  mode // 'fill' or 'switch'
  mutationObserver
  #style = `
    :host {
      display: flex;
      flex-flow: row nowrap;
    }
    .menu-container {
      width: 100%;
      height: 100%;
    }
    .menu-toggle {
      display: none;
    }

    /* Styles for 'switch' mode */
    .menu-container.switch.compact .menu-toggle {
      display: inline-block;
    }
    .menu-container.switch.compact .menu-items {
      display: none;
    }
    .menu-container.switch.compact.expanded .menu-items {
      display: block;
    }

    /* Styles for 'fill' mode */
    .menu-container.fill:not(.expanded) {
      overflow: hidden;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
    }
    .menu-container.fill.expanded {
      overflow: visible;
    }
    .menu-container.fill .menu-toggle {
      display: inline-block;
      order: 2;
    }
    .menu-container.fill .menu-items {
      display: flex;
      order: 1;
      flex: 0 1 auto;
    } 
  `

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.mode = this.classList.contains('fill') ? 'fill' : 'switch'
    this.classList.add(this.mode)
    this.render()
    this.setClassBySize()
    this.setContainerSize()
    window.addEventListener('resize', this.updateMenu.bind(this))
    window.addEventListener('click', this.closeMenu.bind(this))
    
    this.mutationObserver = new MutationObserver(this.updateMenu.bind(this))
    const target = this.querySelector('.ds-panel')
    this.mutationObserver.observe(target, { childList: true, subtree: true })
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
      <div class="menu-container ${ this.mode}">
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
    const container = this.shadowRoot.querySelector('.menu-container')
    this.classList.add('expanded')
    container.classList.add('expanded')
  }

  closeMenu() {
    const container = this.shadowRoot.querySelector('.menu-container')
    this.classList.remove('expanded')
    container.classList.remove('expanded')
  }

  updateMenu() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = setTimeout(() => {
      this.setClassBySize()
      this.setContainerSize()
    }, 100)
  }

  setClassBySize() {
    if (this.mode !== 'switch') {
      return
    }
    const container = this.shadowRoot.querySelector('.menu-container')
    const items = this.shadowRoot.querySelector('.menu-items')

    this.classList.remove('compact')
    container.classList.remove('compact')

    if (items.scrollWidth > items.clientWidth) {
      this.classList.add('compact')
      container.classList.add('compact')
    }
  }

  setContainerSize() {
    if (this.mode !== 'fill') {
      return
    }
    const container = this.querySelector('.ds-panel')
    const toggle = this.querySelector('button[slot="toggle"]')
    const maxWidth = this.clientWidth - toggle.clientWidth
    let visibleContentWidth = 0
    for (const element of Array.from(container.children)) {
      if (visibleContentWidth < maxWidth) {
        visibleContentWidth = visibleContentWidth + element.clientWidth + 8
        continue
      } else {
        visibleContentWidth = visibleContentWidth - element.clientWidth - 16
        break
      }
    }
    this.shadowRoot.querySelector('.menu-items').style.width = `${ visibleContentWidth }px`
  }
}

export class DSNavScrollable extends HTMLElement {

  debounceTimer
  mutationObserver
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
      z-index: 2;
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

      <slot></slot>

      <button class="btn-scroll-left" title="Scroll mod venstre">
        <svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">
            <path d="M22 27L5.41 15.16C4.85 14.72 4.86 14.02 5.43 13.59L22 2"/>
          </g>
        </svg>
      </button>
      
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

    this.mutationObserver = new MutationObserver(this.updateButtons.bind(this))
    const target = this.querySelector('.ds-panel')
    this.mutationObserver.observe(target, { childList: true, subtree: true })
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