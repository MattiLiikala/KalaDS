import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @element kds-list
 * @summary Vertical list of kds-list-item elements.
 *
 * Sets role="list" on itself so that kds-list-item children (role="listitem") form a proper list for
 * assistive technology. A kds-list inside a list item's `nested` slot is indented.
 *
 * @slot - kds-list-item elements
 * @attr {string} label - Accessible name for the list (optional)
 * @attr {boolean} dense - Tighter item spacing
 */
@customElement('kds-list')
export class KdsList extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--kds-component-list-gap);
      padding-block: var(--kds-component-list-padding-y);
    }

    :host([hidden]) {
      display: none;
    }

    :host([dense]) {
      --_kds-list-dense-padding-y: var(--kds-semantic-spacing-xs);
    }

    :host([slot='nested']) {
      padding-block: 0;
      padding-inline-start: var(--kds-component-list-nested-indent);
    }
  `;

  @property() label = '';
  @property({ type: Boolean, reflect: true }) dense = false;

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'list');
  }

  protected updated() {
    if (this.label) this.setAttribute('aria-label', this.label);
    else this.removeAttribute('aria-label');
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-list': KdsList;
  }
}
