import { LitElement, html, css, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Solid variants render their label as a knockout (cut out of the fill). */
const KNOCKOUT_VARIANTS: ReadonlySet<ButtonVariant> = new Set(['primary', 'secondary', 'danger']);

/**
 * State styles for one variant, plus its `on-inverse` counterpart. Each state only sets the private
 * custom properties consumed by the base `button` / `button::before` rules.
 */
function variantStyles(variant: ButtonVariant, hosts: string[]) {
  const block = (hostSuffix: string, prefix: string) => {
    const host = (state = '') => hosts.map((h) => `:host(${h}${hostSuffix}) button${state}`).join(',\n');
    const t = (name: string) => `var(--kds-component-button-${prefix}-${name})`;
    return `
      ${host()} {
        --_bg: ${t('bg')};
        --_text: ${t('text')};
        --_border: ${t('border')};
      }
      ${host(':hover:not(:disabled)')} {
        --_bg: ${t('bg-hover')};
        --_border: ${t('border-hover')};
      }
      ${host(':active:not(:disabled)')} {
        --_bg: ${t('bg-active')};
      }
      ${host(':focus-visible')} {
        --_border: ${t('border-focus')};
        box-shadow: 0 0 0 3px ${t('ring-focus')};
      }
      ${host(':disabled')} {
        --_bg: ${t('bg-disabled')};
        --_border: ${t('border-disabled')};
        --_text: ${t('text-disabled')};
        cursor: not-allowed;
      }
    `;
  };
  const shape = hosts.map((h) => `:host(${h}) button`).join(',\n');
  return unsafeCSS(`
    ${shape} {
      --_radius: var(--kds-component-button-${variant}-radius);
      --_padding-y: var(--kds-component-button-${variant}-padding-y);
      --_padding-x: var(--kds-component-button-${variant}-padding-x);
    }
    ${block('', variant)}
    ${block('[on-inverse]', `${variant}-on-inverse`)}
  `);
}

const supportsMask =
  typeof CSS !== 'undefined' &&
  (CSS.supports('mask-image', 'url("x.png")') || CSS.supports('-webkit-mask-image', 'url("x.png")'));

/**
 * @element kds-button
 * @summary Trigger actions or navigate. Always use this instead of a native <button> with manual styling.
 *
 * Solid variants (`primary`, `secondary`, `danger`) render the label and icons as a knockout: they are
 * cut out of the button fill, so the surface behind the button shows through. The surface behind the
 * button must therefore have good contrast (at least 4.5:1) with the button fill in every state.
 * On inverse surfaces (`semantic.bg.inverse`), set `on-inverse` to switch to the fills made for them.
 *
 * @slot - Default slot: button label text
 * @slot start - Icon slot before the label
 * @slot end - Icon slot after the label
 * @attr {primary|secondary|danger|ghost} variant - Visual style variant
 * @attr {sm|md|lg} size - Size variant
 * @attr {boolean} disabled - Disables the button
 * @attr {boolean} on-inverse - Use fills made for inverse surfaces (`semantic.bg.inverse`)
 * @csspart button - The native button element
 * @csspart label - Wrapper around the default slot (label text)
 */
@customElement('kds-button')
export class KdsButton extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    button {
      position: relative;
      isolation: isolate;
      display: inline-flex;
      align-items: center;
      gap: var(--kds-size-200-rem);
      font-family: var(--kds-font-family-label);
      font-weight: var(--kds-font-weight-bold);
      font-size: var(--kds-font-size-200);
      line-height: var(--kds-font-line-height-small);
      cursor: pointer;
      color: var(--_text);
      background: none;
      border: 1px solid transparent;
      border-radius: var(--_radius);
      padding: var(--_padding-y) var(--_padding-x);
      transition: box-shadow 0.15s ease;
      text-decoration: none;
      white-space: nowrap;
    }

    /* The fill lives on its own layer so it can be masked without clipping the focus ring. */
    button::before {
      content: '';
      position: absolute;
      inset: -1px;
      z-index: -1;
      box-sizing: border-box;
      border: 1px solid var(--_border);
      border-radius: inherit;
      background-color: var(--_bg);
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    /*
     * The label is wrapped in a real element rather than left as a bare slotted text node. A bare text node
     * becomes an anonymous flex item, and some browsers (notably Safari) report its unaligned position from
     * Range.getBoundingClientRect, which put the knockout text off-centre next to taller icons.
     */
    .label[hidden] {
      display: none;
    }

    button.knockout {
      color: transparent;
    }
    button.knockout::before {
      -webkit-mask: var(--_knockout-mask) 0 0 / 100% 100% no-repeat;
      mask: var(--_knockout-mask) 0 0 / 100% 100% no-repeat;
    }

    @media (forced-colors: active) {
      button.knockout {
        color: ButtonText;
      }
      button.knockout::before {
        -webkit-mask: none;
        mask: none;
      }
    }

    button:focus-visible {
      outline: none;
    }

    ${variantStyles('primary', ['[variant="primary"]', ':not([variant])'])}
    ${variantStyles('secondary', ['[variant="secondary"]'])}
    ${variantStyles('danger', ['[variant="danger"]'])}
    ${variantStyles('ghost', ['[variant="ghost"]'])}

    /* === SIZES === */
    :host([size='sm']) button {
      font-size: var(--kds-font-size-100);
      --_padding-y: var(--kds-size-100-rem);
      --_padding-x: var(--kds-size-300-rem);
    }
    :host([size='lg']) button {
      font-size: var(--kds-font-size-300);
      --_padding-y: var(--kds-size-300-rem);
      --_padding-x: var(--kds-size-600-rem);
    }
  `;

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) size: ButtonSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true, attribute: 'on-inverse' }) onInverse = false;

  @query('button') private _button!: HTMLButtonElement;
  @query('slot:not([name])') private _labelSlot?: HTMLSlotElement;

  /** Hides the label wrapper when there is no label, so icon-only buttons get no extra flex gap. */
  @state() private _hasLabel = true;

  private _resizeObserver?: ResizeObserver;
  private _mutationObserver?: MutationObserver;
  private _frame = 0;
  /** Incremented per mask build so stale async builds (icon image loads) are discarded. */
  private _maskVersion = 0;

  private _syncLabel = () => {
    const nodes = this._labelSlot?.assignedNodes({ flatten: true }) ?? [];
    this._hasLabel = nodes.some((n) => n.nodeType === Node.ELEMENT_NODE || !!n.textContent?.trim());
  };

  private _onContentChange = () => {
    this._syncLabel();
    this._scheduleMask();
  };

  private _scheduleMask = () => {
    cancelAnimationFrame(this._frame);
    this._frame = requestAnimationFrame(() => void this._updateMask());
  };

  connectedCallback() {
    super.connectedCallback();
    this._mutationObserver = new MutationObserver(this._onContentChange);
    this._mutationObserver.observe(this, { childList: true, characterData: true, subtree: true });
    document.fonts?.addEventListener('loadingdone', this._scheduleMask);
    document.fonts?.ready.then(this._scheduleMask);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this._frame);
    this._resizeObserver?.disconnect();
    this._mutationObserver?.disconnect();
    document.fonts?.removeEventListener('loadingdone', this._scheduleMask);
  }

  protected firstUpdated() {
    this._resizeObserver = new ResizeObserver(this._scheduleMask);
    this._resizeObserver.observe(this._button);
  }

  protected updated(changed: PropertyValues<this>) {
    if (changed.has('variant') || changed.has('size') || changed.has('disabled') || changed.has('onInverse')) {
      this._scheduleMask();
    }
  }

  private _clearMask() {
    this._button.classList.remove('knockout');
    this._button.style.removeProperty('--_knockout-mask');
  }

  /**
   * Builds a mask image for the fill layer: opaque everywhere except where the label and icons are,
   * so they appear cut out of the button and show whatever surface is behind it.
   */
  private async _updateMask() {
    const version = ++this._maskVersion;
    const button = this._button;
    if (!button || !supportsMask || this.disabled || !KNOCKOUT_VARIANTS.has(this.variant)) {
      this._clearMask();
      return;
    }

    const width = button.offsetWidth;
    const height = button.offsetHeight;
    const rect = button.getBoundingClientRect();
    if (!width || !height || !rect.width) return;
    // Client rects include CSS transforms; convert them back to the button's own layout space.
    const scale = rect.width / width;
    const dpr = window.devicePixelRatio || 1;

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'destination-out';

    const style = getComputedStyle(button);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    if (style.letterSpacing !== 'normal') ctx.letterSpacing = style.letterSpacing;
    ctx.textBaseline = 'alphabetic';

    const toLocal = (r: DOMRect) => ({
      x: (r.left - rect.left) / scale,
      y: (r.top - rect.top) / scale,
      width: r.width / scale,
      height: r.height / scale,
    });

    // The label wrapper's box is the label's line box: a reliable vertical reference in every browser.
    const label = this.renderRoot.querySelector<HTMLElement>('.label');
    const lineBox = label && !label.hidden ? toLocal(label.getBoundingClientRect()) : undefined;

    const icons: Promise<void>[] = [];
    for (const slot of this.renderRoot.querySelectorAll('slot')) {
      for (const node of slot.assignedNodes({ flatten: true })) {
        if (node.nodeType === Node.TEXT_NODE) {
          this._drawText(ctx, node as Text, toLocal, slot === this._labelSlot ? lineBox : undefined);
        } else if (node instanceof Element) {
          const svg = node.shadowRoot?.querySelector('svg') ?? (node.localName === 'svg' ? node : null);
          if (svg) icons.push(this._drawSvg(ctx, svg as SVGSVGElement, toLocal(svg.getBoundingClientRect())));
        }
      }
    }
    await Promise.all(icons);
    if (version !== this._maskVersion) return;

    button.style.setProperty('--_knockout-mask', `url("${canvas.toDataURL('image/png')}")`);
    button.classList.add('knockout');
  }

  private _drawText(
    ctx: CanvasRenderingContext2D,
    node: Text,
    toLocal: (r: DOMRect) => { x: number; y: number; width: number; height: number },
    lineBox?: { y: number; height: number },
  ) {
    const raw = node.data;
    const start = raw.search(/\S/);
    if (start < 0) return;
    const end = raw.length - (raw.length - raw.trimEnd().length);
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    const box = range.getBoundingClientRect();
    if (!box.width) return;

    const { x, width, ...textBox } = toLocal(box);
    // Centre the font's content area in the line box, as the browser does (half-leading on both sides).
    const { y, height } = lineBox ?? textBox;
    const text = raw.slice(start, end).replace(/\s+/g, ' ');
    const metrics = ctx.measureText(text);
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;
    const baseline = y + (height - (ascent + descent)) / 2 + ascent;
    // Stretch to the laid-out width so canvas and DOM text line up exactly.
    ctx.save();
    ctx.translate(x, baseline);
    ctx.scale(metrics.width ? width / metrics.width : 1, 1);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  private _drawSvg(
    ctx: CanvasRenderingContext2D,
    svg: SVGSVGElement,
    box: { x: number; y: number; width: number; height: number },
  ): Promise<void> {
    if (!box.width || !box.height) return Promise.resolve();
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(box.width));
    clone.setAttribute('height', String(box.height));
    // Icons paint with currentColor; any opaque colour works for a mask.
    clone.setAttribute('color', '#000');
    clone.setAttribute('fill', getComputedStyle(svg).fill === 'none' ? 'none' : '#000');
    const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, box.x, box.y, box.width, box.height);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  }

  render() {
    return html`
      <button part="button" ?disabled=${this.disabled} aria-disabled=${this.disabled}>
        <slot name="start" @slotchange=${this._scheduleMask}></slot>
        <span class="label" part="label" ?hidden=${!this._hasLabel}>
          <slot @slotchange=${this._onContentChange}></slot>
        </span>
        <slot name="end" @slotchange=${this._scheduleMask}></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-button': KdsButton;
  }
}
