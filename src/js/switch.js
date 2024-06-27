export class DSSwitch extends HTMLElement {

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
  `

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${ this.style }</style>
      <label>
        <slot></slot>
        <input type="checkbox">
        <span class="switch"></span>
      </label>
    `
  }

  static get observedAttributes() {
    return ['checked'];
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._syncState();
  }

  connectedCallback() {
    this.render()

    // Reflect the initial state
    this._upgradeProperty('checked')

    this.shadowRoot.querySelector('input').addEventListener('change', this._onChange.bind(this))
    this._syncState()
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('input').removeEventListener('change', this._onChange.bind(this));
  }

  _onChange(event) {
    this.checked = event.target.checked;
    this.dispatchEvent(new Event('change'));
  }

  _syncState() {
    const input = this.shadowRoot.querySelector('input');
    if (!input) {
      return
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
}