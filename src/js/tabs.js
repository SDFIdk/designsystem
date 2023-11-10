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
  
  constructor() {
    super()
    this.tabTitles = []
    this.tabContents = []
    this.activeIndex = 0
    this.componentId = Math.floor(Math.random() * 1000)
  }

  connectedCallback() {
    // Change index if `data-selected` attribute is set
    const idx = Number(this.getAttribute('data-selected'))
    if (idx >= 0 && idx < this.childElementCount) {
      this.activeIndex = idx
    }
    this.setupTabs()
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
      tabTitleButton.addEventListener("click", () =>
        this.switchTab(index)
      )

      this.tabTitles.push(tabTitleButton)

      const tabContent = document.createElement("div")
      tabContent.className = "tab-content"
      tabContent.id = `tabpanel-${this.componentId}-${index}`
      tabContent.setAttribute("role", "tabpanel")
      tabContent.setAttribute("aria-labelledby", `tab-${this.componentId}-${index}`)
      tabContent.style.display = index === this.activeIndex ? "block" : "none"
      tabContent.appendChild(tab)

      this.tabContents.push(tabContent)
    });
  }

  switchTab(index) {
    this.tabTitles[this.activeIndex].setAttribute("aria-selected", false)
    this.tabTitles[index].setAttribute("aria-selected", true)
    this.tabContents[this.activeIndex].style.display = "none"
    this.tabContents[index].style.display = "block"
    this.activeIndex = index

    const tabChangeEvent = new CustomEvent("tabchange", {
      detail: { 
        index: index,
        title: this.tabTitles[index].textContent,
      },
      bubbles: true,
    })
    this.dispatchEvent(tabChangeEvent)
  }

  render() {
    const styleContainer = document.createElement("style")
    
    styleContainer.textContent = this.styles
    
    this.appendChild(styleContainer)

    const tabsContainer = document.createElement("div")
    tabsContainer.className = "ds-tabs-header"

    this.tabTitles.forEach((tabTitle, index) => {
      tabTitle.id = `tab-${this.componentId}-${index}`
      tabsContainer.appendChild(tabTitle)
    })

    this.appendChild(tabsContainer)

    const tabContentContainer = document.createElement("div")
    tabContentContainer.className = "ds-tabs-body"

    this.tabContents.forEach((tabContent) => {
      tabContent.className = "tabpanel"
      tabContentContainer.appendChild(tabContent)
    })

    this.appendChild(tabContentContainer)
  }
}

customElements.define("ds-tabs", Tabs)
