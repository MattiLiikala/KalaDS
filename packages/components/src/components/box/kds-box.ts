import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { namedAttr, spacingAttr, type Spacing } from '../../shared/layout-styles.js';

const BG = ['default', 'subtle', 'muted', 'inverse'] as const;
const RADIUS = ['none', 'sm', 'md', 'lg', 'full'] as const;

/**
 * @element kds-box
 * @summary Generic block with token-based padding, margin, background, border and radius.
 *
 * The escape hatch for spacing and simple surfaces without writing CSS: every value is a token name.
 *
 * @slot - Content
 * @attr {none|xs|sm|md|lg|xl|2xl} padding - Padding on all sides
 * @attr {none|xs|sm|md|lg|xl|2xl} padding-x - Horizontal padding (overrides padding)
 * @attr {none|xs|sm|md|lg|xl|2xl} padding-y - Vertical padding (overrides padding)
 * @attr {none|xs|sm|md|lg|xl|2xl} margin-y - Vertical margin
 * @attr {default|subtle|muted|inverse} bg - Background (inverse also switches to inverse text)
 * @attr {none|sm|md|lg|full} radius - Corner radius
 * @attr {boolean} border - Adds the default 1px border
 * @attr {boolean} inline - inline-block instead of block
 */
@customElement('kds-box')
export class KdsBox extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        box-sizing: border-box;
        padding-block: var(--_py, var(--_p, var(--kds-component-box-padding)));
        padding-inline: var(--_px, var(--_p, var(--kds-component-box-padding)));
        margin-block: var(--_my, 0);
        background-color: var(--_bg, var(--kds-component-box-bg));
        border-radius: var(--_radius, var(--kds-component-box-radius));
      }

      :host([hidden]) {
        display: none;
      }

      :host([inline]) {
        display: inline-block;
      }

      :host([border]) {
        border: var(--kds-component-box-border-width) solid var(--kds-component-box-border);
      }

      :host([bg='inverse']) {
        color: var(--kds-semantic-text-inverse);
      }
    `,
    spacingAttr('padding', '--_p'),
    spacingAttr('padding-x', '--_px'),
    spacingAttr('padding-y', '--_py'),
    spacingAttr('margin-y', '--_my'),
    namedAttr('bg', '--_bg', BG, '--kds-semantic-bg-'),
    namedAttr('radius', '--_radius', RADIUS, '--kds-semantic-radius-'),
  ];

  @property({ reflect: true }) padding?: Spacing;
  @property({ reflect: true, attribute: 'padding-x' }) paddingX?: Spacing;
  @property({ reflect: true, attribute: 'padding-y' }) paddingY?: Spacing;
  @property({ reflect: true, attribute: 'margin-y' }) marginY?: Spacing;
  @property({ reflect: true }) bg?: (typeof BG)[number];
  @property({ reflect: true }) radius?: (typeof RADIUS)[number];
  @property({ type: Boolean, reflect: true }) border = false;
  @property({ type: Boolean, reflect: true }) inline = false;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-box': KdsBox;
  }
}
