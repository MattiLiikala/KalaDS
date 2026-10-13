import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { KdsRadio } from '../radio/kds-radio.js';
import { uniqueId } from '../../shared/popover.js';

/**
 * @element kds-radio-group
 * @summary Group of kds-radio options where exactly one can be selected.
 *
 * Handles selection, keyboard navigation (arrow keys move and select, Tab enters and leaves the group),
 * and submits the selected value with forms.
 *
 * @slot - kds-radio elements
 * @attr {string} label - Visible group label (legend). Required for accessibility.
 * @attr {string} value - Value of the selected radio
 * @attr {string} name - Form field name
 * @attr {vertical|horizontal} orientation - Layout of the options (default vertical)
 * @attr {string} helper - Helper text below the options
 * @attr {string} error - Error message. When set, shows the error state.
 * @attr {boolean} required - Requires a selection for form submission
 * @attr {boolean} disabled - Disables every option
 * @fires kds-change - When the user selects an option. `detail: { value }`
 * @csspart label - The group label
 * @csspart options - Wrapper around the options
 */
@customElement('kds-radio-group')
export class KdsRadioGroup extends LitElement {
  static formAssociated = true;

  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    .group {
      display: flex;
      flex-direction: column;
      gap: var(--kds-component-radio-group-gap);
    }

    .label {
      font-family: var(--kds-semantic-type-label-family);
      font-size: var(--kds-semantic-type-label-size);
      font-weight: var(--kds-semantic-type-label-weight);
      line-height: var(--kds-semantic-type-body-line-height);
      color: var(--kds-component-radio-group-legend-text);
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: var(--kds-component-radio-group-gap);
    }

    :host([orientation='horizontal']) .options {
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--kds-component-radio-group-gap) var(--kds-component-radio-group-gap-horizontal);
    }

    .helper,
    .error {
      font-family: var(--kds-semantic-type-caption-family);
      font-size: var(--kds-semantic-type-caption-size);
      line-height: var(--kds-semantic-type-caption-line-height);
      color: var(--kds-component-radio-group-helper-text);
    }

    .error {
      color: var(--kds-component-radio-group-error-text);
    }
  `;

  @property() label = '';
  @property({ reflect: true }) value = '';
  @property({ reflect: true }) name = '';
  @property({ reflect: true }) orientation: 'vertical' | 'horizontal' = 'vertical';
  @property() helper = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @queryAssignedElements({ selector: 'kds-radio', flatten: true }) private _radios!: KdsRadio[];

  private _internals = this.attachInternals();
  private _id = uniqueId('kds-radio-group');

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('kds-radio-select', this._onRadioSelect as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('kds-radio-select', this._onRadioSelect as EventListener);
  }

  protected updated(_changed: PropertyValues<this>) {
    this._syncRadios();
    this._internals.setFormValue(this.value || null);
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Please select an option.');
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
  }

  private _enabled() {
    return this._radios.filter((r) => !r.isDisabled);
  }

  /** Mirrors the group value onto the radios and keeps exactly one of them in the tab order. */
  private _syncRadios = () => {
    const radios = this._radios;
    radios.forEach((r) => {
      r.checked = r.value === this.value;
      r.groupDisabled = this.disabled;
    });
    const tabbable = radios.find((r) => r.checked && !r.isDisabled) ?? this._enabled()[0];
    radios.forEach((r) => (r.tabbable = r === tabbable));
  };

  private _select(radio: KdsRadio, focus: boolean) {
    if (radio.isDisabled) return;
    const changed = this.value !== radio.value;
    this.value = radio.value;
    this._syncRadios();
    if (focus) radio.focus();
    if (changed) {
      this.dispatchEvent(new CustomEvent('kds-change', { bubbles: true, composed: true, detail: { value: this.value } }));
    }
  }

  private _onRadioSelect = (e: Event) => {
    this._select(e.target as KdsRadio, true);
  };

  private _onKeyDown(e: KeyboardEvent) {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const enabled = this._enabled();
    if (!enabled.length) return;
    const current = enabled.findIndex((r) => r.matches(':focus-within'));
    let next: number;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = enabled.length - 1;
    else {
      const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
      next = (Math.max(current, 0) + step + enabled.length) % enabled.length;
    }
    e.preventDefault();
    this._select(enabled[next], true);
  }

  render() {
    const describedBy = this.error ? `${this._id}-error` : this.helper ? `${this._id}-helper` : undefined;
    return html`
      <div class="group">
        ${this.label
          ? html`<span class="label" part="label" id="${this._id}-label">
              ${this.label}${this.required ? html`<span aria-hidden="true"> *</span>` : nothing}
            </span>`
          : nothing}
        <div
          class="options"
          part="options"
          role="radiogroup"
          aria-labelledby=${this.label ? `${this._id}-label` : nothing}
          aria-describedby=${describedBy ?? nothing}
          aria-required=${this.required ? 'true' : 'false'}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-orientation=${this.orientation}
          @keydown=${this._onKeyDown}
        >
          <slot @slotchange=${this._syncRadios}></slot>
        </div>
        ${this.error
          ? html`<span class="error" part="error" id="${this._id}-error">${this.error}</span>`
          : this.helper
            ? html`<span class="helper" part="helper" id="${this._id}-helper">${this.helper}</span>`
            : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-radio-group': KdsRadioGroup;
  }
}
