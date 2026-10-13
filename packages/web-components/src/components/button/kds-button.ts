import { LitElement, html, css, unsafeCSS, type CSSResultGroup } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * State styles for one variant, plus its `on-inverse` counterpart. Each state only sets the private
 * custom properties consumed by the base `button` rule.
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
        /* Offset outline: the gap keeps the ring visible against a fill of the same colour. */
        outline: var(--kds-component-button-ring-width) solid ${t('ring-focus')};
        outline-offset: var(--kds-component-button-ring-offset);
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

/**
 * @element kds-button
 * @summary Trigger actions or navigate. Always use this instead of a native <button> with manual styling.
 *
 * Solid variants (`primary`, `secondary`, `danger`) have a filled background with a label colour that
 * keeps at least 4.5:1 contrast in every state. On inverse surfaces (`semantic.bg.inverse`), set
 * `on-inverse` to switch to the fills made for them.
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
  /** focus() on the host (e.g. kds-menu returning focus to its trigger) reaches the inner <button>. */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: var(--kds-size-200-rem);
      font-family: var(--kds-font-family-label);
      font-weight: var(--kds-font-weight-bold);
      font-size: var(--kds-font-size-200);
      line-height: var(--kds-font-line-height-small);
      cursor: pointer;
      color: var(--_text);
      background-color: var(--_bg);
      border: 1px solid var(--_border);
      border-radius: var(--_radius);
      padding: var(--_padding-y) var(--_padding-x);
      transition: background-color 0.15s ease, border-color 0.15s ease;
      text-decoration: none;
      white-space: nowrap;
    }

    /* The label wrapper is hidden when there is no label, so icon-only buttons get no extra flex gap. */
    .label[hidden] {
      display: none;
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

  /*
   * ARIA state set on the host (for example by kds-menu or a consumer) is copied onto the inner <button>,
   * the element assistive technology actually interacts with. ARIA on the host alone would be lost.
   */
  /** @internal */
  @property({ attribute: 'aria-expanded' }) hostAriaExpanded: string | null = null;
  /** @internal */
  @property({ attribute: 'aria-haspopup' }) hostAriaHaspopup: string | null = null;
  /** @internal */
  @property({ attribute: 'aria-pressed' }) hostAriaPressed: string | null = null;
  /** @internal */
  @property({ attribute: 'aria-label' }) hostAriaLabel: string | null = null;

  @query('slot:not([name])') private _labelSlot?: HTMLSlotElement;

  /** Hides the label wrapper when there is no label, so icon-only buttons get no extra flex gap. */
  @state() private _hasLabel = true;

  private _mutationObserver?: MutationObserver;

  private _syncLabel = () => {
    const nodes = this._labelSlot?.assignedNodes({ flatten: true }) ?? [];
    this._hasLabel = nodes.some((n) => n.nodeType === Node.ELEMENT_NODE || !!n.textContent?.trim());
  };

  connectedCallback() {
    super.connectedCallback();
    this._mutationObserver = new MutationObserver(this._syncLabel);
    this._mutationObserver.observe(this, { childList: true, characterData: true, subtree: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mutationObserver?.disconnect();
  }

  /** Accessible name for the inner button. Subclasses without visible text (kds-icon-button) override this. */
  protected get _accessibleLabel(): string | undefined {
    return this.hostAriaLabel ?? undefined;
  }

  render() {
    return html`
      <button
        part="button"
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled}
        aria-label=${ifDefined(this._accessibleLabel)}
        aria-expanded=${ifDefined(this.hostAriaExpanded ?? undefined)}
        aria-haspopup=${ifDefined(this.hostAriaHaspopup ?? undefined)}
        aria-pressed=${ifDefined(this.hostAriaPressed ?? undefined)}
      >
        <slot name="start"></slot>
        <span class="label" part="label" ?hidden=${!this._hasLabel}>
          <slot @slotchange=${this._syncLabel}></slot>
        </span>
        <slot name="end"></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-button': KdsButton;
  }
}
