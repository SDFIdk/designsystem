export class DsLogo extends HTMLElement {

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
          width: 6rem;
          height: auto;
          container-type: inline-size; 
        }
        svg {

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
        @container (max-width: 3rem) {
          svg {
            --ds-logo-stroke-width: 1;
          }
          svg .dsl-path:nth-child(2) {
            transform: translate(0,1.5px);
          }
          svg .dsl-path:nth-child(3) {
            display: none;
          }
        }
        @container (max-width: 6rem) {
          svg {
            --ds-logo-stroke-width: 1.3;
          }
        }
      </style>
      <svg width="100%" height="100%" viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          #large .dsl-path {stroke-with: 1.5px;}
          #medium .dsl-path {stroke-with: 1.3px;}
          #small .dsl-path {stroke-with: 0.8px;}
        </style>

        <circle class="dsl-circle" cx="31.5" cy="31.5" r="30.5"/>
        <g transform="translate(10,7)">
          <path class="dsl-path" d="M21.4996 1.03271V3.48274M21.4996 7.93102V9.41378M26.1735 5.70663H23.724M19.2757 5.70663H16.8257" stroke-linecap="round"/>
          <path class="dsl-path" d="M7.4 35.4H35.6"/>
          <path class="dsl-path" d="M7.4 38.3H35.6"/>
          <path class="dsl-path" d="M7.4 41.2H35.6"/>
          <ellipse class="dsl-path" cx="21.5012" cy="13.1208" rx="2.52069" ry="2.52069"/>
          <mask id="mask0_2142_223" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="9" width="43" height="23">
            <path d="M0 9.4H43V31.9H0V9.4Z" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_2142_223)">
            <path class="dsl-path" d="M21.5001 35.2291V16.3537M21.5001 16.3537C22.9819 15.3449 24.4647 13.1208 28.9139 13.1382C32.6198 13.1527 34.8449 14.6036 34.8449 18.3105C34.8449 24.2415 31.2496 27.8344 25.207 36.1036M21.5001 16.3537C20.0164 15.3449 18.5336 13.159 14.0863 13.1382C10.3785 13.1208 8.15525 14.6036 8.15525 18.3105C8.15525 24.2415 11.8 27.8344 17.7932 36.1036M34.7748 17.2353C38.0723 17.2353 39.5897 19.0518 39.5897 22.0174C39.5897 25.7243 34.5143 32.5662 31.138 36.1036M8.22516 17.2353C4.81035 17.2353 3.41064 19.0369 3.41064 22.0024C3.41064 25.7243 8.48586 32.5662 11.8621 36.1036"/>
          </g>
        </g> 
      </svg>
    `
  }

}

customElements.define('ds-logo', DsLogo)