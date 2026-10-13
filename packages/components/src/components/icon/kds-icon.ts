import { LitElement, css, nothing } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import '@kalads/icons';

export type IconSize = 'sm' | 'md' | 'lg';
export type IconColor = 'inherit' | 'subtle' | 'muted' | 'brand' | 'danger' | 'warning' | 'success';

/**
 * @element kds-icon
 * @summary Renders any KalaDS icon by name, with token-based size and colour.
 *
 * `<kds-icon name="search">` renders `<kds-icon-search>`. Without a `label` the icon is decorative and
 * hidden from assistive technology; with a `label` it's announced as an image with that name.
 *
 * @attr {string} name - Icon name, e.g. "search", "chevron-down" (see Data Display/Icon for the full set)
 * @attr {sm|md|lg} size - Icon size (default md)
 * @attr {inherit|subtle|muted|brand|danger|warning|success} color - Icon colour (default inherit: the text colour)
 * @attr {string} label - Accessible name. Leave empty for decorative icons.
 */
@customElement('kds-icon')
export class KdsIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      flex-shrink: 0;
      line-height: 0;
      --kds-icon-size: var(--kds-component-icon-size-md);
    }

    :host([hidden]) {
      display: none;
    }

    :host([size='sm']) {
      --kds-icon-size: var(--kds-component-icon-size-sm);
    }

    :host([size='lg']) {
      --kds-icon-size: var(--kds-component-icon-size-lg);
    }

    :host([color='subtle']) {
      color: var(--kds-component-icon-color-subtle);
    }
    :host([color='muted']) {
      color: var(--kds-component-icon-color-muted);
    }
    :host([color='brand']) {
      color: var(--kds-component-icon-color-brand);
    }
    :host([color='danger']) {
      color: var(--kds-component-icon-color-danger);
    }
    :host([color='warning']) {
      color: var(--kds-component-icon-color-warning);
    }
    :host([color='success']) {
      color: var(--kds-component-icon-color-success);
    }
  `;

  @property({ reflect: true }) name = '';
  @property({ reflect: true }) size: IconSize = 'md';
  @property({ reflect: true }) color: IconColor = 'inherit';
  @property() label = '';

  protected updated() {
    if (this.label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  render() {
    // Only plain icon names become tag names, so the static tag can't be abused for markup injection.
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(this.name)) return nothing;
    const tag = `kds-icon-${this.name}`;
    if (!customElements.get(tag)) {
      console.warn(`<kds-icon>: unknown icon "${this.name}"`);
      return nothing;
    }
    return staticHtml`<${unsafeStatic(tag)} aria-hidden="true"></${unsafeStatic(tag)}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-icon': KdsIcon;
  }
}
