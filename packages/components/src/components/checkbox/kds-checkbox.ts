import { LitElement, html, css, unsafeCSS, nothing, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '@kalads/icons';
import { focusRing } from '../../shared/field-styles.js';

/**
 * @element kds-checkbox
 * @summary Binary choice, or a mixed state for "select all". Use kds-checkbox-group to group several.
 *
 * Wraps a native checkbox, so keyboard, label clicks and forms work as usual. The value is submitted
 * with forms when checked.
 *
 * There's no error state on a single checkbox: show errors on the kds-checkbox-group.
 *
 * @slot - Label text
 * @attr {boolean} checked - Whether the checkbox is checked
 * @attr {boolean} indeterminate - Mixed state (shows a dash). Cleared when the user toggles the checkbox.
 * @attr {boolean} disabled - Disables the checkbox
 * @attr {boolean} required - Requires the checkbox to be checked for form submission
 * @attr {string} name - Form field name
 * @attr {string} value - Value submitted when checked (default "on")
 * @fires kds-change - When the user toggles the checkbox. `detail: { checked }`
 * @csspart box - The visual checkbox square
 * @csspart label - The label text wrapper
 */
@customElement('kds-checkbox')
export class KdsCheckbox extends LitElement {
  static formAssociated = true;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([hidden]) {
      display: none;
    }

    label {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--kds-component-checkbox-gap);
      cursor: pointer;
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      line-height: var(--kds-semantic-type-body-line-height);
      color: var(--kds-component-checkbox-label-text);
    }

    .control {
      position: relative;
      display: inline-flex;
      /* Centre the box on the first line of label text. */
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

    input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }

    .box {
      --_bg: var(--kds-component-checkbox-bg);
      --_border: var(--kds-component-checkbox-border);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: var(--kds-component-checkbox-size);
      height: var(--kds-component-checkbox-size);
      border: var(--kds-component-checkbox-border-width) solid var(--_border);
      border-radius: var(--kds-component-checkbox-radius);
      background-color: var(--_bg);
      color: var(--kds-component-checkbox-check);
      transition: background-color 0.15s ease, border-color 0.15s ease;
      --kds-icon-size: 100%;
    }

    label:hover .box {
      --_bg: var(--kds-component-checkbox-bg-hover);
      --_border: var(--kds-component-checkbox-border-hover);
    }

    :host([checked]) .box,
    :host([indeterminate]) .box {
      --_bg: var(--kds-component-checkbox-bg-checked);
      --_border: var(--kds-component-checkbox-border-checked);
    }

    :host([checked]) label:hover .box,
    :host([indeterminate]) label:hover .box {
      --_bg: var(--kds-component-checkbox-bg-checked-hover);
      --_border: var(--kds-component-checkbox-border-checked-hover);
    }

    input:focus-visible + .box {
      ${unsafeCSS(focusRing('checkbox'))}
    }

    :host([disabled]) label {
      cursor: not-allowed;
      color: var(--kds-component-checkbox-label-text-disabled);
    }

    :host([disabled]) .box,
    :host([disabled]) label:hover .box {
      --_bg: var(--kds-component-checkbox-bg-disabled);
      --_border: var(--kds-component-checkbox-border-disabled);
    }

    :host([disabled][checked]) .box,
    :host([disabled][indeterminate]) .box {
      --_bg: var(--kds-component-checkbox-bg-checked-disabled);
      color: var(--kds-component-checkbox-check-disabled);
    }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ reflect: true }) name = '';
  @property() value = 'on';

  @query('input') private _input!: HTMLInputElement;

  private _internals = this.attachInternals();

  protected updated(changed: PropertyValues<this>) {
    if (changed.has('indeterminate')) this._input.indeterminate = this.indeterminate;
    this._internals.setFormValue(this.checked ? this.value : null);
    if (this.required && !this.checked) {
      this._internals.setValidity({ valueMissing: true }, 'Please check this box.', this._input);
    } else {
      this._internals.setValidity({});
    }
  }

  formResetCallback() {
    this.checked = this.hasAttribute('checked');
  }

  private _onChange() {
    this.checked = this._input.checked;
    this.indeterminate = false;
    this.dispatchEvent(new CustomEvent('kds-change', { bubbles: true, composed: true, detail: { checked: this.checked } }));
  }

  render() {
    return html`
      <label>
        <span class="control">
          <input
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @change=${this._onChange}
          />
          <span class="box" part="box" aria-hidden="true">
            ${this.indeterminate
              ? html`<kds-icon-minus></kds-icon-minus>`
              : this.checked
                ? html`<kds-icon-check></kds-icon-check>`
                : nothing}
          </span>
        </span>
        <span class="text" part="label"><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-checkbox': KdsCheckbox;
  }
}
