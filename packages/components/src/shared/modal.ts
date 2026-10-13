import { LitElement, type PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';

/**
 * Shared behaviour for modal surfaces (dialog, drawer), built on the native <dialog> element.
 *
 * `showModal()` gives focus containment, inert page content, Escape handling and the top layer for free.
 * Subclasses render a `<dialog part="dialog">` and their own layout inside it.
 *
 * @fires kds-open - After the modal opens
 * @fires kds-close - After the modal closes. `detail.reason` is 'close-button', 'escape', 'backdrop' or 'api'.
 */
export class KdsModalElement extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  /** Escape and backdrop clicks don't close the modal, and no close button is shown. For required steps. */
  @property({ type: Boolean, reflect: true }) persistent = false;
  /** Accessible name and visible title. */
  @property() heading = '';
  /** Accessible name for the close button. */
  @property({ attribute: 'close-label' }) closeLabel = 'Close';

  @query('dialog') protected _dialog!: HTMLDialogElement;

  private _closeReason = 'api';
  private _returnFocus: HTMLElement | null = null;

  show() {
    this.open = true;
  }

  close(reason = 'api') {
    this._closeReason = reason;
    this.open = false;
  }

  protected updated(changed: PropertyValues<this>) {
    if (!changed.has('open') || !this._dialog) return;
    if (this.open && !this._dialog.open) {
      this._returnFocus = document.activeElement as HTMLElement | null;
      this._dialog.showModal();
      this.dispatchEvent(new CustomEvent('kds-open', { bubbles: true, composed: true }));
    } else if (!this.open && this._dialog.open) {
      this._dialog.close();
    }
  }

  /** Native close (Escape, form[method=dialog], close()) — keep `open` in sync and report why. */
  protected _onNativeClose = () => {
    const reason = this._closeReason;
    this._closeReason = 'api';
    this.open = false;
    this._returnFocus?.focus?.();
    this._returnFocus = null;
    this.dispatchEvent(new CustomEvent('kds-close', { bubbles: true, composed: true, detail: { reason } }));
  };

  protected _onCancel = (e: Event) => {
    if (this.persistent) {
      e.preventDefault();
      return;
    }
    this._closeReason = 'escape';
  };

  /** A click whose target is the <dialog> itself landed on the backdrop, outside the inner surface. */
  protected _onDialogClick = (e: MouseEvent) => {
    if (e.target === this._dialog && !this.persistent) this.close('backdrop');
  };

  protected _onCloseButton = () => this.close('close-button');
}
