import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeVariant = 'default' | 'primary' | 'danger' | 'warning' | 'success';

/**
 * @element kds-badge
 * @summary Small status label for categorization or state indication.
 *
 * Badges are outlined: no fill, with a 1px border in the same colour as the text. They take the surface
 * colour behind them, so the text colour must contrast with that surface (at least 4.5:1).
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
      color: var(--_text);
      background: none;
      border: var(--_border-width) solid var(--_border);
      border-radius: var(--_radius);
      /* The border sits inside the padding, so badges keep the same outer size as without one. */
      padding: calc(var(--_padding-y) - var(--_border-width)) calc(var(--_padding-x) - var(--_border-width));
    }

    :host(:not([variant])) span,
    :host([variant='default']) span {
      --_text: var(--kds-component-badge-default-text);
      --_border: var(--kds-component-badge-default-border);
      --_border-width: var(--kds-component-badge-default-border-width);
      --_radius: var(--kds-component-badge-default-radius);
      --_padding-y: var(--kds-component-badge-default-padding-y);
      --_padding-x: var(--kds-component-badge-default-padding-x);
    }

    :host([variant='primary']) span {
      --_text: var(--kds-component-badge-primary-text);
      --_border: var(--kds-component-badge-primary-border);
      --_border-width: var(--kds-component-badge-primary-border-width);
      --_radius: var(--kds-component-badge-primary-radius);
      --_padding-y: var(--kds-component-badge-primary-padding-y);
      --_padding-x: var(--kds-component-badge-primary-padding-x);
    }

    :host([variant='danger']) span {
      --_text: var(--kds-component-badge-danger-text);
      --_border: var(--kds-component-badge-danger-border);
      --_border-width: var(--kds-component-badge-danger-border-width);
      --_radius: var(--kds-component-badge-danger-radius);
      --_padding-y: var(--kds-component-badge-danger-padding-y);
      --_padding-x: var(--kds-component-badge-danger-padding-x);
    }

    :host([variant='warning']) span {
      --_text: var(--kds-component-badge-warning-text);
      --_border: var(--kds-component-badge-warning-border);
      --_border-width: var(--kds-component-badge-warning-border-width);
      --_radius: var(--kds-component-badge-warning-radius);
      --_padding-y: var(--kds-component-badge-warning-padding-y);
      --_padding-x: var(--kds-component-badge-warning-padding-x);
    }

    :host([variant='success']) span {
      --_text: var(--kds-component-badge-success-text);
      --_border: var(--kds-component-badge-success-border);
      --_border-width: var(--kds-component-badge-success-border-width);
      --_radius: var(--kds-component-badge-success-radius);
      --_padding-y: var(--kds-component-badge-success-padding-y);
      --_padding-x: var(--kds-component-badge-success-padding-x);
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
