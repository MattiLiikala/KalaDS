import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { uniqueId } from '../../shared/popover.js';

/**
 * @element kds-checkbox-group
 * @summary Labelled group of related kds-checkbox elements.
 *
 * Gives the checkboxes a shared label (announced as a group), shared helper or error text, and the
 * layout. Each checkbox keeps its own name, value and state.
 *
 * @slot - kds-checkbox elements
 * @attr {string} label - Visible group label. Required for accessibility.
 * @attr {vertical|horizontal} orientation - Layout of the options (default vertical)
 * @attr {string} helper - Helper text below the options
 * @attr {string} error - Error message. When set, shows the error state.
 * @attr {boolean} required - Marks the group as required (shows an asterisk)
 * @csspart label - The group label
 * @csspart options - Wrapper around the options
 */
@customElement('kds-checkbox-group')
export class KdsCheckboxGroup extends LitElement {
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
      gap: var(--kds-component-checkbox-group-gap);
    }

    .label {
      font-family: var(--kds-semantic-type-label-family);
      font-size: var(--kds-semantic-type-label-size);
      font-weight: var(--kds-semantic-type-label-weight);
      line-height: var(--kds-semantic-type-body-line-height);
      color: var(--kds-component-checkbox-group-legend-text);
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: var(--kds-component-checkbox-group-gap);
    }

    :host([orientation='horizontal']) .options {
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--kds-component-checkbox-group-gap) var(--kds-component-checkbox-group-gap-horizontal);
    }

    .helper,
    .error {
      font-family: var(--kds-semantic-type-caption-family);
      font-size: var(--kds-semantic-type-caption-size);
      line-height: var(--kds-semantic-type-caption-line-height);
      color: var(--kds-component-checkbox-group-helper-text);
    }

    .error {
      color: var(--kds-component-checkbox-group-error-text);
    }
  `;

  @property() label = '';
  @property({ reflect: true }) orientation: 'vertical' | 'horizontal' = 'vertical';
  @property() helper = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) required = false;

  private _id = uniqueId('kds-checkbox-group');

  render() {
    const describedBy = this.error ? `${this._id}-error` : this.helper ? `${this._id}-helper` : undefined;
    return html`
      <div
        class="group"
        role="group"
        aria-labelledby=${this.label ? `${this._id}-label` : nothing}
        aria-describedby=${describedBy ?? nothing}
      >
        ${this.label
          ? html`<span class="label" part="label" id="${this._id}-label">
              ${this.label}${this.required ? html`<span aria-hidden="true"> *</span>` : nothing}
            </span>`
          : nothing}
        <div class="options" part="options"><slot></slot></div>
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
    'kds-checkbox-group': KdsCheckboxGroup;
  }
}
