import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @element kds-paper
 * @summary Plain surface for grouping content, with optional elevation.
 *
 * The basic building block behind cards and panels: background, 1px border and a crisp offset shadow
 * whose distance grows with `elevation`. Use kds-card when you need header/body/footer sections.
 *
 * @slot - Content
 * @attr {0|1|2|3} elevation - Crisp shadow level: 0 none, 1 low, 2 medium, 3 high (like kds-card) (default 1)
 * @attr {outlined|flat} variant - outlined (border) or flat (no border) (default outlined)
 * @attr {none|xs|sm|md|lg|xl} padding - Inner padding (default lg)
 * @csspart paper - The surface
 */
@customElement('kds-paper')
export class KdsPaper extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    .paper {
      box-sizing: border-box;
      height: 100%;
      padding: var(--_padding, var(--kds-component-paper-padding));
      background-color: var(--kds-component-paper-bg);
      border: var(--kds-component-paper-border-width) solid var(--kds-component-paper-border);
      border-radius: var(--kds-component-paper-radius);
      box-shadow: var(--kds-component-paper-shadow-1);
    }

    :host([variant='flat']) .paper {
      border-color: transparent;
    }

    :host([elevation='0']) .paper {
      box-shadow: var(--kds-component-paper-shadow-0);
    }
    :host([elevation='2']) .paper {
      box-shadow: var(--kds-component-paper-shadow-2);
    }
    :host([elevation='3']) .paper {
      box-shadow: var(--kds-component-paper-shadow-3);
    }

    :host([padding='none']) {
      --_padding: 0;
    }
    :host([padding='xs']) {
      --_padding: var(--kds-semantic-padding-xs);
    }
    :host([padding='sm']) {
      --_padding: var(--kds-semantic-padding-sm);
    }
    :host([padding='md']) {
      --_padding: var(--kds-semantic-padding-md);
    }
    :host([padding='lg']) {
      --_padding: var(--kds-semantic-padding-lg);
    }
    :host([padding='xl']) {
      --_padding: var(--kds-semantic-padding-xl);
    }
  `;

  @property({ type: Number, reflect: true }) elevation: 0 | 1 | 2 | 3 = 1;
  @property({ reflect: true }) variant: 'outlined' | 'flat' = 'outlined';
  @property({ reflect: true }) padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  render() {
    return html`<div class="paper" part="paper"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-paper': KdsPaper;
  }
}
