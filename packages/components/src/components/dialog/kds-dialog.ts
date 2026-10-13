import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@kalads/icons';
import '../icon-button/kds-icon-button.js';
import { KdsModalElement } from '../../shared/modal.js';
import { uniqueId } from '../../shared/popover.js';

/**
 * @element kds-dialog
 * @summary Modal window for focused tasks and confirmations.
 *
 * Built on the native <dialog> with showModal(): focus moves into the dialog and stays there, the page
 * behind is inert, and Escape closes it. Focus returns to the element that opened it. Surface:
 * 1px border and the high soft shadow (semantic.shadow.soft.3).
 *
 * @slot - Dialog body
 * @slot footer - Actions, e.g. Cancel and Confirm buttons (right-aligned)
 * @attr {boolean} open - Opens the dialog
 * @attr {string} heading - Title, also the dialog's accessible name. Required.
 * @attr {sm|md|lg} size - Maximum width (default md)
 * @attr {boolean} persistent - Escape and backdrop clicks don't close the dialog and there's no close button
 * @attr {string} close-label - Accessible name of the close button (default "Close")
 * @fires kds-open - After the dialog opens
 * @fires kds-close - After it closes. `detail.reason`: 'close-button' | 'escape' | 'backdrop' | 'api'
 * @csspart dialog - The native dialog element
 * @csspart surface - The visible dialog surface
 * @csspart heading - The title
 * @csspart body - The body wrapper
 * @csspart footer - The footer wrapper
 */
@customElement('kds-dialog')
export class KdsDialog extends KdsModalElement {
  static styles = css`
    :host {
      display: contents;
    }

    dialog {
      box-sizing: border-box;
      width: min(var(--_width), calc(100vw - var(--kds-semantic-spacing-md) * 2));
      max-width: none;
      max-height: calc(100vh - var(--kds-semantic-spacing-md) * 2);
      padding: 0;
      border: none;
      background: none;
      color: var(--kds-component-dialog-text);
      overflow: visible;
      --_width: var(--kds-component-dialog-width-md);
    }

    :host([size='sm']) dialog {
      --_width: var(--kds-component-dialog-width-sm);
    }

    :host([size='lg']) dialog {
      --_width: var(--kds-component-dialog-width-lg);
    }

    dialog::backdrop {
      background-color: var(--kds-component-dialog-backdrop);
      opacity: var(--kds-component-dialog-backdrop-opacity);
    }

    dialog[open] .surface {
      animation: enter 0.15s ease;
    }

    .surface {
      display: flex;
      flex-direction: column;
      gap: var(--kds-component-dialog-gap);
      box-sizing: border-box;
      max-height: inherit;
      padding: var(--kds-component-dialog-padding);
      background-color: var(--kds-component-dialog-bg);
      border: var(--kds-component-dialog-border-width) solid var(--kds-component-dialog-border);
      border-radius: var(--kds-component-dialog-radius);
      box-shadow: var(--kds-component-dialog-shadow);
    }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--kds-component-dialog-gap);
    }

    h2 {
      margin: 0;
      font-family: var(--kds-semantic-type-h4-family);
      font-size: var(--kds-semantic-type-h4-size);
      font-weight: var(--kds-semantic-type-h4-weight);
      line-height: var(--kds-semantic-type-h4-line-height);
    }

    kds-icon-button {
      margin-block-start: calc(var(--kds-semantic-spacing-xs) * -1);
      margin-inline-end: calc(var(--kds-semantic-spacing-xs) * -1);
    }

    .body {
      overflow-y: auto;
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      line-height: var(--kds-semantic-type-body-line-height);
    }

    .footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--kds-semantic-spacing-sm);
    }

    .footer[hidden] {
      display: none;
    }

    @keyframes enter {
      from {
        opacity: 0;
        translate: 0 var(--kds-semantic-spacing-sm);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      dialog[open] .surface {
        animation: none;
      }
    }
  `;

  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';
  @state() private _hasFooter = false;

  private _id = uniqueId('kds-dialog');

  render() {
    return html`
      <dialog
        part="dialog"
        aria-labelledby="${this._id}-heading"
        @close=${this._onNativeClose}
        @cancel=${this._onCancel}
        @click=${this._onDialogClick}
      >
        <div class="surface" part="surface">
          <div class="header">
            <h2 id="${this._id}-heading" part="heading">${this.heading}</h2>
            ${!this.persistent
              ? html`<kds-icon-button size="sm" label=${this.closeLabel} @click=${this._onCloseButton}>
                  <kds-icon-close></kds-icon-close>
                </kds-icon-button>`
              : nothing}
          </div>
          <div class="body" part="body"><slot></slot></div>
          <div class="footer" part="footer" ?hidden=${!this._hasFooter}>
            <slot
              name="footer"
              @slotchange=${(e: Event) => (this._hasFooter = (e.target as HTMLSlotElement).assignedElements().length > 0)}
            ></slot>
          </div>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-dialog': KdsDialog;
  }
}
