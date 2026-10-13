import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing } from '../../shared/field-styles.js';

/**
 * @element kds-radio
 * @summary One option in a kds-radio-group. Always use inside a kds-radio-group.
 *
 * Selection, keyboard navigation (arrow keys) and form value are handled by the group, because native
 * radios can't be grouped across separate shadow roots.
 *
 * @slot - Label text
 * @attr {string} value - Value the group takes when this radio is selected
 * @attr {boolean} checked - Set by the group; reflects whether this radio is selected
 * @attr {boolean} disabled - Disables this option
 * @csspart radio - The element with role="radio"
 * @csspart circle - The visual circle
 * @csspart label - The label text wrapper
 */
@customElement('kds-radio')
export class KdsRadio extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([hidden]) {
      display: none;
    }

    .radio {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--kds-component-radio-gap);
      cursor: pointer;
      outline: none;
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      line-height: var(--kds-semantic-type-body-line-height);
      color: var(--kds-component-radio-label-text);
    }

    .control {
      display: inline-flex;
      height: calc(1em * var(--kds-semantic-type-body-line-height));
      align-items: center;
      flex-shrink: 0;
    }

    /*
     * The label text sets the baseline, so the control lines up with surrounding text and the line height
     * doesn't change when the box gets a check icon (an empty box has no baseline of its own).
     */
    .text {
      align-self: baseline;
    }

    .circle {
      --_bg: var(--kds-component-radio-bg);
      --_border: var(--kds-component-radio-border);
      --_dot: transparent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: var(--kds-component-radio-size);
      height: var(--kds-component-radio-size);
      border: var(--kds-component-radio-border-width) solid var(--_border);
      border-radius: var(--kds-component-radio-radius);
      background-color: var(--_bg);
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }

    .circle::after {
      content: '';
      width: var(--kds-component-radio-dot-size);
      height: var(--kds-component-radio-dot-size);
      border-radius: var(--kds-component-radio-radius);
      background-color: var(--_dot);
    }

    .radio:hover .circle {
      --_bg: var(--kds-component-radio-bg-hover);
      --_border: var(--kds-component-radio-border-hover);
    }

    :host([checked]) .circle {
      --_border: var(--kds-component-radio-border-checked);
      --_dot: var(--kds-component-radio-dot);
    }

    :host([checked]) .radio:hover .circle {
      --_border: var(--kds-component-radio-border-checked-hover);
      --_dot: var(--kds-component-radio-dot-hover);
    }

    .radio:focus-visible .circle {
      ${unsafeCSS(focusRing('radio'))}
    }

    :host([disabled]) .radio,
    :host([group-disabled]) .radio {
      cursor: not-allowed;
      color: var(--kds-component-radio-label-text-disabled);
    }

    :host([disabled]) .circle,
    :host([group-disabled]) .circle,
    :host([disabled]) .radio:hover .circle,
    :host([group-disabled]) .radio:hover .circle {
      --_bg: var(--kds-component-radio-bg-disabled);
      --_border: var(--kds-component-radio-border-disabled);
    }

    :host([disabled][checked]) .circle,
    :host([group-disabled][checked]) .circle {
      --_dot: var(--kds-component-radio-dot-disabled);
    }
  `;

  @property({ reflect: true }) value = '';
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Set by the group when the whole group is disabled; kept separate so re-enabling the group restores `disabled`. */
  @property({ type: Boolean, reflect: true, attribute: 'group-disabled' }) groupDisabled = false;
  /** Set by the group: only one radio in a group is in the tab order (roving tabindex). */
  @property({ type: Boolean, attribute: false }) tabbable = false;

  focus(options?: FocusOptions) {
    this.renderRoot.querySelector<HTMLElement>('.radio')?.focus(options);
  }

  get isDisabled() {
    return this.disabled || this.groupDisabled;
  }

  private _select() {
    if (this.isDisabled) return;
    this.dispatchEvent(new CustomEvent('kds-radio-select', { bubbles: true }));
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault();
      this._select();
    }
  }

  render() {
    return html`
      <div
        class="radio"
        part="radio"
        role="radio"
        aria-checked=${this.checked ? 'true' : 'false'}
        aria-disabled=${this.isDisabled ? 'true' : 'false'}
        tabindex=${this.tabbable && !this.isDisabled ? '0' : '-1'}
        @click=${this._select}
        @keydown=${this._onKeyDown}
      >
        <span class="control" aria-hidden="true"><span class="circle" part="circle"></span></span>
        <span class="text" part="label"><slot></slot></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-radio': KdsRadio;
  }
}
