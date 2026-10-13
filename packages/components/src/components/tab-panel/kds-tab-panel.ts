import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing } from '../../shared/field-styles.js';

/**
 * @element kds-tab-panel
 * @summary Content shown when the kds-tab with the same `value` is selected.
 *
 * kds-tabs sets its role, labelling and visibility.
 *
 * @slot - Panel content
 * @attr {string} value - Matches the `value` of its kds-tab
 * @csspart panel - The panel wrapper
 */
@customElement('kds-tab-panel')
export class KdsTabPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      outline: none;
      border-radius: var(--kds-component-tab-panel-radius);
    }

    :host([hidden]) {
      display: none;
    }

    :host(:focus-visible) {
      ${unsafeCSS(focusRing('tab-panel'))}
    }

    .panel {
      padding-block: var(--kds-component-tab-panel-padding-y);
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      line-height: var(--kds-semantic-type-body-line-height);
      color: var(--kds-component-tab-panel-text);
    }
  `;

  @property({ reflect: true }) value = '';

  render() {
    return html`<div class="panel" part="panel"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-tab-panel': KdsTabPanel;
  }
}
