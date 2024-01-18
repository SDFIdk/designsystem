// src/js/toast.js
function showToast({ message, duration = 5e3 }) {
  const newToast = document.createElement("div");
  newToast.className = "ds-toast-item";
  newToast.innerText = message;
  const targetElement = document.querySelector(".ds-toast-container");
  if (!targetElement) {
    const toastcontainer = document.createElement("div");
    toastcontainer.className = "ds-toast-container";
    document.body.append(toastcontainer);
    toastcontainer.append(newToast);
  } else {
    targetElement.append(newToast);
  }
  setTimeout(function() {
    newToast.remove();
  }, duration);
}

// src/js/codeview.js
var CodeView = class extends HTMLElement {
  styles = `
    .ds-code-view {
      position: relative;
    }
    .ds-code-view label {
      background-color: var(--code-background-color);
      display: inline-block; 
      border-radius: 1rem 1rem 0 0; 
      margin: 1rem 0 0; 
      padding: 0.75rem 1rem 0.25rem;
    }
    .ds-code-view pre {
      display: block;
      max-width: 100%;
      overflow: auto;
      background-color: var(--code-background-color);
      padding: var(--space-sm) var(--space);
    }
    .ds-code-view-copy {
      position: absolute;
      top: var(--space);
      right: 0;
    }
  `;
  _content;
  _label;
  constructor() {
    super();
  }
  render() {
    this.innerHTML = `
      <div class="ds-code-view">
        <label>${this._label}</label>
        <pre><code></code></pre>
        <button class="ds-code-view-copy quiet" title="Kopi\xE9r">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>Kopi\xE9r</title>
            <path d="M7.30769 15H6.53846C6.13044 15 5.73912 14.8379 5.4506 14.5494C5.16209 14.2609 5 13.8696 5 13.4615V6.53846C5 6.13044 5.16209 5.73912 5.4506 5.4506C5.73912 5.16209 6.13044 5 6.53846 5H13.4615C13.8696 5 14.2609 5.16209 14.5494 5.4506C14.8379 5.73912 15 6.13044 15 6.53846V7.30769M10.5385 9.00001H17.4615C18.3112 9.00001 19 9.6888 19 10.5385V17.4615C19 18.3112 18.3112 19 17.4615 19H10.5385C9.68879 19 9 18.3112 9 17.4615V10.5385C9 9.6888 9.68879 9.00001 10.5385 9.00001Z" stroke="var(--ds-icon-color, black)" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
          </svg>
        </button>
      </div>
    `;
    this.querySelector("code").textContent = this._content;
  }
  connectedCallback() {
    if (!document.head.querySelector(".ds-code-view-style")) {
      const styleTag = document.createElement("style");
      styleTag.className = "ds-code-view-style";
      styleTag.innerHTML = this.styles;
      document.head.append(styleTag);
    }
    if (this.dataset.snip) {
      this._content = document.getElementById(this.dataset.snip).cloneNode(true).innerHTML;
    } else {
      this._content = this.innerHTML;
    }
    if (this.title) {
      this._label = this.title;
    } else {
      this._label = "Kode";
    }
    this.render();
    this.querySelector(".ds-code-view-copy").addEventListener("click", this._copyHandler.bind(this));
  }
  _copyHandler(event) {
    navigator.clipboard.writeText(this._content.trim()).then((success) => {
      showToast({
        message: "Kode kopieret",
        duration: 2e3
      });
    }).catch((err) => {
      console.error(err.message);
    });
  }
};
customElements.define("code-view", CodeView);

// src/js/themeToggle.js
var ThemeToggle = class extends HTMLElement {
  localstorageKey = "SDFI-theme-choice";
  buttonDark;
  buttonLight;
  style = `
    .ds-theme-toggle {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      width: auto;
    }
    button[data-toggle="light"] {
      background-color: var(--c1);
    }
    button[data-toggle="light"]:hover,
    button[data-toggle="light"]:active {
      background-color: var(--c2);
      border-color: var(--c2);
    }
    button[data-toggle="light"] > svg {
      --ds-icon-color: var(--c10);
    }
    button[data-toggle="dark"] {
      background-color: var(--c6);
    }
    button[data-toggle="dark"]:hover,
    button[data-toggle="dark"]:active {
      background-color: var(--c5);
      border-color: var(--c5);
    }
    button[data-toggle="dark"] > svg {
      --ds-icon-color: var(--c1);
    }
  `;
  constructor() {
    super();
  }
  render() {
    if (!document.head.querySelector(".ds-theme-toggle-style")) {
      const styleTag = document.createElement("style");
      styleTag.className = "ds-theme-toggle-style";
      styleTag.innerHTML = this.style;
      document.head.append(styleTag);
    }
    this.innerHTML = `
      <div class="ds-theme-toggle ds-button-group">
        <button title="Lys" data-toggle="light">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>Lyst tema</title>
            <circle cx="12" cy="12" r="5" stroke="var(--ds-icon-color, black)" fill="none"/>
            <path d="M3 12L5 12M19 12L21 12" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M12 3L12 5M12 19L12 21" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M18.3638 5.63672L16.9496 7.05093M7.05006 16.9504L5.63585 18.3646" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M18.3638 18.3633L16.9496 16.9491M7.05006 7.04957L5.63585 5.63536" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
          </svg>
        </button>
        
        <button title="M\xF8rk" data-toggle="dark">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>M\xF8rkt tema</title>
            <circle cx="12" cy="12" r="5" stroke="var(--ds-icon-color, black)" fill="none"/>
            <path d="M3 12L5 12M19 12L21 12" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M12 3L12 5M12 19L12 21" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M18.3638 5.63672L16.9496 7.05093M7.05006 16.9504L5.63585 18.3646" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
            <path d="M18.3638 18.3633L16.9496 16.9491M7.05006 7.04957L5.63585 5.63536" stroke="var(--ds-icon-color, black)" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;
  }
  goDarkHandler(event) {
    document.documentElement.dataset.theme = "dark";
    localStorage.setItem(this.localstorageKey, "dark");
  }
  goLightHandler(event) {
    document.documentElement.dataset.theme = "light";
    localStorage.setItem(this.localstorageKey, "light");
  }
  checkPreference() {
    const preference = localStorage.getItem(this.localstorageKey);
    if (preference === "dark") {
      document.documentElement.dataset.theme = "dark";
    } else if (preference === "light") {
      document.documentElement.dataset.theme = "light";
    }
  }
  connectedCallback() {
    this.checkPreference();
    this.render();
    this.buttonDark = this.querySelector('button[data-toggle="dark"]');
    this.buttonLight = this.querySelector('button[data-toggle="light"]');
    this.buttonDark.addEventListener("click", this.goDarkHandler.bind(this));
    this.buttonLight.addEventListener("click", this.goLightHandler.bind(this));
  }
  disconnectedCallback() {
    this.buttonDark.removeEventListener("click", this.goDarkHandler);
    this.buttonLight.removeEventListener("click", this.goLightHandler);
  }
};
customElements.define("ds-theme-toggle", ThemeToggle);

// src/js/togglePanel.js
var DSTogglePanel = class extends HTMLElement {
  toggleButton;
  togglePanel;
  componentId = Math.floor(Math.random() * 1e3);
  componentTitle;
  constructor() {
    super();
  }
  connectedCallback() {
    this.componentTitle = this.title ? this.title : "Vis mere";
    this.innerHTML = `
      ${this.renderToggleButton()}
      <div id="ds-toggle-panel-${this.componentId}" class="ds-toggle-panel" hidden aria-labelledby="ds-toggle-button-${this.componentId}">
        ${this.innerHTML}
      </div>
    `;
    this.toggleButton = document.querySelector(`#ds-toggle-button-${this.componentId}`);
    this.togglePanel = this.querySelector(".ds-toggle-panel");
    this.toggleButton.addEventListener("click", this.toggle.bind(this));
  }
  renderToggleButton() {
    const externalToggleButton = document.querySelector(`button[for="${this.id}"]`);
    if (externalToggleButton) {
      externalToggleButton.id = `ds-toggle-button-${this.componentId}`;
      externalToggleButton.setAttribute("aria-controls", `ds-toggle-panel-${this.componentId}`);
      return "";
    } else {
      return `
        <button id="ds-toggle-button-${this.componentId}" aria-controls="ds-toggle-panel-${this.componentId}" class="ds-toggle-button" title="${this.componentTitle}">
          <svg><use href="../assets/designsystem-icons.svg#hentdata-choose" /></svg>
        </button>
      `;
    }
  }
  toggle(event) {
    event.stopPropagation();
    this.togglePanel.hidden = !this.togglePanel.hidden;
  }
  open() {
    this.togglePanel.hidden = false;
  }
  close() {
    this.togglePanel.hidden = true;
  }
};
customElements.define("ds-toggle-panel", DSTogglePanel);

// src/js/toggle.js
var DSSlide = class extends HTMLElement {
  // Properties
  style = `
    :host([hidden]) {
      display: block !important;
      transform: translate(-100%);
    }
    :host {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      max-width: 100%;
      background-color: var(--background-color);
      padding: var(--padding);
      transition: transform 0.3s;
      transform: translate(0);
    }
  `;
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
      <style>${this.style}</style>
      <ds-toggle-panel>
        ${this.innerHTML}
      </ds-toggle-panel>
    `;
  }
};
customElements.define("ds-slide", DSSlide);

// src/js/logo.js
var DSLogo = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
      <style>
        :host {
          --ds-logo-color: #fff;
          --ds-logo-outline-color: hsl(198,100%,29%);
          --ds-logo-background-color: hsl(198,100%,29%);
          --ds-logo-stroke-width: 1.5;
          display: inline-block;
          width: 4rem;
          height: auto;
          aspect-ratio: 1/1;
          line-height: 1;
          container-type: size;
        }
        svg .dsl-group {
          transform: translate(10px,7px);
        }
        svg .dsl-path {
          stroke-width: var(--ds-logo-stroke-width);
          stroke: var(--ds-logo-color);
        }
        svg .dsl-circle {
          stroke: var(--ds-logo-outline-color);
          stroke-width: var(--ds-logo-stroke-width);
          fill: var(--ds-logo-background-color);
        }
        @container (max-width: 2.49rem) {
          svg {
            --ds-logo-stroke-width: 2.25;
          }
          svg .dsl-group {
            transform: translate(12px,9px) scale(0.9);
          }
          svg .dsl-path:nth-child(3) {
            display: none;
          }
        }
        @container (min-width: 2.5rem) and (max-width: 3.9rem) {
          svg {
            --ds-logo-stroke-width: 1.7;
          }
          svg .dsl-group {
            transform: translate(10.5px,7px);
          }
        }
      </style>
      <svg width="100%" height="100%" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>SDFI</title>
        <circle class="dsl-circle" cx="31.5" cy="31.5" r="30"/>
        <g class="dsl-group">
          <path class="dsl-path" d="M21.50 1.03V3.48M21.50 7.93V9.41M26.17 5.71H23.72M19.28 5.71H16.83" stroke-linecap="round"/>
          <path class="dsl-path" d="M7.40 35.40H35.60"/>
          <path class="dsl-path" d="M7.40 38.30H35.60"/>
          <path class="dsl-path" d="M7.40 41.20H35.60"/>
          <ellipse class="dsl-path" cx="21.50" cy="13.12" rx="2.52" ry="2.52"/>
          <mask id="mask0_2142_223" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="9" width="43" height="23">
            <path d="M0 9.40H43V31.90H0V9.40Z" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_2142_223)">
            <path class="dsl-path" d="M21.50 35.23V16.35M21.50 16.35C22.98 15.34 24.46 13.12 28.91 13.14C32.62 13.15 34.84 14.60 34.84 18.31C34.84 24.24 31.25 27.83 25.21 36.10M21.50 16.35C20.02 15.34 18.53 13.16 14.09 13.14C10.38 13.12 8.16 14.60 8.16 18.31C8.16 24.24 11.80 27.83 17.79 36.10M34.77 17.24C38.07 17.24 39.59 19.05 39.59 22.02C39.59 25.72 34.51 32.57 31.14 36.10M8.23 17.24C4.81 17.24 3.41 19.04 3.41 22.00C3.41 25.72 8.49 32.57 11.86 36.10"/>
          </g>
        </g> 
      </svg>
    `;
  }
};
customElements.define("ds-logo", DSLogo);

// src/js/spinner.js
var Spinner = class extends HTMLElement {
  // Properties
  style = `
    @keyframes logoanimation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    ds-spinner {
      width: 10rem;
      height: auto;
      aspect-ratio: 1;
      display: inline-block;
    }

    ds-spinner ds-logo {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: logoanimation 2s ease-in-out infinite; 
    }
  `;
  template = `
    <style>${this.style}</style>
    <ds-logo></ds-logo>
  `;
  // Getters
  static get observedAttributes() {
    return [
      "hidden"
    ];
  }
  // Constructor
  constructor() {
    super();
  }
  // Methods
  createDOM() {
    this.innerHTML = this.template;
  }
  // Lifecycle
  connectedCallback() {
    this.createDOM();
  }
};

// src/js/tabs.js
var Tabs = class extends HTMLElement {
  constructor() {
    super();
    this.tabTitles = [];
    this.tabContents = [];
    this.activeIndex = 0;
    this.componentId = Math.floor(Math.random() * 1e3);
  }
  connectedCallback() {
    const idx = Number(this.getAttribute("data-selected"));
    if (idx >= 0 && idx < this.childElementCount) {
      this.activeIndex = idx;
    }
    this.setupTabs();
    this.render();
  }
  setupTabs() {
    const tabs = Array.from(this.children);
    tabs.forEach((tab, index) => {
      const title = tab.getAttribute("title");
      const tabTitleButton = document.createElement("button");
      tabTitleButton.textContent = title;
      tabTitleButton.setAttribute("role", "tab");
      tabTitleButton.setAttribute("aria-selected", index === this.activeIndex);
      tabTitleButton.setAttribute(
        "aria-controls",
        `tabpanel-${this.componentId}-${index}`
      );
      tabTitleButton.addEventListener(
        "click",
        () => this.switchTab(index)
      );
      this.tabTitles.push(tabTitleButton);
      const tabContent = document.createElement("div");
      tabContent.className = "tab-content";
      tabContent.id = `tabpanel-${this.componentId}-${index}`;
      tabContent.setAttribute("role", "tabpanel");
      tabContent.setAttribute("aria-labelledby", `tab-${this.componentId}-${index}`);
      tabContent.style.display = index === this.activeIndex ? "block" : "none";
      tabContent.appendChild(tab);
      this.tabContents.push(tabContent);
    });
  }
  switchTab(index) {
    this.tabTitles[this.activeIndex].setAttribute("aria-selected", false);
    this.tabTitles[index].setAttribute("aria-selected", true);
    this.tabContents[this.activeIndex].style.display = "none";
    this.tabContents[index].style.display = "block";
    this.activeIndex = index;
    const tabChangeEvent = new CustomEvent("tabchange", {
      detail: {
        index,
        title: this.tabTitles[index].textContent
      },
      bubbles: true
    });
    this.dispatchEvent(tabChangeEvent);
  }
  render() {
    const styleContainer = document.createElement("style");
    styleContainer.textContent = this.styles;
    this.appendChild(styleContainer);
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "ds-tabs-header";
    this.tabTitles.forEach((tabTitle, index) => {
      tabTitle.id = `tab-${this.componentId}-${index}`;
      tabsContainer.appendChild(tabTitle);
    });
    this.appendChild(tabsContainer);
    const tabContentContainer = document.createElement("div");
    tabContentContainer.className = "ds-tabs-body";
    this.tabContents.forEach((tabContent) => {
      tabContent.className = "tabpanel";
      tabContentContainer.appendChild(tabContent);
    });
    this.appendChild(tabContentContainer);
  }
};
customElements.define("ds-tabs", Tabs);

// src/js/responsiveNav.js
var DSNav = class extends HTMLElement {
  navElement;
  toggleElement;
  hiddenNavElements;
  constructor() {
    super();
  }
  connectedCallback() {
    this.hiddenNavElements = this.cloneNodes(this.querySelectorAll("ds-nav > *"));
    this.render();
    window.addEventListener("resize", this.render.bind(this));
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.render);
    window.removeEventListener("click", this.closeToggle);
  }
  cloneNodes(nodeList) {
    let nodes = [];
    nodeList.forEach((node) => {
      nodes.push(node.cloneNode(true));
    });
    return nodes;
  }
  render() {
    this.innerHTML = "";
    this.renderNav();
    this.renderToggle();
  }
  renderNav() {
    this.navElement = document.createElement("nav");
    this.append(this.navElement);
    for (const e in this.hiddenNavElements) {
      this.navElement.append(this.hiddenNavElements[e].cloneNode(true));
      const navWidth = this.navElement.offsetWidth + 43;
      if (navWidth > this.clientWidth) {
        this.navElement.childNodes[this.navElement.childNodes.length - 1].remove();
        break;
      }
    }
  }
  renderToggle() {
    if (this.navElement.childNodes.length === this.hiddenNavElements.length) {
      this.classList.remove("toggle");
    } else {
      this.classList.add("toggle");
      this.toggleElement = document.createElement("ds-toggle-panel");
      this.hiddenNavElements.forEach((node) => {
        this.toggleElement.append(node);
      });
      this.append(this.toggleElement);
      window.addEventListener("click", this.closeToggle.bind(this));
    }
  }
  closeToggle() {
    this.toggleElement.close();
  }
};
customElements.define("ds-nav", DSNav);

// src/js/icon.js
var DSIcon = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.style = "--ds-icon-width: 3rem; width: var(--ds-icon-width); height: var(--ds-icon-width); display: inline-block;";
    this.innerHTML = `<svg style="width: 100%; height: 100%;"><use href="../../assets/designsystem-icons.svg#${this.className}"/></svg>`;
  }
};
customElements.define("ds-icon", DSIcon);

// src/js/popover.js
var ToggleEvent = class extends Event {
  constructor(type, { oldState = "", newState = "", ...init } = {}) {
    super(type, init);
    this.oldState = String(oldState || "");
    this.newState = String(newState || "");
  }
};
var popoverToggleTaskQueue = /* @__PURE__ */ new WeakMap();
function queuePopoverToggleEventTask(element, oldState, newState) {
  popoverToggleTaskQueue.set(
    element,
    setTimeout(() => {
      if (!popoverToggleTaskQueue.has(element))
        return;
      element.dispatchEvent(
        new ToggleEvent("toggle", {
          cancelable: false,
          oldState,
          newState
        })
      );
    }, 0)
  );
}
var ShadowRoot = globalThis.ShadowRoot || function() {
};
var HTMLDialogElement = globalThis.HTMLDialogElement || function() {
};
var topLayerElements = /* @__PURE__ */ new WeakMap();
var autoPopoverList = /* @__PURE__ */ new WeakMap();
var visibilityState = /* @__PURE__ */ new WeakMap();
function getPopoverVisibilityState(popover) {
  return visibilityState.get(popover) || "hidden";
}
var popoverInvoker = /* @__PURE__ */ new WeakMap();
function popoverTargetAttributeActivationBehavior(element) {
  const popover = element.popoverTargetElement;
  if (!popover) {
    return;
  }
  const visibility = getPopoverVisibilityState(popover);
  if (element.popoverTargetAction === "show" && visibility === "showing") {
    return;
  }
  if (element.popoverTargetAction === "hide" && visibility === "hidden")
    return;
  if (visibility === "showing") {
    hidePopover(popover, true, true);
  } else if (checkPopoverValidity(popover, false)) {
    popoverInvoker.set(popover, element);
    showPopover(popover);
  }
}
function checkPopoverValidity(element, expectedToBeShowing) {
  if (element.popover !== "auto" && element.popover !== "manual") {
    return false;
  }
  if (!element.isConnected)
    return false;
  if (expectedToBeShowing && getPopoverVisibilityState(element) !== "showing") {
    return false;
  }
  if (!expectedToBeShowing && getPopoverVisibilityState(element) !== "hidden") {
    return false;
  }
  if (element instanceof HTMLDialogElement && element.hasAttribute("open")) {
    return false;
  }
  if (document.fullscreenElement === element)
    return false;
  return true;
}
function getStackPosition(popover) {
  if (!popover)
    return 0;
  return Array.from(autoPopoverList.get(popover.ownerDocument) || []).indexOf(
    popover
  ) + 1;
}
function topMostClickedPopover(target) {
  const clickedPopover = nearestInclusiveOpenPopover(target);
  const invokerPopover = nearestInclusiveTargetPopoverForInvoker(target);
  if (getStackPosition(clickedPopover) > getStackPosition(invokerPopover)) {
    return clickedPopover;
  }
  return invokerPopover;
}
function topMostAutoPopover(document2) {
  const documentPopovers = autoPopoverList.get(document2);
  for (const popover of documentPopovers || []) {
    if (!popover.isConnected) {
      documentPopovers.delete(popover);
    } else {
      return popover;
    }
  }
  return null;
}
function getRootNode(node) {
  if (typeof node.getRootNode === "function") {
    return node.getRootNode();
  }
  if (node.parentNode)
    return getRootNode(node.parentNode);
  return node;
}
function nearestInclusiveOpenPopover(node) {
  while (node) {
    if (node instanceof HTMLElement && node.popover === "auto" && visibilityState.get(node) === "showing") {
      return node;
    }
    node = node.parentElement || getRootNode(node);
    if (node instanceof ShadowRoot)
      node = node.host;
    if (node instanceof Document)
      return;
  }
}
function nearestInclusiveTargetPopoverForInvoker(node) {
  while (node) {
    const nodePopover = node.popoverTargetElement;
    if (nodePopover)
      return nodePopover;
    node = node.parentElement || getRootNode(node);
    if (node instanceof ShadowRoot)
      node = node.host;
    if (node instanceof Document)
      return;
  }
}
function topMostPopoverAncestor(newPopover) {
  const popoverPositions = /* @__PURE__ */ new Map();
  let i = 0;
  const document2 = newPopover.ownerDocument;
  for (const popover of autoPopoverList.get(document2) || []) {
    popoverPositions.set(popover, i);
    i += 1;
  }
  popoverPositions.set(newPopover, i);
  i += 1;
  let topMostPopoverAncestor2 = null;
  function checkAncestor(candidate) {
    const candidateAncestor = nearestInclusiveOpenPopover(candidate);
    if (candidateAncestor === null)
      return null;
    const candidatePosition = popoverPositions.get(candidateAncestor);
    if (topMostPopoverAncestor2 === null || popoverPositions.get(topMostPopoverAncestor2) < candidatePosition) {
      topMostPopoverAncestor2 = candidateAncestor;
    }
  }
  checkAncestor(newPopover?.parentElement);
  return topMostPopoverAncestor2;
}
function isFocusable(focusTarget) {
  if (focusTarget.hidden)
    return false;
  if (focusTarget instanceof HTMLButtonElement || focusTarget instanceof HTMLInputElement || focusTarget instanceof HTMLSelectElement || focusTarget instanceof HTMLTextAreaElement || focusTarget instanceof HTMLOptGroupElement || focusTarget instanceof HTMLOptionElement || focusTarget instanceof HTMLFieldSetElement) {
    if (focusTarget.disabled)
      return false;
  }
  if (focusTarget instanceof HTMLInputElement && focusTarget.type === "hidden") {
    return false;
  }
  if (focusTarget instanceof HTMLAnchorElement && focusTarget.href === "") {
    return false;
  }
  return focusTarget.tabIndex !== -1;
}
function focusDelegate(focusTarget) {
  if (focusTarget.shadowRoot && focusTarget.shadowRoot.delegatesFocus !== true) {
    return null;
  }
  let whereToLook = focusTarget;
  if (whereToLook.shadowRoot) {
    whereToLook = whereToLook.shadowRoot;
  }
  const autoFocusDelegate = whereToLook.querySelector("[autofocus]");
  if (autoFocusDelegate) {
    return autoFocusDelegate;
  }
  const walker = focusTarget.ownerDocument.createTreeWalker(
    whereToLook,
    NodeFilter.SHOW_ELEMENT
  );
  let descendant = walker.currentNode;
  while (descendant) {
    if (isFocusable(descendant)) {
      return descendant;
    }
    descendant = walker.nextNode();
  }
}
function popoverFocusingSteps(subject) {
  focusDelegate(subject)?.focus();
}
var previouslyFocusedElements = /* @__PURE__ */ new WeakMap();
function showPopover(element) {
  if (!checkPopoverValidity(element, false)) {
    return;
  }
  const document2 = element.ownerDocument;
  if (!element.dispatchEvent(
    new ToggleEvent("beforetoggle", {
      cancelable: true,
      oldState: "closed",
      newState: "open"
    })
  )) {
    return;
  }
  if (!checkPopoverValidity(element, false)) {
    return;
  }
  let shouldRestoreFocus = false;
  if (element.popover === "auto") {
    const originalType = element.getAttribute("popover");
    const ancestor = topMostPopoverAncestor(element) || document2;
    hideAllPopoversUntil(ancestor, false, true);
    if (originalType !== element.getAttribute("popover") || !checkPopoverValidity(element, false)) {
      return;
    }
  }
  if (!topMostAutoPopover(document2)) {
    shouldRestoreFocus = true;
  }
  previouslyFocusedElements.delete(element);
  const originallyFocusedElement = document2.activeElement;
  element.classList.add("popover-open");
  visibilityState.set(element, "showing");
  if (!topLayerElements.has(document2)) {
    topLayerElements.set(document2, /* @__PURE__ */ new Set());
  }
  topLayerElements.get(document2).add(element);
  popoverFocusingSteps(element);
  if (element.popover === "auto") {
    if (!autoPopoverList.has(document2)) {
      autoPopoverList.set(document2, /* @__PURE__ */ new Set());
    }
    autoPopoverList.get(document2).add(element);
    setInvokerAriaExpanded(popoverInvoker.get(element), true);
  }
  if (shouldRestoreFocus && originallyFocusedElement && element.popover === "auto") {
    previouslyFocusedElements.set(element, originallyFocusedElement);
  }
  queuePopoverToggleEventTask(element, "closed", "open");
}
function hidePopover(element, focusPreviousElement = false, fireEvents = false) {
  if (!checkPopoverValidity(element, true)) {
    return;
  }
  const document2 = element.ownerDocument;
  if (element.popover === "auto") {
    hideAllPopoversUntil(element, focusPreviousElement, fireEvents);
    if (!checkPopoverValidity(element, true)) {
      return;
    }
  }
  setInvokerAriaExpanded(popoverInvoker.get(element), false);
  popoverInvoker.delete(element);
  if (fireEvents) {
    element.dispatchEvent(
      new ToggleEvent("beforetoggle", {
        oldState: "open",
        newState: "closed"
      })
    );
    if (!checkPopoverValidity(element, true)) {
      return;
    }
  }
  topLayerElements.get(document2)?.delete(element);
  autoPopoverList.get(document2)?.delete(element);
  element.classList.remove("popover-open");
  visibilityState.set(element, "hidden");
  if (fireEvents) {
    queuePopoverToggleEventTask(element, "open", "closed");
  }
  const previouslyFocusedElement = previouslyFocusedElements.get(element);
  if (previouslyFocusedElement) {
    previouslyFocusedElements.delete(element);
    if (focusPreviousElement) {
      previouslyFocusedElement.focus();
    }
  }
}
function closeAllOpenPopovers(document2, focusPreviousElement = false, fireEvents = false) {
  let popover = topMostAutoPopover(document2);
  while (popover) {
    hidePopover(popover, focusPreviousElement, fireEvents);
    popover = topMostAutoPopover(document2);
  }
}
function hideAllPopoversUntil(endpoint, focusPreviousElement, fireEvents) {
  const document2 = endpoint.ownerDocument || endpoint;
  if (endpoint instanceof Document) {
    return closeAllOpenPopovers(document2, focusPreviousElement, fireEvents);
  }
  let lastToHide = null;
  let foundEndpoint = false;
  for (const popover of autoPopoverList.get(document2) || []) {
    if (popover === endpoint) {
      foundEndpoint = true;
    } else if (foundEndpoint) {
      lastToHide = popover;
      break;
    }
  }
  if (!foundEndpoint) {
    return closeAllOpenPopovers(document2, focusPreviousElement, fireEvents);
  }
  while (lastToHide && getPopoverVisibilityState(lastToHide) === "showing" && autoPopoverList.get(document2)?.size) {
    hidePopover(lastToHide, focusPreviousElement, fireEvents);
  }
}
var popoverPointerDownTargets = /* @__PURE__ */ new WeakMap();
function lightDismissOpenPopovers(event) {
  if (!event.isTrusted)
    return;
  const target = event.composedPath()[0];
  if (!target)
    return;
  const document2 = target.ownerDocument;
  const topMostPopover = topMostAutoPopover(document2);
  if (!topMostPopover)
    return;
  const ancestor = topMostClickedPopover(target);
  if (ancestor && event.type === "pointerdown") {
    popoverPointerDownTargets.set(document2, ancestor);
  } else if (event.type === "pointerup") {
    const sameTarget = popoverPointerDownTargets.get(document2) === ancestor;
    popoverPointerDownTargets.delete(document2);
    if (sameTarget) {
      hideAllPopoversUntil(ancestor || document2, false, true);
    }
  }
}
var initialAriaExpandedValue = /* @__PURE__ */ new WeakMap();
function setInvokerAriaExpanded(el, force = false) {
  if (!el)
    return;
  if (!initialAriaExpandedValue.has(el)) {
    initialAriaExpandedValue.set(el, el.getAttribute("aria-expanded"));
  }
  const popover = el.popoverTargetElement;
  if (popover && popover.popover === "auto") {
    el.setAttribute("aria-expanded", String(force));
  } else {
    const initialValue = initialAriaExpandedValue.get(el);
    if (!initialValue) {
      el.removeAttribute("aria-expanded");
    } else {
      el.setAttribute("aria-expanded", initialValue);
    }
  }
}
var ShadowRoot2 = globalThis.ShadowRoot || function() {
};
function isSupported() {
  return typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype === "object" && "popover" in HTMLElement.prototype;
}
function patchSelectorFn(object, name, mapper) {
  const original = object[name];
  Object.defineProperty(object, name, {
    value(selector) {
      return original.call(this, mapper(selector));
    }
  });
}
var nonEscapedPopoverSelector = /(^|[^\\])popover-open\b/g;
function apply() {
  window.ToggleEvent = window.ToggleEvent || ToggleEvent;
  function rewriteSelector(selector) {
    if (selector?.includes("popover-open")) {
      selector = selector.replace(
        nonEscapedPopoverSelector,
        "$1.\\popover-open"
      );
    }
    return selector;
  }
  patchSelectorFn(Document.prototype, "querySelector", rewriteSelector);
  patchSelectorFn(Document.prototype, "querySelectorAll", rewriteSelector);
  patchSelectorFn(Element.prototype, "querySelector", rewriteSelector);
  patchSelectorFn(Element.prototype, "querySelectorAll", rewriteSelector);
  patchSelectorFn(Element.prototype, "matches", rewriteSelector);
  patchSelectorFn(Element.prototype, "closest", rewriteSelector);
  patchSelectorFn(
    DocumentFragment.prototype,
    "querySelectorAll",
    rewriteSelector
  );
  patchSelectorFn(
    DocumentFragment.prototype,
    "querySelectorAll",
    rewriteSelector
  );
  Object.defineProperties(HTMLElement.prototype, {
    popover: {
      enumerable: true,
      configurable: true,
      get() {
        if (!this.hasAttribute("popover"))
          return null;
        const value = (this.getAttribute("popover") || "").toLowerCase();
        if (value === "" || value == "auto")
          return "auto";
        return "manual";
      },
      set(value) {
        this.setAttribute("popover", value);
      }
    },
    showPopover: {
      enumerable: true,
      configurable: true,
      value() {
        showPopover(this);
      }
    },
    hidePopover: {
      enumerable: true,
      configurable: true,
      value() {
        hidePopover(this, true, true);
      }
    },
    togglePopover: {
      enumerable: true,
      configurable: true,
      value(force) {
        if (visibilityState.get(this) === "showing" && force === void 0 || force === false) {
          hidePopover(this, true, true);
        } else if (force === void 0 || force === true) {
          showPopover(this);
        }
      }
    }
  });
  const popoverTargetAssociatedElements = /* @__PURE__ */ new WeakMap();
  function applyPopoverInvokerElementMixin(ElementClass) {
    Object.defineProperties(ElementClass.prototype, {
      popoverTargetElement: {
        enumerable: true,
        configurable: true,
        set(targetElement) {
          if (targetElement === null) {
            this.removeAttribute("popovertarget");
            popoverTargetAssociatedElements.delete(this);
          } else if (!(targetElement instanceof Element)) {
            throw new TypeError(
              `popoverTargetElement must be an element or null`
            );
          } else {
            this.setAttribute("popovertarget", "");
            popoverTargetAssociatedElements.set(this, targetElement);
          }
        },
        get() {
          if (this.localName !== "button" && this.localName !== "input") {
            return null;
          }
          if (this.localName === "input" && this.type !== "reset" && this.type !== "image" && this.type !== "button") {
            return null;
          }
          if (this.disabled) {
            return null;
          }
          if (this.form && this.type === "submit") {
            return null;
          }
          const targetElement = popoverTargetAssociatedElements.get(this);
          if (targetElement && targetElement.isConnected) {
            return targetElement;
          } else if (targetElement && !targetElement.isConnected) {
            popoverTargetAssociatedElements.delete(this);
            return null;
          }
          const root = getRootNode(this);
          const idref = this.getAttribute("popovertarget");
          if ((root instanceof Document || root instanceof ShadowRoot2) && idref) {
            return root.getElementById(idref) || null;
          }
          return null;
        }
      },
      popoverTargetAction: {
        enumerable: true,
        configurable: true,
        get() {
          const value = (this.getAttribute("popovertargetaction") || "").toLowerCase();
          if (value === "show" || value === "hide")
            return value;
          return "toggle";
        },
        set(value) {
          this.setAttribute("popovertargetaction", value);
        }
      }
    });
  }
  applyPopoverInvokerElementMixin(HTMLButtonElement);
  applyPopoverInvokerElementMixin(HTMLInputElement);
  const handleInvokerActivation = (event) => {
    if (!event.isTrusted)
      return;
    const target = event.composedPath()[0];
    if (!(target instanceof Element) || target?.shadowRoot) {
      return;
    }
    const root = getRootNode(target);
    if (!(root instanceof ShadowRoot2 || root instanceof Document)) {
      return;
    }
    const invoker = target.closest("[popovertargetaction],[popovertarget]");
    if (invoker) {
      popoverTargetAttributeActivationBehavior(invoker);
      return;
    }
  };
  const onKeydown = (event) => {
    const key = event.key;
    const target = event.target;
    if (target && (key === "Escape" || key === "Esc")) {
      hideAllPopoversUntil(target.ownerDocument, true, true);
    }
  };
  const addEventListeners = (root) => {
    root.addEventListener("click", handleInvokerActivation);
    root.addEventListener("keydown", onKeydown);
    root.addEventListener("pointerdown", lightDismissOpenPopovers);
    root.addEventListener("pointerup", lightDismissOpenPopovers);
  };
  addEventListeners(document);
}
function popoverPolyfill() {
  if (!isSupported()) {
    console.log("polyfilling popover");
    apply();
  } else {
    console.log("not polyfilling popover");
  }
}
export {
  CodeView,
  DSIcon,
  DSLogo,
  DSNav,
  DSSlide,
  DSTogglePanel,
  Spinner,
  Tabs,
  ThemeToggle,
  popoverPolyfill,
  showToast
};
