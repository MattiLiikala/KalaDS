import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing } from '../../shared/field-styles.js';

/**
 * @element kds-tab
 * @summary One tab in kds-tabs. kds-tabs sets its role, selection and keyboard behaviour.
 *
 * @slot - Tab label
 * @attr {string} value - Matches the `value` of the kds-tab-panel it controls
 * @attr {boolean} disabled - Disables the tab
 * @csspart tab - The tab label row
 */
@customElement('kds-tab')
export class KdsTab extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
      border-radius: var(--kds-component-tab-radius) var(--kds-component-tab-radius) 0 0;
      outline: none;
      cursor: pointer;
    }

    :host([hidden]) {
      display: none;
    }

    .tab {
      display: inline-flex;
      align-items: center;
      gap: var(--kds-semantic-spacing-sm);
      padding: var(--kds-component-tab-padding-y) var(--kds-component-tab-padding-x);
      border-radius: inherit;
      color: var(--kds-component-tab-text);
      font-family: var(--kds-semantic-type-label-family);
      font-size: var(--kds-semantic-type-label-size);
      font-weight: var(--kds-semantic-type-label-weight);
      line-height: var(--kds-semantic-type-body-line-height);
      white-space: nowrap;
      transition: color 0.15s ease, background-color 0.15s ease;
    }

    :host(:hover:not([disabled])) .tab {
      background-color: var(--kds-component-tab-bg-hover);
    }

    /* Hover darkens only unselected tabs; the selected tab keeps its accent colour. */
    :host(:hover:not([disabled], [aria-selected='true'])) .tab {
      color: var(--kds-component-tab-text-hover);
    }

    :host([aria-selected='true']) .tab {
      color: var(--kds-component-tab-text-selected);
    }

    /* Selected indicator along the bottom edge, just above the tab list's border. */
    :host([aria-selected='true'])::after {
      content: '';
      position: absolute;
      inset-inline: 0;
      bottom: 0;
      height: var(--kds-component-tab-indicator-width);
      background-color: var(--kds-component-tab-indicator);
    }

    :host(:focus-visible) {
      ${unsafeCSS(focusRing('tab'))}
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    :host([disabled]) .tab {
      color: var(--kds-component-tab-text-disabled);
    }
  `;

  @property({ reflect: true }) value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    return html`<span class="tab" part="tab"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-tab': KdsTab;
  }
}
