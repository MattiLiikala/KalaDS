import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * @element kds-button
 * @summary Trigger actions or navigate. Always use this instead of a native <button> with manual styling.
 * @slot - Default slot: button label text
 * @slot start - Icon slot before the label
 * @slot end - Icon slot after the label
 * @attr {primary|secondary|danger|ghost} variant - Visual style variant
 * @attr {sm|md|lg} size - Size variant
 * @attr {boolean} disabled - Disables the button
 */
@customElement('kds-button')
export class KdsButton extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: var(--kds-size-200);
      font-family: var(--kds-font-family-label);
      font-weight: var(--kds-font-weight-bold);
      font-size: var(--kds-font-size-200);
      line-height: var(--kds-font-line-height-small);
      cursor: pointer;
      border: 1px solid;
      transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      text-decoration: none;
      white-space: nowrap;
    }

    button:focus-visible {
      outline: none;
    }

    /* === PRIMARY === */
    :host(:not([variant])) button,
    :host([variant='primary']) button {
      background-color: var(--kds-component-button-primary-bg);
      color: var(--kds-component-button-primary-text);
      border-color: var(--kds-component-button-primary-border);
      border-radius: var(--kds-component-button-primary-radius);
      padding: var(--kds-component-button-primary-padding-y) var(--kds-component-button-primary-padding-x);
    }
    :host(:not([variant])) button:hover:not(:disabled),
    :host([variant='primary']) button:hover:not(:disabled) {
      background-color: var(--kds-component-button-primary-bg-hover);
      border-color: var(--kds-component-button-primary-border-hover);
    }
    :host(:not([variant])) button:active:not(:disabled),
    :host([variant='primary']) button:active:not(:disabled) {
      background-color: var(--kds-component-button-primary-bg-active);
    }
    :host(:not([variant])) button:focus-visible,
    :host([variant='primary']) button:focus-visible {
      border-color: var(--kds-component-button-primary-border-focus);
      box-shadow: 0 0 0 3px var(--kds-component-button-primary-ring-focus);
    }
    :host(:not([variant])) button:disabled,
    :host([variant='primary']) button:disabled {
      background-color: var(--kds-component-button-primary-bg-disabled);
      border-color: var(--kds-component-button-primary-border-disabled);
      color: var(--kds-component-button-primary-text-disabled);
      cursor: not-allowed;
    }

    /* === SECONDARY === */
    :host([variant='secondary']) button {
      background-color: var(--kds-component-button-secondary-bg);
      color: var(--kds-component-button-secondary-text);
      border-color: var(--kds-component-button-secondary-border);
      border-radius: var(--kds-component-button-secondary-radius);
      padding: var(--kds-component-button-secondary-padding-y) var(--kds-component-button-secondary-padding-x);
    }
    :host([variant='secondary']) button:hover:not(:disabled) {
      background-color: var(--kds-component-button-secondary-bg-hover);
      border-color: var(--kds-component-button-secondary-border-hover);
    }
    :host([variant='secondary']) button:active:not(:disabled) {
      background-color: var(--kds-component-button-secondary-bg-active);
    }
    :host([variant='secondary']) button:focus-visible {
      border-color: var(--kds-component-button-secondary-border-focus);
      box-shadow: 0 0 0 3px var(--kds-component-button-secondary-ring-focus);
    }
    :host([variant='secondary']) button:disabled {
      background-color: var(--kds-component-button-secondary-bg-disabled);
      border-color: var(--kds-component-button-secondary-border-disabled);
      color: var(--kds-component-button-secondary-text-disabled);
      cursor: not-allowed;
    }

    /* === DANGER === */
    :host([variant='danger']) button {
      background-color: var(--kds-component-button-danger-bg);
      color: var(--kds-component-button-danger-text);
      border-color: var(--kds-component-button-danger-border);
      border-radius: var(--kds-component-button-danger-radius);
      padding: var(--kds-component-button-danger-padding-y) var(--kds-component-button-danger-padding-x);
    }
    :host([variant='danger']) button:hover:not(:disabled) {
      background-color: var(--kds-component-button-danger-bg-hover);
      border-color: var(--kds-component-button-danger-border-hover);
    }
    :host([variant='danger']) button:active:not(:disabled) {
      background-color: var(--kds-component-button-danger-bg-active);
    }
    :host([variant='danger']) button:focus-visible {
      border-color: var(--kds-component-button-danger-border-focus);
      box-shadow: 0 0 0 3px var(--kds-component-button-danger-ring-focus);
    }
    :host([variant='danger']) button:disabled {
      background-color: var(--kds-component-button-danger-bg-disabled);
      border-color: var(--kds-component-button-danger-border-disabled);
      color: var(--kds-component-button-danger-text-disabled);
      cursor: not-allowed;
    }

    /* === GHOST === */
    :host([variant='ghost']) button {
      background-color: var(--kds-component-button-ghost-bg);
      color: var(--kds-component-button-ghost-text);
      border-color: var(--kds-component-button-ghost-border);
      border-radius: var(--kds-component-button-ghost-radius);
      padding: var(--kds-component-button-ghost-padding-y) var(--kds-component-button-ghost-padding-x);
    }
    :host([variant='ghost']) button:hover:not(:disabled) {
      background-color: var(--kds-component-button-ghost-bg-hover);
    }
    :host([variant='ghost']) button:active:not(:disabled) {
      background-color: var(--kds-component-button-ghost-bg-active);
    }
    :host([variant='ghost']) button:focus-visible {
      border-color: var(--kds-component-button-ghost-border-focus);
      box-shadow: 0 0 0 3px var(--kds-component-button-ghost-ring-focus);
    }
    :host([variant='ghost']) button:disabled {
      color: var(--kds-component-button-ghost-text-disabled);
      cursor: not-allowed;
    }

    /* === SIZES === */
    :host([size='sm']) button {
      font-size: var(--kds-font-size-100);
      padding: var(--kds-size-100) var(--kds-size-300);
    }
    :host([size='lg']) button {
      font-size: var(--kds-font-size-300);
      padding: var(--kds-size-300) var(--kds-size-600);
    }
  `;

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) size: ButtonSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    return html`
      <button part="button" ?disabled=${this.disabled} aria-disabled=${this.disabled}>
        <slot name="start"></slot>
        <slot></slot>
        <slot name="end"></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-button': KdsButton;
  }
}
