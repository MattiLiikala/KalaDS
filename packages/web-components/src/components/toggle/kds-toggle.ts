import { LitElement, html, css, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { focusRing } from '../../shared/field-styles.js';

/**
 * @element kds-toggle
 * @summary On/off switch for settings that take effect immediately.
 *
 * A native checkbox with role="switch". Off is an outlined track; on fills the track with the accent
 * colour. Use a checkbox instead when the choice only applies after a form is submitted.
 *
 * @slot - Label text
 * @attr {boolean} checked - Whether the switch is on
 * @attr {boolean} disabled - Disables the switch
 * @attr {string} name - Form field name
 * @attr {string} value - Value submitted when on (default "on")
 * @fires kds-change - When the user flips the switch. `detail: { checked }`
 * @csspart track - The switch track
 * @csspart thumb - The moving thumb
 * @csspart label - The label text wrapper
 */
@customElement('kds-toggle')
export class KdsToggle extends LitElement {
  static formAssociated = true;
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([hidden]) {
      display: none;
    }

    label {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--kds-component-toggle-gap);
      cursor: pointer;
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      line-height: var(--kds-semantic-type-body-line-height);
      color: var(--kds-component-toggle-label-text);
    }

    .control {
      position: relative;
      display: inline-flex;
      /* Centre the track on the first line of label text, like kds-checkbox. */
      height: calc(1em * var(--kds-semantic-type-body-line-height));
      align-items: center;
      flex-shrink: 0;
    }

    /*
     * The label text sets the baseline, so the control lines up with surrounding text and the line height
     * doesn't change when the box gets a check icon (an empty box has no baseline of its own).
     */
    .text {
      align-self: baseline;
    }

    input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }

    .track {
      --_bg: var(--kds-component-toggle-track-bg);
      --_border: var(--kds-component-toggle-track-border);
      --_thumb: var(--kds-component-toggle-thumb);
      position: relative;
      box-sizing: border-box;
      width: var(--kds-component-toggle-track-width);
      height: var(--kds-component-toggle-track-height);
      border: var(--kds-component-toggle-border-width) solid var(--_border);
      border-radius: var(--kds-component-toggle-radius);
      background-color: var(--_bg);
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }

    .thumb {
      /* Same gap around the thumb on every side: half of what's left of the inner track height. */
      --_inset: calc(
        (var(--kds-component-toggle-track-height) - 2 * var(--kds-component-toggle-border-width) -
            var(--kds-component-toggle-thumb-size)) / 2
      );
      position: absolute;
      top: 50%;
      left: var(--_inset);
      width: var(--kds-component-toggle-thumb-size);
      height: var(--kds-component-toggle-thumb-size);
      border-radius: var(--kds-component-toggle-radius);
      background-color: var(--_thumb);
      translate: 0 -50%;
      transition: left 0.15s ease, background-color 0.15s ease;
    }

    /* left is measured inside the border, so 100% is the inner track width. */
    :host([checked]) .thumb {
      left: calc(100% - var(--kds-component-toggle-thumb-size) - var(--_inset));
    }

    label:hover .track {
      --_bg: var(--kds-component-toggle-track-bg-hover);
      --_border: var(--kds-component-toggle-track-border-hover);
      --_thumb: var(--kds-component-toggle-thumb-hover);
    }

    :host([checked]) .track {
      --_bg: var(--kds-component-toggle-track-bg-checked);
      --_border: var(--kds-component-toggle-track-border-checked);
      --_thumb: var(--kds-component-toggle-thumb-checked);
    }

    :host([checked]) label:hover .track {
      --_bg: var(--kds-component-toggle-track-bg-checked-hover);
      --_border: var(--kds-component-toggle-track-border-checked-hover);
      --_thumb: var(--kds-component-toggle-thumb-checked);
    }

    input:focus-visible + .track {
      ${unsafeCSS(focusRing('toggle'))}
    }

    :host([disabled]) label {
      cursor: not-allowed;
      color: var(--kds-component-toggle-label-text-disabled);
    }

    :host([disabled]) .track,
    :host([disabled]) label:hover .track {
      --_bg: var(--kds-component-toggle-track-bg-disabled);
      --_border: var(--kds-component-toggle-track-border-disabled);
      --_thumb: var(--kds-component-toggle-thumb-disabled);
    }

    @media (prefers-reduced-motion: reduce) {
      .track,
      .thumb {
        transition: none;
      }
    }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ reflect: true }) name = '';
  @property() value = 'on';

  @query('input') private _input!: HTMLInputElement;

  private _internals = this.attachInternals();

  protected updated(_changed: PropertyValues<this>) {
    this._internals.setFormValue(this.checked ? this.value : null);
  }

  formResetCallback() {
    this.checked = this.hasAttribute('checked');
  }

  private _onChange() {
    this.checked = this._input.checked;
    this.dispatchEvent(new CustomEvent('kds-change', { bubbles: true, composed: true, detail: { checked: this.checked } }));
  }

  render() {
    return html`
      <label>
        <span class="control">
          <input
            type="checkbox"
            role="switch"
            .checked=${this.checked}
            aria-checked=${this.checked ? 'true' : 'false'}
            ?disabled=${this.disabled}
            @change=${this._onChange}
          />
          <span class="track" part="track" aria-hidden="true"><span class="thumb" part="thumb"></span></span>
        </span>
        <span class="text" part="label"><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kds-toggle': KdsToggle;
  }
}
