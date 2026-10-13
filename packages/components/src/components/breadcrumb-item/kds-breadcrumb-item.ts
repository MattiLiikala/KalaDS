import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@kalads/icons';
import '../link/kds-link.js';

/**
 * @element kds-breadcrumb-item
 * @summary One step in kds-breadcrumbs.
 *
 * A link when it has an `href`; plain text marked aria-current="page" when it's the current page
 * (`current`, or no `href`). A chevron separator is shown before every item except the first.
 *
 * @slot - Item text
 * @attr {string} href - Destination
 * @attr {boolean} current - Marks this item as the current page
 * @csspart separator - The chevron separator
 */
@customElement('kds-breadcrumb-item')
export class KdsBreadcrumbItem extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--kds-component-breadcrumb-item-gap);
      font-family: var(--kds-semantic-type-body-sm-family);
      font-size: var(--kds-semantic-type-body-sm-size);
      line-height: var(--kds-semantic-type-body-sm-line-height);
      color: var(--kds-component-breadcrumb-item-text);
    }

    :host(:first-of-type) .separator {
      display: none;
    }

    .separator {
      display: inline-flex;
      color: var(--kds-component-breadcrumb-item-separator);
      --kds-icon-size: var(--kds-component-breadcrumb-item-separator-size);
    }

    .current {
      color: var(--kds-component-breadcrumb-item-text-current);
      font-weight: var(--kds-font-weight-bold);
    }
  `;

  @property() href = '';
  @property({ type: Boolean, reflect: true }) current = false;

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
  }

  render() {
    const isCurrent = this.current || !this.href;
    return html`
      <span class="separator" part="separator" aria-hidden="true"><kds-icon-chevron-right></kds-icon-chevron-right></span>
      ${isCurrent
        ? html`<span class="current" aria-current="page"><slot></slot></span>`
        : html`<kds-link href=${this.href} variant="subtle"><slot></slot></kds-link>`}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-breadcrumb-item': KdsBreadcrumbItem;
  }
}
