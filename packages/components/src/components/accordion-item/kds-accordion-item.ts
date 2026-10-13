import { LitElement, html, css, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '@kalads/icons';
import { focusRing } from '../../shared/field-styles.js';

/**
 * @element kds-accordion-item
 * @summary One expandable section of a kds-accordion.
 *
 * Built on native <details>/<summary>, so it's keyboard operable and announced as expandable. Opening and
 * closing animate the height (skipped with prefers-reduced-motion).
 *
 * @slot - Section content
 * @slot heading - Rich heading content (alternative to the `heading` attribute)
 * @attr {string} heading - Heading text
 * @attr {boolean} open - Whether the section is expanded
 * @attr {boolean} disabled - Prevents expanding or collapsing
 * @fires kds-toggle - When the user expands or collapses the section. `detail: { open }`
 * @csspart summary - The clickable heading row
 * @csspart content - The content wrapper
 */
@customElement('kds-accordion-item')
export class KdsAccordionItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      border-bottom: var(--kds-component-accordion-item-border-width) solid var(--kds-component-accordion-item-border);
    }

    :host([hidden]) {
      display: none;
    }

    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--kds-semantic-spacing-md);
      padding: var(--kds-component-accordion-item-padding-y) var(--kds-component-accordion-item-padding-x);
      border-radius: var(--kds-component-accordion-item-radius);
      color: var(--kds-component-accordion-item-title-text);
      font-family: var(--kds-semantic-type-label-family);
      font-size: var(--kds-semantic-type-body-size);
      font-weight: var(--kds-semantic-type-label-weight);
      line-height: var(--kds-semantic-type-body-line-height);
      cursor: pointer;
      list-style: none;
      outline: none;
      transition: background-color 0.15s ease;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    summary:hover {
      background-color: var(--kds-component-accordion-item-bg-hover);
    }

    summary:focus-visible {
      ${unsafeCSS(focusRing('accordion-item'))}
    }

    :host([disabled]) summary {
      cursor: not-allowed;
      background: none;
      color: var(--kds-semantic-text-muted);
    }

    .chevron {
      display: inline-flex;
      flex-shrink: 0;
      color: var(--kds-component-accordion-item-icon);
      transition: rotate 0.15s ease;
      --kds-icon-size: var(--kds-semantic-spacing-lg);
    }

    /* Follows the item, not <details>: while closing, <details> stays open until the animation ends. */
    :host([open]) .chevron {
      rotate: 180deg;
    }

    .panel.animating {
      overflow: hidden;
    }

    .content {
      padding: 0 var(--kds-component-accordion-item-padding-x) var(--kds-component-accordion-item-padding-y);
      color: var(--kds-component-accordion-item-content-text);
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      line-height: var(--kds-semantic-type-body-line-height);
    }

    @media (prefers-reduced-motion: reduce) {
      .chevron {
        transition: none;
      }
    }
  `;

  @property() heading = '';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('details') private _details!: HTMLDetailsElement;
  @query('.panel') private _panel!: HTMLElement;

  private _animation?: Animation;

  protected updated(changed: PropertyValues) {
    if (!changed.has('open')) return;
    // First render: no animation.
    if (changed.get('open') === undefined) this._details.open = this.open;
    else this._animate(this.open);
  }

  /**
   * Animates the panel height to open or closed. <details> is opened first (so the content renders and
   * can be measured) and only closed once the closing animation ends. Reversing mid-way starts from the
   * current height.
   */
  private _animate(open: boolean) {
    const details = this._details;
    const panel = this._panel;
    if (!this._animation && details.open === open) return;

    const from = this._animation ? panel.getBoundingClientRect().height : details.open ? panel.scrollHeight : 0;
    this._animation?.cancel();
    this._animation = undefined;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.classList.remove('animating');
      details.open = open;
      return;
    }

    details.open = true;
    const to = open ? panel.scrollHeight : 0;
    panel.classList.add('animating');
    const animation = panel.animate({ height: [`${from}px`, `${to}px`] }, { duration: 200, easing: 'ease' });
    this._animation = animation;
    animation.finished
      .then(() => {
        if (this._animation !== animation) return;
        this._animation = undefined;
        panel.classList.remove('animating');
        if (!open) details.open = false;
      })
      .catch(() => {
        // Cancelled by a newer toggle, which takes over.
      });
  }

  /** The summary click is handled here instead of natively, so opening and closing can animate. */
  private _onSummaryClick(e: Event) {
    e.preventDefault();
    if (this.disabled) return;
    this.open = !this.open;
    this._dispatchToggle();
  }

  /** Syncs `open` when <details> is toggled some other way (for example find-in-page). */
  private _onToggle() {
    if (this._animation || this._details.open === this.open) return;
    this.open = this._details.open;
    this._dispatchToggle();
  }

  private _dispatchToggle() {
    this.dispatchEvent(new CustomEvent('kds-toggle', { bubbles: true, composed: true, detail: { open: this.open } }));
  }

  render() {
    return html`
      <details @toggle=${this._onToggle}>
        <summary part="summary" aria-disabled=${this.disabled ? 'true' : 'false'} @click=${this._onSummaryClick}>
          <span><slot name="heading">${this.heading}</slot></span>
          <span class="chevron" aria-hidden="true"><kds-icon-chevron-down></kds-icon-chevron-down></span>
        </summary>
        <div class="panel">
          <div class="content" part="content"><slot></slot></div>
        </div>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-accordion-item': KdsAccordionItem;
  }
}
