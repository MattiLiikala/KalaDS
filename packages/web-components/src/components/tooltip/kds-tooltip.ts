import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { POPUP_RESET, autoUpdate, hidePopup, positionPopup, showPopup, uniqueId, type Placement } from '../../shared/popover.js';

const SHOW_DELAY_MS = 300;
const HIDE_DELAY_MS = 100;

/**
 * @element kds-tooltip
 * @summary Short text label shown when its trigger is hovered or focused.
 *
 * Wrap the trigger: `<kds-tooltip content="Copy link"><kds-icon-button ...></kds-icon-button></kds-tooltip>`.
 * The tooltip text is linked to the trigger with aria-describedby, can be hovered without closing,
 * and closes on Escape (WCAG 1.4.13). Keep the text short and never put interactive content in it.
 *
 * Note: when the trigger is a KalaDS component with its own shadow root (kds-button, kds-icon-button),
 * the description is attached to the host element. For icon buttons, give the button a `label` too,
 * which is its accessible name.
 *
 * @slot - The trigger element
 * @attr {string} content - Tooltip text
 * @attr {top|bottom|left|right} placement - Preferred side (flips when there isn't room; default top)
 * @attr {boolean} disabled - Never shows the tooltip
 * @csspart tooltip - The tooltip bubble
 */
@customElement('kds-tooltip')
export class KdsTooltip extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    .tooltip {
      ${POPUP_RESET}
      box-sizing: border-box;
      max-width: var(--kds-component-tooltip-max-width);
      padding: var(--kds-component-tooltip-padding-y) var(--kds-component-tooltip-padding-x);
      border: none;
      border-radius: var(--kds-component-tooltip-radius);
      background-color: var(--kds-component-tooltip-bg);
      color: var(--kds-component-tooltip-text);
      font-family: var(--kds-semantic-type-label-sm-family);
      font-size: var(--kds-semantic-type-label-sm-size);
      font-weight: var(--kds-semantic-type-label-sm-weight);
      line-height: var(--kds-semantic-type-label-sm-line-height);
      pointer-events: auto;
      /* Carries the anchor gap for positionPopup (see shared/popover.ts). */
      scroll-margin-top: var(--kds-component-tooltip-offset);
    }

    .tooltip[hidden] {
      display: none;
    }
  `;

  @property() content = '';
  @property({ reflect: true }) placement: Placement = 'top';
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('.tooltip') private _bubble!: HTMLElement;

  /** Lives in light DOM next to the trigger, so aria-describedby can reference it. */
  private _text = document.createElement('span');
  private _id = uniqueId('kds-tooltip');
  private _showTimer = 0;
  private _hideTimer = 0;
  private _open = false;
  private _stopAutoUpdate?: () => void;

  constructor() {
    super();
    this._text.id = this._id;
    this._text.slot = 'content';
    this._text.setAttribute('role', 'tooltip');
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._text.isConnected) this.append(this._text);
    this.addEventListener('mouseenter', this._scheduleShow);
    this.addEventListener('mouseleave', this._scheduleHide);
    this.addEventListener('focusin', this._showNow);
    this.addEventListener('focusout', this._hideNow);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this._scheduleShow);
    this.removeEventListener('mouseleave', this._scheduleHide);
    this.removeEventListener('focusin', this._showNow);
    this.removeEventListener('focusout', this._hideNow);
    this._hide();
  }

  protected updated(changed: PropertyValues<this>) {
    if (changed.has('content')) this._text.textContent = this.content;
    if (changed.has('disabled') && this.disabled) this._hide();
  }

  private get _trigger(): Element | undefined {
    return [...this.children].find((el) => el !== this._text);
  }

  private _onTriggerSlotChange() {
    const trigger = this._trigger;
    if (!trigger) return;
    const ids = new Set((trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
    ids.add(this._id);
    trigger.setAttribute('aria-describedby', [...ids].join(' '));
  }

  private _scheduleShow = () => {
    clearTimeout(this._hideTimer);
    clearTimeout(this._showTimer);
    this._showTimer = window.setTimeout(() => this._show(), SHOW_DELAY_MS);
  };

  private _scheduleHide = () => {
    clearTimeout(this._showTimer);
    clearTimeout(this._hideTimer);
    this._hideTimer = window.setTimeout(() => this._hide(), HIDE_DELAY_MS);
  };

  private _showNow = () => {
    clearTimeout(this._hideTimer);
    this._show();
  };

  private _hideNow = () => this._hide();

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this._hide();
  };

  private _show() {
    const trigger = this._trigger;
    if (this._open || this.disabled || !this.content || !trigger) return;
    this._open = true;
    showPopup(this._bubble);
    const place = () => this._bubble.setAttribute('data-side', positionPopup(trigger, this._bubble, this.placement));
    place();
    this._stopAutoUpdate = autoUpdate(trigger, this._bubble, place);
    document.addEventListener('keydown', this._onKeyDown);
  }

  private _hide() {
    clearTimeout(this._showTimer);
    clearTimeout(this._hideTimer);
    if (!this._open) return;
    this._open = false;
    this._stopAutoUpdate?.();
    hidePopup(this._bubble);
    document.removeEventListener('keydown', this._onKeyDown);
  }

  render() {
    return html`
      <slot @slotchange=${this._onTriggerSlotChange}></slot>
      <div
        class="tooltip"
        part="tooltip"
        popover="manual"
        hidden
        @mouseenter=${this._showNow}
        @mouseleave=${this._scheduleHide}
      >
        <slot name="content"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-tooltip': KdsTooltip;
  }
}
