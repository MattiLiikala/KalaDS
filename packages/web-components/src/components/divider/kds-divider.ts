import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @element kds-divider
 * @summary Thin line separating groups of content, horizontally or vertically.
 *
 * Optional label text sits in the middle of a horizontal divider ("or"). Purely decorative dividers can
 * set `decorative` to hide them from assistive technology.
 *
 * @slot - Optional label (horizontal dividers only)
 * @attr {horizontal|vertical} orientation - Direction of the line (default horizontal)
 * @attr {boolean} flush - Removes the spacing around the divider
 * @attr {boolean} decorative - Hides the divider from assistive technology
 * @csspart line - Each line segment
 * @csspart label - The label wrapper
 */
@customElement('kds-divider')
export class KdsDivider extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-block: var(--kds-component-divider-spacing);
    }

    :host([orientation='vertical']) {
      display: inline-block;
      align-self: stretch;
      margin-block: 0;
      margin-inline: var(--kds-component-divider-spacing);
    }

    :host([flush]) {
      margin: 0;
    }

    :host([hidden]) {
      display: none;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: var(--kds-component-divider-label-gap);
      height: 100%;
    }

    .line {
      flex: 1;
      border-top: var(--kds-component-divider-width) solid var(--kds-component-divider-color);
    }

    :host([orientation='vertical']) .line {
      border-top: none;
      border-inline-start: var(--kds-component-divider-width) solid var(--kds-component-divider-color);
      height: 100%;
    }

    .label {
      font-family: var(--kds-semantic-type-body-sm-family);
      font-size: var(--kds-semantic-type-body-sm-size);
      line-height: var(--kds-semantic-type-body-sm-line-height);
      color: var(--kds-component-divider-label-text);
    }

    .label[hidden],
    .line[hidden] {
      display: none;
    }
  `;

  @property({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @property({ type: Boolean, reflect: true }) flush = false;
  @property({ type: Boolean, reflect: true }) decorative = false;

  @state() private _hasLabel = false;

  protected updated() {
    if (this.decorative) {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('role');
    } else {
      this.removeAttribute('aria-hidden');
      this.setAttribute('role', 'separator');
      this.setAttribute('aria-orientation', this.orientation);
    }
  }

  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasLabel = slot.assignedNodes({ flatten: true }).some((n) => !!n.textContent?.trim());
  }

  render() {
    const labelled = this._hasLabel && this.orientation === 'horizontal';
    return html`
      <div class="divider">
        <span class="line" part="line"></span>
        <span class="label" part="label" ?hidden=${!labelled}><slot @slotchange=${this._onSlotChange}></slot></span>
        <span class="line" part="line" ?hidden=${!labelled}></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-divider': KdsDivider;
  }
}
