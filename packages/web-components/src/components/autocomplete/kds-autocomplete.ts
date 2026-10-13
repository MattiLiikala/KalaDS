import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@kalads/icons';
import { fieldStyles } from '../../shared/field-styles.js';
import { POPUP_RESET, autoUpdate, hidePopup, positionPopup, showPopup, uniqueId } from '../../shared/popover.js';

interface Option {
  value: string;
  label: string;
  disabled: boolean;
}

/**
 * @element kds-autocomplete
 * @summary Text field that suggests matching options as you type (WAI-ARIA combobox).
 *
 * Options are regular <option> children. Typing filters them; arrow keys move through the matches,
 * Enter picks the highlighted one and Escape closes the list (or clears the text when it's closed).
 * Leaving the field restores the selected option's label, unless the text exactly matches another option.
 *
 * @slot - <option> elements (not rendered directly)
 * @attr {string} label - Visible label text
 * @attr {string} value - Selected option value
 * @attr {string} placeholder - Placeholder text
 * @attr {string} name - Form field name
 * @attr {string} helper - Helper text below the field
 * @attr {string} error - Error message. When set, shows the error state.
 * @attr {string} empty-text - Shown when no option matches (default "No results")
 * @attr {boolean} disabled - Disables the field
 * @attr {boolean} required - Requires a selection for form submission
 * @fires kds-change - When an option is picked or cleared. `detail: { value }`
 * @csspart label - The label
 * @csspart input - The text input
 * @csspart listbox - The popup list of options
 * @csspart option - Each option in the list
 */
@customElement('kds-autocomplete')
export class KdsAutocomplete extends LitElement {
  static formAssociated = true;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles = [
    fieldStyles('autocomplete'),
    css`
      input {
        padding-inline-end: calc(var(--kds-component-autocomplete-padding-x) * 2 + var(--kds-semantic-spacing-lg));
      }

      .listbox {
        ${POPUP_RESET}
        box-sizing: border-box;
        max-height: var(--kds-component-autocomplete-popup-max-height);
        overflow-y: auto;
        padding: var(--kds-component-autocomplete-popup-padding);
        background-color: var(--kds-component-autocomplete-popup-bg);
        border: var(--kds-component-autocomplete-popup-border-width) solid var(--kds-component-autocomplete-popup-border);
        border-radius: var(--kds-component-autocomplete-popup-radius);
        box-shadow: var(--kds-component-autocomplete-popup-shadow);
        /* Carries the anchor gap for positionPopup (see shared/popover.ts). */
        scroll-margin-top: var(--kds-component-autocomplete-popup-offset);
      }

      .listbox[hidden] {
        display: none;
      }

      .option {
        padding: var(--kds-component-autocomplete-option-padding-y) var(--kds-component-autocomplete-option-padding-x);
        border-radius: var(--kds-component-autocomplete-option-radius);
        font-family: var(--kds-semantic-type-body-family);
        font-size: var(--kds-semantic-type-body-size);
        line-height: var(--kds-semantic-type-body-line-height);
        color: var(--kds-component-autocomplete-option-text);
        cursor: pointer;
      }

      .option:hover {
        background-color: var(--kds-component-autocomplete-option-bg-hover);
      }

      .option[data-active] {
        background-color: var(--kds-component-autocomplete-option-bg-active);
        color: var(--kds-component-autocomplete-option-text-active);
      }

      .option[aria-disabled='true'] {
        color: var(--kds-component-autocomplete-option-text-disabled);
        cursor: not-allowed;
        background: none;
      }

      .option[aria-selected='true'] {
        font-weight: var(--kds-font-weight-bold);
      }

      .empty {
        padding: var(--kds-component-autocomplete-option-padding-y) var(--kds-component-autocomplete-option-padding-x);
        font-family: var(--kds-semantic-type-body-family);
        font-size: var(--kds-semantic-type-body-size);
        color: var(--kds-component-autocomplete-empty-text);
      }
    `,
  ];

  @property() label = '';
  @property() value = '';
  @property() placeholder = '';
  @property({ reflect: true }) name = '';
  @property() helper = '';
  @property() error = '';
  @property({ attribute: 'empty-text' }) emptyText = 'No results';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  @state() private _options: Option[] = [];
  @state() private _query = '';
  @state() private _open = false;
  @state() private _active = -1;

  @query('input') private _input!: HTMLInputElement;
  @query('.listbox') private _listbox!: HTMLElement;

  private _internals = this.attachInternals();
  private _id = uniqueId('kds-autocomplete');
  private _observer = new MutationObserver(() => this._readOptions());
  private _stopAutoUpdate?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._readOptions();
    this._observer.observe(this, { childList: true, subtree: true, attributes: true, characterData: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
    this._stopAutoUpdate?.();
  }

  private _readOptions() {
    this._options = [...this.querySelectorAll('option')].map((o) => ({
      value: o.value,
      label: o.textContent?.trim() ?? '',
      disabled: o.disabled,
    }));
    if (!this.matches(':focus-within')) this._query = this._selectedLabel();
  }

  private _selectedLabel() {
    return this._options.find((o) => o.value === this.value)?.label ?? '';
  }

  private get _matches() {
    const q = this._query.trim().toLowerCase();
    // Showing the selected label shouldn't filter the list down to that one option.
    if (!q || this._query === this._selectedLabel()) return this._options;
    return this._options.filter((o) => o.label.toLowerCase().includes(q));
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has('value') && !this.matches(':focus-within')) this._query = this._selectedLabel();
  }

  protected updated(changed: PropertyValues) {
    this._internals.setFormValue(this.value || null);
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Please select an option.', this._input);
    } else {
      this._internals.setValidity({});
    }
    if (changed.has('_open')) {
      if (this._open) {
        this._listbox.style.width = `${this._input.offsetWidth}px`;
        showPopup(this._listbox);
        const place = () => positionPopup(this._input, this._listbox, 'bottom-start');
        place();
        this._stopAutoUpdate = autoUpdate(this._input, this._listbox, place);
      } else {
        this._stopAutoUpdate?.();
        hidePopup(this._listbox);
      }
    }
    if (changed.has('_active') && this._active >= 0) {
      this.renderRoot.querySelector(`#${this._id}-option-${this._active}`)?.scrollIntoView({ block: 'nearest' });
    }
  }

  formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
    this._query = this._selectedLabel();
  }

  private _commit(option: Option | undefined) {
    if (option?.disabled) return;
    const value = option?.value ?? '';
    const changed = value !== this.value;
    this.value = value;
    this._query = option?.label ?? '';
    this._open = false;
    this._active = -1;
    if (changed) {
      this.dispatchEvent(new CustomEvent('kds-change', { bubbles: true, composed: true, detail: { value } }));
    }
  }

  private _move(step: number) {
    const matches = this._matches;
    if (!matches.length) return;
    let next = this._active;
    for (let i = 0; i < matches.length; i++) {
      next = (next + step + matches.length) % matches.length;
      if (!matches[next].disabled) break;
    }
    this._active = next;
  }

  private _onInput() {
    this._query = this._input.value;
    this._open = true;
    this._active = this._matches.findIndex((o) => !o.disabled);
    if (!this._query) this._commit(undefined);
  }

  private _onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this._open) this._open = true;
        this._move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!this._open) this._open = true;
        this._move(-1);
        break;
      case 'Enter':
        if (this._open && this._active >= 0) {
          e.preventDefault();
          this._commit(this._matches[this._active]);
        }
        break;
      case 'Escape':
        if (this._open) {
          e.preventDefault();
          this._open = false;
          this._active = -1;
        } else if (this._query) {
          e.preventDefault();
          this._commit(undefined);
        }
        break;
      case 'Tab':
        this._open = false;
        break;
    }
  }

  private _onBlur() {
    this._open = false;
    this._active = -1;
    const exact = this._options.find((o) => !o.disabled && o.label.toLowerCase() === this._query.trim().toLowerCase());
    if (exact && exact.value !== this.value) this._commit(exact);
    else this._query = this._selectedLabel();
  }

  render() {
    const describedBy = this.error ? `${this._id}-error` : this.helper ? `${this._id}-helper` : undefined;
    const matches = this._matches;
    const activeId = this._open && this._active >= 0 ? `${this._id}-option-${this._active}` : undefined;
    return html`
      ${this.label
        ? html`<label part="label" for=${this._id}>
            ${this.label}${this.required ? html`<span aria-hidden="true"> *</span>` : nothing}
          </label>`
        : nothing}
      <div class="control">
        <input
          id=${this._id}
          part="input"
          class="field"
          type="text"
          role="combobox"
          autocomplete="off"
          aria-autocomplete="list"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-controls="${this._id}-listbox"
          aria-activedescendant=${activeId ?? nothing}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${describedBy ?? nothing}
          .value=${this._query}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
          @blur=${this._onBlur}
          @click=${() => !this.disabled && (this._open = true)}
        />
        <span class="icon" aria-hidden="true"><kds-icon-chevron-down></kds-icon-chevron-down></span>
      </div>
      <div
        class="listbox"
        part="listbox"
        id="${this._id}-listbox"
        role="listbox"
        aria-label=${this.label || nothing}
        popover="manual"
        hidden
        @mousedown=${(e: MouseEvent) => e.preventDefault()}
      >
        ${matches.length
          ? matches.map(
              (o, i) => html`<div
                class="option"
                part="option"
                id="${this._id}-option-${i}"
                role="option"
                aria-selected=${o.value === this.value ? 'true' : 'false'}
                aria-disabled=${o.disabled ? 'true' : 'false'}
                ?data-active=${i === this._active}
                @click=${() => this._commit(o)}
              >
                ${o.label}
              </div>`,
            )
          : html`<div class="empty" role="presentation">${this.emptyText}</div>`}
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
    'kds-autocomplete': KdsAutocomplete;
  }
}
