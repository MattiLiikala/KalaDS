import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

/**
 * @element kds-input
 * @summary Text input field. Always use this instead of a raw <input> with manual styling.
 * @attr {string} label - Visible label text
 * @attr {string} value - Current value
 * @attr {string} placeholder - Placeholder text
 * @attr {text|email|password|number|search|tel|url} type - Input type
 * @attr {string} helper - Helper text displayed below the input
 * @attr {string} error - Error message. When set, puts the input in error state.
 * @attr {boolean} disabled - Disables the input
 * @attr {boolean} required - Marks the input as required
 */
@customElement('kds-input')
export class KdsInput extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--kds-size-100-rem);
    }

    label {
      font-family: var(--kds-font-family-label);
      font-size: var(--kds-font-size-200);
      font-weight: var(--kds-font-weight-bold);
      color: var(--kds-component-input-label-text);
      line-height: var(--kds-font-line-height-medium);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      --_border-color: var(--kds-component-input-border);
      width: 100%;
      box-sizing: border-box;
      font-family: var(--kds-font-family-base);
      font-size: var(--kds-font-size-300);
      font-weight: var(--kds-font-weight-normal);
      line-height: var(--kds-font-line-height-medium);
      color: var(--kds-component-input-text);
      background-color: var(--kds-component-input-bg);
      border: var(--kds-component-input-border-width) solid var(--_border-color);
      border-radius: var(--kds-component-input-radius);
      padding: var(--kds-component-input-padding-y) var(--kds-component-input-padding-x);
      /* A zero-width shadow in the border colour, so focus animates only the width, never from black. */
      box-shadow: inset 0 0 0 0 var(--_border-color);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      outline: none;
    }

    input::placeholder {
      color: var(--kds-component-input-text-placeholder);
    }

    /* Hover never applies while focused, invalid or disabled, so it can't override those states. */
    input:hover:not(:disabled, :focus, [aria-invalid='true']) {
      --_border-color: var(--kds-component-input-border-hover);
    }

    /*
     * Focus thickens the border to border-width-focus. The real border stays at border-width and the extra
     * width is drawn as an inset shadow in the border colour. Browsers snap border widths to whole pixels
     * (1.5px often renders as 1px), so changing the border itself would resize the field on focus.
     */
    input:focus {
      --_border-color: var(--kds-component-input-border-focus);
      box-shadow: inset 0 0 0 calc(var(--kds-component-input-border-width-focus) - var(--kds-component-input-border-width))
        var(--_border-color);
    }

    /*
     * Error styles key off aria-invalid (set only for a non-empty error), not :host([error]): binding an
     * empty error still sets error="", which would otherwise put every input in the error state.
     */
    input[aria-invalid='true'] {
      --_border-color: var(--kds-component-input-border-error);
    }

    /* The error colour wins over the focus colour, so focus darkens it to stay visible. */
    input[aria-invalid='true']:focus {
      --_border-color: var(--kds-component-input-border-error-focus);
    }

    input:disabled {
      --_border-color: var(--kds-component-input-border-disabled);
      background-color: var(--kds-component-input-bg-disabled);
      color: var(--kds-component-input-text-disabled);
      cursor: not-allowed;
    }

    .helper {
      font-family: var(--kds-font-family-base);
      font-size: var(--kds-font-size-100);
      color: var(--kds-component-input-helper-text);
      line-height: var(--kds-font-line-height-medium);
    }

    .error-message {
      font-family: var(--kds-font-family-base);
      font-size: var(--kds-font-size-100);
      color: var(--kds-component-input-error-text);
      line-height: var(--kds-font-line-height-medium);
    }
  `;

  @property() label = '';
  @property() value = '';
  @property() placeholder = '';
  @property() type: InputType = 'text';
  @property() helper = '';
  @property({ reflect: true }) error = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  private _inputId = `kds-input-${Math.random().toString(36).slice(2, 9)}`;

  private _handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('kds-input', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private _handleChange(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('kds-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  render() {
    return html`
      ${this.label ? html`<label part="label" for=${this._inputId}>${this.label}${this.required ? html`<span aria-hidden="true"> *</span>` : ''}</label>` : ''}
      <div class="input-wrapper">
        <input
          part="input"
          id=${this._inputId}
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${this.error ? `${this._inputId}-error` : this.helper ? `${this._inputId}-helper` : ''}
          @input=${this._handleInput}
          @change=${this._handleChange}
        />
      </div>
      ${this.error ? html`<span id=${this._inputId + '-error'} class="error-message" part="error">${this.error}</span>` : ''}
      ${this.helper && !this.error ? html`<span id=${this._inputId + '-helper'} class="helper" part="helper">${this.helper}</span>` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-input': KdsInput;
  }
}
