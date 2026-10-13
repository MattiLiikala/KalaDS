import { LitElement, html, css, unsafeCSS, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { focusRing } from '../../shared/field-styles.js';

/**
 * @element kds-list-item
 * @summary One row in a kds-list: primary text, optional secondary text, leading and trailing content.
 *
 * Static by default. With `href` the row is a link; with `interactive` it's a button that fires
 * kds-select. Put a kds-list in the `nested` slot for a sub-list.
 *
 * @slot - Primary text
 * @slot secondary - Secondary (description) text
 * @slot start - Leading content: icon, avatar, checkbox
 * @slot end - Trailing content: meta text, badge, action
 * @slot nested - A nested kds-list
 * @attr {string} href - Makes the row a link
 * @attr {string} target - Link target
 * @attr {boolean} interactive - Makes the row a button (fires kds-select)
 * @attr {boolean} selected - Highlights the row as current or selected (sets aria-current)
 * @attr {boolean} disabled - Disables an interactive row
 * @fires kds-select - When an interactive row is activated
 * @csspart row - The row (link, button or div)
 */
@customElement('kds-list-item')
export class KdsListItem extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    .row {
      display: flex;
      align-items: center;
      gap: var(--kds-component-list-item-gap);
      box-sizing: border-box;
      width: 100%;
      /* kds-list[dense] sets --_kds-list-dense-padding-y; it inherits into items (Firefox has no :host-context). */
      padding: var(--_kds-list-dense-padding-y, var(--kds-component-list-item-padding-y)) var(--kds-component-list-item-padding-x);
      border: none;
      border-radius: var(--kds-component-list-item-radius);
      background: none;
      color: var(--kds-component-list-item-text);
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      line-height: var(--kds-semantic-type-body-line-height);
      text-align: start;
      text-decoration: none;
      outline: none;
    }

    a.row,
    button.row {
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    a.row:hover,
    button.row:hover:not(:disabled) {
      background-color: var(--kds-component-list-item-bg-hover);
    }

    a.row:active,
    button.row:active:not(:disabled) {
      background-color: var(--kds-component-list-item-bg-active);
    }

    a.row:focus-visible,
    button.row:focus-visible {
      ${unsafeCSS(focusRing('list-item'))}
    }

    :host([selected]) .row {
      background-color: var(--kds-component-list-item-bg-selected);
      color: var(--kds-component-list-item-text-selected);
    }

    button.row:disabled {
      color: var(--kds-component-list-item-text-disabled);
      cursor: not-allowed;
    }

    .text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .secondary {
      font-size: var(--kds-semantic-type-body-sm-size);
      color: var(--kds-component-list-item-secondary-text);
    }

    :host([selected]) .secondary {
      color: inherit;
    }

    .secondary[hidden] {
      display: none;
    }

    ::slotted([slot='start']),
    ::slotted([slot='end']) {
      flex-shrink: 0;
    }
  `;

  @property() href = '';
  @property() target = '';
  @property({ type: Boolean, reflect: true }) interactive = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private _hasSecondary = false;

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'listitem');
  }

  private _onSecondaryChange(e: Event) {
    this._hasSecondary = (e.target as HTMLSlotElement).assignedNodes({ flatten: true }).length > 0;
  }

  private _onClick() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('kds-select', { bubbles: true, composed: true }));
  }

  render() {
    const content = html`
      <slot name="start"></slot>
      <span class="text">
        <span><slot></slot></span>
        <span class="secondary" ?hidden=${!this._hasSecondary}>
          <slot name="secondary" @slotchange=${this._onSecondaryChange}></slot>
        </span>
      </span>
      <slot name="end"></slot>
    `;
    const current = this.selected ? (this.href ? 'page' : 'true') : nothing;
    const row = this.href
      ? html`<a
          class="row"
          part="row"
          href=${this.href}
          target=${this.target || nothing}
          rel=${this.target === '_blank' ? 'noopener noreferrer' : nothing}
          aria-current=${current}
          >${content}</a
        >`
      : this.interactive
        ? html`<button class="row" part="row" type="button" aria-current=${current} ?disabled=${this.disabled} @click=${this._onClick}>
            ${content}
          </button>`
        : html`<div class="row" part="row">${content}</div>`;
    return html`${row}<slot name="nested"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-list-item': KdsListItem;
  }
}
