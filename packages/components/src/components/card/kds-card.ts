import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @element kds-card
 * @summary Surface container for grouping related content.
 * @slot - Default slot: card content
 * @slot header - Optional card header area
 * @slot footer - Optional card footer area
 * @attr {boolean} interactive - When set, the card shows hover styles (use for clickable cards)
 */
@customElement('kds-card')
export class KdsCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .card {
      background-color: var(--kds-component-card-bg);
      border: 1px solid var(--kds-component-card-border);
      border-radius: var(--kds-component-card-radius);
      box-shadow: var(--kds-component-card-shadow);
      overflow: hidden;
    }

    :host([interactive]) .card {
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    }

    :host([interactive]) .card:hover {
      background-color: var(--kds-component-card-bg-hover);
      border-color: var(--kds-component-card-border-hover);
      box-shadow: var(--kds-component-card-shadow-hover);
    }

    .header {
      padding: var(--kds-component-card-padding);
      border-bottom: 1px solid var(--kds-component-card-border);
    }

    .header:empty {
      display: none;
    }

    .body {
      padding: var(--kds-component-card-padding);
    }

    .footer {
      padding: var(--kds-component-card-padding);
      border-top: 1px solid var(--kds-component-card-border);
    }

    .footer:empty {
      display: none;
    }
  `;

  @property({ type: Boolean, reflect: true }) interactive = false;

  render() {
    return html`
      <div class="card" part="card">
        <div class="header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-card': KdsCard;
  }
}
