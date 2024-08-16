// src/js/toast.js
function showToast({ message, duration = 5e3 }) {
  const newToast = document.createElement("div");
  newToast.className = "ds-toast-item";
  newToast.innerText = message;
  newToast.dataset.theme = "dark";
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

// assets/icons/copy.svg
var copy_default = '<svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">\n    <path d="M20.5 6V4.5C20.5 3.4 19.6 2.5 18.5 2.5H4.5C3.4 2.5 2.5 3.4 2.5 4.5V18.5C2.5 19.6 3.4 20.5 4.5 20.5H6M26.5 24.5V10.5C26.5 9.4 25.6 8.5 24.5 8.5H10.5C9.4 8.5 8.5 9.4 8.5 10.5V24.5C8.5 25.6 9.4 26.5 10.5 26.5H24.5C25.6 26.5 26.5 25.6 26.5 24.5Z"/>\n  </g>\n</svg>';

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
          ${copy_default}
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

// assets/icons/sun.svg
var sun_default = '<svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">\n    <path d="M0.5 14.5H3.5M25.5 14.5L28.5 14.5M14.49 0.5V3.5M14.5 25.5V28.5M4.6 24.4L6.72 22.28M22.28 6.72L24.4 4.6M4.59 4.61L6.72 6.73M22.28 22.28L24.4 24.4M22.5 14.5C22.5 18.92 18.92 22.5 14.5 22.5C10.08 22.5 6.5 18.92 6.5 14.5C6.5 10.08 10.08 6.5 14.5 6.5C18.92 6.5 22.5 10.08 22.5 14.5Z"/>\n  </g>\n</svg>';

// src/js/themeToggle.js
var ThemeToggle = class extends HTMLElement {
  localstorageKey = "Klimadatastyrelsen-theme-choice";
  buttonDark;
  buttonLight;
  style = `
    button[data-toggle="light"] {
      background-color: var(--white);
      padding-left: var(--space-sm);
    }
    button[data-toggle="light"]:hover,
    button[data-toggle="light"]:active {
      background-color: var(--c2);
      border-color: var(--c2);
    }
    button[data-toggle="light"] > svg {
      --ds-icon-color: var(--black);
    }
    button[data-toggle="dark"] {
      background-color: var(--c7);
    }
    button[data-toggle="dark"]:hover,
    button[data-toggle="dark"]:active {
      background-color: var(--c6);
      border-color: var(--c6);
    }
    button[data-toggle="dark"] > svg {
      --ds-icon-color: var(--white);
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
          ${sun_default}
        </button>
        
        <button title="M\xF8rk" data-toggle="dark">
          ${sun_default}
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

// assets/icons/choose.svg
var choose_default = '<svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">\n    <path d="M16.5 14.5C16.5 15.6 15.6 16.5 14.5 16.5C13.4 16.5 12.5 15.6 12.5 14.5C12.5 13.4 13.4 12.5 14.5 12.5C15.6 12.5 16.5 13.4 16.5 14.5Z"/>\n    <path d="M27.5 14.5C27.5 15.6 26.6 16.5 25.5 16.5C24.4 16.5 23.5 15.6 23.5 14.5C23.5 13.4 24.4 12.5 25.5 12.5C26.6 12.5 27.5 13.4 27.5 14.5Z"/>\n    <path d="M5.5 14.5C5.5 15.6 4.6 16.5 3.5 16.5C2.4 16.5 1.5 15.6 1.5 14.5C1.5 13.4 2.4 12.5 3.5 12.5C4.6 12.5 5.5 13.4 5.5 14.5Z"/>\n  </g>\n</svg>';

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
    const externalToggleButton = this.parentElement.querySelector(`button[for="${this.id}"]`);
    if (externalToggleButton) {
      externalToggleButton.id = `ds-toggle-button-${this.componentId}`;
      externalToggleButton.setAttribute("aria-controls", `ds-toggle-panel-${this.componentId}`);
      return "";
    } else {
      return `
        <button id="ds-toggle-button-${this.componentId}" aria-controls="ds-toggle-panel-${this.componentId}" class="ds-toggle-button" title="${this.componentTitle}">
          ${choose_default}
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
    if (!customElements.get("ds-toggle-panel")) {
      customElements.define("ds-toggle-panel", DSTogglePanel);
    }
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
        <title>Klimadatastyrelsen</title>
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

// src/js/spinner.js
var Spinner = class extends HTMLElement {
  // Properties
  style = `
    @keyframes logoanimation {
      0% {
        transform: scaleX(0%);
        filter: brightness(1);
      }
      25% {
        transform: scaleX(105%);
        filter: brightness(1);
      }
      50% {
        transform: scaleX(0%);
        filter: brightness(1);
      }
      51% {
        transform: scaleX(0%);
        filter: brightness(0.6);
      }
      75% {
        transform: scaleX(105%);
        filter: brightness(0.6);
      }
      100% {
        transform: scaleX(0%);
        filter: brightness(0.6);
      }
    }

    @keyframes logosled {
      from {
        rotate: 0deg;
      }
      to {
        rotate: 359deg;
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
      position: relative;
      /* animation: logoanimation 3s ease-in-out infinite; */
    }

    ds-spinner ds-logo::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border-top: solid medium var(--color);
      transform-origin: 50% 50%;
      animation: logosled 2s ease-out infinite;
      border-radius: 50%;
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
    if (!customElements.get("ds-logo")) {
      customElements.define("ds-logo", DSLogo);
    }
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
  `;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.activeIndex = 0;
    this.componentId = Math.floor(Math.random() * 1e3);
  }
  connectedCallback() {
    const idx = Number(this.getAttribute("data-selected"));
    if (idx >= 0 && idx < this.childElementCount) {
      this.activeIndex = idx;
    }
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
      if (index === this.activeIndex) {
        tabTitleButton.classList.add("active");
      }
      tabTitleButton.addEventListener(
        "click",
        () => this.switchTab(index)
      );
      this.shadowRoot.querySelector(".ds-tabs-header").append(tabTitleButton);
      tab.id = `tabpanel-${this.componentId}-${index}`;
      tab.setAttribute("role", "tabpanel");
      tab.setAttribute("aria-labelledby", `tab-${this.componentId}-${index}`);
      tab.style.display = index === this.activeIndex ? "block" : "none";
    });
  }
  switchTab(index) {
    const tabTitles = this.shadowRoot.querySelectorAll(".ds-tabs-header button");
    const tabContents = Array.from(this.children);
    tabTitles[this.activeIndex].setAttribute("aria-selected", false);
    tabTitles[index].setAttribute("aria-selected", true);
    tabTitles.forEach((tabElement) => {
      tabElement.classList.remove("active");
    });
    tabTitles[index].classList.add("active");
    tabContents[this.activeIndex].style.display = "none";
    tabContents[index].style.display = "block";
    this.activeIndex = index;
    const tabChangeEvent = new CustomEvent("tabchange", {
      detail: {
        index,
        title: tabTitles[index].textContent
      },
      bubbles: true
    });
    this.dispatchEvent(tabChangeEvent);
  }
  render() {
    this.shadowRoot.innerHTML += `
      <style>
        ${this.style}
      </style>
      <nav class="ds-tabs-header"></nav>
      <div class="ds-tabs-body">
        <slot></slot>
      </div>
    `;
    this.setupTabs();
  }
};

// src/js/logoTitle.js
var DSLogoTitle = class extends HTMLElement {
  constructor() {
    super();
    if (!customElements.get("ds-logo")) {
      customElements.define("ds-logo", DSLogo);
    }
  }
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }
        :host(.black) ds-logo {
          --ds-logo-color: var(--white);
          --ds-logo-outline-color: var(--black);
          --ds-logo-background-color: var(--black);
        }
        :host(.white) ds-logo {
          --ds-logo-color: var(--black);
          --ds-logo-outline-color: var(--white);
          --ds-logo-background-color: var(--white);
        }
        :host(.transparent) ds-logo {
          --ds-logo-color: var(--ds-logo-theme-color);
          --ds-logo-outline-color: var(--ds-logo-theme-color);
          --ds-logo-background-color: transparent;
        }  
        .logo-title-wrapper {
          height: 100%;
          min-height: 4rem;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: flex-start;
          gap: var(--space-sm);
        }
        ds-logo {
          height: 4rem;
          width: 4rem;
          margin-left: -0.8rem;
        }
        p {
          margin: 0.75rem 0 0;
          padding: 0;
        }
        .single-line {
          margin-top: 1.33rem;
          font-weight: 370;
          font-size: 1.125rem;
          line-height: 1.33;
        }
        strong {
          font-size: 1.188rem;
          font-weight: 500;
          line-height: 1.10;
          letter-spacing: 0.01rem;
        }
        small {
          display: inline-block;
          font-size: 0.875rem;
          font-weight: 390;
          line-height: 1.21;
          padding-bottom: var(--space-xs);
        }

        :host(.small) .logo-title-wrapper {
          min-height: 2rem;
          gap: var(--space-xs);
        }
        :host(.small) ds-logo {
          height: 1.5rem;
          width: 1.5rem;
          margin-left: -0.33rem;
        }
        :host(.small) p {
          margin-top: var(--space-xs);
        }
        :host(.small) .single-line {
          margin-top: var(--space-xs);
        }
        :host(.small) .single-line,
        :host(.small) strong {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.14;
          letter-spacing: 0.02rem;
        }
        :host(.small) small {
          font-size: 0.875rem;
          font-weight: 390;
          line-height: 1.21;
        }
      </style>
      <div class="logo-title-wrapper">
        <ds-logo></ds-logo>
        ${this.formatLogoText(this.title, this.getAttribute("byline"))}
      </div>
    `;
  }
  formatLogoText(title, byline) {
    let txt = "";
    if (title && byline) {
      txt = `<p><strong>${title}</strong><br><small>${byline}</small></p>`;
    } else if (title && !byline) {
      txt = `<p class="single-line">${title}</p>`;
    } else {
      txt = `<p class="single-line">Klimadatastyrelsen</p>`;
    }
    return txt;
  }
};

// src/js/responsiveNav.js
var DSNav = class extends HTMLElement {
  navElement;
  toggleElement;
  hiddenNavElements;
  debounceTimer;
  constructor() {
    super();
    if (!customElements.get("ds-toggle-panel")) {
      customElements.define("ds-toggle-panel", DSTogglePanel);
    }
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
var DSNavResponsive = class extends HTMLElement {
  mode;
  // 'fill' or 'switch'
  intersectionObserver;
  #style = `
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
  `;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.mode = this.classList.contains("fill") ? "fill" : "switch";
    this.classList.add(this.mode);
    this.render();
    this.setClassBySize();
    this.setContainerSize();
    window.addEventListener("resize", this.updateMenu.bind(this));
    window.addEventListener("click", this.closeMenu.bind(this));
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this.updateMenu);
    window.removeEventListener("click", this.closeMenu);
  }
  render() {
    this.shadowRoot.innerHTML += `
      <style>
        ${this.#style}
      </style>
      <div class="menu-container ${this.mode}">
        <slot name="toggle" class="menu-toggle"></slot>
        <div class="menu-items">
          <slot></slot>
        </div>
      </div>
    `;
    this.shadowRoot.querySelector(".menu-toggle").addEventListener("click", this.openMenu.bind(this));
  }
  openMenu(event) {
    event.stopPropagation();
    const container = this.shadowRoot.querySelector(".menu-container");
    this.classList.add("expanded");
    container.classList.add("expanded");
  }
  closeMenu() {
    const container = this.shadowRoot.querySelector(".menu-container");
    this.classList.remove("expanded");
    container.classList.remove("expanded");
  }
  updateMenu() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(this.setClassBySize.bind(this), 100);
  }
  setClassBySize() {
    const container = this.shadowRoot.querySelector(".menu-container");
    const items = this.shadowRoot.querySelector(".menu-items");
    this.classList.remove("compact");
    container.classList.remove("compact");
    if (items.scrollWidth > items.clientWidth) {
      this.classList.add("compact");
      container.classList.add("compact");
    }
  }
  setContainerSize() {
    if (this.mode !== "fill") {
      return;
    }
    const container = this.querySelector(':not(button[slot="toggle"])');
    const toggle = this.querySelector('button[slot="toggle"]');
    const maxWidth = this.clientWidth - toggle.clientWidth - 8;
    let visibleContentWidth = 0;
    for (const element of Array.from(container.children)) {
      if (visibleContentWidth < maxWidth) {
        visibleContentWidth = visibleContentWidth + element.clientWidth + 8;
        continue;
      } else {
        visibleContentWidth = visibleContentWidth - element.clientWidth - 16;
        break;
      }
    }
    this.shadowRoot.querySelector(".menu-items").style.width = `${visibleContentWidth}px`;
  }
};
var DSNavScrollable = class extends HTMLElement {
  debounceTimer;
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
  `;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML += `
      <style>
        ${this.style}
      </style>

      <slot></slot>

      <button class="btn-scroll-left" title="Scroll mod venstre">
        <svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">
            <path d="M22 27L5.41 15.16C4.85 14.72 4.86 14.02 5.43 13.59L22 2"/>
          </g>
        </svg>
      </button>
      
      <button class="btn-scroll-right" title="Scroll mod h\xF8jre">
        <svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">
            <path d="M6 2L22.59 13.84C23.15 14.28 23.14 14.98 22.57 15.41L6 27"/>
          </g>
        </svg>
      </button>
    `;
    this.updateButtons();
    this.shadowRoot.querySelector("slot").addEventListener("scroll", this.scrollHandler.bind(this));
    this.shadowRoot.querySelector(".btn-scroll-left").addEventListener("click", this.scrollLeftHandler.bind(this));
    this.shadowRoot.querySelector(".btn-scroll-right").addEventListener("click", this.scrollRightHandler.bind(this));
  }
  scrollHandler() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(this.updateButtons.bind(this), 100);
  }
  scrollLeftHandler() {
    const scrollableElement = this.shadowRoot.querySelector("slot");
    this.scrollBtnHandler(scrollableElement.scrollLeft - 200);
  }
  scrollRightHandler() {
    const scrollableElement = this.shadowRoot.querySelector("slot");
    this.scrollBtnHandler(scrollableElement.scrollLeft + 200);
  }
  scrollBtnHandler(position) {
    this.shadowRoot.querySelector("slot").scroll({
      top: 0,
      left: position,
      behavior: "smooth"
    });
  }
  updateButtons() {
    const scrollableElement = this.shadowRoot.querySelector("slot");
    const leftBtn = this.shadowRoot.querySelector(".btn-scroll-left");
    const rightBtn = this.shadowRoot.querySelector(".btn-scroll-right");
    const scrolled = scrollableElement.scrollLeft;
    const visibleWidth = scrollableElement.clientWidth;
    const totalWidth = scrollableElement.scrollWidth;
    if (scrolled > 0) {
      leftBtn.style.display = "block";
    } else {
      leftBtn.style.display = "none";
    }
    if (visibleWidth > totalWidth || scrolled + visibleWidth >= totalWidth) {
      rightBtn.style.display = "none";
    } else {
      rightBtn.style.display = "block";
    }
  }
};

// src/js/icon.js
var DSIcon = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.style = "--ds-icon-width: 3rem; width: var(--ds-icon-width); height: var(--ds-icon-width); display: inline-block;";
    this.innerHTML = `<svg style="width: 100%; height: 100%;"><use href="../../assets/icons.svg#${this.className}"/></svg>`;
  }
};

// assets/icons/arrow-single-up.svg
var arrow_single_up_default = '<svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">\n    <path d="M2 22L13.84 5.41C14.28 4.85 14.98 4.86 15.41 5.43L27 22"/>\n  </g>\n</svg>';

// assets/icons/arrow-single-down.svg
var arrow_single_down_default = '<svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">\n    <path d="M27 7L15.16 23.59C14.72 24.15 14.02 24.14 13.59 23.57L2 7"/>\n  </g>\n</svg>';

// src/js/dataTable.js
var DSDataTable = class extends HTMLElement {
  #tableHeaders = [];
  #tableBody = [];
  #tableBodyFiltered = [];
  set data(payload) {
    this.#tableHeaders = payload.headers;
    this.#tableBody = payload.body;
    this.#tableBodyFiltered = payload.body;
    this.render();
  }
  constructor() {
    super();
  }
  connectedCallback() {
    this.className = "ds-data-table";
  }
  render() {
    this.innerHTML = "";
    this.append(this.renderFilterInput());
    const tableElement = document.createElement("table");
    tableElement.innerHTML = "<thead></thead><tbody></tbody>";
    this.append(tableElement);
    this.renderHeader();
    this.renderBody();
    this.dispatchEvent(new CustomEvent("datatable:update", { bubbles: true }));
  }
  renderFilterInput() {
    const filterElement = document.createElement("input");
    filterElement.type = "search";
    filterElement.placeholder = "Filter";
    filterElement.addEventListener("input", this.filterDataHandler.bind(this));
    return filterElement;
  }
  renderHeader() {
    const tableHead = this.querySelector("thead");
    const tableHeaderRow = document.createElement("tr");
    this.#tableHeaders.forEach((header, index) => {
      tableHeaderRow.append(this.renderHeaderCell(header, index));
    });
    tableHead.append(tableHeaderRow);
  }
  renderHeaderCell(data, index) {
    const headerElement = document.createElement("th");
    headerElement.dataset.index = index;
    if (typeof data === "object") {
      if (data.type === "number") {
        headerElement.style.textAlign = "right";
      }
      if (!data.sortable) {
        headerElement.innerText = data.value;
      } else {
        headerElement.innerHTML = this.renderSortButtons(data.value);
        headerElement.querySelector("button").addEventListener("click", this.sortHandler.bind(this));
      }
    } else {
      headerElement.innerHTML = this.renderSortButtons(data);
      headerElement.querySelector("button").addEventListener("click", this.sortHandler.bind(this));
    }
    return headerElement;
  }
  renderSortButtons(title) {
    return `
      <button class="quiet button-sort">
        <span class="sort-asc">${arrow_single_up_default}</span>
        <span class="sort-dsc">${arrow_single_down_default}</span>
        ${title}
      </button>
    `;
  }
  renderBody() {
    const tableBody = this.querySelector("tbody");
    tableBody.innerHTML = "";
    this.#tableBodyFiltered.forEach((rowData) => {
      tableBody.append(this.renderCells(rowData));
    });
  }
  renderCells(rowData) {
    const rowElement = document.createElement("tr");
    rowData.forEach((cellData) => {
      rowElement.append(this.renderCell(cellData));
    });
    return rowElement;
  }
  renderCell(data) {
    const cellElement = document.createElement("td");
    if (typeof data === "string") {
      cellElement.innerHTML = data;
    } else if (typeof data === "number") {
      cellElement.innerText = data;
      cellElement.style.textAlign = "right";
    } else if (typeof data === "object") {
      if (data.type === "number") {
        cellElement.style.textAlign = "right";
      }
      if (data.editable && data.type === "number") {
        cellElement.innerHTML = `<input type="number" value="${data.value}" style="text-align: right; width: 100%;">`;
      } else if (data.editable && data.type === "string") {
        cellElement.innerHTML = `<input type="text" value="${data.value}">`;
      } else {
        cellElement.innerHTML = data.value;
      }
      if (data.editCallback) {
        cellElement.querySelector("input").addEventListener("input", data.editCallback);
      }
    }
    if (data.className) {
      cellElement.classList.add(data.className);
    }
    return cellElement;
  }
  filterDataHandler(event) {
    if (event.target.value === "" || !event.target.value) {
      this.#tableBodyFiltered = this.#tableBody;
    } else {
      this.#tableBodyFiltered = this.filterData(this.#tableBody, event.target.value);
    }
    this.renderBody();
  }
  filterData(data, query) {
    return data.filter((dataRow) => {
      let match = false;
      dataRow.forEach((cell) => {
        if (cell.toString().includes(query)) {
          match = true;
        }
      });
      return match;
    });
  }
  sortHandler(event) {
    let target = event.target;
    if (event.target.tagName === "SVG") {
      target = event.target.parentElement;
    }
    target.classList.toggle("asc");
    const sortMode = target.className.includes("asc");
    const targetIndex = target.parentElement.dataset.index;
    this.#tableBodyFiltered = this.sortData(this.#tableBodyFiltered, targetIndex, sortMode);
    this.renderBody();
  }
  sortData(data, columnIndex, direction) {
    return data.sort((a, b) => {
      let xVal, yVal;
      if (direction) {
        xVal = a[columnIndex].value ? a[columnIndex].value : a[columnIndex];
        yVal = b[columnIndex].value ? b[columnIndex].value : b[columnIndex];
      } else {
        yVal = a[columnIndex].value ? a[columnIndex].value : a[columnIndex];
        xVal = b[columnIndex].value ? b[columnIndex].value : b[columnIndex];
      }
      if (xVal > yVal) {
        return 1;
      } else if (xVal > yVal) {
        return -1;
      } else {
        return 0;
      }
    });
  }
};

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
    apply();
  }
}

// src/js/switch.js
var DSSwitch = class extends HTMLElement {
  style = `
    :host {
      display: inline-block;
      width: auto;
      height: var(--space-md);
    }
    label {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: stretch;
      height: 100%;
      width: auto;
      gap: var(--space-sm);
    }
    input[type="checkbox"] {
      display: none;
    }
    .switch {
      border: solid 1px var(--border-color);
      position: relative;
      display: block;
      width: 3rem;
      background-color: var(--bg1);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: background-color 0.3s, border-color 0.3s;
    }
    .switch::after {
      content: '';
      position: absolute;
      top: 0.125rem;
      left: var(--space-xxs);
      width: 1rem;
      height: 1rem;
      background-color: var(--white);
      border: solid 1px var(--border-color);
      border-radius: 50%;
      transition: transform 0.3s, border-color 0.3s;
    }
    input:checked ~ .switch {
      background-color: var(--primary);
      border-color: var(--primary);
    }
    input:checked ~ .switch::after {
      transform: translateX(1.5rem);
      border-color: var(--white);
    }
  `;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.style}</style>
      <label>
        <slot></slot>
        <input type="checkbox">
        <span class="switch"></span>
      </label>
    `;
  }
  static get observedAttributes() {
    return ["checked"];
  }
  get checked() {
    return this.hasAttribute("checked");
  }
  set checked(value) {
    if (value) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this._syncState();
  }
  connectedCallback() {
    this.render();
    this._upgradeProperty("checked");
    this.shadowRoot.querySelector("input").addEventListener("change", this._onChange.bind(this));
    this._syncState();
  }
  disconnectedCallback() {
    this.shadowRoot.querySelector("input").removeEventListener("change", this._onChange.bind(this));
  }
  _onChange(event) {
    this.checked = event.target.checked;
    this.dispatchEvent(new Event("change"));
  }
  _syncState() {
    const input = this.shadowRoot.querySelector("input");
    if (!input) {
      return;
    }
    if (this.checked) {
      input.checked = true;
    } else {
      input.checked = false;
    }
  }
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
};
export {
  CodeView,
  DSDataTable,
  DSIcon,
  DSLogo,
  DSLogoTitle,
  DSNav,
  DSNavResponsive,
  DSNavScrollable,
  DSSlide,
  DSSwitch,
  DSTogglePanel,
  Spinner,
  Tabs,
  ThemeToggle,
  popoverPolyfill,
  showToast
};
