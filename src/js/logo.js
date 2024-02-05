export class DSLogo extends HTMLElement {

  constructor() {
    super()
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
    `
  }

}
