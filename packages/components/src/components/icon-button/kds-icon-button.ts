import { css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KdsButton, type ButtonVariant } from '../button/kds-button.js';

/**
 * @element kds-icon-button
 * @summary Round button that shows only an icon. `label` is required: it is the accessible name.
 *
 * Has every kds-button variant, `on-inverse` and the knockout effect (on solid variants the icon is cut
 * out of the fill). Defaults to the ghost variant. Pair with kds-tooltip to show the label on hover.
 *
 * @slot - The icon, e.g. <kds-icon-close>
 * @attr {string} label - Accessible name, e.g. "Close dialog". Required.
 * @attr {primary|secondary|danger|ghost} variant - Visual style (default ghost)
 * @attr {sm|md|lg} size - Size variant
 * @attr {boolean} disabled - Disables the button
 * @attr {boolean} on-inverse - Use fills made for inverse surfaces
 * @csspart button - The native button element
 */
@customElement('kds-icon-button')
export class KdsIconButton extends KdsButton {
  static styles = [
    KdsButton.styles,
    css`
      /*
       * Square, and exactly as tall as a kds-button of the same size: one line of label text plus the
       * button's vertical padding (the 1px border is added on top, as in kds-button). The icon is centred
       * in that box, so icon buttons and text buttons line up in a row.
       */
      button {
        --_size: calc(1em * var(--kds-font-line-height-small) + 2 * var(--_padding-y));
        box-sizing: content-box;
        justify-content: center;
        width: var(--_size);
        height: var(--_size);
        padding: 0;
        line-height: 0;
        --_icon-size: var(--kds-component-icon-button-icon-size-md);
      }

      /* Same specificity as the variant shape rules and later in the cascade, so these win. */
      :host([size]) button,
      :host(:not([size])) button {
        --_radius: var(--kds-component-icon-button-radius);
      }

      :host([size='sm']) button {
        --_icon-size: var(--kds-component-icon-button-icon-size-sm);
      }

      :host([size='lg']) button {
        --_icon-size: var(--kds-component-icon-button-icon-size-lg);
      }

      .label {
        display: inline-flex;
      }

      ::slotted(*) {
        --kds-icon-size: var(--_icon-size);
      }
    `,
  ];

  @property() label = '';

  constructor() {
    super();
    this.variant = 'ghost' as ButtonVariant;
  }

  protected get _accessibleLabel() {
    return this.label || this.hostAriaLabel || undefined;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-icon-button': KdsIconButton;
  }
}
