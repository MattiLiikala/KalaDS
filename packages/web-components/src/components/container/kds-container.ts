import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @element kds-container
 * @summary Centres content horizontally and limits its width. Layout only: no visuals of its own.
 *
 * @slot - Content
 * @attr {sm|md|lg|xl|full} size - Maximum width (default lg): sm 640px, md 768px, lg 1024px, xl 1280px
 * @attr {boolean} flush - Removes the horizontal padding
 */
@customElement('kds-container')
export class KdsContainer extends LitElement {
  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      width: 100%;
      max-width: var(--kds-component-container-max-width-lg);
      margin-inline: auto;
      padding-inline: var(--kds-component-container-padding-x);
    }

    :host([hidden]) {
      display: none;
    }

    :host([size='sm']) {
      max-width: var(--kds-component-container-max-width-sm);
    }
    :host([size='md']) {
      max-width: var(--kds-component-container-max-width-md);
    }
    :host([size='xl']) {
      max-width: var(--kds-component-container-max-width-xl);
    }
    :host([size='full']) {
      max-width: none;
    }

    :host([flush]) {
      padding-inline: 0;
    }
  `;

  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg';
  @property({ type: Boolean, reflect: true }) flush = false;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-container': KdsContainer;
  }
}
