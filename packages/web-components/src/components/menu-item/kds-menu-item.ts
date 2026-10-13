import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing } from '../../shared/field-styles.js';

/**
 * @element kds-menu-item
 * @summary One action in a kds-menu.
 *
 * The item itself is the focusable role="menuitem" element; kds-menu moves focus between items with
 * the arrow keys.
 *
 * @slot - Item text
 * @slot start - Leading icon
 * @slot end - Trailing content, e.g. a keyboard shortcut
 * @attr {string} value - Value reported in the menu's kds-select event
 * @attr {default|danger} variant - danger for destructive actions
 * @attr {boolean} disabled - Disables the item (still focusable, as the menu pattern recommends)
 * @csspart item - The item row
 */
@customElement('kds-menu-item')
export class KdsMenuItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      border-radius: var(--kds-component-menu-item-radius);
      outline: none;
      cursor: pointer;
    }

    :host([hidden]) {
      display: none;
    }

    .item {
      display: flex;
      align-items: center;
      gap: var(--kds-component-menu-item-gap);
      padding: var(--kds-component-menu-item-padding-y) var(--kds-component-menu-item-padding-x);
      border-radius: inherit;
      color: var(--kds-component-menu-item-text);
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      line-height: var(--kds-semantic-type-body-line-height);
      white-space: nowrap;
    }

    :host(:hover) .item,
    :host(:focus) .item {
      background-color: var(--kds-component-menu-item-bg-hover);
    }

    :host(:active) .item {
      background-color: var(--kds-component-menu-item-bg-active);
    }

    :host(:focus-visible) {
      ${unsafeCSS(focusRing('menu-item'))}
    }

    :host([variant='danger']) .item {
      color: var(--kds-component-menu-item-text-danger);
    }

    :host([disabled]) {
      cursor: not-allowed;
    }

    :host([disabled]) .item {
      color: var(--kds-component-menu-item-text-disabled);
      background: none;
    }

    .label {
      flex: 1;
    }

    ::slotted([slot='start']) {
      --kds-icon-size: var(--kds-component-menu-item-icon-size);
    }

    ::slotted([slot='end']) {
      color: var(--kds-semantic-text-muted);
      font-size: var(--kds-semantic-type-caption-size);
    }
  `;

  @property({ reflect: true }) value = '';
  @property({ reflect: true }) variant: 'default' | 'danger' = 'default';
  @property({ type: Boolean, reflect: true }) disabled = false;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'menuitem');
    if (!this.hasAttribute('tabindex')) this.tabIndex = -1;
  }

  protected updated() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  render() {
    return html`
      <div class="item" part="item">
        <slot name="start"></slot>
        <span class="label"><slot></slot></span>
        <slot name="end"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-menu-item': KdsMenuItem;
  }
}
