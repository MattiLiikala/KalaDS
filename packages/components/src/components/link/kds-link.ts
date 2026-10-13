import { LitElement, html, css, unsafeCSS, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@kalads/icons';
import { focusRing, visuallyHidden } from '../../shared/field-styles.js';

/**
 * @element kds-link
 * @summary Text link for navigation. Use kds-button for actions.
 *
 * Underlined so it's recognisable without relying on colour. Links that open in a new tab
 * (target="_blank") get an icon and a screen-reader note, and rel="noopener noreferrer".
 *
 * @slot - Link text
 * @attr {string} href - Destination
 * @attr {string} target - Browsing context, e.g. "_blank"
 * @attr {string} rel - Link relationship (noopener noreferrer is added for _blank)
 * @attr {boolean} download - Downloads the destination instead of navigating
 * @attr {default|subtle} variant - default (accent colour) or subtle (text colour, accent on hover)
 * @attr {string} new-tab-label - Screen-reader note for new-tab links (default "(opens in new tab)")
 * @csspart link - The anchor element
 */
@customElement('kds-link')
export class KdsLink extends LitElement {
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles = [
    visuallyHidden,
    css`
      :host {
        display: inline;
      }

      /*
       * The underline is a background line along the bottom of the text, not text-decoration: decorations
       * skip inline icons, and this one runs under the new-tab icon too. It follows the text across line
       * breaks, and sits below the descenders.
       */
      a {
        --_underline-width: var(--kds-component-link-underline-width);
        color: var(--kds-component-link-text);
        text-decoration: none;
        background-image: linear-gradient(currentColor, currentColor);
        background-position: 0 100%;
        background-repeat: no-repeat;
        background-size: 100% var(--_underline-width);
        outline: none;
        transition: color 0.15s ease;
      }

      a:hover {
        --_underline-width: var(--kds-component-link-underline-width-hover);
        color: var(--kds-component-link-text-hover);
      }

      a:active {
        color: var(--kds-component-link-text-active);
      }

      :host([variant='subtle']) a {
        color: var(--kds-component-link-text-subtle);
      }

      :host([variant='subtle']) a:hover {
        color: var(--kds-component-link-text-subtle-hover);
      }

      /* Rounded only while focused, for the ring: the radius would also clip the ends of the underline. */
      a:focus-visible {
        border-radius: var(--kds-component-link-radius);
        ${unsafeCSS(focusRing('link'))}
      }

      /*
       * The icon's glyph stands on the text baseline. An inline-block with overflow hidden has its baseline
       * at its bottom edge, and the Material glyph leaves 3 of its 24 grid units empty below it, so the box
       * is lowered by 1/8 of its size.
       */
      .external {
        display: inline-block;
        overflow: hidden;
        vertical-align: calc(var(--kds-component-link-icon-size) / -8);
        width: var(--kds-component-link-icon-size);
        height: var(--kds-component-link-icon-size);
        line-height: 0;
        margin-inline-start: var(--kds-component-link-icon-gap);
        --kds-icon-size: var(--kds-component-link-icon-size);
      }
    `,
  ];

  @property() href = '';
  @property() target = '';
  @property() rel = '';
  @property({ type: Boolean }) download = false;
  @property({ reflect: true }) variant: 'default' | 'subtle' = 'default';
  @property({ attribute: 'new-tab-label' }) newTabLabel = '(opens in new tab)';

  render() {
    const newTab = this.target === '_blank';
    const rel = newTab ? [this.rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : this.rel;
    return html`<a
      part="link"
      href=${this.href || nothing}
      target=${this.target || nothing}
      rel=${rel || nothing}
      ?download=${this.download}
      ><slot></slot>${newTab
        ? html`<span class="external" aria-hidden="true"><kds-icon-external-link></kds-icon-external-link></span
            ><span class="visually-hidden">${this.newTabLabel}</span>`
        : nothing}</a
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-link': KdsLink;
  }
}
