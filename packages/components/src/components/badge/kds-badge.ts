import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeVariant = 'default' | 'primary' | 'danger' | 'warning' | 'success';

/**
 * @element kds-badge
 * @summary Small status label for categorization or state indication.
 * @slot - Default slot: badge text content
 * @attr {default|primary|danger|warning|success} variant - Visual style variant
 */
@customElement('kds-badge')
export class KdsBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    span {
      display: inline-flex;
      align-items: center;
      font-family: var(--kds-font-family-label);
      font-size: var(--kds-font-size-100);
      font-weight: var(--kds-font-weight-bold);
      line-height: var(--kds-font-line-height-small);
      white-space: nowrap;
    }

    :host(:not([variant])) span,
    :host([variant='default']) span {
      background-color: var(--kds-component-badge-default-bg);
      color: var(--kds-component-badge-default-text);
      border-radius: var(--kds-component-badge-default-radius);
      padding: var(--kds-component-badge-default-padding-y) var(--kds-component-badge-default-padding-x);
    }

    :host([variant='primary']) span {
      background-color: var(--kds-component-badge-primary-bg);
      color: var(--kds-component-badge-primary-text);
      border-radius: var(--kds-component-badge-primary-radius);
      padding: var(--kds-component-badge-primary-padding-y) var(--kds-component-badge-primary-padding-x);
    }

    :host([variant='danger']) span {
      background-color: var(--kds-component-badge-danger-bg);
      color: var(--kds-component-badge-danger-text);
      border-radius: var(--kds-component-badge-danger-radius);
      padding: var(--kds-component-badge-danger-padding-y) var(--kds-component-badge-danger-padding-x);
    }

    :host([variant='warning']) span {
      background-color: var(--kds-component-badge-warning-bg);
      color: var(--kds-component-badge-warning-text);
      border-radius: var(--kds-component-badge-warning-radius);
      padding: var(--kds-component-badge-warning-padding-y) var(--kds-component-badge-warning-padding-x);
    }

    :host([variant='success']) span {
      background-color: var(--kds-component-badge-success-bg);
      color: var(--kds-component-badge-success-text);
      border-radius: var(--kds-component-badge-success-radius);
      padding: var(--kds-component-badge-success-padding-y) var(--kds-component-badge-success-padding-x);
    }
  `;

  @property({ reflect: true }) variant: BadgeVariant = 'default';

  render() {
    return html`<span part="badge"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-badge': KdsBadge;
  }
}
