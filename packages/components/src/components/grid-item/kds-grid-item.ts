import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { numberAttr } from '../../shared/layout-styles.js';

/**
 * @element kds-grid-item
 * @summary Cell in a kds-grid that spans several columns or rows. Uses the kds-grid tokens.
 *
 * Plain children of kds-grid take one cell; wrap content in kds-grid-item only when it should span.
 *
 * @slot - Content
 * @attr {number} span - Columns to span (1–12)
 * @attr {boolean} full - Spans the full row
 * @attr {number} row-span - Rows to span
 */
@customElement('kds-grid-item')
export class KdsGridItem extends LitElement {
  static styles = [
    css`
    :host {
      display: block;
      min-width: 0;
      grid-column: span var(--_span, 1);
      grid-row: span var(--_row-span, 1);
    }

    :host([hidden]) {
      display: none;
    }

    :host([full]) {
      grid-column: 1 / -1;
    }
  `,
    numberAttr('span', '--_span'),
    numberAttr('row-span', '--_row-span'),
  ];

  @property({ type: Number, reflect: true }) span = 1;
  @property({ type: Number, reflect: true, attribute: 'row-span' }) rowSpan = 1;
  @property({ type: Boolean, reflect: true }) full = false;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-grid-item': KdsGridItem;
  }
}
