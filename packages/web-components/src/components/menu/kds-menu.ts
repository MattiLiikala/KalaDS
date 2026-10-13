import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { POPUP_RESET, autoUpdate, hidePopup, positionPopup, showPopup, uniqueId, type Placement } from '../../shared/popover.js';
import type { KdsMenuItem } from '../menu-item/kds-menu-item.js';

/**
 * @element kds-menu
 * @summary List of actions that opens from a trigger button (WAI-ARIA menu button).
 *
 * Put a kds-button or kds-icon-button in the `trigger` slot and kds-menu-item elements in the default
 * slot. The trigger opens the menu (also ArrowDown); arrow keys, Home and End move between items; Enter
 * or Space picks one; Escape, Tab and clicking outside close it and return focus to the trigger.
 * kds-divider can separate groups of items.
 *
 * @slot trigger - The button that opens the menu
 * @slot - kds-menu-item (and kds-divider) elements
 * @attr {boolean} open - Whether the menu is open
 * @attr {string} label - Accessible name of the menu (defaults to the trigger's text)
 * @attr {bottom-start|bottom-end|top-start|top-end} placement - Preferred position (default bottom-start)
 * @fires kds-select - When an item is picked. `detail: { value, item }`
 * @csspart menu - The popup menu surface
 */
@customElement('kds-menu')
export class KdsMenu extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }

    .menu {
      ${POPUP_RESET}
      box-sizing: border-box;
      min-width: var(--kds-component-menu-min-width);
      max-height: var(--kds-component-menu-popup-max-height);
      overflow-y: auto;
      padding: var(--kds-component-menu-popup-padding);
      background-color: var(--kds-component-menu-popup-bg);
      border: var(--kds-component-menu-popup-border-width) solid var(--kds-component-menu-popup-border);
      border-radius: var(--kds-component-menu-popup-radius);
      box-shadow: var(--kds-component-menu-popup-shadow);
      color: var(--kds-semantic-text-default);
      /* Carries the anchor gap for positionPopup (see shared/popover.ts). */
      scroll-margin-top: var(--kds-component-menu-popup-offset);
    }

    .menu[hidden] {
      display: none;
    }

    ::slotted(kds-divider) {
      margin-block: var(--kds-semantic-spacing-xs);
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property() label = '';
  @property({ reflect: true }) placement: Placement = 'bottom-start';

  @query('.menu') private _menu!: HTMLElement;

  private _id = uniqueId('kds-menu');
  private _stopAutoUpdate?: () => void;

  private get _trigger(): HTMLElement | undefined {
    return this.querySelector<HTMLElement>(':scope > [slot="trigger"]') ?? undefined;
  }

  private get _items(): KdsMenuItem[] {
    return [...this.querySelectorAll<KdsMenuItem>(':scope > kds-menu-item')].filter((i) => !i.hidden);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardown();
  }

  protected updated() {
    const trigger = this._trigger;
    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-expanded', this.open ? 'true' : 'false');
    }
    if (this.open && this._menu.hidden) this._openMenu();
    if (!this.open && !this._menu.hidden) this._teardown();
  }

  show() {
    this.open = true;
  }

  hide(returnFocus = true) {
    this.open = false;
    if (returnFocus) this._trigger?.focus();
  }

  private _openMenu() {
    const trigger = this._trigger;
    if (!trigger) return;
    showPopup(this._menu);
    const place = () => positionPopup(trigger, this._menu, this.placement);
    place();
    this._stopAutoUpdate = autoUpdate(trigger, this._menu, place);
    document.addEventListener('pointerdown', this._onOutsidePointer, true);
    this._focusItem(0);
  }

  private _teardown() {
    this._stopAutoUpdate?.();
    this._stopAutoUpdate = undefined;
    if (this._menu) hidePopup(this._menu);
    document.removeEventListener('pointerdown', this._onOutsidePointer, true);
  }

  private _focusItem(index: number) {
    const items = this._items;
    if (!items.length) return;
    items[(index + items.length) % items.length].focus();
  }

  private _onOutsidePointer = (e: PointerEvent) => {
    if (!e.composedPath().includes(this)) this.hide(false);
  };

  private _onTriggerClick = (e: Event) => {
    if ((e.target as HTMLElement).closest('[slot="trigger"]') === null) return;
    this.open = !this.open;
  };

  private _onTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.open = true;
      if (e.key === 'ArrowUp') requestAnimationFrame(() => this._focusItem(-1));
    }
  };

  private _pick(item: KdsMenuItem) {
    if (item.disabled) return;
    this.dispatchEvent(
      new CustomEvent('kds-select', { bubbles: true, composed: true, detail: { value: item.value, item } }),
    );
    this.hide();
  }

  private _onMenuKeyDown(e: KeyboardEvent) {
    const items = this._items;
    const current = items.indexOf(document.activeElement as KdsMenuItem);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._focusItem(current + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusItem(current - 1);
        break;
      case 'Home':
        e.preventDefault();
        this._focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        this._focusItem(-1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (current >= 0) this._pick(items[current]);
        break;
      case 'Escape':
        e.preventDefault();
        this.hide();
        break;
      case 'Tab':
        this.hide(false);
        break;
    }
  }

  private _onMenuClick(e: Event) {
    const item = (e.target as HTMLElement).closest<KdsMenuItem>('kds-menu-item');
    if (item) this._pick(item);
  }

  render() {
    const triggerText = this._trigger?.textContent?.trim() || this._trigger?.getAttribute('label') || '';
    return html`
      <slot name="trigger" @click=${this._onTriggerClick} @keydown=${this._onTriggerKeyDown}></slot>
      <div
        class="menu"
        part="menu"
        id=${this._id}
        role="menu"
        aria-label=${this.label || triggerText}
        popover="manual"
        hidden
        @keydown=${this._onMenuKeyDown}
        @click=${this._onMenuClick}
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-menu': KdsMenu;
  }
}
