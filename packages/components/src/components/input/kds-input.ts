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
      gap: var(--kds-size-100);
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
      width: 100%;
      box-sizing: border-box;
      font-family: var(--kds-font-family-base);
      font-size: var(--kds-font-size-300);
      font-weight: var(--kds-font-weight-normal);
      line-height: var(--kds-font-line-height-medium);
      color: var(--kds-component-input-text);
      background-color: var(--kds-component-input-bg);
      border: 1px solid var(--kds-component-input-border);
      border-radius: var(--kds-component-input-radius);
      padding: var(--kds-component-input-padding-y) var(--kds-component-input-padding-x);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      outline: none;
    }

    input::placeholder {
      color: var(--kds-component-input-text-placeholder);
    }

    input:hover:not(:disabled) {
      border-color: var(--kds-component-input-border-hover);
    }

    input:focus {
      border-color: var(--kds-component-input-border-focus);
      box-shadow: 0 0 0 3px var(--kds-component-input-ring-focus);
    }

    input:disabled {
      background-color: var(--kds-component-input-bg-disabled);
      border-color: var(--kds-component-input-border-disabled);
      color: var(--kds-component-input-text-disabled);
      cursor: not-allowed;
    }

    :host([error]) input {
      border-color: var(--kds-component-input-border-error);
    }

    :host([error]) input:focus {
      box-shadow: 0 0 0 3px var(--kds-component-input-ring-error);
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
