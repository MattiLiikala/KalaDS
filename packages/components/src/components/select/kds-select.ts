import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@kalads/icons';
import { fieldStyles } from '../../shared/field-styles.js';
import { uniqueId } from '../../shared/popover.js';

interface OptionData {
  value: string;
  label: string;
  disabled: boolean;
}

interface GroupData {
  label: string;
  disabled: boolean;
  options: OptionData[];
}

/**
 * @element kds-select
 * @summary Pick one option from a list. Styled like kds-input, built on a native <select>.
 *
 * Write regular <option> and <optgroup> children; they are mirrored into the internal select, so the
 * native picker (including on mobile) and keyboard behaviour are kept. For long lists or type-to-filter,
 * use kds-autocomplete.
 *
 * @slot - <option> and <optgroup> elements (not rendered directly)
 * @attr {string} label - Visible label text
 * @attr {string} value - Selected option value
 * @attr {string} placeholder - Text shown while nothing is selected
 * @attr {string} name - Form field name
 * @attr {string} helper - Helper text below the field
 * @attr {string} error - Error message. When set, shows the error state.
 * @attr {boolean} disabled - Disables the select
 * @attr {boolean} required - Requires a selection for form submission
 * @fires kds-change - When the user picks an option. `detail: { value }`
 * @csspart label - The label
 * @csspart select - The native select element
 */
@customElement('kds-select')
export class KdsSelect extends LitElement {
  static formAssociated = true;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles = [
    fieldStyles('select'),
    css`
      select {
        appearance: none;
        cursor: pointer;
        /* Room for the chevron. */
        padding-inline-end: calc(var(--kds-component-select-padding-x) * 2 + var(--kds-semantic-spacing-lg));
      }

      select.placeholder {
        color: var(--kds-component-select-text-placeholder);
      }

      select:disabled + .icon {
        color: var(--kds-component-select-text-disabled);
      }
    `,
  ];

  @property() label = '';
  @property() value = '';
  @property() placeholder = '';
  @property({ reflect: true }) name = '';
  @property() helper = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  @state() private _items: (OptionData | GroupData)[] = [];
  @query('select') private _select!: HTMLSelectElement;

  private _internals = this.attachInternals();
  private _id = uniqueId('kds-select');
  private _observer = new MutationObserver(() => this._readOptions());

  connectedCallback() {
    super.connectedCallback();
    this._readOptions();
    this._observer.observe(this, { childList: true, subtree: true, attributes: true, characterData: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }

  private _readOptions() {
    const toOption = (o: HTMLOptionElement): OptionData => ({
      value: o.value,
      label: o.textContent?.trim() ?? '',
      disabled: o.disabled,
    });
    this._items = [...this.children].flatMap((child): (OptionData | GroupData)[] => {
      if (child instanceof HTMLOptionElement) return [toOption(child)];
      if (child instanceof HTMLOptGroupElement) {
        return [{ label: child.label, disabled: child.disabled, options: [...child.querySelectorAll('option')].map(toOption) }];
      }
      return [];
    });
    if (!this.value && !this.placeholder) {
      const selected = this.querySelector<HTMLOptionElement>('option[selected]') ?? this.querySelector('option');
      if (selected) this.value = selected.value;
    }
  }

  protected updated(_changed: PropertyValues<this>) {
    // Options render after the value is first set, so re-apply it once they exist.
    if (this._select && this._select.value !== this.value) this._select.value = this.value;
    this._internals.setFormValue(this.value || null);
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Please select an option.', this._select);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
  }

  private _onChange() {
    this.value = this._select.value;
    this.dispatchEvent(new CustomEvent('kds-change', { bubbles: true, composed: true, detail: { value: this.value } }));
  }

  private _renderOption(o: OptionData) {
    return html`<option value=${o.value} ?disabled=${o.disabled} ?selected=${o.value === this.value}>${o.label}</option>`;
  }

  render() {
    const describedBy = this.error ? `${this._id}-error` : this.helper ? `${this._id}-helper` : undefined;
    return html`
      ${this.label
        ? html`<label part="label" for=${this._id}>
            ${this.label}${this.required ? html`<span aria-hidden="true"> *</span>` : nothing}
          </label>`
        : nothing}
      <div class="control">
        <select
          id=${this._id}
          part="select"
          class="field ${this.placeholder && !this.value ? 'placeholder' : ''}"
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${describedBy ?? nothing}
          @change=${this._onChange}
        >
          ${this.placeholder
            ? html`<option value="" disabled ?selected=${!this.value} hidden>${this.placeholder}</option>`
            : nothing}
          ${this._items.map((item) =>
            'options' in item
              ? html`<optgroup label=${item.label} ?disabled=${item.disabled}>
                  ${item.options.map((o) => this._renderOption(o))}
                </optgroup>`
              : this._renderOption(item),
          )}
        </select>
        <span class="icon" aria-hidden="true"><kds-icon-chevron-down></kds-icon-chevron-down></span>
      </div>
      ${this.error
        ? html`<span class="error-message" part="error" id="${this._id}-error">${this.error}</span>`
        : this.helper
          ? html`<span class="helper" part="helper" id="${this._id}-helper">${this.helper}</span>`
          : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-select': KdsSelect;
  }
}
