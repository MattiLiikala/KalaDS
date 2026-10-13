import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { KdsAccordionItem } from '../accordion-item/kds-accordion-item.js';

/**
 * @element kds-accordion
 * @summary Stack of collapsible sections (kds-accordion-item).
 *
 * By default only one section is open at a time; set `multiple` to let several stay open. (Native
 * exclusive <details name> can't be used, because each item has its own shadow root.)
 *
 * @slot - kds-accordion-item elements
 * @attr {boolean} multiple - Allows several sections to be open at once
 */
@customElement('kds-accordion')
export class KdsAccordion extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--kds-component-accordion-gap);
    }

    :host([hidden]) {
      display: none;
    }
  `;

  @property({ type: Boolean, reflect: true }) multiple = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('kds-toggle', this._onToggle);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('kds-toggle', this._onToggle);
  }

  private _onToggle = (e: Event) => {
    const item = e.target as KdsAccordionItem;
    if (this.multiple || !item.open || item.parentElement !== this) return;
    for (const other of this.querySelectorAll<KdsAccordionItem>(':scope > kds-accordion-item')) {
      if (other !== item) other.open = false;
    }
  };

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-accordion': KdsAccordion;
  }
}
