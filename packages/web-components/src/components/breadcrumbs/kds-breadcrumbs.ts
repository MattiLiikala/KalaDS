import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @element kds-breadcrumbs
 * @summary Shows where the current page sits in the site hierarchy.
 *
 * A navigation landmark with a list of kds-breadcrumb-item elements. The last item is the current page.
 *
 * @slot - kds-breadcrumb-item elements
 * @attr {string} label - Accessible name of the navigation landmark (default "Breadcrumb")
 * @csspart nav - The nav element
 * @csspart list - The list wrapper
 */
@customElement('kds-breadcrumbs')
export class KdsBreadcrumbs extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--kds-component-breadcrumbs-gap);
      margin: 0;
      padding: 0;
    }
  `;

  @property() label = 'Breadcrumb';

  render() {
    return html`
      <nav part="nav" aria-label=${this.label}>
        <div class="list" part="list" role="list"><slot></slot></div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-breadcrumbs': KdsBreadcrumbs;
  }
}
