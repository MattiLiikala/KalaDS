import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * @element kds-skeleton
 * @summary Placeholder shape shown while content loads.
 *
 * Hidden from assistive technology: mark the loading region itself with aria-busy="true" (and announce
 * completion if it matters). The shimmer animation stops when the user prefers reduced motion.
 *
 * @attr {text|rect|circle} variant - Shape (default text)
 * @attr {number} lines - Number of text lines (text variant; the last line is shorter)
 * @attr {string} width - CSS width, e.g. "12rem" or "60%" (default: full width; circle: spacing.2xl)
 * @attr {string} height - CSS height (rect and circle)
 * @csspart shape - Each skeleton shape
 */
@customElement('kds-skeleton')
export class KdsSkeleton extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    :host([variant='circle']) {
      display: inline-block;
    }

    .stack {
      display: flex;
      flex-direction: column;
      gap: var(--kds-component-skeleton-gap);
    }

    .shape {
      display: block;
      background-color: var(--kds-component-skeleton-bg);
      background-image: linear-gradient(
        90deg,
        transparent,
        var(--kds-component-skeleton-highlight),
        transparent
      );
      background-size: 200% 100%;
      background-repeat: no-repeat;
      border-radius: var(--kds-component-skeleton-radius);
      animation: shimmer 1.4s ease-in-out infinite;
    }

    .line {
      /* One line of body text. */
      height: calc(1em * var(--kds-semantic-type-body-line-height));
      font-size: var(--kds-semantic-type-body-size);
      border-radius: var(--kds-component-skeleton-radius-text);
    }

    .line.last {
      width: 60%;
    }

    .circle {
      aspect-ratio: 1;
      border-radius: var(--kds-semantic-radius-full);
    }

    @keyframes shimmer {
      from {
        background-position: 150% 0;
      }
      to {
        background-position: -50% 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .shape {
        animation: none;
        background-image: none;
      }
    }
  `;

  @property({ reflect: true }) variant: 'text' | 'rect' | 'circle' = 'text';
  @property({ type: Number }) lines = 1;
  @property() width = '';
  @property() height = '';

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-hidden', 'true');
  }

  render() {
    const size = styleMap({ width: this.width || null, height: this.height || null });
    if (this.variant === 'circle') {
      const d = this.width || this.height || 'var(--kds-semantic-spacing-2xl)';
      return html`<span class="shape circle" part="shape" style=${styleMap({ width: d })}></span>`;
    }
    if (this.variant === 'rect') {
      return html`<span class="shape" part="shape" style=${styleMap({ width: this.width || null, height: this.height || 'var(--kds-semantic-size-xs)' })}></span>`;
    }
    const count = Math.max(1, Math.floor(this.lines));
    return html`<span class="stack" style=${size}>
      ${Array.from({ length: count }, (_, i) =>
        html`<span class="shape line ${count > 1 && i === count - 1 ? 'last' : ''}" part="shape"></span>`,
      )}
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-skeleton': KdsSkeleton;
  }
}
