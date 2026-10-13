import { unsafeCSS } from 'lit';

/**
 * Text-field look shared by kds-select and kds-autocomplete, matching kds-input: label, helper and error
 * text, and the field border states (control border, darker on hover, accent at 1.5px on focus, danger
 * on error). `prefix` is the component token prefix, e.g. 'select' → --kds-component-select-*.
 *
 * The control element needs the `field` class. Error state keys off aria-invalid="true".
 */
export function fieldStyles(prefix: string) {
  const t = (name: string) => `var(--kds-component-${prefix}-${name})`;
  return unsafeCSS(`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--kds-semantic-spacing-xs);
    }

    :host([hidden]) {
      display: none;
    }

    label {
      font-family: var(--kds-semantic-type-label-family);
      font-size: var(--kds-semantic-type-label-size);
      font-weight: var(--kds-semantic-type-label-weight);
      line-height: var(--kds-semantic-type-body-line-height);
      color: ${t('label-text')};
    }

    .control {
      position: relative;
      display: flex;
      align-items: center;
    }

    .field {
      --_border-color: ${t('border')};
      width: 100%;
      box-sizing: border-box;
      font-family: var(--kds-semantic-type-body-family);
      font-size: var(--kds-semantic-type-body-size);
      font-weight: var(--kds-semantic-type-body-weight);
      line-height: var(--kds-semantic-type-body-line-height);
      color: ${t('text')};
      background-color: ${t('bg')};
      border: ${t('border-width')} solid var(--_border-color);
      border-radius: ${t('radius')};
      padding: ${t('padding-y')} ${t('padding-x')};
      /* A zero-width shadow in the border colour, so focus animates only the width, never from black. */
      box-shadow: inset 0 0 0 0 var(--_border-color);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      outline: none;
    }

    .field::placeholder {
      color: ${t('text-placeholder')};
    }

    .field:hover:not(:disabled, :focus, [aria-invalid='true']) {
      --_border-color: ${t('border-hover')};
    }

    /* Thicker focus border drawn as an inset shadow, so the field never resizes (see kds-input). */
    .field:focus {
      --_border-color: ${t('border-focus')};
      box-shadow: inset 0 0 0 calc(${t('border-width-focus')} - ${t('border-width')}) var(--_border-color);
    }

    .field[aria-invalid='true'] {
      --_border-color: ${t('border-error')};
    }

    .field[aria-invalid='true']:focus {
      --_border-color: ${t('border-error-focus')};
    }

    .field:disabled {
      --_border-color: ${t('border-disabled')};
      background-color: ${t('bg-disabled')};
      color: ${t('text-disabled')};
      cursor: not-allowed;
    }

    .icon {
      position: absolute;
      inset-inline-end: ${t('padding-x')};
      display: inline-flex;
      color: ${t('icon')};
      pointer-events: none;
      --kds-icon-size: var(--kds-semantic-spacing-lg);
    }

    .helper,
    .error-message {
      font-family: var(--kds-semantic-type-caption-family);
      font-size: var(--kds-semantic-type-caption-size);
      line-height: var(--kds-semantic-type-caption-line-height);
      color: ${t('helper-text')};
    }

    .error-message {
      color: ${t('error-text')};
    }
  `);
}

/** Visually hidden but available to assistive technology. */
export const visuallyHidden = unsafeCSS(`
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
`);

/** Shared focus ring: a crisp outline drawn outside the element, offset from it. */
export function focusRing(prefix: string) {
  return `
    outline: var(--kds-component-${prefix}-ring-width) solid var(--kds-component-${prefix}-ring-focus);
    outline-offset: var(--kds-component-${prefix}-ring-offset);
  `;
}
