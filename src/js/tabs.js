/** 
 * Web component that turns a list of elements into a tabbed UI widget
 * @param {Number} dataSelected - 0-index value. Renders the tabs with the indexed tab opened. Set via `data-selected` attribute on the element.
 * @fires tabchange
 * @example
 * <ds-tabs data-selected="1"> <!-- Renders with the 2nd tab open -->
 *  <article title="Tabtitle no 1">
 *    <p>The tab content</p>
 *  </article>
 *  <article title="Tabtitle no 2">
 *    <p>Some other content</p>
 *  </article>
 * </ds-tabs>
*/
export class Tabs extends HTMLElement {

  style = `
    .ds-tabs-header {
      border-bottom: solid 1px var(--border-color);
    }
    .ds-tabs-header > button {
      font-size: 1rem;
      font-weight: 570;
      line-height: 1.12;
      letter-spacing: 0.02rem;
      color: var(--color);
      padding: var(--space);
      border: none;
      height: auto;
      background: linear-gradient(0deg, var(--link), var(--link)) no-repeat right bottom / 0 8%;
      transition: color 0.3s ease-in-out, background-size 0.3s ease-in-out, outline 0.3s;
    }
    .ds-tabs-header > button:hover,
    .ds-tabs-header > button:active {
      background-size: 100% 8%;
      background-position-x: left;
    }
    .ds-tabs-header > button:focus {
      outline: solid var(--space-xxs) var(--highlight);
      border-radius: var(--space-xxs);
    }
    .ds-tabs-header > button.active {
      background: linear-gradient(0deg, var(--highlight), var(--highlight)) no-repeat left bottom / 100% 8%;
    }
  `

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.activeIndex = 0
    this.componentId = Math.floor(Math.random() * 1000)
  }

  connectedCallback() {
    // Change index if `data-selected` attribute is set
    const idx = Number(this.getAttribute('data-selected'))
    if (idx >= 0 && idx < this.childElementCount) {
      this.activeIndex = idx
    }
    //this.setupTabs()
    this.render()
  }

  setupTabs() {
    const tabs = Array.from(this.children)

    tabs.forEach((tab, index) => {
      const title = tab.getAttribute("title")
      const tabTitleButton = document.createElement("button")
      tabTitleButton.textContent = title
      tabTitleButton.setAttribute("role", "tab")
      tabTitleButton.setAttribute("aria-selected", index === this.activeIndex)
      tabTitleButton.setAttribute(
        "aria-controls",
        `tabpanel-${this.componentId}-${index}`
      )
      if (index === this.activeIndex) {
        tabTitleButton.classList.add('active')
      } 
      tabTitleButton.addEventListener("click", () =>
        this.switchTab(index)
      )

      this.shadowRoot.querySelector('.ds-tabs-header').append(tabTitleButton)

      tab.id = `tabpanel-${this.componentId}-${index}`
      tab.setAttribute("role", "tabpanel")
      tab.setAttribute("aria-labelledby", `tab-${this.componentId}-${index}`)
      tab.style.display = index === this.activeIndex ? "block" : "none"
    })
  }

  switchTab(index) {
    const tabTitles = this.shadowRoot.querySelectorAll('.ds-tabs-header button')
    const tabContents = Array.from(this.children)

    tabTitles[this.activeIndex].setAttribute("aria-selected", false)
    tabTitles[index].setAttribute("aria-selected", true)
    tabTitles.forEach((tabElement) => {
      tabElement.classList.remove('active')
    })
    tabTitles[index].classList.add('active')

    tabContents[this.activeIndex].style.display = "none"
    tabContents[index].style.display = "block"
    this.activeIndex = index

    const tabChangeEvent = new CustomEvent("tabchange", {
      detail: { 
        index: index,
        title: tabTitles[index].textContent,
      },
      bubbles: true,
    })
    this.dispatchEvent(tabChangeEvent)
  }

  render() {
    this.shadowRoot.innerHTML += `
      <style>
        ${ this.style }
      </style>
      <nav class="ds-tabs-header"></nav>
      <div class="ds-tabs-body">
        <slot></slot>
      </div>
    `
    this.setupTabs()
  }
}
