import { LitElement, css, unsafeCSS } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'label'
  | 'overline';
export type TypographyColor = 'default' | 'subtle' | 'muted' | 'brand' | 'danger' | 'inverse';

const VARIANTS: TypographyVariant[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'body-sm', 'caption', 'label', 'overline'];
const COLORS: TypographyColor[] = ['default', 'subtle', 'muted', 'brand', 'danger', 'inverse'];
const ALLOWED_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'strong', 'em', 'small'];

const DEFAULT_TAG: Record<TypographyVariant, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  label: 'span',
  overline: 'span',
};

const variantStyles = unsafeCSS(
  VARIANTS.map(
    (v) => `
      :host([variant='${v}']) .text {
        font-family: var(--kds-semantic-type-${v}-family);
        font-size: var(--kds-semantic-type-${v}-size);
        font-weight: var(--kds-semantic-type-${v}-weight);
        line-height: var(--kds-semantic-type-${v}-line-height);
      }`,
  ).join('\n') +
    COLORS.map((c) => `:host([color='${c}']) .text { color: var(--kds-component-typography-color-${c}); }`).join('\n'),
);

/**
 * @element kds-typography
 * @summary Text in the KalaDS type scale: headings, body, caption, label and overline.
 *
 * Renders the matching element for the variant (h1–h6, p, span). Use `as` to change the element without
 * changing the look, e.g. a visual h4 that is an h2 in the document outline.
 *
 * @slot - Text content
 * @attr {h1|h2|h3|h4|h5|h6|body|body-sm|caption|label|overline} variant - Type style (default body)
 * @attr {string} as - Element to render (h1–h6, p, span, div, label, strong, em, small)
 * @attr {default|subtle|muted|brand|danger|inverse} color - Text colour (default default)
 * @attr {start|center|end} align - Text alignment
 * @attr {boolean} truncate - Single line, cut off with an ellipsis
 * @attr {boolean} gutter - Adds space below the text
 * @csspart text - The rendered text element
 */
@customElement('kds-typography')
export class KdsTypography extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }

      .text {
        margin: 0;
        color: var(--kds-component-typography-color-default);
      }

      :host([variant='overline']) .text {
        text-transform: uppercase;
        letter-spacing: var(--kds-semantic-type-overline-letter-spacing);
      }

      :host([align='start']) .text {
        text-align: start;
      }
      :host([align='center']) .text {
        text-align: center;
      }
      :host([align='end']) .text {
        text-align: end;
      }

      :host([truncate]) .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      :host([gutter]) .text {
        margin-block-end: var(--kds-component-typography-gutter);
      }
    `,
    variantStyles,
  ];

  @property({ reflect: true }) variant: TypographyVariant = 'body';
  @property({ reflect: true }) as = '';
  @property({ reflect: true }) color: TypographyColor = 'default';
  @property({ reflect: true }) align?: 'start' | 'center' | 'end';
  @property({ type: Boolean, reflect: true }) truncate = false;
  @property({ type: Boolean, reflect: true }) gutter = false;

  render() {
    const tag = ALLOWED_TAGS.includes(this.as) ? this.as : (DEFAULT_TAG[this.variant] ?? 'p');
    const t = unsafeStatic(tag);
    return staticHtml`<${t} class="text" part="text"><slot></slot></${t}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-typography': KdsTypography;
  }
}
