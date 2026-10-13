import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { spacingAttr, type Spacing } from '../../shared/layout-styles.js';

/**
 * @element kds-stack
 * @summary Lays children out in a column or row with token-based spacing.
 *
 * @slot - Children
 * @attr {column|row} direction - Main axis (default column)
 * @attr {none|xs|sm|md|lg|xl|2xl} gap - Space between children (default md)
 * @attr {start|center|end|stretch|baseline} align - Cross-axis alignment
 * @attr {start|center|end|between|around|evenly} justify - Main-axis distribution
 * @attr {boolean} wrap - Lets children wrap onto new lines
 * @attr {boolean} inline - Inline instead of block
 */
@customElement('kds-stack')
export class KdsStack extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--_gap, var(--kds-component-stack-gap));
      }

      :host([hidden]) {
        display: none;
      }

      :host([inline]) {
        display: inline-flex;
      }

      :host([direction='row']) {
        flex-direction: row;
      }

      :host([wrap]) {
        flex-wrap: wrap;
      }

      :host([align='start']) {
        align-items: flex-start;
      }
      :host([align='center']) {
        align-items: center;
      }
      :host([align='end']) {
        align-items: flex-end;
      }
      :host([align='stretch']) {
        align-items: stretch;
      }
      :host([align='baseline']) {
        align-items: baseline;
      }

      :host([justify='start']) {
        justify-content: flex-start;
      }
      :host([justify='center']) {
        justify-content: center;
      }
      :host([justify='end']) {
        justify-content: flex-end;
      }
      :host([justify='between']) {
        justify-content: space-between;
      }
      :host([justify='around']) {
        justify-content: space-around;
      }
      :host([justify='evenly']) {
        justify-content: space-evenly;
      }
    `,
    spacingAttr('gap', '--_gap'),
  ];

  @property({ reflect: true }) direction: 'column' | 'row' = 'column';
  @property({ reflect: true }) gap?: Spacing;
  @property({ reflect: true }) align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  @property({ reflect: true }) justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  @property({ type: Boolean, reflect: true }) wrap = false;
  @property({ type: Boolean, reflect: true }) inline = false;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-stack': KdsStack;
  }
}
