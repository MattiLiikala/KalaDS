import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @element kds-card
 * @summary Surface container for grouping related content.
 *
 * Cards have a 1px border and a crisp, unblurred offset shadow. There are no divider lines: header,
 * body and footer are separated by spacing only.
 *
 * @slot - Default slot: card content
 * @slot header - Optional card header area
 * @slot footer - Optional card footer area
 * @attr {boolean} interactive - When set, the card shows hover styles (use for clickable cards): it presses
 *   down into its shadow on hover
 * @csspart card - The card surface
 * @csspart header - Header section (rendered only when the header slot has content)
 * @csspart body - Body section
 * @csspart footer - Footer section (rendered only when the footer slot has content)
 */
@customElement('kds-card')
export class KdsCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .card {
      display: flex;
      flex-direction: column;
      gap: var(--kds-component-card-gap);
      padding: var(--kds-component-card-padding);
      background-color: var(--kds-component-card-bg);
      border: var(--kds-component-card-border-width) solid var(--kds-component-card-border);
      border-radius: var(--kds-component-card-radius);
      box-shadow: var(--kds-component-card-shadow);
    }

    :host([interactive]) .card {
      cursor: pointer;
      transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
    }

    /*
     * Hover presses the card down into its shadow: it moves by the shadow offset as the shadow collapses.
     * Hover is taken from the host, which doesn't move, so the pointer near the top/left edge can't
     * slip off the moving card and make it flicker.
     */
    :host([interactive]:hover) .card {
      background-color: var(--kds-component-card-bg-hover);
      box-shadow: var(--kds-component-card-shadow-hover);
      transform: translate(var(--kds-component-card-offset-x-hover), var(--kds-component-card-offset-y-hover));
    }

    @media (prefers-reduced-motion: reduce) {
      :host([interactive]) .card {
        transition: background-color 0.15s ease;
      }
    }

    [hidden] {
      display: none;
    }
  `;

  @property({ type: Boolean, reflect: true }) interactive = false;

  /** A wrapper containing a <slot> never matches :empty, so section visibility is tracked from slot content. */
  @state() private _hasHeader = false;
  @state() private _hasFooter = false;

  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const hasContent = slot
      .assignedNodes({ flatten: true })
      .some((n) => n.nodeType === Node.ELEMENT_NODE || !!n.textContent?.trim());
    if (slot.name === 'header') this._hasHeader = hasContent;
    else this._hasFooter = hasContent;
  }

  render() {
    return html`
      <div class="card" part="card">
        <div class="header" part="header" ?hidden=${!this._hasHeader}>
          <slot name="header" @slotchange=${this._onSlotChange}></slot>
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <div class="footer" part="footer" ?hidden=${!this._hasFooter}>
          <slot name="footer" @slotchange=${this._onSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-card': KdsCard;
  }
}
