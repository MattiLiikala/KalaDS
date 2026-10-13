import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { POPUP_RESET, hidePopup, showPopup } from '../../shared/popover.js';

/**
 * @element kds-backdrop
 * @summary Dims the page behind temporary content, e.g. while something loads.
 *
 * Covers the viewport with the overlay colour. Content in the default slot (a spinner, a message) is
 * centred above it. It's shown in the browser's top layer, so it covers everything without z-index.
 * kds-dialog and kds-drawer have their own backdrop; use this one for custom overlays.
 * The backdrop doesn't trap focus: for anything the user must interact with, use kds-dialog.
 *
 * @slot - Content centred above the overlay
 * @attr {boolean} open - Shows the backdrop
 * @fires kds-close - When the overlay is clicked
 * @csspart overlay - The dimming layer
 * @csspart content - The centred content wrapper
 */
@customElement('kds-backdrop')
export class KdsBackdrop extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }

    .backdrop {
      ${POPUP_RESET}
      inset: 0;
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      padding: 0;
      border: none;
      background: none;
      align-items: center;
      justify-content: center;
    }

    .backdrop:popover-open,
    .backdrop:not([popover]):not([hidden]) {
      display: flex;
    }

    .backdrop[hidden] {
      display: none;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background-color: var(--kds-component-backdrop-bg);
      opacity: var(--kds-component-backdrop-opacity);
      animation: fade-in 0.15s ease;
    }

    .content {
      position: relative;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .overlay {
        animation: none;
      }
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;

  @query('.backdrop') private _backdrop!: HTMLElement;

  protected updated(changed: PropertyValues<this>) {
    if (changed.has('open')) (this.open ? showPopup : hidePopup)(this._backdrop);
  }

  private _onOverlayClick() {
    this.dispatchEvent(new CustomEvent('kds-close', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="backdrop" popover="manual" hidden>
        <div class="overlay" part="overlay" @click=${this._onOverlayClick}></div>
        <div class="content" part="content"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-backdrop': KdsBackdrop;
  }
}
