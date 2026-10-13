import { LitElement, html, css, unsafeCSS, nothing } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property, state } from 'lit/decorators.js';
import '@kalads/icons';
import '../icon-button/kds-icon-button.js';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'danger';

const ICONS: Record<NotificationVariant, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  danger: 'error',
};

const variantStyles = unsafeCSS(
  (Object.keys(ICONS) as NotificationVariant[])
    .map(
      (v) => `:host([variant='${v}']) {
        --_bg: var(--kds-component-notification-${v}-bg);
        --_accent: var(--kds-component-notification-${v}-accent);
        --_shadow-color: var(--kds-component-notification-${v}-shadow-color);
        --_close: var(--kds-component-notification-${v}-close);
        --_close-bg-hover: var(--kds-component-notification-${v}-close-bg-hover);
      }`,
    )
    .join('\n'),
);

/**
 * @element kds-notification
 * @summary Message about the status of something: info, success, warning or error.
 *
 * Tinted with the variant's palette: subtle background, strong border and icon, and a crisp shadow in
 * the variant colour. Danger and
 * warning use role="alert" (announced immediately); info and success use role="status" (announced
 * politely). Add the element to the page when the message should be announced.
 *
 * @slot - Message text
 * @slot actions - Buttons or links shown below the message
 * @attr {info|success|warning|danger} variant - Kind of message (default info)
 * @attr {1|2|3} elevation - Crisp shadow level: 1 low, 2 medium, 3 high (default 3)
 * @attr {string} heading - Optional bold title
 * @attr {boolean} dismissible - Shows a close button
 * @attr {string} close-label - Accessible name of the close button (default "Dismiss")
 * @fires kds-close - When the close button is pressed. Call preventDefault() to keep it visible.
 * @csspart notification - The notification surface
 * @csspart icon - The leading icon
 */
@customElement('kds-notification')
export class KdsNotification extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        --_bg: var(--kds-component-notification-info-bg);
        --_accent: var(--kds-component-notification-info-accent);
        --_shadow-color: var(--kds-component-notification-info-shadow-color);
        --_close: var(--kds-component-notification-info-close);
        --_close-bg-hover: var(--kds-component-notification-info-close-bg-hover);
        --_offset: var(--kds-component-notification-offset-3);
      }

      :host([elevation='1']) {
        --_offset: var(--kds-component-notification-offset-1);
      }
      :host([elevation='2']) {
        --_offset: var(--kds-component-notification-offset-2);
      }

      :host([hidden]) {
        display: none;
      }

      .notification {
        display: flex;
        align-items: flex-start;
        gap: var(--kds-component-notification-gap);
        padding: var(--kds-component-notification-padding);
        background-color: var(--_bg);
        border: var(--kds-component-notification-border-width) solid var(--_accent);
        border-radius: var(--kds-component-notification-radius);
        /* A crisp shadow (semantic.shadow.crisp.*) in the variant's colour. */
        box-shadow: var(--_offset) var(--_offset) 0 0 var(--_shadow-color);
        color: var(--kds-component-notification-text);
        font-family: var(--kds-semantic-type-body-family);
        font-size: var(--kds-semantic-type-body-size);
        line-height: var(--kds-semantic-type-body-line-height);
      }

      .icon {
        display: inline-flex;
        flex-shrink: 0;
        color: var(--_accent);
        /* Centre the icon on the first line of text. */
        height: calc(1em * var(--kds-semantic-type-body-line-height));
        align-items: center;
        --kds-icon-size: var(--kds-semantic-spacing-lg);
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: var(--kds-semantic-spacing-xs);
        flex: 1;
        min-width: 0;
      }

      .heading {
        font-family: var(--kds-semantic-type-label-family);
        font-weight: var(--kds-semantic-type-label-weight);
        color: var(--kds-component-notification-title-text);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--kds-semantic-spacing-sm);
        margin-block-start: var(--kds-semantic-spacing-xs);
      }

      .actions[hidden] {
        display: none;
      }

      /*
       * The close button is a ghost kds-icon-button. Its ghost tokens are re-pointed for this one button,
       * so the icon and hover tint follow the notification variant instead of the primary colour.
       */
      kds-icon-button {
        flex-shrink: 0;
        margin-block: calc(var(--kds-semantic-spacing-xs) * -1);
        --kds-component-button-ghost-text: var(--_close);
        --kds-component-button-ghost-bg-hover: var(--_close-bg-hover);
        --kds-component-button-ghost-bg-active: var(--_close-bg-hover);
      }
    `,
    variantStyles,
  ];

  @property({ reflect: true }) variant: NotificationVariant = 'info';
  @property({ type: Number, reflect: true }) elevation: 1 | 2 | 3 = 3;
  @property() heading = '';
  @property({ type: Boolean, reflect: true }) dismissible = false;
  @property({ attribute: 'close-label' }) closeLabel = 'Dismiss';

  @state() private _hasActions = false;

  private _dismiss() {
    const event = new CustomEvent('kds-close', { bubbles: true, composed: true, cancelable: true });
    if (this.dispatchEvent(event)) this.hidden = true;
  }

  render() {
    const urgent = this.variant === 'danger' || this.variant === 'warning';
    const icon = unsafeStatic(`kds-icon-${ICONS[this.variant] ?? 'info'}`);
    return html`
      <div class="notification" part="notification" role=${urgent ? 'alert' : 'status'}>
        <span class="icon" part="icon" aria-hidden="true">${staticHtml`<${icon}></${icon}>`}</span>
        <div class="content">
          ${this.heading ? html`<span class="heading">${this.heading}</span>` : nothing}
          <div><slot></slot></div>
          <div class="actions" ?hidden=${!this._hasActions}>
            <slot
              name="actions"
              @slotchange=${(e: Event) => (this._hasActions = (e.target as HTMLSlotElement).assignedElements().length > 0)}
            ></slot>
          </div>
        </div>
        ${this.dismissible
          ? html`<kds-icon-button size="sm" label=${this.closeLabel} @click=${this._dismiss}>
              <kds-icon-close></kds-icon-close>
            </kds-icon-button>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-notification': KdsNotification;
  }
}
