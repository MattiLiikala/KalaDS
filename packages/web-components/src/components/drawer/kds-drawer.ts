import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@kalads/icons';
import '../icon-button/kds-icon-button.js';
import { KdsModalElement } from '../../shared/modal.js';
import { uniqueId } from '../../shared/popover.js';

/**
 * @element kds-drawer
 * @summary Full-height panel that slides in from the side, for navigation or secondary tasks.
 *
 * Modal like kds-dialog (native <dialog>): focus is contained, the page behind is inert, Escape closes
 * it and focus returns to the opener.
 *
 * @slot - Drawer body
 * @slot footer - Actions pinned to the bottom
 * @attr {boolean} open - Opens the drawer
 * @attr {string} heading - Title, also the drawer's accessible name. Required.
 * @attr {start|end} placement - Side it slides in from (default end: right in left-to-right layouts)
 * @attr {sm|md|lg} size - Width (default md)
 * @attr {boolean} persistent - Escape and backdrop clicks don't close the drawer and there's no close button
 * @attr {string} close-label - Accessible name of the close button (default "Close")
 * @fires kds-open - After the drawer opens
 * @fires kds-close - After it closes. `detail.reason`: 'close-button' | 'escape' | 'backdrop' | 'api'
 * @csspart dialog - The native dialog element (the panel)
 * @csspart heading - The title
 * @csspart body - The body wrapper
 * @csspart footer - The footer wrapper
 */
@customElement('kds-drawer')
export class KdsDrawer extends KdsModalElement {
  static styles = css`
    :host {
      display: contents;
    }

    dialog {
      box-sizing: border-box;
      position: fixed;
      inset-block: 0;
      inset-inline-start: auto;
      inset-inline-end: 0;
      width: min(var(--_width), 100vw);
      max-width: none;
      height: 100%;
      max-height: none;
      margin: 0;
      padding: 0;
      border: none;
      border-inline-start: var(--kds-component-drawer-border-width) solid var(--kds-component-drawer-border);
      background-color: var(--kds-component-drawer-bg);
      color: var(--kds-component-drawer-text);
      --_width: var(--kds-component-drawer-width-md);
      --_from: 100%;
    }

    :host([placement='start']) dialog {
      inset-inline-start: 0;
      inset-inline-end: auto;
      border-inline-start: none;
      border-inline-end: var(--kds-component-drawer-border-width) solid var(--kds-component-drawer-border);
      --_from: -100%;
    }

    :host([size='sm']) dialog {
      --_width: var(--kds-component-drawer-width-sm);
    }

    :host([size='lg']) dialog {
      --_width: var(--kds-component-drawer-width-lg);
    }

    dialog::backdrop {
      background-color: var(--kds-component-drawer-backdrop);
      opacity: var(--kds-component-drawer-backdrop-opacity);
    }

    dialog[open] {
      display: flex;
      flex-direction: column;
      animation: slide-in 0.2s ease;
    }

    .header,
    .body,
    .footer {
      padding-inline: var(--kds-component-drawer-padding);
    }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--kds-component-drawer-gap);
      padding-block: var(--kds-component-drawer-padding) var(--kds-component-drawer-gap);
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
      flex: 1;
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
      padding-block: var(--kds-component-drawer-gap) var(--kds-component-drawer-padding);
    }

    .footer[hidden] {
      display: none;
    }

    @keyframes slide-in {
      from {
        translate: var(--_from) 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      dialog[open] {
        animation: none;
      }
    }
  `;

  @property({ reflect: true }) placement: 'start' | 'end' = 'end';
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md';
  @state() private _hasFooter = false;

  private _id = uniqueId('kds-drawer');

  render() {
    return html`
      <dialog
        part="dialog"
        aria-labelledby="${this._id}-heading"
        @close=${this._onNativeClose}
        @cancel=${this._onCancel}
        @click=${this._onDialogClick}
      >
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
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-drawer': KdsDrawer;
  }
}
