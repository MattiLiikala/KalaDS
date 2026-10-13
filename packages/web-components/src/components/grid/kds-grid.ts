import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { namedAttr, numberAttr, spacingAttr, type Spacing } from '../../shared/layout-styles.js';

const MIN = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/**
 * @element kds-grid
 * @summary CSS grid with a fixed number of columns, or responsive columns with a minimum width.
 *
 * Set `columns` for a fixed grid, or `min` for as many columns as fit, each at least that wide
 * (responsive without breakpoints). Use kds-grid-item to span several columns.
 *
 * @slot - Grid children
 * @attr {number} columns - Number of equal columns (1–12)
 * @attr {xs|sm|md|lg|xl|2xl} min - Minimum column width for auto-fitting columns (overrides columns)
 * @attr {none|xs|sm|md|lg|xl|2xl} gap - Space between cells (default md)
 * @attr {none|xs|sm|md|lg|xl|2xl} row-gap - Vertical space between rows (overrides gap)
 * @attr {start|center|end|stretch} align - Vertical alignment of cells
 */
@customElement('kds-grid')
export class KdsGrid extends LitElement {
  static styles = [
    css`
      :host {
        display: grid;
        grid-template-columns: repeat(var(--_columns, 1), minmax(0, 1fr));
        gap: var(--_row-gap, var(--_gap, var(--kds-component-grid-gap))) var(--_gap, var(--kds-component-grid-gap));
      }

      :host([hidden]) {
        display: none;
      }

      :host([min]) {
        grid-template-columns: repeat(auto-fill, minmax(min(var(--_min, var(--kds-component-grid-min-item-width)), 100%), 1fr));
      }

      :host([align='start']) {
        align-items: start;
      }
      :host([align='center']) {
        align-items: center;
      }
      :host([align='end']) {
        align-items: end;
      }
      :host([align='stretch']) {
        align-items: stretch;
      }
    `,
    spacingAttr('gap', '--_gap'),
    spacingAttr('row-gap', '--_row-gap'),
    namedAttr('min', '--_min', MIN, '--kds-semantic-size-'),
    numberAttr('columns', '--_columns'),
  ];

  @property({ type: Number, reflect: true }) columns = 1;
  @property({ reflect: true }) min?: (typeof MIN)[number];
  @property({ reflect: true }) gap?: Spacing;
  @property({ reflect: true, attribute: 'row-gap' }) rowGap?: Spacing;
  @property({ reflect: true }) align?: 'start' | 'center' | 'end' | 'stretch';

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-grid': KdsGrid;
  }
}
