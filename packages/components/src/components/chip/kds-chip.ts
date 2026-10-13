import { LitElement, html, css, unsafeCSS, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@kalads/icons';
import { focusRing } from '../../shared/field-styles.js';

export type ChipVariant = 'neutral' | 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';

const VARIANTS: ChipVariant[] = ['neutral', 'primary', 'secondary', 'danger', 'warning', 'success', 'info'];
const STATES = ['border', 'text', 'bg-hover', 'border-hover', 'text-hover', 'bg-active', 'bg-selected', 'border-selected', 'text-selected', 'bg-selected-hover'];

/** Maps each variant's tokens onto private custom properties (--_c-*) that the state rules read. */
const variantStyles = unsafeCSS(
  VARIANTS.map(
    (v) => `${v === 'neutral' ? ':host, ' : ''}:host([variant='${v}']) {
      ${STATES.map((s) => `--_c-${s}: var(--kds-component-chip-${v}-${s});`).join('\n      ')}
    }`,
  ).join('\n'),
);

/**
 * @element kds-chip
 * @summary Compact element for filters, choices or entered values (tags).
 *
 * Outlined pill like kds-badge, but interactive: `selectable` makes it a toggle button (aria-pressed),
 * and `removable` adds a remove button. A chip that is neither is static text.
 *
 * `variant` sets the colour. Neutral (default) is grey at rest and uses primary on hover and when selected;
 * the other variants show their colour at rest too. Hover is a lighter version of the selected look.
 *
 * @slot - Chip text
 * @slot start - Optional leading icon
 * @attr {neutral|primary|secondary|danger|warning|success|info} variant - Colour (default neutral)
 * @attr {boolean} selectable - Clicking toggles `selected`
 * @attr {boolean} selected - Selected state (only for selectable chips)
 * @attr {boolean} removable - Shows a remove button
 * @attr {string} remove-label - Prefix for the remove button's accessible name (default "Remove"), followed by the chip text
 * @attr {boolean} disabled - Disables the chip
 * @fires kds-change - When a selectable chip is toggled. `detail: { selected }`
 * @fires kds-remove - When the remove button is pressed
 * @csspart chip - The chip body
 * @csspart remove - The remove button
 */
@customElement('kds-chip')
export class KdsChip extends LitElement {
  static styles = [
    variantStyles,
    css`
    :host {
      display: inline-flex;
    }

    :host([hidden]) {
      display: none;
    }

    .chip {
      --_bg: var(--kds-component-chip-bg);
      --_border: var(--_c-border);
      --_text: var(--_c-text);
      display: inline-flex;
      align-items: center;
      gap: var(--kds-component-chip-gap);
      box-sizing: border-box;
      border: var(--kds-component-chip-border-width) solid var(--_border);
      border-radius: var(--kds-component-chip-radius);
      background-color: var(--_bg);
      color: var(--_text);
      font-family: var(--kds-semantic-type-label-family);
      font-size: var(--kds-semantic-type-label-size);
      font-weight: var(--kds-semantic-type-label-weight);
      line-height: var(--kds-semantic-type-label-line-height);
      white-space: nowrap;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .body {
      display: inline-flex;
      align-items: center;
      gap: var(--kds-component-chip-gap);
      padding: var(--kds-component-chip-padding-y) var(--kds-component-chip-padding-x);
      border: none;
      border-radius: inherit;
      background: none;
      color: inherit;
      font: inherit;
      outline: none;
    }

    :host([removable]) .body {
      padding-inline-end: 0;
    }

    button.body {
      cursor: pointer;
    }

    ::slotted([slot='start']) {
      --kds-icon-size: var(--kds-component-chip-icon-size);
    }

    :host([selectable]:not([disabled])) .chip:hover {
      --_bg: var(--_c-bg-hover);
      --_border: var(--_c-border-hover);
      --_text: var(--_c-text-hover);
    }

    :host([selectable]:not([disabled])) .chip:active {
      --_bg: var(--_c-bg-active);
    }

    :host([selected]) .chip {
      --_bg: var(--_c-bg-selected);
      --_border: var(--_c-border-selected);
      --_text: var(--_c-text-selected);
    }

    :host([selected]:not([disabled])) .chip:hover {
      --_bg: var(--_c-bg-selected-hover);
    }

    :host([disabled]) .chip {
      --_bg: var(--kds-component-chip-bg-disabled);
      --_border: var(--kds-component-chip-border-disabled);
      --_text: var(--kds-component-chip-text-disabled);
    }

    :host([disabled]) button {
      cursor: not-allowed;
    }

    .body:focus-visible,
    .remove:focus-visible {
      ${unsafeCSS(focusRing('chip'))}
    }

    .remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-inline: var(--kds-component-chip-gap);
      padding: 0;
      border: none;
      border-radius: var(--kds-component-chip-radius);
      background: none;
      color: inherit;
      cursor: pointer;
      outline: none;
      --kds-icon-size: var(--kds-component-chip-icon-size);
    }

    .remove:hover:not(:disabled) {
      background-color: var(--_c-bg-active);
    }

    .remove:disabled {
      cursor: not-allowed;
    }
  `,
  ];

  @property({ reflect: true }) variant: ChipVariant = 'neutral';
  @property({ type: Boolean, reflect: true }) selectable = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) removable = false;
  @property({ attribute: 'remove-label' }) removeLabel = 'Remove';
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _toggle() {
    if (this.disabled) return;
    this.selected = !this.selected;
    this.dispatchEvent(new CustomEvent('kds-change', { bubbles: true, composed: true, detail: { selected: this.selected } }));
  }

  private _remove() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('kds-remove', { bubbles: true, composed: true }));
  }

  render() {
    const content = html`<slot name="start"></slot><slot></slot>`;
    return html`
      <span class="chip" part="chip">
        ${this.selectable
          ? html`<button
              class="body"
              type="button"
              aria-pressed=${this.selected ? 'true' : 'false'}
              ?disabled=${this.disabled}
              @click=${this._toggle}
            >
              ${content}
            </button>`
          : html`<span class="body">${content}</span>`}
        ${this.removable
          ? html`<button
              class="remove"
              part="remove"
              type="button"
              aria-label=${`${this.removeLabel} ${this.textContent?.trim() ?? ''}`.trim()}
              ?disabled=${this.disabled}
              @click=${this._remove}
            >
              <kds-icon-close aria-hidden="true"></kds-icon-close>
            </button>`
          : nothing}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-chip': KdsChip;
  }
}
