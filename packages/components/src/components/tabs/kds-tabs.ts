import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { KdsTab } from '../tab/kds-tab.js';
import type { KdsTabPanel } from '../tab-panel/kds-tab-panel.js';
import { uniqueId } from '../../shared/popover.js';

/**
 * @element kds-tabs
 * @summary Switches between related panels of content (WAI-ARIA tabs).
 *
 * Children are kds-tab and kds-tab-panel elements, matched by `value`. The tab list is one Tab stop;
 * arrow keys, Home and End move between tabs and select them (automatic activation). Each tab is
 * linked to its panel with aria-controls / aria-labelledby.
 *
 * @slot - kds-tab and kds-tab-panel elements (tabs are moved into the tab list automatically)
 * @attr {string} value - Value of the selected tab (defaults to the first enabled tab)
 * @attr {string} label - Accessible name of the tab list
 * @fires kds-change - When the user selects a tab. `detail: { value }`
 * @csspart tablist - The tab list
 */
@customElement('kds-tabs')
export class KdsTabs extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    .tablist {
      display: flex;
      gap: var(--kds-component-tabs-gap);
      overflow-x: auto;
      border-bottom: var(--kds-component-tabs-border-width) solid var(--kds-component-tabs-border);
      /* Room for the focus ring and selected indicator, which sit outside the tabs. */
      padding-inline: var(--kds-semantic-border-width-ring-offset);
      padding-block-start: calc(var(--kds-semantic-border-width-ring) + var(--kds-semantic-border-width-ring-offset));
    }
  `;

  @property({ reflect: true }) value = '';
  @property() label = '';

  private _id = uniqueId('kds-tabs');

  private get _tabs(): KdsTab[] {
    return [...this.querySelectorAll<KdsTab>(':scope > kds-tab')];
  }

  private get _panels(): KdsTabPanel[] {
    return [...this.querySelectorAll<KdsTabPanel>(':scope > kds-tab-panel')];
  }

  protected updated(_changed: PropertyValues<this>) {
    this._sync();
  }

  /** Assigns roles, ids, selection state and roving tabindex to the tabs and panels. */
  private _sync = () => {
    const tabs = this._tabs;
    if (!this.value || !tabs.some((t) => t.value === this.value && !t.disabled)) {
      const first = tabs.find((t) => !t.disabled);
      if (first && first.value !== this.value) {
        this.value = first.value;
        return;
      }
    }
    tabs.forEach((tab, i) => {
      tab.slot = 'tab';
      tab.id ||= `${this._id}-tab-${i}`;
      const selected = tab.value === this.value;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.setAttribute('aria-disabled', tab.disabled ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    });
    this._panels.forEach((panel, i) => {
      const tab = tabs.find((t) => t.value === panel.value);
      panel.id ||= `${this._id}-panel-${i}`;
      panel.setAttribute('role', 'tabpanel');
      if (tab) {
        panel.setAttribute('aria-labelledby', tab.id);
        tab.setAttribute('aria-controls', panel.id);
      }
      panel.hidden = panel.value !== this.value;
      panel.tabIndex = 0;
    });
  };

  private _select(tab: KdsTab) {
    if (tab.disabled) return;
    const changed = tab.value !== this.value;
    this.value = tab.value;
    tab.focus();
    if (changed) {
      this.dispatchEvent(new CustomEvent('kds-change', { bubbles: true, composed: true, detail: { value: this.value } }));
    }
  }

  private _onClick(e: Event) {
    const tab = (e.target as HTMLElement).closest<KdsTab>('kds-tab');
    if (tab) this._select(tab);
  }

  private _onKeyDown(e: KeyboardEvent) {
    const enabled = this._tabs.filter((t) => !t.disabled);
    const current = enabled.findIndex((t) => t === document.activeElement);
    if (current < 0) return;
    let next: number | undefined;
    if (e.key === 'ArrowRight') next = (current + 1) % enabled.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = enabled.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    this._select(enabled[next]);
  }

  render() {
    return html`
      <div
        class="tablist"
        part="tablist"
        role="tablist"
        aria-label=${this.label || ''}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
      >
        <slot name="tab" @slotchange=${this._sync}></slot>
      </div>
      <slot @slotchange=${this._sync}></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-tabs': KdsTabs;
  }
}
